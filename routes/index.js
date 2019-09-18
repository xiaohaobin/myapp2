//首页，登录皆在此编译业务逻辑
//默认账户密码admin
var user = {
	username: 'xhb',
	password: 'xhb'
}

//默认首页
exports.index = function(req, res) {
	res.render('index', {
		title: 'Index'
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

	res.render('home', {
		title: 'Home',
		user: user
	});
};

