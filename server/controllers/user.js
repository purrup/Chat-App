// 驗證前端資料用的物件
const ajv = new (require("ajv"))({allErrors: true});
// 客製錯誤訊息的物件
require("ajv-errors")(ajv);
// 使用者 model
const UserModel = require('../models/User.js');
// 雜湊物件
const bcrypt = require('bcrypt');
module.exports = {
  // 建立使用者
  onCreateUser: async (req, res) => {
    try {
      //  取得用來驗證前端傳入的資料的物件
      const validation = VerifyUserInfo(req.body);
      if (!validation(req.body)) return res.status(400).json({result: false, errors: validation.errors});
      // 對密碼執行雜揍
      await encryptPassword(req.body);
      // 取得使用者資料
      const {name, email, password} = req.body;
      // 建立使用者的物件
      const user = await UserModel.create({name, email, password});
      delete user.password;
      // 回傳執行結果
      return res.status(200).json({ result: true, user });
    } catch (error) {
      return res.status(500).json({ result: false, error: error.message })
    }
  },

  // 登入
  onLogin: async (req, res) => {
      try {
        const { name, password } = req.body;
        const user = await UserModel.findOne({ name });
        if (!user)
          return res.json({ error: "Incorrect Username or Password", result: false });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
          return res.json({ error: "Incorrect Username or Password", result: false });
        delete user.password;
        // 回傳執行結果
        return res.status(200).json({ result: true, user, auth: req.authorization });
    } catch (error) {
      return res.status(500).json({ result: false, error: error.message })
    }
  },

  // 設定頭像
  onSetAvatar: async (req, res) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await UserModel.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (error) {
      return res.status(500).json({ result: false, error: error.message, isSet: false })
    }
  },

  // 登出
  onLogout: async (req, res) => {
    try {
      if (!req.params.id) return res.json({  result: false, error: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).json({ result: true });
  } catch (error) {
    return res.status(500).json({ result: false, error: error.message })
  }
  },

  // 查詢除了登入的使用者以外的所有使用者
  onGetAllOtherUsers: async (req, res) => {
    try {
      const users = await UserModel.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "name",
        "avatarImage",
        "_id",
      ]);;
      return res.status(200).json({ result: true, users });;
    } catch (error) {
      return res.status(500).json({ result: false, error: error })
    }
  },
  
  // 查詢指定使用者
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      return res.status(200).json({ result: true, user });
    } catch (error) {
      return res.status(500).json({ result: false, error: error })
    }
  },

  // 刪除指定使用者
  onDeleteUserById: async (req, res) => {
    try {
      const result = await UserModel.deleteOne({_id: req.params.id});
      // 查無指定 id 的使用者
      if(result.deletedCount === 0) return res.status(500).json({ success: false, message: `Cannot find user:${req.params.id}.` })
      // 成功刪除使用者
      return res.status(200).json({ 
        success: true, 
        message: `Deleted user:${req.params.id}.` 
      });
    } catch (error) {
      return res.status(500).json({ result: false, error: error })
    }
  }
}

/**
 * 建立驗證前端欄位資料的物件
 * @param {Object}
 * @returns 回傳用來驗證的物件
 */
const VerifyUserInfo = (requestBody) => {
  const { name, email, password } = requestBody;
    // 設定要驗證前端傳來資料的欄位
    return ajv.compile({
      type: "object",
      properties: {
        name: { type: "string", nullable: false, maxLength:10, minLength: 3 },
        email: { type: "string", nullable: false, maxLength: 50 },
        password: { type: "string", nullable: false, minLength: 5 }
      },
      required: ["name", "email", "password"],
      errorMessage: {
        type: "傳入資料不是 Object", 
        properties: { 
          name: `接收到使用者名稱為: [${name}]，使用者名稱須為字串，不得為空值，長度 3 ~ 10。`,
          email: `接收到使用者信箱為: [${email}]，使用者信箱須為字串，不得為空值，長度小於 50。`,
          password: `接收到使用者密碼為: [${password}]，使用者密碼須為字串，不得為空值，長度小於 50。`
        },
      },
    });
}

/**
 * 將密碼雜揍
 * @param {Object} requestBody 傳入自前端接收到的資料，req.body
 */
const encryptPassword = async (requestBody) => {
  // 建立 salt
  const salt = await bcrypt.genSalt();
  // 將密碼雜揍
  const password = await bcrypt.hash(requestBody.password, salt);
  // 更新密碼
  requestBody.password = password;
}




