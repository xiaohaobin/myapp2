//用于封装token生成和解析函数
var jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
var signkey = 'mes_qdhd_mobile_xhykjyxgs';

exports.setToken = function(username,userid){
	return new Promise((resolve,reject)=>{
		const token = jwt.sign({
			name:username,
			_id:userid
		},signkey,{ expiresIn:'0.01h' });
		resolve(token);
	})
}


exports.verToken = function(token){
	return new Promise((resolve,reject)=>{
		var info = jwt.verify(token.split(' ')[1],signkey);
		resolve(info);
	})
}

//生成token（采用文件加密私钥），data为uid：uid
exports.setToken2 = function(data){
  let created = Math.floor(Date.now() / 1000);
  let cert = fs.readFileSync(path.join(__dirname, '../config/pri.pem'));//私钥
  let token = jwt.sign({
    data,
    exp: created + 3600 * 24
  }, cert, {algorithm: 'RS256'});
  return token;
}
var verToken2 = function(token){
	let cert = fs.readFileSync(path.join(__dirname, '../config/pub.pem'));//公钥
	  try{
	    let result = jwt.verify(token, cert, {algorithms: ['RS256']}) || {};
	    let {exp = 0} = result,current = Math.floor(Date.now()/1000);
	    if(current <= exp){
	      res = result.data || {};
	    }
	  }catch(e){
	 
	  }
	  return res;
}
//验证token,采用公钥
exports.verToken2 = verToken2;

exports.postValToken = function(req, res, next){
	var token = req.headers['authorization'];
	if(token){
		var r = verToken2(token);
		if(r && r.uid){
			console.log("验证通过")			
			return {
				code:1,
				isPass:true
			};
		}else{
			return {
				code:0,
				isPass:false,
				callback:function(){
					res.json({
						code:-200,
						msg:"token失效,请重新登录"
					})
				}
			};
		}
	}else{
		return {
			code:0,
			isPass:false,
			callback:function(){
				res.json({
					code:-200,
					msg:"token缺省,请登录"
				})
			}
		};
	}
	
//	next();
}