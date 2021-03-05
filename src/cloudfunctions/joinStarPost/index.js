// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = event.openid 
  let list = await db.collection('star').aggregate()
    .match({
      _openid: openid
    })
    .lookup({
      from: 'post',
      localField: 'post_id',
      foreignField: '_id',
      as: 'star_to_post'
    }).end()
  console.log(list)
  return {
    list: list
  }
}
