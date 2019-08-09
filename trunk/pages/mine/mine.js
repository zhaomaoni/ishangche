// pages/mine/mine.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    isShow:true,
    nickName: "",
    scNumber: "",
    avatarUrl: "../../images/icon_head.png"
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var _this = this;
    if (userUtil.getUserHead() == '') {
      _this.setData({
        isShow: true
      })
    }
    this.setData({
      nickName: userUtil.getUserName()
    })
    if (userUtil.getUserHead() != '') { //有头像无上车号时 只展示头像和昵称
      _this.setData({
        isShow: false,
        avatarUrl: userUtil.getUserHead()
      })
    }
    if (userUtil.getScIdNum() != '') { //有上车号时 展示上车号
      _this.setData({
        scNumber: userUtil.getScIdNum()
      })
    }
  },
  //返回上一页并刷新上一页
  changeParentData: function () {
    var pages = getCurrentPages();//当前页面栈
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对
      beforePage.changeData();//触发父页面中的方法
    }
  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /*** 生命周期函数--监听页面显示 */
  onShow: function () { this.changeParentData()},
  //点击完善信息 获取手机号
  getPhoneNumber: function (e) {
    console.log(e)
    var _this = this;
    var iv = e.detail.iv;
    var encryptedData = e.detail.encryptedData;
    console.log(userUtil.getSessionKey())
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.checkSession({
        success: function () {
          allapi.postFormRequestAll(conf.allUrl.getUserPhone, {
            channel: "02",
            sessionId: "",
            systemVersion: "1.0",
            inputParamJson: {
              encryptedData: encryptedData,
              iv: iv,
              sessionKey: userUtil.getSessionKey()
            }
          }, function (res) {
            var phoneNum = res.data.phone;
            _this.resectFn(phoneNum)
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: "手机号获取失败，请重新获取"
      })
    }
  },
  //注册接口
  resectFn: function (phoneNum) {
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.newUser, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        phone: phoneNum,
        nickName: userUtil.getUserName(),
        userLogo: userUtil.getUserHead(),
        openId: userUtil.getOpenid(),
        gender: userUtil.getGender()
      }
    }, function (msg) {
      var message = msg.data.returnCode.message;
      var type = msg.data.returnCode.type;
      if (type == "S" && message == "登录成功") {
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
      } else {
        wx.showModal({
          title: '提示',
          content: message,
        })
      }
    })
  },
  //点击退出登陆
  loginOut: function () {
    var _this = this;
    wx.showLoading({
      title: '退出登录中'
    })
    setTimeout(function () {

      userUtil.setUserType("")
      userUtil.setUserName("")
      userUtil.setUserHead("")
      userUtil.setSessionId("")
      userUtil.setCarIdentStatus("")
      userUtil.setPhotoIdentStatus("")
      userUtil.setUserId("")
      userUtil.setGender("")
      userUtil.setBirthday("")
      userUtil.setVipType("")
      userUtil.setPhoneNum("")
      userUtil.setScIdNum("")
      userUtil.setOpenid("")
      userUtil.setSessionKey("")
      userUtil.setIsLike("")
      console.log(userUtil.getScIdNum())
      console.log(userUtil.getUserName())
      wx.hideLoading()
      _this.setData({
        isShow: true,
        avatarUrl: "../../images/icon_head.png"
      })
    }, 1000)
  },
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
  // 点击回退按钮至上一页
  histroyBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //点击 关注 跳转至关注列表
  mineFocue:function(){
    if(this.data.isShow!=true){
      wx.navigateTo({
        url: '../mineFocus/mineFocus',
      })
    }else{
      wx.showModal({
        content: '请登陆后再进行查看',
        showCancel:false,
        success:function(res){
          wx.navigateTo({
            url: '../loginAll/loginAll',
          })
        }
      })
    }
  },
  //点击 下载上车 跳转至下载页
  downApp:function(){
    wx.navigateTo({
      url: '../openApp/openApp',
    })
  },
  //点击 用户未登录 跳转至登陆页
  loginNav:function(){
    wx.navigateTo({
      url: '../loginAll/loginAll',
    })
  }
})