const apiUrl = 'https://zixun.ishangche.net/information/'  //端口域名
const loginApi = "https://zixun.ishangche.net/user/" //登陆注册
const focusApi = "https://zixun.ishangche.net/enterprise/"//关注端口
// const apiUrl = 'http://192.168.1.138:90/information/'  //端口域名
// const loginApi = "http://192.168.1.138:90/user/" //登陆注册
// const focusApi = "http://192.168.1.138:90/enterprise/"//关注端口
const config = {
  allUrl: {
    infoUrl: apiUrl + "homeInformations", //资讯首页
    iBody: apiUrl + "informationBody",   //资讯主体
    firstInformationComments: apiUrl + "firstInformationComments", //资讯评论点赞展示|一级界面
    secondInformationComments: apiUrl + "secondInformationComments", //资讯评论点赞展示|二级界面
    addPage: apiUrl + "addPageViews",  //增加资讯浏览量
    like: apiUrl + "like", //资讯点赞
    comment: apiUrl + "comment", //资讯评论
    delComment: apiUrl + "delComment", //资讯删除评论
    mainAbout: apiUrl + "informationCorrelation", //资讯相关推荐
    mainShare: apiUrl + "share", //资讯分享
    informationFuzzyQuery: apiUrl + "informationFuzzyQuery", //搜索
    interview: apiUrl + "interview",  //申请访谈
    login: loginApi + "userLogin",  //登陆
    newUser: loginApi + "newUser",   //注册
    getUserPhone: loginApi + "getUserPhone",  //获取手机号
    getUserInfo: loginApi + "getUserInfo",    //获取用户微信数据
    enterpriseFollow: focusApi + "enterpriseFollow", //我的关注
    enterpriseDetails: focusApi + "enterpriseDetails",//关注用户信息
    enterpriseInformations: focusApi + "enterpriseInformations", //关注历史资讯
    followEnterprise: focusApi + "followEnterprise", //关注用户
    unFollowEnterprise: focusApi + "unFollowEnterprise" //取消关注
  }
}
module.exports = config;