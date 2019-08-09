// pages/login/login.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
var utilMd5 = require('../../utils/md5.js');  
Page({
  /*** 页面的初始数据 */
  data: {
    numVal:"",
    pwdVal:"",
    avatarUrl:"../../images/icon_head.png"
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {},
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /*** 生命周期函数--监听页面显示 */
  onShow: function () {},
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {},
  //获取账号内容
  username:function(e){
    this.setData({
      numVal:e.detail.value
    })
  },
  //获取密码内容
  pwdFn:function(e){
    this.setData({
      pwdVal: e.detail.value
    })
  },
  //点击确定按钮进行登陆
  loginFn:function(){
    var _this = this;
    var numVal = this.data.numVal;
    var pwdVal = utilMd5.hexMD5("SC"+this.data.pwdVal);
    if(numVal=='' || pwdVal==''){
      wx.showModal({
        title: '提示',
        content: '账号及密码都不能为空',
        showCancel: false
      })
    }else{
      _this.userLogin(numVal,pwdVal)
    }
  },
  //登陆接口
  userLogin: function (numVal, pwdVal){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.login, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        userName: numVal,
        password: pwdVal,
        type: 1
      }
    }, function (res) {
      if(res.data.returnCode.type=="E"){
        wx.showModal({
          title: '提示',
          content: res.data.returnCode.message,
          showCancel: false
        })
      }else{
        userUtil.setUserName(res.data.nickName)  //将名称存储与本地
        console.log(userUtil.getUserName())
        userUtil.setUserHead(res.data.userLogo) //将头像存储与本地
        userUtil.setUserType(res.data.returnCode.message) //将提示存储于本地
        userUtil.setBirthday(res.data.birthday) //将生日存储与本地
        userUtil.setCarIdentStatus(res.data.carIdentStatus) //将车辆认证存储与本地
        userUtil.setGender(res.data.gender) //将性别存储与本地
        userUtil.setPhoneNum(res.data.phone) //将手机号存储与本地
        userUtil.setPhotoIdentStatus(res.data.photoIdentStatus) //将头像认证存储与本地
        userUtil.setScIdNum(res.data.scId) //将上车号存储与本地
        userUtil.setSessionId(res.data.sessionId) //将sessionID存储与本地
        userUtil.setUserId(res.data.userId) //将userId存储与本地
        userUtil.setVipType(res.data.vipType) //将vipType存储与本地
        wx.reLaunch({
          url: '../index/index',
        })
        _this.setData({
          avatarUrl: userUtil.getUserHead()
        })
      }
    })
  }
})