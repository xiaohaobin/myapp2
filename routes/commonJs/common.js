const crypto = require('crypto');
//后台公共脚本
module.exports = {
	/**
	 * 请求成功响应格式
	 * @param {Object} res response对象
	 * @param {Object} ret 返回json数据
	 * */
	responseJSON:function(res, ret){
		/*
		 * code 200  成功
		 * code -1，-200   失败
		 * code 0  用户认证 失败  ，重新登录
		 * */
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
	},
	/**
	 * 标准时间返回 y-m-d h:m:s格式
	 * @param {Object} date 当前时间对象
	 * @return {String}
	 * */
	formatDateTime: function(date) {
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? ('0' + m) : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var h = date.getHours();
		h = h < 10 ? ('0' + h) : h;
		var minute = date.getMinutes();
		minute = minute < 10 ? ('0' + minute) : minute;
		var second = date.getSeconds();
		second = second < 10 ? ('0' + second) : second;
		return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
	},
}