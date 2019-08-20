var conf = require('./config.js')
var getUrl = function (url) {
  return url;
}
//get请求
module.exports.getInfo = function (params, success_callback, error_callback) {
  var url = getUrl(params)
  getRequest(url, success_callback, error_callback)
}
//post请求
module.exports.postFormRequestAll = function (url1, data, success_callback, error_callback){
  var urls = getUrl(url1)
  postFormRequest(urls, data, success_callback, error_callback)
}
/* 处理通用get请求 */
var getRequest = function (url, success_callback, error_callback) {
  // showLoading()
  wx.request({
    url: url,
    method: 'GET',
    success: function (res) {
      // hideLoading()
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      // hideLoading()
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}
/* 处理通用post，form请求 */
var postFormRequest = function (urls, data, success_callback, error_callback) {
  // showLoading()
  wx.request({
    url: urls,
    method: 'POST',
    data: data,
    success: function (res) {
      // hideLoading()
      //注意：可以对参数解密等处理 
      if (success_callback) {
        success_callback(res)
      }
    },
    fail: function (res) {
      // hideLoading()
      if (error_callback) {
        error_callback(res)
      }
    },
    complete: function () {
      // complete  
    }
  })
}
/* 加载loading */
function showLoading() {
  wx.showLoading({
    title: "加载中",
    mask: true
  })
}
/* 关闭loading */
function hideLoading() {
  wx.hideLoading()
}