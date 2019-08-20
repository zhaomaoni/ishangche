// pages/index/index.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    playIndex: null,//用于记录当前播放的视频的索引值
    header: ["上车热门", "超跑视频", "车主访谈"],
    currentTab: 0,
    currentPage:1,
    loadMoreIs: true, //是否下拉
    list:[],
    isTab: 0,
    userLogo:"",
    isLoad:false
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.listDataFn(this.data.currentTab, this.data.currentPage)
  },
  // 底部切换
  footFn:function(e){
    var index = e.currentTarget.dataset.index;
    var url = e.currentTarget.dataset.url;
    if(this.data.isTab!=index){
      wx.reLaunch({
        url: url,
      })
      this.setData({
        isTab: index
      })
    }
  },
  /* 获取数据 */
  listDataFn: function (currentTab,currentPage){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    var cur;
    if (currentTab==0){
      cur = 2
    } else if (currentTab==1){
      cur = 1
    }else{
      cur = 0
    }
    this.setData({
      isLoad:true
    })
    //获取 记录 数据   //channel: "02", //话题03 交友01 资讯02
    allapi.postFormRequestAll(conf.allUrl.infoUrl, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          pageSize: "10",
          currentPage: currentPage++,
          userId: userUtil.getUserId(), 
          type: cur
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
          userLogo: res.data.userLogo,
          isLoad:false
        })
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
  },
  //点击播放
  videoPlay: function (e) {
    var curIdx = e.currentTarget.dataset.index;
    // 没有播放时播放视频
    /*if (!this.data.playIndex) {
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
    }*/
  },
  autoplayFn:function(e){
    console.log(e)
  },
  //监听屏幕滚动 判断上下滚动
  // onPageScroll: function (ev) {
  //   console.log(ev.scrollTop)
  // },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /*** 生命周期函数--监听页面显示 */
  onShow: function () {},
  //刷新上级页面
  changeData: function () {
    this.onLoad();
  },
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    var _this = this
    var cur;
    if (this.data.currentTab == 0) {
      cur = 2
    } else if (this.data.currentTab == 1) {
      cur = 1
    } else {
      cur = 0
    }
    this.setData({
      currentPage: 1,
      isLoad: true,
      list:[]
    })
    wx.stopPullDownRefresh();
    setTimeout(function () {
      allapi.postFormRequestAll(conf.allUrl.infoUrl, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          pageSize: "10",
          currentPage: _this.data.currentPage++,
          userId: userUtil.getUserId(),
          type: cur
        }
      },function (res) {
        var listArr = res.data.informationList;
        var listNum = listArr;
          _this.setData({
            list: listNum,
            currentPage: _this.data.currentPage++,
            loadMoreIs: res.data.informationList.length == 10,
            userLogo: res.data.userLogo,
            isLoad: false
          })
      })
    }, 500);
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
    }else{
      _this.setData({
        currentPage: 1
      })
      this.onLoad()
    }
    
  },
  // 文章资讯跳转详情
  navigatorFn1: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    this.setData({
      isLoad: true
    })
    wx.navigateTo({
      url: '../aDetails/aDetails?index=' + index + "&currentTab=" + _this.data.currentTab,
      success:function(){
        _this.setData({
          isLoad: false
        })
      }
    })
  },
  // 视频资讯跳转详情
  navigatorFn2: function (e) {
    var _this = this;
    this.setData({
      isLoad: true
    })
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../vDetails/vDetails?index='+index,
      success: function () {
        _this.setData({
          isLoad: false
        })
      }
    })
  },
  // 跳转至搜索页
  searchFn:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  }
})