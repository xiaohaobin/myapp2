//负载均衡配置

//负载均衡引用依赖
var process = require('process');
var http = require('http');

function catchGlobalError(err) {
    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
        console.error('Caught exception:', err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason.stack);
    });
}

//服务器代理设置
exports.nginx_setting = function(req, res, next){
	res.set({
//		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Rememberme': true,
		'Access-Control-Allow-HttpOnly': false,
		'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
		'Access-Control-Allow-Credentials': true, //false,
		'Access-Control-Max-Age': '86400', // 24 hours
		'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
	});
	console.log('%s %s', req.method, req.url);
	next();
}

//代理监听
exports.serverListen = function(app){
	////创建两个服务器实体
	var server = require('http').createServer(app);
	var server1 = require('http').createServer(app);
	//服务器监听端口
	var PORT = parseInt(process.env.PORT || 8088);
	var PORT1 = PORT + 1;
	
	server.listen(PORT, function (err) {
	    console.log('Node app is running on port:', PORT);
	    catchGlobalError(err);
	});
	
	server1.listen(PORT1, function (err) {
	    console.log('Node app is running on port:', PORT1);
	    catchGlobalError(err);
	});
}
