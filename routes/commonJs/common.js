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
	}
}