// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  const communityId = event.communityId
  
  let listTmp = await db.collection('join_community').aggregate().match({
    communityId: communityId
  }).lookup({
    from: 'user',
    localField: '_openid',
    foreignField: '_openid',
    as: 'user',
  })
  .end()
  listTmp = listTmp.list
  let list = []
  let name
  let openid
  let status
  listTmp.forEach(element => {
    name = element.user[0].name
    openid = element._openid
    status = element.status
    list.push({
      name,
      openid,
      status
    })
  });
  console.log(list)

  return {
    list:list
  }
 
}

