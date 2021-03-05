// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database().collection("join_community")

// 云函数入口函数
exports.main = async (event, context) => {
  const success=1
  console.log(event.communityId,event.openid)
  await db.where({
    communityId: event.communityId,
    _openid: event.openid,
  }).remove().catch(err=>{
    success = 0
  })
  return{
    success
  }

  return {
    
  }
}