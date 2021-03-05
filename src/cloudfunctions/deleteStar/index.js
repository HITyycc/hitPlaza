const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const post_id = event.post_id 
  await db.collection('star').where({
    post_id: post_id
  }).remove()
}
