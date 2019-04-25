const request = require('request');
const random = require('string-random');
var crypto = require('crypto');

function getJsapiTicket(token){
   var ticket = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${token}&type=jsapi`
   return new Promise((resolve,reject)=>{
       request.get(ticket,function(error,response,body){
           resolve(body);
       })
   })
  
}

/**
 * @sha1加密模块 (加密固定,不可逆)
 * @param str string 要加密的字符串
 * @retrun string 加密后的字符串
 * */
 function getSha1(str) {
    console.log("加密"+str);
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}

exports.getAccessToken = async (ctx)=>{
    console.log("测试");
    var body = ctx.request.body;
    var appid = body.appid;
    var appsecret = body.appsecret;
    var url = body.url;
    console.log('url',url);
    var accessTokenURl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`;
    console.log(accessTokenURl);
    var token = await new Promise((resolve,reject)=>{
        request.get(accessTokenURl,function(error,response,body){
            resolve(JSON.parse(body))
        })
    })
   var ticketObj= await new Promise((resolve,reject)=>{
       console.log("获取token",token);
        getJsapiTicket(token.access_token).then((resp)=>{
            console.log("ticket",resp);
            resolve(JSON.parse(resp));
        });
    })
    console.log("出来了");
    console.log(ticketObj);
    // 时间戳、随机数、jsapi_ticket和要访问的url按照签名算法拼接字符串
   var noncestr = random(16);
   console.log("随机字符串"+noncestr);
   var timestamp = parseInt(new Date().getTime()/1000);
   var ticket = ticketObj.ticket;
   var str = "jsapi_ticket="+ticket+"&noncestr="+noncestr+"&timestamp="+timestamp+"&url="+url;
   console.log("加密字符串"+str);
   var signature = getSha1(str);
   console.log("signature=",signature);
    ctx.body = {
        accessToken: token.access_token,
        noncestr:noncestr,
        timestamp:timestamp,
        ticket:ticket,
        signature:signature
    }
}
 

// 在服务器端创建
exports.getSignature = async (ctx)=>{

}