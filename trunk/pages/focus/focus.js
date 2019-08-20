// pages/focus/focus.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    focusImg:"../../images/icon_focusNo.png",
    userMsg:[],
    pageSize:"10",
    currentPage:"1",
    loadMoreIs: true, //是否下拉
    hisList:[],
    isLoad: false,
    enterpriseid:""
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var enterpriseid = opt.enterpriseid;
    // var enterpriseId = "ef1a5d22bcbb4806b00c71b790b8f817";
    this.setData({
      enterpriseid: enterpriseid//"ef1a5d22bcbb4806b00c71b790b8f817"
    })
    this.userMsgFn(enterpriseid)
    this.historyFn(this.data.pageSize, this.data.currentPage, this.data.enterpriseid)
  },
  //获取用户信息数据
  userMsgFn: function (enterpriseid){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.enterpriseDetails, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        enterpriseId: enterpriseid,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      wx.setNavigationBarTitle({
        title: res.data.enterpriseName,    //页面标题
      })
      _this.setData({
        userMsg: res.data,
        follow:res.data.follow
      })
    })
  },
  //获取历史资讯信息
  historyFn: function (pageSize, currentPage, enterpriseid){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    this.setData({
      isLoad: true
    })
    allapi.postFormRequestAll(conf.allUrl.enterpriseInformations, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        pageSize: pageSize,
        currentPage: currentPage++,
        enterpriseId: enterpriseid,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      var listArr = res.data.informationList;
      var listNum = listArr;
      if (_this.data.loadMoreIs == false) {
        _this.setData({
          hisList: listNum,
          isLoad: false,
          currentPage: currentPage++
        })
      } else {
        _this.setData({
          isLoad: false,
          currentPage: currentPage++,
          hisList: _this.data.hisList.concat(listNum)
        })
      }
      _this.setData({
        loadMoreIs: res.data.informationList.length == _this.data.pageSize
      })
      wx.hideLoading()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },
  //点击进入文章详情页
  jumpFn:function(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../aDetails/aDetails?index=' + index
    })
  },
  //点击进入视频详情页
  jumpFn2: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../vDetails/vDetails?index=' + index
    })
  },
  //是否关注
  followFn: function (e) {
    var follow = e.currentTarget.dataset.follow;
    var id = e.currentTarget.dataset.index;
    console.log(e)
    var _this = this;
    if (userUtil.getScIdNum()!=""){
      if (this.data.follow == 1) {
        this.unFollowEnterprise(id)
        this.setData({
          follow: 0
        })
      } else {
        this.followEnterprise(id)
        this.setData({
          follow: 1
        })
      }
    }else{
      wx.showModal({
        content: '请登录后再进行查看',
        showCancel: false,
        success: function (res) {
          wx.navigateTo({
            url: '../loginAll/loginAll',
          })
        }
      })
    }
    
  },
  //关注
  followEnterprise: function (enterpriseid) {
    allapi.postFormRequestAll(conf.allUrl.followEnterprise, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        enterpriseId: enterpriseid,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      console.log("关注")
    })
  },
  //不关注
  unFollowEnterprise: function (enterpriseid) {
    allapi.postFormRequestAll(conf.allUrl.unFollowEnterprise, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        enterpriseId: enterpriseid,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      console.log("取消关注")
    })
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
  onPullDownRefresh: function () {
    var _this = this;
    this.setData({
      currentPage: 1,
      hisList:[]
    })
    wx.stopPullDownRefresh();
    setTimeout(function () {
      _this.historyFn(_this.data.pageSize, _this.data.currentPage, _this.data.enterpriseid)
    }, 500);
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.historyFn(this.data.pageSize, this.data.currentPage, this.data.enterpriseid)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () { }
})