import p from 'wl-pinyin'
const db = wx.cloud.database().collection("join_community")
Page({
  data: {
    letterList:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    show: false,
    communityId:"",
    nowChoice:""
  },
  onShow(){
    let memList = {'#':[],'A':[], 'B':[], 'C':[], 'D':[], 'E':[], 'F':[], 'G':[], 'H':[], 'I':[], 'J':[], 'K':[], 'L':[], 'M':[], 'N':[], 'O':[], 'P':[], 'Q':[], 'R':[], 'S':[], 'T':[], 'U':[], 'V':[], 'W':[], 'X':[], 'Y':[], 'Z':[]}
    const communityId = this.data.communityId
     wx.cloud.callFunction({
      name: "getStuList",
      data:{
        communityId:communityId
      }
    }).then(res => {
      let list = res.result.list;
      console.log('aaa',list)
      list.forEach(element => {
        element.index = p.getFirstLetter(element.name)[0]
        if(this.data.letterList.indexOf(element.index)===-1){
          memList['#'].push(element)
        }else{
          memList[element.index].push(element)
        }
        
      });
      console.log('wa',memList)
      this.setData({
        memList
      })
    })
  },
  onLoad(options){
    const communityId = options.communityId
    console.log(communityId)
    this.setData({
      communityId:communityId
    })
  },
  showPopup(event) {
    console.log("bbb")
    this.setData({ show: true });
    const nowChoice = event.currentTarget.dataset.member
    this.setData({
      nowChoice
    })
  },
  onClose() {
    this.setData({ show: false });
  },
  changeStatusToStudent(){
    const that=this
    wx.cloud.callFunction({
      name: "changeStatus",
      data:{
        communityId: this.data.communityId,
        openid: this.data.nowChoice.openid,
        status:"student"
      },
      success:function(res){
        if(res.result.success === 1){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000})
            that.onClose()
            that.onShow()

        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'success',
            duration: 1000
       })
        } 
      }
    })
  },
  changeStatusToAdmin(){
    const that=this
    wx.cloud.callFunction({
      name: "changeStatus",
      data:{
        communityId: this.data.communityId,
        openid: this.data.nowChoice.openid,
        status:"admin"
      },
      success:function(res){
        if(res.result.success === 1){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000})
            that.onClose()
            that.onShow()

        }else{
          wx.showToast({
            title: '修改失败',
            icon: 'success',
            duration: 1000
       })
        } 
      }
    })
  },
  deleteStu(){
    const that = this
    wx.cloud.callFunction({
      name:'removeStudent',
      data:{
        communityId: this.data.communityId,
        openid: this.data.nowChoice.openid
      },
      success:function(res){
        if(res.result.success===1){
          wx.showToast({
            title: '删除成功',
            icon:'success',
            duration:1500
          })
          that.setData({
            show: false
          })
          that.onShow()
        }else{
          wx.showToast({
            title: '删除失败',
            icon:'none',
            duration:1500
          })
        }
      }
    })
  }
});
