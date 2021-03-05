// miniprogram/pages/kechengyemian.js
Page({
  data: {
    msg: "Hello World"
  },
  gotoPage: function(event) {
    const nextPage = event.target.id;
    const url = "/pages/"+nextPage+"/"+nextPage;
    wx.navigateTo({
      url: url
    })
  }
})