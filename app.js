//加载依赖
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs'); //
var session = require('express-session');
var _cookie = require('cookie');
var bodyParser = require('body-parser'); //post请求查询依赖模块
//var log4js = require('log4js');//输出日志模块
var log4js = require('./logs/log'); // 日志输出引入

//负载均衡引用依赖
//var timeout = require('connect-timeout');
//var process = require('process');
//var http = require('http');

//加载路由配置文件

var routes = require('./routes/index');
var regRoutes = require('./routes/reg');
var loginRoutes = require('./routes/login');
var userListRoutes = require('./routes/userList'); //用户列表页面路由配置

var app = express();

//// nginx负载均衡============================================================================
////设置默认超时时间
//app.use(timeout('15s'));
//var nginx_setting = function(req, res, next) {
//	res.set({
////		'Content-Type': 'text/html',
//		'Access-Control-Allow-Origin': '*',
//		'Access-Control-Allow-Rememberme': true,
//		'Access-Control-Allow-HttpOnly': false,
//		'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
//		'Access-Control-Allow-Credentials': true, //false,
//		'Access-Control-Max-Age': '86400', // 24 hours
//		'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
//	});
//
//	console.log('%s %s', req.method, req.url);
//	next();
//}
//app.use(nginx_setting);
//
//function catchGlobalError(err) {
//  // 注册全局未捕获异常处理器
//  process.on('uncaughtException', function(err) {
//      console.error('Caught exception:', err.stack);
//  });
//  process.on('unhandledRejection', function(reason, p) {
//      console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
//  });
//}
//
////创建两个服务器实体
//var server = require('http').createServer(app);
//var server1 = require('http').createServer(app);
//
////服务器监听端口
//var PORT = parseInt(process.env.PORT || 8088);
//var PORT1 = PORT + 1;
//
//server.listen(PORT, function (err) {
//  console.log('Node app is running on port:', PORT);
//  catchGlobalError(err);
//});
//
//server1.listen(PORT1, function (err) {
//  console.log('Node app is running on port:', PORT1);
//  catchGlobalError(err);
//});
//// nginx负载均衡============================================================================


// post请求配置  parse application/x-www-form-urlencoded==========================
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
// post请求配置=========================================================================================

//设定端口,默认3000
//app.set('port', process.env.PORT || 3000);

// 重新定义模版为html文件
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); // app.set('view engine', 'ejs');

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));

//应用cookie及session==============================
app.use(cookieParser());
app.use(
	session({
		resave: true, // 如果没有修改，不要保存会话
		saveUninitialized: false, // 在存储内容之前不要创建会话
		secret: 'wrnmmp', //签名秘钥，任意字符串
		name: 'xhb_19901209', //session cookie 名称
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 1000 // 超时时间，设置1小时
		}
	})
);
//应用cookie及session==============================

//请求时，应用身份验证==============================================================================================================================
//没有登录不能进入的主要页面路由(首页和子页面)
var aPageUrl = [
	'/',
	'/home',
	'/userList',
];

app.use(function(req, res, next) {
	//判断当前有无session，如果无，则判断当前路由界面，如果非登录页，则返回登录页
	if(!req.session.user) {
		var b = compareUrl(aPageUrl, req.url); //true,非法进入子页面和首页
		b ? res.redirect('/login') : next();

	} else if(req.session.user) {
		next();
	}
});
//比较某个字符串是否等于数组中的某一个值
function compareUrl(arr, sUrl) {
	var res = false;
	for(var i = 0; i < arr.length; i++) {
		if(sUrl == arr[i]) {
			res = true;
		}
	}
	return res;
}
//请求时，应用身份验证==============================================================================================================================

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由=====================================
app.get('/', routes.index);
//登录
app.get('/login', loginRoutes.login);
app.post('/doLogin', loginRoutes.doLogin); //表单提交
app.get('/logout', loginRoutes.logout); //退出

//主要页面
app.get('/home', routes.home);

//注册
app.get('/reg', regRoutes.reg); //注册
app.post('/doReg', regRoutes.doReg); //注册接口

//用户列表路由入口
app.get('/userList', userListRoutes.port); //页面入口
app.post('/list', userListRoutes.list); //列表接口
app.post('/add', userListRoutes.add); //新增
app.post('/regUser', userListRoutes.regUser); //验证用户名可否使用
app.post('/update', userListRoutes.update); //更新
app.post('/del', userListRoutes.del); //删除用户

// 匹配路径和路由=====================================

// 捕获404并转发给错误处理程序
app.use(function(req, res, next) {
	next(createError(404));
});

// 错误处理程序
app.use(function(err, req, res, next) {
	 if (req.timedout && req.headers.upgrade === 'websocket') {
        // 忽略 websocket 的超时
        return;
    }
	
	 var statusCode = err.status || 500;
    if (statusCode === 500) {
        console.error(err.stack || err);
    }
    if (req.timedout) {
        console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
    }

	
	//设置局部变量，只提供开发中的错误
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	//渲染错误页面
	res.status(err.status || 500);
});

//// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//// 生产环境，500错误处理
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//      message: err.message,
//      error: {}
//  });
//});





module.exports = app;