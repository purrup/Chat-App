const mongoose = require("mongoose");
// 使用者 schema
const userSchema = new mongoose.Schema(
  {
    // 名稱
    name: {
      type: String,
      required: true,
      max: 10,
      min: 3,
      unique: true
    },
    // 信箱
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true
    },
    // 密碼（經雜湊）
    password: {
      type: String,
      required: true,
      min: 5,
    },
    // 是否已選擇頭像
    isAvatarImageSet: {
      type: Boolean,
      default: false,
    },
    // 頭像資料
    avatarImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);
module.exports = mongoose.model("User", userSchema);
