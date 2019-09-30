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




//加载路由配置文件

var routes = require('./routes/index');
var regRoutes = require('./routes/reg');
var loginRoutes = require('./routes/login');
//var userListRoutes = require('./routes/userList'); //用户列表页面路由配置
//var websocketRoutes = require('./routes/websocket');
var userListRoutes = require('./routes/module/userList'); //用户列表页面路由配置
var websocketRoutes = require('./routes/module/websocket');
//var common = require('./routes/commonJS/common');
var imageListRoutes = require('./routes/module/imageList'); //图片列表页面路由配置

var app = express();


//// nginx负载均衡============================================================================
//var timeout = require('connect-timeout');
//var loadBalancing = require('./routes/loadBalancing');
//app.use(timeout('15s'));
//app.use(loadBalancing.nginx_setting);
//loadBalancing.serverListen(app);
//// nginx负载均衡============================================================================


//cors跨域设置===================================================================================================================
//app.all('*',function (req, res, next) {
//res.header('Access-Control-Allow-Origin', '*');
//res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
//res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//if (req.method == 'OPTIONS') {
//  res.send(200); //让options请求快速返回/
//}
//else {
//  next();
//}
//});
//cors跨域设置===================================================================================================================

//imageListRoutes.toimg(app)


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
//		store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
//		resave: false, // 如果没有修改，不要保存会话
		resave: true, // 如果没有修改，不要保存会话
		saveUninitialized: false, // 在存储内容之前不要创建会话
		secret: 'chyingp', //签名秘钥，任意字符串
		name: 'skey', //session cookie 名称
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
var urlConfig = require('./routes/urlConfig');
app.use(urlConfig.reqValidFn);
urlConfig.valUrlFn(app);

//验证token================================================

//请求时，应用身份验证==============================================================================================================================

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/uploadFile', express.static('uploadFile'));
// 匹配路径和路由=====================================
app.get('/', routes.index);
//主要页面
app.get('/home', routes.home);

//登录
app.get('/login', loginRoutes.login);
app.post('/doLogin', loginRoutes.doLogin); //表单提交
app.get('/logout', loginRoutes.logout); //退出


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


//关于文件上传页面
imageListRoutes.setApp(app);
//imageListRoutes
app.get('/imageList', imageListRoutes.port); //页面入口
//app.post('/addImage', imageListRoutes.insert); //图片添加接口
app.post('/addImage',imageListRoutes.insert); //图片添加接口


//websocket页面
app.get('/websocket', websocketRoutes.port);
//建立ws连接
websocketRoutes.wsFn();


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