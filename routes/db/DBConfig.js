
module.exports = {
    mysql: {
        host: '127.0.0.1',
        user: 'root', //你的数据库账号
        password: '000000', //你的数据库密码
        database: 'my_datatables_1',//你的数据库名
        port: 3306
    },
    
    verifyTkoenSql:'UPDATE node_user SET token = ? WHERE username = ?',
    queryAll: 'SELECT * FROM node_user', // 查找表中所有数据
    
   
}
