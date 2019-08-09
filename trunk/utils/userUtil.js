//获取方法
var getUserName = function () { //获取用户名称
  var info = wx.getStorageSync('get_user_name') || ''
  return info;
}
var getUserHead = function () {  //获取用户头像
  var info = wx.getStorageSync('get_user_head') || ''
  return info;
}
var getUserType = function () { //是否绑定上车号提示
  var info = wx.getStorageSync('get_user_type') || ''
  return info;
}
var getSessionId = function(){  //获取session_id
  var info = wx.getStorageSync("get_session_id") || ""
  return info
}
var getCarIdentStatus = function () {  //获取车辆认证状态 0-未认证 1-已认证 2-审核中
  var info = wx.getStorageSync("get_CarId_status") || ""
  return info
}
var getPhotoIdentStatus = function () {  //获取车辆认证状态 0-未认证 1-已认证 2-审核中
  var info = wx.getStorageSync("get_photoId_status") || ""
  return info
}
var getUserId = function () {  //获取用户ID
  var info = wx.getStorageSync("get_user_id") || ""
  return info
}
var getGender = function () {  //获取用户性别 性别 0-女  1-男
  var info = wx.getStorageSync("get_gender") || ""
  return info
}
var getBirthday = function(){ //获取用户出生日期
  var info = wx.getStorageSync("get_birthday") || ""
  return info
}
var getVipType = function(){//获取会员类型 89-黄金会员 90-白金会员 91-黑金会员 98-认证会员 99-普通用户
  var info = wx.getStorageSync("get_vip_type") || ""
  return info
}
var getPhoneNum = function () { //获取手机号
  var info = wx.getStorageSync("get_phone_num") || ""
  return info
}
var getScIdNum = function () { //获取上车号
  var info = wx.getStorageSync("get_scId_num") || ""
  return info
}
var getIv = function () { //获取iv
  var info = wx.getStorageSync("get_iv_num") || ""
  return info
}
var getEncryptedData = function () { //获取encryptedData
  var info = wx.getStorageSync("get_enc_num") || ""
  return info
}
var getOpenid = function(){ //获取openid
  var info = wx.getStorageSync("get_openid_num") || ""
  return info
}
var getSessionKey = function () { //获取sessionKey
  var info = wx.getStorageSync("get_sessionKey_num") || ""
  return info
}
var getIsLike = function () { //获取点赞
  var info = wx.getStorageSync("get_is_like") || ""
  return info
}
//设置方法
var setUserName = function (name) {  //设置用户名称
  wx.setStorageSync('get_user_name', name)
}
var setUserHead = function (head) {  //设置用户头像
  wx.setStorageSync('get_user_head', head)
}
var setUserType = function (type) {  //设置绑定上车号提示
  wx.setStorageSync('get_user_type', type)
}
var setSessionId = function (sessionId) {  //获取session_id
  var info = wx.setStorageSync("get_session_id", sessionId)
  return info
}
var setCarIdentStatus = function (carIdentStatus) {  //获取车辆认证状态 0-未认证 1-已认证 2-审核中
  var info = wx.setStorageSync("get_CarId_status", carIdentStatus)
  return info
}
var setPhotoIdentStatus = function (photoIdentStatus) {  //获取车辆认证状态 0-未认证 1-已认证 2-审核中
  var info = wx.setStorageSync("get_photoId_status", photoIdentStatus)
  return info
}
var setUserId = function (userId) {  //获取用户ID
  var info = wx.setStorageSync("get_user_id", userId)
  return info
}
var setGender = function (gender) {  //获取用户性别 性别 0-女  1-男
  var info = wx.setStorageSync("get_gender", gender)
  return info
}
var setBirthday = function (birthday) { //获取用户出生日期
  var info = wx.setStorageSync("get_birthday", birthday)
  return info
}
var setVipType = function (vipType) {//获取会员类型 89-黄金会员 90-白金会员 91-黑金会员 98-认证会员 99-普通用户
  var info = wx.setStorageSync("get_vip_type", vipType)
  return info
}
var setPhoneNum = function (phoneNum) { //获取手机号
  var info = wx.setStorageSync("get_phone_num", phoneNum)
  return info
}
var setScIdNum = function (scIdNum) { //获取上车号
  var info = wx.setStorageSync("get_scId_num", scIdNum)
  return info
}
var setOpenid = function (openid) { //获取openid
  var info = wx.setStorageSync("get_openid_num", openid)
  return info
}
var setSessionKey = function (sessionKey) { //获取sessionKey
  var info = wx.setStorageSync("get_sessionKey_num", sessionKey)
  return info
}
var setIsLike = function (isLike) { //获取点赞
  var info = wx.setStorageSync("get_is_like", isLike)
  return info
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
  getSessionId: getSessionId,
  getCarIdentStatus: getCarIdentStatus,
  getPhotoIdentStatus: getPhotoIdentStatus,
  getUserId: getUserId,
  getGender: getGender,
  getBirthday: getBirthday,
  getVipType: getVipType,
  getPhoneNum:getPhoneNum,
  getScIdNum: getScIdNum,
  getOpenid: getOpenid,
  getSessionKey: getSessionKey,
  getIsLike: getIsLike,
  setUserType: setUserType,
  setUserName: setUserName,
  setUserHead: setUserHead,
  setSessionId: setSessionId,
  setCarIdentStatus: setCarIdentStatus,
  setPhotoIdentStatus: setPhotoIdentStatus,
  setUserId: setUserId,
  setGender: setGender,
  setBirthday: setBirthday,
  setVipType: setVipType,
  setPhoneNum: setPhoneNum,
  setScIdNum: setScIdNum,
  setOpenid: setOpenid,
  setSessionKey: setSessionKey,
  setIsLike: setIsLike,
  isLogin: isLogin
}