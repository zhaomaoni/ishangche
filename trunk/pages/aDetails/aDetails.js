// pages/aDetails/aDetails.js
var allapi = require("../../utils/comment.js");
var conf = require('../../utils/config.js');
var userUtil = require('../../utils/userUtil.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /*** 页面的初始数据 */
  data: {
    isShow:false,
    content:[],
    nodes:[],
    informationId:"", //
    pageSize:"10",
    currentPage:1,
    loadMoreIs: true, //是否下拉
    commentList:[],
    islike:0,
    follow:0,
    isLoad:false,
    likes:"",
    inter:0,//车主访谈按钮是否现实  为2时现实
    hideLay:true,   //是否现实评论框
    inputShowed:false,//是否自动获取光标
    pingVal:"", //评论框的内容
    holder:"发表你的精彩评论吧", //评论框placeholder
    touchStartTime: 0,// 触摸开始时间
    touchEndTime: 0,// 触摸结束时间
    lastTapTime: 0,// 最后一次单击事件点击发生时间
    lastTapTimeoutFunc: null,// 单击事件点击后要触发的函数
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (opt) {
    var _this = this;
    var index = opt.index;
    var current = opt.currentTab;
    if (current==2){
      this.setData({
        inter: current
      })
    }
    this.setData({
      informationId:index
    })
    this.morePingLoad(index)
    this.loadContent(index)
    this.addPageViews(index)
  },
  //增加浏览量
  addPageViews:function(index){
    var _this = this;
    allapi.postFormRequestAll(conf.allUrl.addPage, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationId: index
      }
    },function (res) {
      console.log("增加浏览量成功")    
    })
  },
  //获取详情内容
  loadContent:function(index){
    var _this = this;
    this.setData({
      isLoad:true
    })
    allapi.postFormRequestAll(conf.allUrl.iBody, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationId: index,
        userId: userUtil.getUserId()
      }
    },function (res) {
      _this.setData({
        content: res.data,
        islike: res.data.isLike,
        follow: res.data.follow,
        likes: res.data.likes,
        informationCommentId: res.data.informationId,
        nodes: res.data.informationContent
      })
      _this.setData({
        isLoad: false
      })
      userUtil.setIsLike(res.data.isLike)
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
  onPullDownRefresh: function () {
    this.loadContent(this.data.informationId)
    this.setData({
      loadMoreIs: true,
      currentPage:1,
      commentList:[]
    })
    this.morePingLoad(this.data.informationId)
  },
  /*** 页面上拉触底事件的处理函数 */
  onReachBottom: function () {
    this.morePingLoad(this.data.informationId)
  },
  /*** 用户点击右上角分享 */
  onShareAppMessage: function () {
    var _this = this;
    return {
      title: _this.data.content.informationTitle,
      imageUrl: _this.data.content.informationPhoto,
      path: '/pages/aDetails/aDetails?index=' + _this.data.informationId + "&currentTab=" + _this.data.inter
    }
    wx.showShareMenu({
      withShareTicket: true
    })
    allapi.postFormRequestAll(conf.allUrl.mainShare,{
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        type: "1",
        informationId: _this.data.informationId,
        userId: userUtil.getUserId()
      }
    },function(res){
      console.log("分享成功")
    })
  },
  // 点赞
  zanBtnFn: function (e) {
    var _this = this;
    var islike = e.currentTarget.dataset.islike;
    var id = e.currentTarget.dataset.id;
    if (userUtil.getScIdNum()!=""){
      if (userUtil.getIsLike() == "1") {   //点过赞
        userUtil.setIsLike("0")
        this.setData({
          islike: userUtil.getIsLike(),
          likes: parseInt(_this.data.likes) - 1
        })
        this.zanLoadFn(id, "1")
      } else {  //未点过赞
        userUtil.setIsLike("1")
        this.setData({
          islike: userUtil.getIsLike(),
          likes: parseInt(_this.data.likes) + 1
        })
        this.zanLoadFn(id, "0")
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '您未绑定上车号，请进行绑定',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
    
  },
  //点赞接口
  zanLoadFn:function(id,islike){
    var _this = this;
    this.setData({
      isLoad: true
    })
    allapi.postFormRequestAll(conf.allUrl.like, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        type: "1",
        informationId: id,
        isLike: islike,
        contentId: id,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      _this.setData({
        isLoad: false
      })
      // console.log(res)
    })
  },
  //更多评论
  morePingFn:function(e){
    var index = e.currentTarget.dataset.id;
    var _this = this
    if (userUtil.getScIdNum() != "") {
      wx.navigateTo({
        url: '../moreDetails/moreDetails?index=' + index + "&informationId=" + _this.data.informationId,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您未绑定上车号，请绑定再查看',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },
  //获取一级评论数据
  morePingLoad:function(index){
    var _this = this;
    if (_this.data.loadMoreIs == false) {
      wx.hideLoading()
      return;
    }
    this.setData({
      isLoad: true
    })
    allapi.postFormRequestAll(conf.allUrl.firstInformationComments, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationId: index,
        userId: userUtil.getUserId(),
        pageSize: _this.data.pageSize,
        currentPage: _this.data.currentPage++
      }
    },function (res) {
      if (_this.data.loadMoreIs == false) {
        wx.hideLoading()
        return;
      }
      var listArr = res.data.commentsList;
      var listNum = listArr;
      if (_this.data.loadMoreIs == false) {
        _this.setData({
          commentList: listNum,
          isLoad:false
        })
      } else {
        _this.setData({
          isLoad:false,
          commentList: _this.data.commentList.concat(listNum)
        })
      }
      if (res.data.commentsList.length<10){
        _this.setData({
          currentPage: _this.data.currentPage++,
          loadMoreIs: res.data.commentsList.length == 10
        })
      }else{
        _this.setData({
          currentPage: _this.data.currentPage++,
          loadMoreIs: res.data.commentsList.length == 10
        })
      }
      // 停止下拉动作
      wx.stopPullDownRefresh();
    })
  },
  //是否关注
  followFn:function(e){
    var follow = e.currentTarget.dataset.follow;
    var id = e.currentTarget.dataset.id;
    var _this = this;
    if (userUtil.getScIdNum() != "") {
      if(this.data.follow==1){
        this.unFollowEnterprise(id)
        this.setData({
          follow : 0
        })
      }else{
        this.followEnterprise(id)
        this.setData({
          follow: 1
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您未绑定上车号，请进行绑定',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },
  //关注
  followEnterprise: function (enterpriseId){
    allapi.postFormRequestAll(conf.allUrl.followEnterprise, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        enterpriseId: enterpriseId,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      // console.log("关注")
    })
  },
  //不关注
  unFollowEnterprise: function (enterpriseId){
    allapi.postFormRequestAll(conf.allUrl.unFollowEnterprise, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        enterpriseId: enterpriseId,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      // console.log("取消关注")
    })
  },
  //点击评论现实评论框
  pingLayFn:function(){
    if (userUtil.getScIdNum() != "") {
      this.setData({
        hideLay:false,
        inputShowed:true
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您未绑定上车号，请进行绑定',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
  },
  //点击空白地方关闭评论框
  layHideFn: function () {
    this.setData({
      hideLay: true
    })
  },
  //评论框失去焦点后隐藏
  hideInput:function(){
    this.setData({
      hideLay: true
    })
  },
  //获取评论内容
  pingVal:function(e){
    this.setData({
      pingVal: e.detail.value
    })
  },
  //发送评论
  btn_pingFn:function(e){
    if (this.data.pingVal.length == 0) {
      wx.showModal({
        title: '提示',
        content: '评论内容不能为空',
        showCancel:false
      })
    } else {
      if (this.data.holder !="发表你的精彩评论吧"){
        this.loadPingFn(this.data.informationId, this.data.pingVal, this.data.fromuserid, "2")
      }else{
        this.loadPingFn(this.data.informationId, this.data.pingVal, "", "1")
      }
    }
  },
  //评论接口
  loadPingFn: function (id, content, replyUserId, type){
    var _this = this;
    this.setData({
      isLoad: true
    })
    allapi.postFormRequestAll(conf.allUrl.comment , {
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
        currentPage:1,
        fromuserid: "",
        isLoad:false,
        commentList:[],
        informationCommentId: _this.data.informationId,
        holder:"发表你的精彩评论吧"
      })
      // _this.morePingLoad(_this.data.informationId)
      allapi.postFormRequestAll(conf.allUrl.firstInformationComments, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          informationId: _this.data.informationId,
          userId: userUtil.getUserId(),
          pageSize: _this.data.pageSize,
          currentPage: _this.data.currentPage++
        }
      }, function (res) {
        var commentList = res.data.commentsList;
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            currentPage: _this.data.currentPage++,
            commentList: commentList,
          })
        } else {
          _this.setData({
            currentPage: _this.data.currentPage++,
            commentList: _this.data.commentList.concat(commentList)
          })
        }
        _this.setData({
          loadMoreIs: res.data.commentsList.length == 10
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
    })
  },
  //二级回复触发
  secondPing:function(e){
    var fromuserid = e.currentTarget.dataset.fromuserid;
    var name = e.currentTarget.dataset.name;
    var ids = e.currentTarget.dataset.id;
    if (userUtil.getScIdNum() != "") {
      this.setData({
        hideLay: false,
        fromuserid: fromuserid,
        informationCommentId: ids,
        holder: "回复：" + name
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您未绑定上车号，请绑定后再评论',
        success: function (msg) {
          if (msg.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
    }
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
  delCommit:function(ids){
    var _this = this;
    this.setData({
      isLoad: true
    })
    allapi.postFormRequestAll(conf.allUrl.delComment, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        informationCommentId: ids,
        informationId: _this.data.informationId,
        type: "1"
      }
    }, function (res) {
      _this.setData({
        currentPage: 1,
        // commentList: [],
        isLoad:false
      })
      allapi.postFormRequestAll(conf.allUrl.firstInformationComments, {
        channel: "02",
        sessionId: "",
        systemVersion: "1.0",
        inputParamJson: {
          informationId: _this.data.informationId,
          userId: userUtil.getUserId(),
          pageSize: _this.data.pageSize,
          currentPage: _this.data.currentPage++
        }
      }, function (res) {
        var commentList = res.data.commentsList;
        if (_this.data.loadMoreIs == false) {
          _this.setData({
            currentPage: _this.data.currentPage++,
            commentList: commentList,
          })
        } else {
          _this.setData({
            currentPage: _this.data.currentPage++,
            commentList: _this.data.commentList.concat(commentList)
          })
        }
        _this.setData({
          loadMoreIs: res.data.commentsList.length == 10
        })
        wx.hideLoading()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
    })
  },
  //点击公众号头像跳转至公众号主页
  jumpFouce:function(e){
    console.log(e.currentTarget.dataset.enterpriseid)
    var enterpriseid = e.currentTarget.dataset.enterpriseid;
    wx.navigateTo({
      url: '../focus/focus?enterpriseid=' + enterpriseid,
    })
  },
  /// 按钮触摸开始触发的事件
  touchStart: function (e) {
    this.touchStartTime = e.timeStamp
  },
  /// 按钮触摸结束触发的事件
  touchEnd: function (e) {
    this.touchEndTime = e.timeStamp
  },
  /// 点击 申请访谈 按钮跳转至申请访谈页
  appleBtn:function(){
    wx.navigateTo({
      url: '../apply/apply',
    })
  }
})