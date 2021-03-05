
const DB_reply = wx.cloud.database().collection("reply")
const DB_post = wx.cloud.database().collection("post")
const DB_star = wx.cloud.database().collection("star")

Page({
  data: {
    show: false,
    option2: [
      { text: '匿名', value: 'a' },
      { text: '非匿名', value: 'b' },
    ],
    guanzhu: false,  //关注记得动态获取初始化
    top:false, //置顶记得动态初始化
    value2: 'a',
    content: '',
    post: '',
    postId:'',
    reply_to_post: []
  },

  // findTarget: function(reply) {
  //   return reply._id === 
  // },

  onLoad(query) {
    this.setData({
      postId: query.post,
    });
    const postId = query.post
    const that = this
    DB_post.where({
      _id: postId
    }).get().then(res =>{
      that.setData({
        post: res.data[0],
        top: res.data[0].top
      })
      console.log(res.data[0].time)
    })

    wx.getStorage({
      key: 'openid',
      success (res) {
        const openid = res.data
        DB_star.where({
          "_openid": openid,
          "post_id": postId
        }).get({
          success: function(res) {
            if (res.data.length >= 1) {
              that.setData({
                guanzhu: true
              })
            }
          }
        })
      }
    })
    var tmp_reply_to_reply = []
    var tmp_reply_to_post = []

    DB_reply.where({
      post_id: this.data.postId
    }).get().then(res => {
      res.data.forEach(element => {
        if (element.reply_type == 0){
          element.reply = []
          tmp_reply_to_post.push(element)
        } else if (element.reply_type == 1){
          tmp_reply_to_reply.push(element)
        }
      })
      // that.setData({
      //   reply_to_post: tmp_reply_to_post,
      //   reply_to_reply: tmp_reply_to_reply
      // })
      console.log(tmp_reply_to_reply)
      console.log(tmp_reply_to_post)

      var flag = 0
      var element
      var target
      for (var i=0; i < tmp_reply_to_reply.length; i++) {
        flag = 0
        element = tmp_reply_to_reply[i]
        for (var j=0; j < tmp_reply_to_post.length; j++) {
          target = tmp_reply_to_post[j]
          if (target._id == element.reply_to) {
            target.reply.push(element)
            break
          }
          for (var k=0; k < target.reply.length; k++) {
            if (target.reply[k]._id == element.reply_to) {
              target.reply.push(element)
              flag = 1
              break
            }
          }
          if (flag == 1)
            break
        }
      }
      that.setData({
        reply_to_post: tmp_reply_to_post
      })
    })
  },

  onChange(event) {
    // event.detail 为当前输入的值
    content = event.detail.value;
  },

  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },
  showPopup() {
    console.log("bbb")
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  reply_one(){
    DB_reply.add({
      data: {
        anonymous: false,
        content: content,
        mark: false,
        post_id: this.data.post_id,
        // reply_to: this.data.reply_to,
        // reply_type: this.data.reply_type
      }
    })
  },
  deletePost(){
    const post_id = this.data.post._id
    wx.showModal({
      title: '提示',
      content: '确认删除该帖子？',
      success (res) {
        let postData = { post_id }
        wx.cloud.callFunction({
          name: 'deletePostData',
          data: postData,
          complete: res => {
            console.log("complete")
            wx.showToast({
              title: '删除成功',
              duration: 1000,
              icon: "success"
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },1000)
          }
        })
    
      }
    })
  },
  guanzhu(){
    var granzhu = !this.data.guanzhu

    if (granzhu){
      DB_star.add({
        data: {
          post_id: this.data.postId,
        },
        success: res=> {
          this.setData({
            guanzhu: granzhu
          })
          wx.showToast({
            title: '已关注帖子！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 2500  // 提示窗停留时间，默认1500ms
          })
        }
      })
    } else {
      let starData = { post_id: this.data.postId }
      wx.cloud.callFunction({
        name: 'deleteStar',
        data: starData,
        complete: res => {
          console.log("complete")
          this.setData({
            guanzhu: granzhu
          })
          wx.showToast({
            title: '已取消关注！',
            duration: 1000,
            icon: "success"
          })
        }
      })
    }
  },
  zhiding(){
    var top = !this.data.top
    let topData = { 
      post_id: this.data.postId,
      top: top
    }
    this.setData({
      top: top
    })
    wx.cloud.callFunction({
      name: 'changeTop',
      data: topData,
      success: res => {
        if (top){
          wx.showToast({
            title: '已置顶！',
            duration: 1000,
            icon: "success"
          })
        } else {
          wx.showToast({
            title: '已取消置顶！',
            duration: 1000,
            icon: "success"
          })
        }
      }
    })
  }
})