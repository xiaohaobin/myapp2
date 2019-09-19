module.exports = {
	UserSQL:{
		insert: 'INSERT INTO node_user(username,password) VALUES(?,?)', // 插入数据
	    drop: 'DROP TABLE node_user', // 删除表中所有的数据
	    queryAll: 'SELECT * FROM node_user', // 查找表中所有数据
	    getUserById: 'SELECT * FROM node_user WHERE uid =?', // 查找符合条件的数据
	}
}

