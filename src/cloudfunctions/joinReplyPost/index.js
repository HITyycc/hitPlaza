const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log("here") 
  const wxContext = cloud.getWXContext();
  const openid = event.openid 
  console.log(openid)
  let list = await db.collection('reply').aggregate()
    .match({
      _openid: openid
    })
    .lookup({
      from: 'post',
      localField: 'post_id',
      foreignField: '_id',
      as: 'reply_to_post'
    }).end()
  console.log(list)
  return {
    list: list
  }
}
