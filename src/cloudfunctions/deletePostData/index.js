const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log("here") 
  const wxContext = cloud.getWXContext();
  const post_id = event.post_id 
  await db.collection('reply').where({
    post_id: post_id
  }).remove()
  await db.collection('star').where({
    post_id: post_id
  }).remove()
  await db.collection('post').where({
    _id: post_id
  }).remove()
}
