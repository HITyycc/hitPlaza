// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database().collection("join_community")

// 云函数入口函数
exports.main = async (event, context) => {
  const _openid=event.openid
  const communityId=event.communityId
  const status=event.status
  success=1
  await db.where({
    _openid,
    communityId
  }).update({
    data:{
      status
    }
  }).catch(err=>{
    success=0
  })
  return({
    success
  })

  return {
    
  }
}