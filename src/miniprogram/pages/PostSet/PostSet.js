// miniprogram/pages/StuChargeDetail/StuChargeDetail.js
const DB = wx.cloud.database().collection("post")


Page({
  data: {
    community_id: '',
    active: 2,
    list: [],
    post: [],
    post_course: [],
    post_experiment: [],
    post_homework: [],
    post_other: [],
  },

  onLoad(options){
    console.log('abc', options.communityId)
    this.setData({
      community_id: options.communityId,
      active: parseInt(options.area) 
    })},
  onShow(){
    const that = this
    var tmp_post_course = []
    var tmp_post_experiment = []
    var tmp_post_homework = []
    var tmp_post_other = []

    
          // 使用静态数据community_id
      // community_id: this.data.community_id
      // console.log("ID",options.communityId)
    DB.where({
      community_id: this.data.community_id
    }).get().then(res => {
      res.data.forEach(element => {
        if (element.section == 0) {
          tmp_post_course.push(element)
        } else if (element.section == 1) {
          tmp_post_experiment.push(element)
        } else if (element.section == 2) {
          tmp_post_homework.push(element)      
        } else if (element.section == 3) {
          tmp_post_other.push(element)
        }
      })
      that.setData({
        post_course: tmp_post_course,
        post_experiment: tmp_post_experiment,
        post_homework: tmp_post_homework,
        post_other: tmp_post_other
      })
    })
  },
  onChange(options) {
  },
  
  IntoClick:function(e){
      const post_id = e.currentTarget.dataset['value'];
      const section = e.currentTarget.dataset['index'];
      var tmp = []
      if (section == '0')
        tmp = this.data.post_course
      else if (section == '1')
        tmp = this.data.post_experiment
      else if (section == '2')
        tmp = this.data.post_homework
      else if (section == '3')
        tmp = this.data.post_other
      
      var post = ''
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i]._id == post_id){
          post = JSON.stringify(tmp[i])
          break
        }
      }

      wx.navigateTo({
          url: '/pages/PageDetail/PageDetail?post='+post
        }
      )
  },
})
