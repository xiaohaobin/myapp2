var mainDataMode = ["name", "age", "phone", "email", "grade", "_class", "address", "username", "password"]; //数据模型（按顺序）
//mysql的添加语句返回值插入	    	
function intoVal() {
	var a = [];
	for(var i = 0; i < mainDataMode.length; i++) {
		a.push('?');
	}
	return a.join();
}

//mysql的更新语句 返回主要字符
function updateSet() {
	var mainDataMode2 = ["name", "age", "phone", "email", "grade", "_class", "address"];
	var a = [];
	for(var i = 0; i < mainDataMode2.length; i++) {
		a.push(mainDataMode2[i] + " = ?");
	}
	return a.join();
}

module.exports = {
	UserSQL: {
		insert: 'INSERT INTO node_user(username,password) VALUES(?,?)', // 插入数据(注册语句)
		drop: 'DROP TABLE node_user', // 删除表中所有的数据删除所有用户
		queryAll: 'SELECT * FROM node_user', // 查找表中所有数据
		getUserById: 'SELECT * FROM node_user WHERE uid =?', // 查找符合条件的数据，根据用户ID查找
		/**
		 * 模糊检索+分页查询，
		 * @param {String} keyword 关键词 ，包含name,email,address,username等字段
		 * @param {Number} pageSize 一页显示条数
		 * @param {Number} pageNum 页码
		 * @return {String}
		 * */
		getListByPage: function(keyword, pageSize, pageNum) {
			var arr = ["uid", "name", "age", "phone", "email", "grade", "_class", "address", "username"]; //不需要密码
			if(keyword == "" || keyword == undefined) { //无模糊检索
				var res = 'SELECT ' + arr.join() + ' FROM node_user LIMIT ' + (pageNum * pageSize - pageSize) + "," + pageSize;
			} else {
				var res = 'SELECT ' + arr.join() + ' FROM node_user WHERE CONCAT(name,email,address,username) LIKE "%' + keyword + '%" LIMIT ' + (pageNum * pageSize - pageSize) + "," + pageSize;
			}
			return res;
		},
		//获取所有列表（可模糊查询）
		getList: function(keyword) {
			if(keyword == "" || keyword == undefined) { //无模糊检索
				var res = 'SELECT * FROM node_user';
			} else {
				var res = 'SELECT * FROM node_user WHERE CONCAT(name,email,address,username) LIKE "%' + keyword + '%"';
			}
			return res;
		},
		//后台插入数据
		addSql: function() { //添加语句   		    	
			return 'INSERT INTO node_user(' + mainDataMode.join() + ') VALUES(' + intoVal() + ')';
		},
		updateSql: function() { //更新语句
			return 'UPDATE node_user SET ' + updateSet() + ' WHERE uid = ?';
		},
		delSql: function(ids) {
			//			var ids = uid.join();
			var res = 'DELETE FROM node_user WHERE uid IN (' + ids + ')';
			return res;
		},
		mainDataMode: ["name", "age", "phone", "email", "grade", "_class", "address", "username", "password"], //数据模型（按顺序）	   
		/**
		 * 对比数据
		 * @param {Object} obj 前台请求的数据
		 * @param {Array} 
		 * */
		comparFn: function(obj) {
			var addSqlParams = [];
			for(var i = 0; i < this.mainDataMode.length; i++) {
				var s = obj[this.mainDataMode[i]];
				if(s) addSqlParams.push(s);
			}
			if(obj.uid) { //针对更新数据的添加id
				addSqlParams.push(obj.uid);
			}
			return addSqlParams;
		},

	}
}