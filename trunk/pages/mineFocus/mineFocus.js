// pages/mineFocus/mineFocus.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    currentPage: 1,
    pageSize:"10",
    loadMoreIs: true, //是否下拉
    list: [],
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    this.loadListFn(this.data.pageSize,this.data.currentPage)
  },
  //获取关注列表数据
  loadListFn: function (pageSize,currentPage){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    allapi.postFormRequestAll(conf.allUrl.enterpriseFollow,{
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        pageSize: pageSize,
        currentPage: currentPage++,
        userId: userUtil.getUserId()
      }
    },function(res){
      var listArr = res.data.followList;
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
        loadMoreIs: res.data.followList.length == _this.data.pageSize
      })
      wx.hideLoading()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
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
  onPullDownRefresh: function () {},
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.loadListFn(this.data.pageSize,this.data.currentPage)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {},
  //点击跳转至详情页
  focueFn:function(e){
    var enterpriseid = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../focus/focus?enterpriseid=' + enterpriseid,
    })
  }
})