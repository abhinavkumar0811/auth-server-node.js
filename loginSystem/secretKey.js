const crypto = require('crypto');

const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex'); // 64 bytes (512 bits)
};

const secretKey = generateSecretKey();
console.log('Generated Secret Key:', secretKey);