// pages/allLogin/allLogin.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    isShow:false,
    nickName:"",
    avatarUrl:"../../images/icon_head.png"
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    if (userUtil.getUserHead() != '') {
      this.setData({
        avatarUrl: userUtil.getUserHead()
      })
    }
  },
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
  //点击上车账号登陆
  scLogin:function(){
    wx.navigateTo({
      url: '../loginApp/loginApp',
    })
  },
  //点击 获取授权
  bindGetUserInfo(opt) { //授权后获取基本信息
    var _this = this;
    if (opt.detail.userInfo.gender==1){
      this.setData({ //性别男为1
        gender: 1
      })
    } else if (opt.detail.userInfo.gender == 2){
      this.setData({ //性别女为0
        gender: 0
      })
    }
    userUtil.setUserName(opt.detail.userInfo.nickName)  //将名称及头像存储与本地
    userUtil.setUserHead(opt.detail.userInfo.avatarUrl)
    this.setData({
      nickName: userUtil.getUserName(),
      avatarUrl: userUtil.getUserHead()
    })
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
              var session_key = res.data.session_key;
              userUtil.setOpenid(res.data.openid)
              userUtil.setSessionKey(res.data.session_key)
              _this.setData({
                openid : openid,
                session_key : session_key
              })
              _this.loginFn(openid)
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: "您拒绝了微信授权"
      })
    }
  },
  //登录接口
  loginFn: function (openId) {
    var _this = this;
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
    },function (res) {
      var type = res.data.returnCode.type;
      var msg = res.data.returnCode.message
      userUtil.setUserType(msg) //将提示存储于本地
      if (type == "E" && msg =="未绑定上车号"){
        _this.setData({
          isShow:true
        })
      }else if(type == "S"){
       
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
        _this.setData({
          nickName: res.data.nickName,
          avatarUrl: res.data.userLogo
        })
        wx.reLaunch({
          url: '../index/index',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: msg
        })
      }
    })
  }, 
  //点击获取手机号授权
  getPhoneNumber: function (e) {
    var _this = this;
    this.setData({
      isShow:false
    })
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    var sessionKey = this.data.session_key;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success:function(){
          allapi.postFormRequestAll(conf.allUrl.getUserPhone,{
            channel: "02",
            sessionId: "",
            systemVersion: "1.0",
            inputParamJson: {
              encryptedData: encryptedData,
              iv: iv,
              sessionKey: sessionKey
            }
          },function(res){
            var phoneNum = res.data.phone;
            _this.resectFn(phoneNum)
          })
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: "手机号获取失败，请重新获取"
      })
    }
  },
  //注册接口
  resectFn: function (phoneNum){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.newUser, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        phone: phoneNum,
        nickName: _this.data.nickName,
        userLogo: _this.data.avatarUrl,
        openId: _this.data.openid,
        gender: _this.data.gender
      }
    }, function (msg) {
      var message = msg.data.returnCode.message;
      var type = msg.data.returnCode.type;
      if (type == "S" && message =="登录成功"){
        userUtil.setUserName(msg.data.nickName)  //将名称存储与本地
        userUtil.setUserHead(msg.data.userLogo) //将头像存储与本地
        userUtil.setUserType(msg.data.returnCode.message) //将提示存储于本地
        userUtil.setBirthday(msg.data.birthday) //将生日存储与本地
        userUtil.setCarIdentStatus(msg.data.carIdentStatus) //将车辆认证存储与本地
        userUtil.setGender(msg.data.gender) //将性别存储与本地
        userUtil.setPhoneNum(msg.data.phone) //将手机号存储与本地
        userUtil.setPhotoIdentStatus(msg.data.photoIdentStatus) //将头像认证存储与本地
        userUtil.setScIdNum(msg.data.scId) //将上车号存储与本地
        userUtil.setSessionId(msg.data.sessionId) //将sessionID存储与本地
        userUtil.setUserId(msg.data.userId) //将userId存储与本地
        userUtil.setVipType(msg.data.vipType) //将vipType存储与本地
        _this.setData({
          avatarUrl: userUtil.getUserHead(),
          nickName: userUtil.getUserName()
        })
        wx.navigateTo({
          url: '../index/index',
        })
      }else{
        wx.showModal({
          title: '提示',
          content: message,
        })
      }
    })
  }
})