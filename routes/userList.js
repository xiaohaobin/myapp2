var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser'); //post请求查询依赖模块
var dbConfig = require('./db/DBConfig'); //引入数据库配置
var userSQL = require('./db/Usersql').UserSQL; //引入sql语法
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var common = require('./commonJs/common'); //引入公共模块
var md5 = require('md5');

//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('userList模块：生成日志文件')

var app = express();
var router = express.Router();

// post请求配置  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
	extended: false
}));
// parse application/json
app.use(bodyParser.json());

// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool(dbConfig.mysql);

function handleError(){
	
}


//port：页面入口，用户列表模块
module.exports = {

	port: function(req, res) {
		res.render('userList', {
			title: '用户列表',
			data: {}
		});
	},
	//获取列表
	list: function(req, res, next) {
		// 从连接池获取连接
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			console.log("前台传递参数：", param);

			var keyword = param.keyword || ""; //关键字
			var pageSize = param.pageSize * 1; //每页数量
			var pageNum = param.pageNum * 1;

			var _res = res;
					
			 
			//查询总数
			connection.query(userSQL.getList(keyword), function(err, res) {
				if(res) {
					var total = res.length;
					var totalPage = Math.ceil(total / pageSize); //总页码数量
					var prevPage = (pageNum * 1 - 1) < 0 ? 0 : (pageNum * 1 - 1); //上一页
					var nextPage = (pageNum * 1 + 1) > totalPage ? pageNum : (pageNum * 1 + 1); //下一页
				}
				//查询分页
				connection.query(userSQL.getListByPage(keyword, pageSize, pageNum), function(err, res) {
					var data = {};
					if(err) {
						data.err = err;
						data.code = -1,
							data.msg = '查询出错';
					} else {
						data.code = 200,
							data.msg = 'success';
						data.data = {
							list: res, //主要数据
							pageNum: pageNum, //当前页码
							prevPage: prevPage,
							nextPage: nextPage,
							total: total, //总条数
							pageSize: pageSize, //每一页数量
							totalPage: Math.ceil(total / pageSize) //总页码数量
						}
					}
					// 以json形式，把操作结果返回给前台页面
					setTimeout(function() {
						common.responseJSON(_res, data);
					}, 300);
					// 释放链接
					pool.releaseConnection(connection);
					
				});
			});
		});

	},
	//验证用户名信息
	regUser:function(req, res, next){
		// 从连接池获取连接
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			var UserName = param.username;			
			var _res = res;
			//查询总数
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
				if(err) data.err = err;
				if(isTrue) {
					data = {
						code: -1,
						msg: '用户名已存在'
					}; 
				} else {
					data = {
						code: 200,
						msg: '用户名可以使用'
					}; //
				}
				// 以json形式，把操作结果返回给前台页面
				setTimeout(function() {
					common.responseJSON(_res, data)				
				}, 300);
				pool.releaseConnection(connection);
			});
		});
	},
	//添加用户
	add:function(req, res, next){
		// 从连接池获取连接
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			console.log("前台传递参数：", param);
			param.age = param.age * 1; 
			param.phone = param.phone * 1; 
			param.grade = param.grade * 1; 
			param._class = param._class * 1; 
			
			//统一生成密码123456
			param.password = md5(123456);
			var _res = res;
			var aRes = userSQL.comparFn(param);//转化为制定数组
			console.log("语法：",userSQL.addSql());
			console.log("插入数据：",aRes);
			//插入
			connection.query(userSQL.addSql(),aRes,function(err, res) {				
				var data = {};
				if(err) data.err = err;
				if(res){
					data = {
						code: 200,
						msg: '操作成功'
					}; //
				}else{
					data = {
						code: -1,
						msg: '操作失败'
					}; //
				}
				
				// 以json形式，把操作结果返回给前台页面
				setTimeout(function() {
					common.responseJSON(_res, data)				
				}, 300);
				pool.releaseConnection(connection);
			});
		});
	},
	//更新用户信息
	update:function(req, res, next){
		// 从连接池获取连接
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			console.log("前台传递参数：", param);
			param.age = param.age * 1; 
			param.phone = param.phone * 1; 
			param.grade = param.grade * 1; 
			param._class = param._class * 1; 
						
			var _res = res;
			var aRes = userSQL.comparFn(param);//转化为制定数组
			console.log("语法：",userSQL.updateSql());
			console.log("插入数据：",aRes);
			//插入
			connection.query(userSQL.updateSql(),aRes,function(err, res) {				
				var data = {};
				if(err) data.err = err;
				if(res){
					data = {
						code: 200,
						msg: '操作成功'
					}; //
				}else{
					data = {
						code: -1,
						msg: '操作失败'
					}; //
				}
				
				// 以json形式，把操作结果返回给前台页面
				setTimeout(function() {
					common.responseJSON(_res, data)				
				}, 300);
				pool.releaseConnection(connection);
			});
		});
	},
	//删除用户信息
	del:function(req, res, next){
		// 从连接池获取连接
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.body;
			console.log("前台传递参数：", param);
			var uid = param.uid;
			var _res = res;
			console.log("语法：",userSQL.delSql(uid));
			//插入
			connection.query(userSQL.delSql(uid),function(err, res) {				
				var data = {};
				if(err) data.err = err;
				if(res){
					data = {
						code: 200,
						msg: '操作成功'
					}; //
				}else{
					data = {
						code: -1,
						msg: '操作失败'
					}; //
				}
				
				// 以json形式，把操作结果返回给前台页面
				setTimeout(function() {
					common.responseJSON(_res, data)				
				}, 300);
				pool.releaseConnection(connection);
			});
		});
	},
}