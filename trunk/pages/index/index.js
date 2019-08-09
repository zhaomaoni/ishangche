// pages/index/index.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    playIndex: null,//用于记录当前播放的视频的索引值
    header: ["车主访谈", "视频资讯"],
    currentTab: 0,
    currentPage:1,
    loadMoreIs: true, //是否下拉
    zanImg: "../../images/icon_zan2.png",
    list:[],
    userLogo:""
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.listDataFn(this.data.currentTab, this.data.currentPage)
  },
  /* 获取数据 */
  listDataFn: function (currentTab,currentPage){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    //获取 记录 数据   //channel: "02", //话题03 交友01 资讯02
    allapi.postFormRequestAll(conf.allUrl.infoUrl, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          pageSize: "10",
          currentPage: currentPage++,
          userId: userUtil.getUserId(), 
          type: currentTab
        }
      },
      function (res) {
        var listArr = res.data.informationList;
        var listNum = listArr;
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            list: listNum,
            currentPage: currentPage++
          })
        } else {
          _this.setData({
            currentPage: currentPage++,
            list: _this.data.list.concat(listNum)
          })
        }
        _this.setData({
          loadMoreIs: res.data.informationList.length == 10,
          userLogo: res.data.userLogo
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
  },
  //点击播放
  videoPlay: function (e) {
    var curIdx = e.currentTarget.dataset.index;
    // 没有播放时播放视频
    if (!this.data.playIndex) {
      this.setData({
        playIndex: curIdx
      })
      var videoContext = wx.createVideoContext('video' + curIdx) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext('video' + this.data.playIndex)
      if (this.data.playIndex != curIdx) {
        videoContextPrev.pause()
      }
      this.setData({
        playIndex: curIdx
      })
      var videoContextCurrent = wx.createVideoContext('video' + curIdx)
      videoContextCurrent.play()
    }
  },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /*** 生命周期函数--监听页面显示 */
  onShow: function () {},

  changeData: function () {
    this.onLoad();//刷新上级页面
  },
  
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    this.setData({
      currentPage:1
    })
    this.listDataFn(this.data.currentTab, this.data.currentPage)
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.listDataFn(this.data.currentTab,this.data.currentPage)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    allapi.postFormRequestAll(conf.allUrl.mainShare, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        type: "1",
        informationId: _this.data.informationId,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      console.log("分享成功")
    })
  },
  //tab导航切换
  currentBtn: function (e) {
    var _this = this;
    if (this.data.currentTab === e.currentTarget.dataset.idx) {
      return false;
    } else {
      _this.setData({
        currentTab: e.currentTarget.dataset.idx,
        list: [],
        loadMoreIs: true
      })
    }
    if (this.data.currentTab == 0) {
      _this.setData({
        currentPage: 1
      })
      this.onLoad()
    } else if (this.data.currentTab == 1) {
      _this.setData({
        currentPage: 1
      })
      this.onLoad()
    }
    
  },
  // 文章资讯跳转详情
  navigatorFn1: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../aDetails/aDetails?index='+index
    })
  },
  // 视频资讯跳转详情
  navigatorFn2: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../vDetails/vDetails?index='+index
    })
  },
  // 跳转至搜索页
  searchFn:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  }
})