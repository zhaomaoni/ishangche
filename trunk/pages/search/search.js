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
    isLoad:false,
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
    var _this = this;
    this.setData({
      currentPage:1,
      list:[],
      loadMoreIs:true,
      isLoad: true
    })
    wx.stopPullDownRefresh();
    setTimeout(function () {
      _this.buildHistory(_this.data.valTxt)
      _this.setData({
        isLoad: false
      })
    }, 500);



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
    this.setData({
      isLoad:true
    })
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
      if(res.data.returnCode.code=="success"){
        // console.log(res.data)
        var listArr = res.data.informationList;


        var titleLight = [];
        var inputs = _this.data.valTxt;
        var lists = listArr
        for (var i = 0; i < lists.length; i++) {
          var word = lists[i].informationTitle
          lists[i].informationTitle = _this.hilight_word(inputs, word)
          // _this.setData({
          //   list: lists
          // })
        }

        if (_this.data.loadMoreIs == false) {
          _this.setData({
            currentPage: _this.data.currentPage++,
            list: listArr,
            isLoad: false
          })
        } else {
          _this.setData({
            isLoad: false,
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
            isHide: false
          })
        } else {
          _this.setData({
            isHide: true
          })
        }
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.returnCode.message,
          showCancel: false
        })
      }
    })
  },
  // 根据搜索字分割字符
  hilight_word: function (key, word) {
    let idx = word.indexOf(key), t = [];

    if (idx > -1) {
      if (idx == 0) {
        t = this.hilight_word(key, word.substr(key.length));
        t.unshift({ key: true, word: key });
        return t;
      }

      if (idx > 0) {
        t = this.hilight_word(key, word.substr(idx));
        t.unshift({ key: false, word: word.substring(0, idx) });
        return t;
      }
    }
    return [{ key: false, word: word }];
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