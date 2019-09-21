var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');//post请求查询依赖模块
var dbConfig = require('./db/DBConfig');//引入数据库配置
var userSQL = require('./db/Usersql').UserSQL;//引入sql语法
var common = require('./commonJs/common');//引入公共模块
var md5 = require('md5');

//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('reg模块：生成日志文件')

var app = express();
var router = express.Router();

// post请求配置  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool( dbConfig.mysql );
// 响应一个JSON数据
//var responseJSON = function (res, ret) {
//  if (typeof ret === 'undefined') {
//    res.json({
//        code: '-200',
//        msg: '操作失败'
//    });
//  } else {
//    res.json(ret);
//  }
//};

//页面地址配置
exports.reg = function(req, res) {
	res.render('reg', {
		title: 'reg'
	});
};

//注册方法函数
exports.doReg = function(req, res, next) {
	// 从连接池获取连接
	pool.getConnection(function(err, connection) {
		// 获取前台页面传过来的参数
		//      var param = req.query || req.params;//get请求

		var param = req.body; //post请求

		console.log("前台传递参数：", param)
		var UserName = param.username;
		var Password = md5(param.password);//md5加密一次
		var _res = res;
		connection.query(userSQL.queryAll, function(err, res) {
			var isTrue = false;
			if(res) { //获取用户列表，循环遍历判断当前用户是否存在
				for(var i = 0; i < res.length; i++) {
					if(res[i].username == UserName) {
						isTrue = true;
					}
				}
			}
			var data = {};
			//data.isreg = !isTrue; //如果isTrue布尔值为true则登陆成功 有false则失败
			if(isTrue) {
				data = {
					code: 1,
					msg: '用户已存在'
				}; //登录成功返回用户信息
			} else {
				console.log([param.username, param.password], 1111);
				connection.query(userSQL.insert, [UserName, Password], function(err, result) {
					if(result) {
						data = {
							code: 200,
							msg: '注册成功'
						};
					} else {
						data = {
							code: -1,
							msg: '注册失败',
							err: err
						};
					}
				});
			}

			if(err) data.err = err;
			// 以json形式，把操作结果返回给前台页面
			setTimeout(function() {
				common.responseJSON(_res, data)				
			}, 300);
			pool.releaseConnection(connection);

		});
	});
}