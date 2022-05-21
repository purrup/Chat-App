const jwt = require('jsonwebtoken');
const UserModel = require('../models/User.js');
const SECRET_KEY = process.env.SECRET_KEY;
// 簽發 Token
module.exports.encode = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await UserModel.find({ name });
    if(!user) { return res.status(400).json({ result: false , error: `查無使用者：${ name }`}) }
    const payload = { userId: user[0]._id };
    const authToken = jwt.sign(payload, SECRET_KEY);
    req.authorization = authToken;
    next();
  } catch (error) {
    return res.status(400).json({ result: false, error: error.message });
  }
};

// 驗證 Token
module.exports.decode = async (req, res, next) => {
  if (!req.body.sender.authorization) {
    return res.status(400).json({ result: false, error: 'No access token provided' });
  }
  // 取得前端傳入的 token
  const accessToken = req.body.sender.authorization.split(' ')[1];
  try {
    // 驗證 token
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res.status(401).json({ result: false, error: error.message });
  }
};
