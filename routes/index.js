var common = require('./commonJs/common'); //引入公共模块
//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('index模块：生成日志文件');

//默认账户密码admin
var user = {
	username: 'xhb',
	password: 'xhb'
}

//默认首页
exports.index = function(req, res) {
	res.render('index', {
		title: '首页'
	});
};

////登录页
//exports.login = function(req, res) {
//	res.render(
//	'login',//views目录下的文件名
//	{ 
//		title: 'login',
//		data:{
//			username:"xhb",
//			password:"123456"
//		}
//	}
//);
//};
//
////登录请求
//exports.doLogin = function(req, res) {
//
//	if(req.body.username === user.username && req.body.password === user.password) {
//		//保存session
//		req.session.user = user;
//		//验证通过就直接跳转到/home
//		res.redirect('/home');
//	}
//	res.redirect('/login');
//};
//
////退出
//exports.logout = function(req, res) {
//	req.session.user = null;
//	res.redirect('/login');
//};

//登录成功之页面
exports.home = function(req, res) {
	//验证token唯一代码==================================================
//	console.log(req.cookies,"主页面");
//	if(common.typeData(req.session.userSSH)){
//		console.log('用户的session存在，可以访问');
//	}else if (common.typeData(req.cookies.userSSH)) {
//	    console.log('用户的cookie存在，需要验证');
//	    res.redirect('/enterToken');
//	} else {
//	    console.log('用户的cookie不存在，需要登录');
//	   res.redirect('/login');
//	}
	//验证token唯一代码==================================================
	
	res.render('home', {
		title: '主要页面',
		user: user
	});
};


