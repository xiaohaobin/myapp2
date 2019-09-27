//var express = require('express');
//var router = express.Router();
//
///* GET users listing. */
//router.get('/', function(req, res, next) {
//res.send('respond with a resource');
//});
//
//module.exports = router;

var express = require('express');
var router = express.Router();

// 验证token

router.post('/vertify', function(req, res, next) {
	console.log(req.data)
	if(req.data){
		return res.json({
			msg:'身份验证成功'
		})
	}else{
		return res.json({
			msg:'未获取到用户信息'
		})
	}
	next();
});

module.exports = router;
