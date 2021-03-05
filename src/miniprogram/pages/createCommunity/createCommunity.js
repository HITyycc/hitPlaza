// pages/createCommunity/createCommunity.js
import p from 'wl-pinyin'
import md5 from '../../utile/md5.js'

const db = wx.cloud.database({
  env: "hitsz-raubs"
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    communityName:"",
  },
 

  handleInput: function(event){
   const newValue=event.detail.value
   this.setData({
    communityName:newValue
   })
  },

  confirmCreate: function(event){
    const _this=this
    wx.showModal({
      title: '提示',
      content: '确认创建社区'+this.data.communityName + '？',
      success (res) {
        if (res.confirm) {
          _this.uploadNewCom(_this.data.communityName)
          wx.showToast({
            title: '创建成功',
            icon: 'success',
            duration: 1000
       })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  uploadNewCom(communityName){
    const time = new Date()
    const invitationCode = md5.hexMD5(time.getTime() + p.getPinyin(communityName))
    db.collection("community").add({
      data:{
        name: communityName,
        time: db.serverDate(),
        invitationCode
      }
    }).then(res => {
      const communityId = res._id 
      db.collection("join_community").add({
        data:{
          communityId,
          communityName,
          status:"admin"
        }
      }).then(res =>{
        console.log("创建成功")
        wx.switchTab({
          url: '../index/index',
          complete: (res) => {},
          fail: (res) => {},
          success: (res) => {},
        })
      })
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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