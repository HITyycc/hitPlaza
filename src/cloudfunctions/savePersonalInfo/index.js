const cloud = require('wx-server-sdk')
cloud.init({env: cloud.DYNAMIC_CURRENT_ENV})
const db = cloud.database()

exports.main = async (event, context) => {
  console.log("here") 
  const wxContext = cloud.getWXContext();
  const openid = event.openid 
  const userCollection = db.collection('user')
  console.log(openid)
  await userCollection.where({'_openid': openid}).update({
    data: {
      'name': event.name,
      'grade': event.grade,
      'department': event.department
    }
  }).catch(err =>{
    console.log(err)
  })
}