// miniprogram/pages/post/post.js
const dbServer = wx.cloud.database()
const DB = wx.cloud.database().collection("post") //云数据库里的post table（表）
const DB_star = wx.cloud.database().collection("star")
let title = ""
let content = ""
let resToStar = ""
Page({
  data: {
    community_id: '',
    section: '0',
    anonymous: 'a',
    option1: [
      { text: '课堂内容区', value: 0 },
      { text: '实验区', value: 1 },
      { text: '作业区', value: 2 },
      { text: '其他区', value: 3 },
    ],
    option2: [
      { text: '匿名', value: 'a' },
      { text: '非匿名', value: 'b' },
    ],
    value1: 0,
    value2: 'a',
  },
  onLoad(query){
    this.setData({
      community_id: query.communityId
    })
  },

  post_title_input(event){ // 获取帖子标题
    title = event.detail.value
  },
  post_content_input(event){ // 获取帖子内容
    content = event.detail.value
  },
  afterChoose1(event){
    const value=event.detail
    console.log(value)
    this.setData({
      value1:value
    })
  },
  afterChoose2(event){
    const value=event.detail
    this.setData({
      value2:value
    })
  },
  // 将帖子标题和内容上传到数据库
  post_one(){ //点击发布
    const time= new Date()
    DB.add({ // 将输入添加到DB.post中
      data:{
        title: title,
        content:content,
        section: this.data.value1,
        anonymous: this.data.value2,
        community_id: this.data.community_id,
        time:time,
        lastModifiedTime:time.toLocaleString(),
        top:false,
        solved: false
      },
      success(res){
        console.log("添加成功",res)
        resToStar = res._id 
        DB_star.add({
          data:{
            post_id: resToStar,
          }
        }) 
        wx.showToast({
          title: '发布成功！', // 标题
          icon: 'success',  // 图标类型，默认success
          duration: 2500  // 提示窗停留时间，默认1500ms
        })
        wx.navigateTo({
          url: '../DatabaseFirstPage/DatabaseFirstPage',
        })
      },
      fail(res){
        console.log("添加失败",res)
      }
    }
    )
  }
})