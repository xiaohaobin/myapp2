//页面地址配置
var vTokenRoutes = require('./token_vertify');
var expressJwt = require('express-jwt');
//没有登录不能进入的主要页面路由(首页和子页面)
var aPageUrl = [
	'/',
	'/home',
	'/userList',
	'websocket',
];

//接口数组(需要验证)
var aApi = [
//	{url:"/",method:"GET",page:"index.html"},	
//	{url:"/home",method:"GET",page:"home.html"},	
//	{url:"/userList",method:"GET",page:"userList.html"},	
//	{url:"/vertify",method:"POST",page:"home.html"},	
	{url:"/list",method:"POST",page:"userList.html"},	
	{url:"/add",method:"POST",page:"userList.html"},	
	{url:"/regUser",method:"POST",page:"userList.html"},	
	{url:"/update",method:"POST",page:"userList.html"},
	{url:"/del",method:"POST",page:"userList.html"},
//	{url:"/websocket",method:"GET",page:"websocket.html"},	
]

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

function compareUrl2(url,method){
	var isSame = false;
	for(var i=0;i<aApi.length;i++){		
		if(url == aApi[i].url && method == aApi[i].method)  isSame = true;
	}
	return isSame;
}

//请求验证
exports.reqValidFn = function(req, res, next){
	// 解析token获取用户信息===============================================================
	var token = req.headers['authorization'];
	if(token == undefined){//第一层验证，如无token，放行，有可能是静态资源加载
		return next();
	}else{
		var Pass = vTokenRoutes.postValToken(req, res, next);
		Pass.isPass ? next() : res.redirect('/login');
	}
	// 解析token获取用户信息===========================================================================

	//判断当前有无session，如果无，则判断当前路由界面，如果非登录页，则返回登录页
//	if(!req.session.user) {
//		var b = compareUrl(aPageUrl, req.url); //true,非法进入子页面和首页\
//		b ? res.redirect('/login') : next();
//
//	} else if(req.session.user) {
//		next();
//	}
}

//验证token是否过期并规定哪些路由不用验证=====================================================
exports.valUrlFn = function(app){
//	app.use(expressJwt({
//		secret: 'mes_qdhd_mobile_xhykjyxgs'
//	}).unless({
//		path: ['/login','/reg']//除了这些地址，其他的URL都需要验证
//	}));
//	
	//当token失效返回提示信息
	app.use(function(err, req, res, next) {
		var apiObj = null;
		if (err.status == 401) {
			var b = compareUrl2(req.url,req.method);
			if(b){
				return res.status(401).send('token失效,请点击<a href="/login">重新登录</a>');
			}else{
//				return next();
				next();
			}

		}
	});
}


//验证token是否过期并规定哪些路由不用验证==============================================================
