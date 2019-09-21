var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');//post请求查询依赖模块
var dbConfig = require('./db/DBConfig');//引入数据库配置
var userSQL = require('./db/Usersql').UserSQL;//引入sql语法
var cookieParser = require('cookie-parser');
var session = require('express-session');
var common = require('./commonJs/common');//引入公共模块
var md5 = require('md5');

//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('login模块：生成日志文件')

var app = express();
var router = express.Router();

// console.log("string类型：123456", md5("123456"));
// console.log("number类型：123456", md5(123456));
//console.log("string类型：xhb", md5("xhb"),md5(md5("xhb")));
 
//应用cookie及session
app.use(cookieParser());
app.use(
	session({
		resave: true, // 如果没有修改，不要保存会话
		saveUninitialized: false, // 在存储内容之前不要创建会话
		secret: 'wrnmmp',//签名秘钥，任意字符串
		name:'xhb_19901209',//session cookie 名称
		cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000   // 超时时间，设置1小时
    }
	})
);

// post请求配置  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


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

	// 从连接池获取连接
	pool.getConnection(function(err, connection) {
		// 获取前台页面传过来的参数
		var param = req.body; //post请求

		console.log("前台传递参数：", param)
		var UserName = param.username;
		var Password = param.password;
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
					}
				}				
			}
			
			var data = {};
			if(err) data.err = err;
			if(isTrue){
				//验证通过就直接跳转到/home
//				res.redirect('/home');
				data.code = 200,
				data.msg = 'success';
				data.username = UserName;
				data.password = Password;
			}else{
				data.code = -1,
				data.msg = '用户名或者密码错误';				
			}
			
			// 以json形式，把操作结果返回给前台页面
			setTimeout(function() {
				common.responseJSON(_res, data);
			}, 300);
			
			// 以json形式，把操作结果返回给前台页面
            //responseJSON(_res, data);
           
			// 释放链接
			pool.releaseConnection(connection);

		});
	});

};

//退出
exports.logout = function(req, res) {
	req.session.user = null;
	res.redirect('/login');
};

//页面初始化请求，应用身份验证