// miniprogram/pages/personalCenter/personalCenter.js

const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // unloginImgUrl: "../../img/tabIcon/user-unlogin.png",
    // personalInfoBtnImgUrl: "../../img/tabIcon/personal_inf_s.png",
    // guanzhuBtnImgUrl:"../../img/tabIcon/guanzhu_s.png",
    // huifuBtnImgUrl:"../../img/tabIcon/huifu_s.png",
    logged: false,
    userInfo: {},
    name: '',

    grade: '',
    department: '',
    openid: ''
  },
  
  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        unloginImgUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      });
      console.log(this.data.userInfo);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    const _this = this;
    wx.getStorage({
      key: 'openid',
      success(res) {
        _this.setData({
          logged: true,
          openid: res.data,
        });
        db.collection('user').where({
          _openid: _this.data.openid
        }).get().then(res => {
          console.log(res)
          _this.setData({
            name: res.data[0].name,
            grade: res.data[0].grade,
            department: res.data[0].department
          })
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
  },
  
  saveData: function(e) {
    const that = this
    wx.getStorage({
      key: 'openid',
      success (res) {
        const openid = res.data
        console.log(that.data.grade)
        console.log(that.data.department)
        console.log(openid)

        let updateData = {
          openid: openid,
          name: that.data.name,
          grade: that.data.grade,
          department: that.data.department
        };
        console.log(updateData)
        wx.cloud.callFunction({
          name: 'savePersonalInfo',
          data: updateData,
          complete: res => {
            console.log("complete")
          }
        })
        
      }
    })
  },
  updateNickName: function(e) {
    const that = this
    var name = e.detail.value
    if (name != '') {
      that.setData({
        name: name
      })
    }
  },
  updateGrade: function(e) {
    const that = this
    var newGrade = e.detail.value
    if (newGrade != '') {
      that.setData({
        grade: newGrade
      })
    }
  },
  updateDepartment: function(e) {
    const that = this
    var newDepartment = e.detail.value
    if (newDepartment != '') {
      that.setData({
        department: newDepartment
      })
    }
  },
})



