// pages/allLogin/allLogin.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {},
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
  onShareAppMessage: function () { },
  scLogin:function(){
    wx.navigateTo({
      url: '../loginApp/loginApp',
    })
  },
  //点击微信登陆按钮获取授权
  bindGetUserInfo(opt) { //授权后获取基本信息
    var _this = this;
    console.log(opt.detail.userInfo.nickName)
    console.log(opt.detail.userInfo.avatarUrl)
    userUtil.setUserName(opt.detail.userInfo.nickName)
    userUtil.setUserHead(opt.detail.userInfo.avatarUrl)
    if (opt.detail.userInfo) { //点击确定后接受授权
      wx.login({
        success: function (ost) {
          var code = ost.code; //返回code
          var appId = "wx318e835965bbc541";
          var secret = "60eb50d424568f3ba118c33c04290f10"
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
            data: {},
            success: function (res) { //根据code获取openid等信息
              var openid = res.data.openid //返回openid
              _this.loginFn(openid)
            }
          })
        }
      })
    } else {
      console.log("点击了拒绝授权");
    }
  },
  //点击微信登录
  loginFn:function(openId){
    allapi.postFormRequestAll(conf.allUrl.login, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        userName:"",
        password:"",
        longitude:"",
        latitude:"",
        type:"2",
        openId: openId
      }
    },
    function (res) {
      var type = res.data.returnCode.type;
      console.log(type)
      userUtil.setUserType(type)
      if(type=="E"){
        wx.showModal({
          title: '提示',
          content: '您未绑定手机号',
          success:function(msg){
            if(msg.confirm){
              console.log("yes")
            }else{
              console.log("no")
            }
          }
        })
      }
    })
  }
})