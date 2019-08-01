// pages/aDetails/aDetails.js
var allapi = require("../../utils/comment.js");
var conf = require('../../utils/config.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /*** 页面的初始数据 */
  data: {
    isShow:false,
    zanImg: "../../images/icon_zan1.png",
    isZan: true,
    content:[],
    nodes:[]
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var _this = this;
    var index = opt.index;
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
  // 点赞
  zanBtnFn: function () {
    var _this = this;
    this.setData({
      zanNum: _this.data.isZan ? Number(_this.data.zanNum) + 1 : Number(_this.data.zanNum) - 1,
      isZan: !_this.data.isZan,
      zanImg: _this.data.isZan ? "../../images/icon_zan3.png" : "../../images/icon_zan1.png"
    })
  },
  //更多评论
  morePingFn:function(){
    wx.navigateTo({
      url: '../moreDetails/moreDetails',
    })
  }
})