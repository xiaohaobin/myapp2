const crypto = require('crypto');
//后台公共脚本
module.exports = {
	/**
	 * 请求成功响应格式
	 * @param {Object} res response对象
	 * @param {Object} ret 返回json数据
	 * */
	responseJSON:function(res, ret){
		if (typeof ret === 'undefined') {
	      res.json({
	          code: '-200',
	          msg: '操作失败'
	      });
	    } 
	    else {
	      res.json(ret);
	    }
	},
	//判断数据类型
	typeData:function(data){
		if (data == '' ||
	        data == null ||
	        data == false ||
	        data == undefined ||
	        data == [] ||
	        data == {}) {
	        return false;
	    } else {
	        return true;
	    }

	},
	/**
	 * 生成令牌和token
	 * @return {string} return 返回值
	 */
	getToken:function(){
		let buf = crypto.randomBytes(12);
	    let token = buf.toString('hex');
	    return token;
	},
	//session cookie配置
	sessionConfig:{
		resave: true, // 如果没有修改，不要保存会话
		saveUninitialized: false, // 在存储内容之前不要创建会话
		secret: 'wrnmmp', //签名秘钥，任意字符串
		name: 'xhb_19901209', //session cookie 名称
		cookie: {
			path: '/',
			httpOnly: true,
			maxAge: 60 * 60 * 1000 // 超时时间，设置1小时
		}
	}
}