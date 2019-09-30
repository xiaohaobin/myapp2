var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');//post请求查询依赖模块
var dbConfig = require('./db/DBConfig');//引入数据库配置
var userSQL = require('./db/Usersql').UserSQL;//引入sql语法
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var common = require('./commonJs/common');//引入公共模块
var md5 = require('md5');
var vTokenRoutes = require('./token_vertify');//token相关

//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('login模块：生成日志文件')




// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.mysql );

//登录页
exports.login = function(req, res) {
	res.render(
  	'login',//views目录下的文件名
  	{ 
  		title: 'login',
  		data:{
  			username:"xhb",
  			password:"123456"
  		}
  	}
  );
};

//登录请求
exports.doLogin = function(req, res,next) {
//	res.cookie('name', 'xiaohaobin', {path: '/',expires: new Date(Date.now() + 900000), httpOnly: true,secure: false, signed: false });
	
	// 从连接池获取连接
	pool.getConnection(function(err, connection) {
		// 获取前台页面传过来的参数
		var param = req.body; //post请求

		console.log("前台传递参数：", param)
		var UserName = param.username;
		var Password = param.password;
		var uid = "";
		var _res = res;
		connection.query(userSQL.queryAll, function(err, res) {
			
			
			var isTrue = false;
			if(res) { //获取用户列表，循环遍历判断当前用户是否存在
				for(var i = 0; i < res.length; i++) {
					if(res[i].username == UserName && res[i].password == md5(Password)) {
						isTrue = true;
						req.session.user = {
							username:res[i].username,
							password:res[i].password
						};
						uid = res[i].uid;
					}
				}				
			}
			
			var data = {};
			if(err) data.err = err;
			if(isTrue){
				//验证通过就直接跳转到/home
				data.code = 200,
				data.msg = 'success';
				data.username = UserName;
				data.password = Password;
				
				//设置token======================================================================				
				var sToken = vTokenRoutes.setToken2({uid});
				data.token = sToken;
				//更新数据库token字段
				connection.query(dbConfig.verifyTkoenSql,[sToken,UserName],function(err, res){
					if(err){
						common.responseJSON(_res, {code:-1,msg:"token插入失败",err:err});
					}
				});
				
				//设置token======================================================================
				
			}else{
				data.code = -1,
				data.msg = '用户名或者密码错误';				
			}
			
			// 以json形式，把操作结果返回给前台页面
			setTimeout(function() {
				common.responseJSON(_res, data);
			}, 300);
			
           
			// 释放链接
			pool.releaseConnection(connection);

		});
	});

};

//退出
exports.logout = function(req, res) {
	res.clearCookie('node_token');//清除token
	res.clearCookie('node_username');
	req.session.user = null;
	res.redirect('/login');
};



//页面初始化请求，应用身份验证