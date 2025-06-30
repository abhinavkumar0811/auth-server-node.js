const userSchema = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();
const { emailVerification, forgetPasswordVarification } = require('../utilitis/mailer');
const userAuthentication = require('../midware/userAuthenticationMidware')

const secretKey = process.env.JWT_SECRET;


// register
const signUp = async (req, res) => {
    try {
        const { name, email, password, gender, phoneNumber } = req.body;

        // Error handling
        if (!name) return res.status(400).send({ status: false, message: 'Name required' });
        if (!email) return res.status(400).send({ status: false, message: 'Email required' });
        if (!password) return res.status(400).send({ status: false, message: 'Password required' });

        // Check if email already exists
        const existEmail = await userSchema.findOne({ email });
        if (existEmail) {
            return res.status(409).send({
                status: false,
                message: 'Another user created an account with this email',
            });
        }

        // Create user (password will be hashed by the pre('save') middleware)
        const newUser = new userSchema({
            name,
            gender,
            phoneNumber,
            email,
            password,
            isVarified: false,
        });

        // Save the new user
        await newUser.save();

        // Generate verification token
        const verificationToken = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '10m' });

// Save the token to the user
        newUser.token = verificationToken;
        await newUser.save();

        // Send verification email
        const sendEmail = await emailVerification(email, verificationToken);
        if (!sendEmail) {
            return res.status(500).send({ status: false, message: 'Email not sent' });
        }

        return res.status(201).send({
            status: true,
            message: 'User created successfully, please verify your email',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'Internal server error', error: error.message });
    }
};

// log In
const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email) {
        return res.status(400).send({ status: false, message: 'Email required' });
      }
  
      if (!password) {
        return res.status(400).send({ status: false, message: 'Password required' });
      }
  
      const existEmail = await userSchema.findOne({ email });
  
      console.log(existEmail);
  
      if (!existEmail) {
        return res.status(404).send({
          status: false,
          message: 'No account created with this email',
        });
      }
      const passwordCompare = await bcrypt.compare(password, existEmail.password);
    //   console.log('Password Comparison Result:', passwordCompare);

  
      if (!passwordCompare) {
        return res.status(401).send({
          status: false,
          message: 'Invalid password',
        });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: existEmail._id }, // Payload
        secretKey, // Secret key
        { expiresIn: '15m' } // Token expiration 
      );
  
      return res.status(200).send({
        status: true,
        message: 'You are logged in',
        token: token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        status: false,
        message: 'Internal server error',
      });
    }
  };
// verifiation
const verify = async (req, res) => {

    try {
        const token = req.params.token;  // retrive token from paramter
        if (!token) return res.status(400).send({
            status: false,
            message: 'No token provided'
        });

        const decode = jwt.verify(token, secretKey);  // decode jwt with secret key
        const userId = decode.userId;      // retrive userId from decoded jwt

        const user = await userSchema.findById(userId);
        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        if (user.isVarified) {     // if user already varified
            return res.status(200).send({
                status: true,
                message: 'You are already verified'
            });
        } else {     // if user not varified
            user.isVarified = true;
            user.token = '';
            await user.save();
            return res.status(200).send({
                status: true,
                message: 'Successfully verified'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: false, message:
                'Internal server error'
        });
    }
};

// forget password 
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;   // retrive email from body
        if(!email){
            res.status(401).send({
                status: false,
                message: 'Please enter your email',
            })
        }

        const user = await userSchema.findOne({ email });  // find email from database

        if (!user) {
            return res.status(404).send({
                status: false,
                message: 'User not found'
            });
        }

        // generate token with userId, secretKey, time
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '15m' });

        user.resetPasswordToken = token;
        await user.save();

        // sending mail and generating token
        const sentMail = await forgetPasswordVarification(email, token);

        if (!sentMail) {
            return res.status(500).send({
                status: false,
                message: 'Email not sent'
            });
        }

        return res.status(200).send({
            status: true,
            message: 'Email sent to your Gmail'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: false, message: 'Internal server error' });
    }
};

// reset password 
const resetPassword = async (req, res) => {
    try {
      const { password, token } = req.body; 
  
      if (!password) {
        return res.status(400).send({ 
          status: false,
          message: 'Password required',
        });
      }
  
      if (!token) {
        return res.status(400).send({ 
          status: false,
          message: 'Token required',
        });
      }
  
      // Retrieve reset password token from schema
      const user = await userSchema.findOne({ resetPasswordToken: token }); 

      if (!user) {
        return res.status(400).send({
          status: false,
          message: 'Invalid or expired token',
        });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt); // hash new password
  
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      await user.save();
  
      return res.status(200).send({
        status: true, 
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error('Error', error);
      return res.status(500).send({
        status: false,
        message: 'Internal server error',
      });
    }
  };
// changed password
const changedPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user.userId;

    if (!currentPassword) {
      return res.status(400).send({
        status: false,
        message: 'Current password required',
      });
    }

    if (!newPassword) {
      return res.status(400).send({
        status: false,
        message: 'New password required',
      });
    }

    // Find by user id
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(404).send({
        status: false,
        message: 'User not found',
      });
    }

    // Compare current password to existing password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password); // compare password error
    if (!isValidPassword) {
      return res.status(401).send({
        status: false,
        message: 'Invalid current password',
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt); // hash new password

    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      status: true, // Corrected: status: true
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Error', error);
    return res.status(500).send({
      status: false,
      message: 'Internal server error',
    });
  }
};
// // test the password hashing from email
// const user = await userSchema.findOne({ email: 'abhinavkashyap702@gmail.com' });
// console.log('Stored Password:', user.password);
 
// test the password hashing from email 
// const user  =  userSchema.findOne({email: 'abhinavkashyap702@gmail.com'});
// console.log('stored password extract from email', user.password);
module.exports = { signUp, signIn, verify, forgetPassword, resetPassword, changedPassword };