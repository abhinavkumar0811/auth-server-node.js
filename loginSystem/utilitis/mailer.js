const nodeMailer = require('nodemailer');
require('dotenv').config();
const commonFile = require('../utilitis/common/common'); 
const userRouter = require('../routes/userRoutes');

const transport = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.APP_PASS,
  },
});

// Email verification
const emailVerification = async (email, token) => {
  try {
    const verificationLink = `http://localhost:8004/user/verify/${token}`;
    const emailVarificationMessage = commonFile.htmlEmailVarificationMessage(verificationLink); // Calling function with verificationLink

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: emailVarificationMessage,
    };

    await transport.sendMail(mailOption);
    return true;
  } catch (error) {
    console.error('Email verification error:', error);
    throw error; // Throw the error
  }
};

// SignIn  verification
const signupEmailVerification = async (email, token) => {
  try {
    const verificationLink = `${process.env.BASE_URL}/user/verify/${token}`;  
    const signInMessage = commonFile.htmlSignUpVarificationMessage(verificationLink); // Calling function with verificationLink

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'SignIn Verification',
      html: signInMessage,
    };

    await transport.sendMail(mailOption);
    return true;
  } catch (error) {
    console.error('Signup verification error:', error);
    throw error; // Throw the error
  }
};

// Forget password
const forgetPasswordVarification = async (email, token) => {
  try {
    const verificationLink = `${process.env.BASE_URL}/user/resetPassword?token=${token}`; // Use BASE_URL
    const forgetPasswordMessage = commonFile.htmlFogetPasswordVarificationMessage(verificationLink); // Calling function with verificationLink

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Forget Password',
      html: forgetPasswordMessage,
    };

    await transport.sendMail(mailOption);
    return true;
  } catch (error) {
    console.error('Forget password error:', error);
    throw error; // Throw the error
  }
};

module.exports = { emailVerification, signupEmailVerification, forgetPasswordVarification };