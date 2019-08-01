// pages/mine/mine.js
Page({
  /*** 页面的初始数据 */
  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    isShow:true,
    scNumber:"123654789"
  },
  /*** 生命周期函数--监听页面加载 */
  onLoad: function (options) {},
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
  // 点击回退按钮至上一页
  histroyBack:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //点击 关注 跳转至关注列表
  mineFocue:function(){
    if(this.data.isShow!=true){
      wx.navigateTo({
        url: '../mineFocus/mineFocus',
      })
    }else{
      wx.showModal({
        content: '请登陆后再进行查看',
        showCancel:false
      })
    }
  },
  //点击 下载上车 跳转至下载页
  downApp:function(){
    wx.navigateTo({
      url: '../openApp/openApp',
    })
  },
  //点击 用户未登录 跳转至登陆页
  loginNav:function(){
    wx.navigateTo({
      url: '../loginAll/loginAll',
    })
  }
})