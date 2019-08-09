// pages/moreDetails/moreDetails.js
var allapi = require("../../utils/comment.js");
var conf = require('../../utils/config.js');
var userUtil = require('../../utils/userUtil.js')
Page({
  /*** 页面的初始数据 */
  data: {
    pageSize: "10",
    currentPage: 1,
    list:[],
    isBlack:false,
    loadMoreIs: true, //是否下拉
    holder:"回复：",
    pingVal:"",
    secondCommentsList: [],
    touchStartTime: 0,// 触摸开始时间
    touchEndTime: 0,// 触摸结束时间
    lastTapTime: 0,// 最后一次单击事件点击发生时间
    lastTapTimeoutFunc: null,// 单击事件点击后要触发的函数
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var pages = getCurrentPages();
    var prevpage = pages[pages.length - 2];
    var fromRouter = prevpage.route;
    console.log(fromRouter)
    if (fromRouter == "pages/vDetails/vDetails") {
      this.setData({
        isBlack:true
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#222222',
      })
    } else {
      this.setData({
        isBlack: false
      })
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      })
    }
    this.setData({
      informationId: opt.informationId,
      informationCommentId:opt.index
    })
    this.loadList(opt.index)
  },
  //评论框失去焦点后隐藏
  hideInput: function () {
    this.setData({
      hideLay: true
    })
  },
  // 获取二级评论展示数据
  loadList:function(index){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    allapi.postFormRequestAll(conf.allUrl.secondInformationComments, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationCommentId: _this.data.informationCommentId,
        userId: userUtil.getUserId(),
        pageSize: _this.data.pageSize,
        currentPage: _this.data.currentPage++
      }
    }, function (res) {
      var secondCommentsList = res.data.secondCommentsList
      if (_this.data.loadMoreIs == false) {
        _this.setData({
          currentPage: _this.data.currentPage++,
          secondCommentsList: secondCommentsList,
        })
      }else{
        _this.setData({
          currentPage: _this.data.currentPage++,
          secondCommentsList: _this.data.secondCommentsList.concat(secondCommentsList)
        })
      }
      _this.setData({
        loadMoreIs: res.data.secondCommentsList.length == 10
      })
      wx.hideLoading()
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      _this.setData({
        list:res.data,
        replyUserId:res.data.fromUserId,
        holder: "回复：" + res.data.nickName
      })
    })
  },
  //获取评论内容
  pingVal: function (e) {
    this.setData({
      pingVal: e.detail.value
    })
  },
  //点击发送
  btn_pingFn:function(){
    if (this.data.pingVal.length == 0) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空',
        showCancel: false
      })
    } else {
      this.loadPingFn(this.data.informationId, this.data.pingVal, this.data.replyUserId, "2")
    }
  },
  //评论接口
  loadPingFn: function (id, content, replyUserId, type) {
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.comment, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        fromUserId: userUtil.getUserId(),
        replyUserId: replyUserId,
        type: type,
        informationId: _this.data.informationId,
        contentId: _this.data.informationCommentId,
        content: content
      }
    }, function (res) {
      _this.setData({
        pingVal: "",
        hideLay: true,
        currentPage: 1,
      })

      allapi.postFormRequestAll(conf.allUrl.secondInformationComments, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          informationCommentId: _this.data.informationCommentId,
          userId: userUtil.getUserId(),
          pageSize: _this.data.pageSize,
          currentPage: _this.data.currentPage++
        }
      }, function (res) {
        var secondCommentsList = res.data.secondCommentsList
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            currentPage: _this.data.currentPage++,
            secondCommentsList: secondCommentsList,
          })
        } else {
          _this.setData({
            currentPage: _this.data.currentPage++,
            secondCommentsList: _this.data.secondCommentsList.concat(secondCommentsList)
          })
        }
        _this.setData({
          loadMoreIs: res.data.secondCommentsList.length == 10
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        _this.setData({
          list: res.data,
          replyUserId: res.data.fromUserId,
          holder: "回复：" + res.data.nickName
        })
      })


    })
  },
  // 长按删除评论
  longTap: function (e) {
    var _this = this;
    var ids = e.currentTarget.dataset.ids;
    var fromuserid = e.currentTarget.dataset.fromuserid;
    if (fromuserid != userUtil.getUserId()) {
    } else {
      wx.showModal({
        title: '提示',
        content: '您是否确定删除？',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            _this.delCommit(ids)
          }
        }
      })
    }
  },
  //删除评论接口
  delCommit: function (ids) {
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.delComment, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationCommentId: ids,
        informationId: _this.data.informationId,
        type: "2"
      }
    }, function (res) {
      _this.setData({
        currentPage: 1
      })
      allapi.postFormRequestAll(conf.allUrl.secondInformationComments, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          informationCommentId: _this.data.informationCommentId,
          userId: userUtil.getUserId(),
          pageSize: _this.data.pageSize,
          currentPage: _this.data.currentPage++
        }
      }, function (res) {
        var secondCommentsList = res.data.secondCommentsList
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            currentPage: _this.data.currentPage++,
            secondCommentsList: secondCommentsList,
          })
        } else {
          _this.setData({
            currentPage: _this.data.currentPage++,
            secondCommentsList: _this.data.secondCommentsList.concat(secondCommentsList)
          })
        }
        _this.setData({
          loadMoreIs: res.data.secondCommentsList.length == 10
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        _this.setData({
          list: res.data,
          replyUserId: res.data.fromUserId,
          holder: "回复：" + res.data.nickName
        })
      })
    })
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
  onShow: function () {},
  /*** 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /*** 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /*** 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {
    this.setData({
      currentPage:1
    })
    this.loadList(this.data.informationCommentId)
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.loadList(this.data.informationCommentId)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: '/pages/aDetails/aDetails',
      imageUrl: '',
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: "分享成功",
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
      },
    }
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
})