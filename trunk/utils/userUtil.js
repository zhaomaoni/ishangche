var getUserName = function () { //获取用户名称
  var info = wx.getStorageSync('get_user_name') || ''
  return info;
}

var getUserHead = function () {  //获取用户头像
  var info = wx.getStorageSync('get_user_head') || ''
  return info;
}

var getUserType = function () { //获取type
  var info = wx.getStorageSync('get_user_type') || ''
  return info;
}

var setUserName = function (name) {  //设置用户名称
  wx.setStorageSync('set_user_name', name)
}

var setUserHead = function (head) {  //设置用户头像
  wx.setStorageSync('set_user_head', head)
}

var setUserType = function (type) {  //设置type
  wx.setStorageSync('set_user_type', type)
}

var isLogin = function () {
  var type = getUsertype()
  if (!type) {
    wx.navigateTo({
      url: '../loginAll/loginAll',
    })
    return false
  }
  return true
}

module.exports = {
  getUserType: getUserType,
  getUserName: getUserName,
  getUserHead: getUserHead,
  setUserType: setUserType,
  setUserName: setUserName,
  setUserHead: setUserHead,
  isLogin: isLogin
}