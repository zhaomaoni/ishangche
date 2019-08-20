// pages/search/search.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    valTxt: "",
    currentPage: 1,
    pageSize: "10",
    loadMoreIs: true,
    list: [],
    isHide: true,
    playIndex: null,//用于记录当前播放的视频的索引值
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) { },
  /*** 生命周期函数--监听页面初次渲染完成 */
  onReady: function () { },
  /*** 生命周期函数--监听页面显示 */
  onShow: function () { },
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () { },
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () { },
  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      currentPage:1
    })
    this.buildHistory(this.data.valTxt)
    wx.hideLoading()
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.buildHistory(this.data.valTxt)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () { },
  //文本框搜索
  searchFn: function (e) {
    var _this = this;
    this.setData({
      valTxt: e.detail.value.trim(),
      currentPage: 1
    })
  },
  //搜索确认事件
  btn_search: function (e) {
    this.setData({
      isHide:true,
      currentPage: 1
    })
    if (e.detail.value == "") {
      wx.showModal({
        title: '提示',
        content: '搜索内容不能为空',
        showCancel: false
      })
      return;
    }
    this.setData({
      loadMoreIs:true,
      list:[],
      valTxt: e.detail.value
    })
    this.buildHistory(e.detail.value)//调用历史记录事件
  },
  // 获取搜索数据
  buildHistory: function (valTxt) {
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    allapi.postFormRequestAll(conf.allUrl.informationFuzzyQuery, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        pageSize: _this.data.pageSize,
        currentPage: _this.data.currentPage++,
        title: valTxt
      }
    }, function (res) {
      // console.log(res.data)
      var listArr = res.data.informationList;
      if (_this.data.loadMoreIs == false) {
        _this.setData({
          currentPage: _this.data.currentPage++,
          list: listArr,
        })
      } else {
        _this.setData({
          currentPage: _this.data.currentPage++,
          list: _this.data.list.concat(listArr)
        })
      }
      _this.setData({
        loadMoreIs: res.data.informationList.length == 10
      })
      wx.hideLoading()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();

      if (res.data.type == 1) {  //type==1 无数据  ==0 有数据
        _this.setData({
          isHide:false
        })
      } else {
        _this.setData({
          isHide: true
        })
      }
    })
  },
  //跳转至文章详情页
  mainJump: function (e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../aDetails/aDetails?index=' + index,
    })
  },
  //跳转至视频详情页
  mainJump2: function (e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../vDetails/vDetails?index=' + index,
    })
  }
})