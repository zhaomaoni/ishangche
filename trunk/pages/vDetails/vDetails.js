// pages/vDetails/vDetails.js
var allapi = require("../../utils/comment.js");
var conf = require('../../utils/config.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /*** 页面的初始数据 */
  data: {
    isShow:false,
    content:[],
    aboutList:[]
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var _this = this;
    var index = opt.index;
    this.setData({
      ind:index
    })
    this.loadList(index)
    this.aboutListFn(index)
  },
  //加载视频数据
  loadList: function (index){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.iBody, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationId: index,
        userId: "" //12346046
      }
    },
      function (res) {
        _this.setData({
          content: res.data,
          nodes: res.data.informationContent
        })
        WxParse.wxParse('article', 'html', _this.data.nodes, _this, 5);
      })
  },
  //加载相关推荐数据
  aboutListFn:function(index){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.mainAbout, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationId: index
      }
    },function(res){
      console.log(res.data.correlationList)
      _this.setData({
        aboutList: res.data.correlationList
      })
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
  onReachBottom: function () {},
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {},
  //更多评论
  morePingFn: function () {
    wx.navigateTo({
      url: '../moreDetails/moreDetails',
    })
  },
  // 视频资讯跳转详情
  navigatorFn2: function (e) {
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../vDetails/vDetails?index=' + index
    })
  }
})