// miniprogram/pages/DatabaseFirstPage/DatabaseFirstPage.js
const DB = wx.cloud.database().collection("community")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    community: {},
    communityId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取url中的参数
    // const community = JSON.parse(options.community)
    const communityId = options.communityId
    const that = this
    DB.where({
      _id: communityId
    }).get().then(res => {
      that.setData({
        community: res.data[0],
        communityId:communityId
      })
      console.log(that.data.community)
    })
  },
  copyCode(){
    const data = this.data.community.invitationCode
    
    wx.setClipboardData({ data: data, 
      success: res => {
        console.log(data)
        wx.showToast({
          title: '邀请码已复制！', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 2500  // 提示窗停留时间，默认1500ms
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})