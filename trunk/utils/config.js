const apiUrl = 'http://192.168.1.188:90/information/'  //端口域名
const loginApi = "http://192.168.1.188:90/user/" //登陆注册
const config = {
  allUrl: {
    // https://zixun.ishangche.net/forum/forumsChannels/ //线上端口域名
    infoUrl: apiUrl + "homeInformations", //资讯首页
    iBody: apiUrl + "informationBody",   //资讯主体
    fZan: apiUrl + "firstInformationComments", //资讯评论点赞展示|一级界面
    sZan: apiUrl + "secondInformationComments", //资讯评论点赞展示|二级界面
    addPage: apiUrl + "addPageViews",  //增加资讯浏览量
    like: apiUrl + "like", //资讯点赞
    comment: apiUrl + "comment", //资讯评论
    delComment: apiUrl + "delComment", //资讯删除评论
    mainAbout: apiUrl + "informationCorrelation", //资讯相关推荐
    mainShare: apiUrl + "share", //资讯分享
    login: loginApi + "userLogin",  //登陆
    newUser: loginApi + "newUser"   //注册
  }
}
module.exports = config;