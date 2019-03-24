var userModel = require('../../models/systems/userModel');
const jsonwebtoken = require('jsonwebtoken')
const crypto = require('crypto');
const key = 'githuoadmin';
const secert = 'githuo_secret';
function encodePassword(value){
    let hmac = crypto.createHmac('sha256',key);
    hmac.update(value);
    let passwordHex = hmac.digest('hex');
    return passwordHex
}
exports.addNewUser = async (ctx)=>{

}
/**
 * 登录,使用系统提供的默认admin,admin
 * 判断数据库里是否用用户名和密码
 */
exports.signin = async (ctx) => {
    let user = ctx.request.body;
    let username = user.username;
    var password = encodePassword(user.password);
    let success = await new Promise((resolve,reject)=>{
        userModel.find({username:username,password:password},(err,data)=>{
            if(err){
                reject(err);
            }else{
                console.log(data);
                if(data.length==0){
                    resolve(false)
                }else{
                    if(data[0].password == password){
                        resolve(true)
                    }else{
                        resolve(false)
                    }
                }
            }
        })
    })
    if(success){
        ctx.status = 200;
        ctx.body = {
            message: '登录成功',
            success: true,
            username:username,
            // 生成token返回给客户端
            token: jsonwebtoken.sign({
                data: username,
                //设置过期时间
                exp: Math.floor(Date.now()/1000)+(60*60*24)
            },secert)
        }
    }else{
        ctx.body = {
            message:'登录失败',
            success:false
        }
    }
}
// 注册新用户,后台不能注册,因为服务器并不是集中管理
//新注册的用户默认注册的权限是管理员权限
/**
 * 注册新用户的同时,往角色库里新增一个管理员角色,新增一个管理员权限
 */
exports.registerUser = async (ctx)=>{
    var username = 'admin';
    var password = encodePassword('admin');
    var user = new userModel({
        username: username,
        password: password
    })
    //查看数据库里是否已经有该用户
    var length = await new Promise((resolve,reject)=>{
        userModel.find({username:username},(err,data)=>{
            if(err){return};
            resolve(data.length);
        })
    })
    if(length){
        ctx.body = {}
    }else{
        var save = await new Promise((resolve,reject)=>{
            user.save((err,data)=>{
                if(err)return;
                resolve(data);
            })
        })
        if(save){
            ctx.body = {
                message:'注册成功',
                success: true
            }
        }else{
            ctx.body = {
                message:'注册失败',
                success: false
            }
        }
    }

}

exports.findUser = async (ctx)=>{

}
exports.findUserCount = async (ctx)=>{
    var acount = await new Promise((resolve,reject)=>{
        userModel.count({},function(err,count){
            resolve(count)
        })  
    })
    ctx.body = {
        acount:acount
    }
    
}
exports.deleteUser = async (ctx)=>{

}

// 更新用户信息,用户名,密码,头像
exports.updateUser = async (ctx)=>{
    let user = ctx.request.body;
    let oldAccountName = user.oldAccountName;
    let newAccountName = user.newAccountName;
    let newPassword = encodePassword(user.newPassword);
    console.log("newAccountName",newAccountName);
    console.log("oldAccountName",oldAccountName);
    console.log("newPassword",newPassword)
    var success = await new Promise((resolve,reject)=>{
        userModel.updateOne({username:oldAccountName},{$set:{username:newAccountName,password:newPassword}},
            (err,data)=>{
                if(err)return;
                resolve(data.ok);
            })
    })
    if(success){
        ctx.body = {
            message:'用户信息更新成功',
            success:true
        }
    }else{
        ctx.body = {
            message:'用户信息更新失败',
            success:false
        }
    }
}
