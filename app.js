//加载依赖
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');//
var session = require('express-session');
var bodyParser = require('body-parser');//post请求查询依赖模块



//加载路由配置文件
var routes = require('./routes/index');
var regRoutes = require('./routes/reg');
var loginRoutes = require('./routes/login');

var app = express();

// post请求配置  parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//设定端口,默认3000
//app.set('port', process.env.PORT || 3000);

// 重新定义模版为html文件
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');// app.set('view engine', 'ejs');

// 定义日志和输出级别
app.use(logger('dev'));

// 定义数据解析器
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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


//没有登录不能进入的主要页面路由(首页和子页面)
var aPageUrl = [
	'/',
	'/home',
];

//请求时，应用身份验证
app.use(function(req,res,next){
	//判断当前有无session，如果无，则判断当前路由界面，如果非登录页，则返回登录页
	if (!req.session.user) {
		var b = compareUrl(aPageUrl,req.url);//true,非法进入子页面和首页
		b ? res.redirect('/login') : next();
		
	}else if(req.session.user) {
		next();		
	}

});

//比较某个字符串是否等于数组中的某一个值
function compareUrl(arr,sUrl){
	var res = false;
	for(var i=0;i<arr.length;i++){
		if(sUrl == arr[i]){
			res = true;
		}
	}
	return res;
}

// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由=====================================
app.get('/', routes.index);

//app.get('/login', routes.login);
//app.post('/login', routes.doLogin);//表单提交
//app.get('/logout', routes.logout);//退出

app.get('/login', loginRoutes.login);
app.post('/doLogin', loginRoutes.doLogin);//表单提交
app.get('/logout', loginRoutes.logout);//退出

app.get('/home', routes.home);

app.get('/reg', regRoutes.reg);//注册
app.post('/doReg', regRoutes.doReg);//注册接口

// 匹配路径和路由=====================================



// 捕获404并转发给错误处理程序
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理程序
app.use(function(err, req, res, next) {
  //设置局部变量，只提供开发中的错误
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  //渲染错误页面
  res.status(err.status || 500);
  res.render('error');
});


//// 开发环境，500错误处理和错误堆栈跟踪
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//      res.status(err.status || 500);
//      res.render('error', {
//          message: err.message,
//          error: err
//      });
//  });
//}

//// 生产环境，500错误处理
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//      message: err.message,
//      error: {}
//  });
//});

module.exports = app;
