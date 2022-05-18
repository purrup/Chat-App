const express = require('express');
// controllers
const user = require('../controllers/user.js');
// 驗證
const { encode } = require('../auth/jwt.js');
const router = express.Router();
router
  .get('/:id', user.onGetAllOtherUsers)
  .post('/register', user.onCreateUser)
  .post('/login', encode, user.onLogin)
  .get('/logout/:id', user.onLogout)
  .post('/setAvatar/:id', user.onSetAvatar)
  .delete('/:id', user.onDeleteUserById)
module.exports = router;
