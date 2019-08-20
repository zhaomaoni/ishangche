// pages/apply/apply.js
var allapi = require("../../utils/comment.js")
var conf = require('../../utils/config.js')
var userUtil = require('../../utils/userUtil.js')
Page({
  /** * 页面的初始数据 */
  data: {
    min: 0,
    telVal: "",
    telVal1:"",
    wechatVal:"",
    max: 500,
    areaVal:""
  },
  /** * 生命周期函数--监听页面加载 */
  onLoad: function (options) {},
  //手机号不能为空
  telphone:function(e){
    var val = e.detail.value;
      this.setData({
        telVal: val
      })
  },
  //您的爱车不能为空
  telphone1: function (e) {
    var val = e.detail.value;
    this.setData({
      telVal1: val
    })
  },
  //微信号
  wechatNum:function(e){
    var val = e.detail.value;
    this.setData({
      wechatVal:val
    })
  },
  //监听文本域字符的变化
  /*inputs: function (e) {
    var value = e.detail.value;
    var len = parseInt(value.length);
    if (len > this.data.max) return;
    this.setData({
      areaVal: value,
      currentWordNumber: len
    });
    if (this.data.currentWordNumber == 500) {
      wx.showModal({
        title: '提示',
        content: '您输入的次数已达上限',
      })
    }
  },*/
  //点击 提交申请
  submitBtn: function (){
    if (this.data.telVal.trim()==""){
      wx.showToast({
        title: '手机号不能为空',
        duration: 1500,
        icon: 'none'
      });
    } else if (!(/^1[34578]\d{9}$/.test(this.data.telVal))){
      wx.showToast({
        title: '您输入的手机号格式有误',
        duration: 1500,
        icon: 'none'
      });
    } else if (this.data.telVal1.trim()==''){
      wx.showToast({
        title: '您的爱车不能为空',
        duration: 1500,
        icon: 'none'
      });
    }else{
      this.loadApple(this.data.telVal, this.data.wechatVal, this.data.telVal1)
    }
  },
  //申请访谈 接口
  loadApple: function (phone, wechat, description){
    allapi.postFormRequestAll(conf.allUrl.interview, {
      channel: "02",
      sessionId: "",
      systemVersion: "1.0",
      inputParamJson: {
        phone: phone,
        wechat: wechat,
        description: description,
        userId: userUtil.getUserId()
      }
    }, function (res) {
      console.log(res)
      if (res.data.returnCode.type=="S"){
        wx.navigateBack({
          url:"../aDetails/aDetails"
        })
      }else{
        wx.showModal({
          title: '提示',
          content: res.data.returnCode.message,
          showCancel:false
        })
      }
    })
  },
  /** * 生命周期函数--监听页面初次渲染完成 */
  onReady: function () {},
  /** * 生命周期函数--监听页面显示 */
  onShow: function () {},
  /** * 生命周期函数--监听页面隐藏 */
  onHide: function () {},
  /** * 生命周期函数--监听页面卸载 */
  onUnload: function () {},
  /** * 页面相关事件处理函数--监听用户下拉动作 */
  onPullDownRefresh: function () {},
  /** * 页面上拉触底事件的处理函数 */
  onReachBottom: function () {},
  /** * 用户点击右上角分享 */
  onShareAppMessage: function () {}
})