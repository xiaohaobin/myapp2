var express = require('express');
var app = express();
var fs = require("fs");
var path = require("path");
var bodyParser = require('body-parser');
var multer = require('multer');
var util = require('util');

//必定引入
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig'); //引入数据库配置
var vTokenRoutes = require('../token_vertify'); //token相关
var common = require('../commonJs/common'); //引入公共模块
//调用日志模块输出日志
var logger = require('../../logs/log').logger;
logger.info('imageList模块：生成日志文件');

//获取存放上传文件的路劲
var _uploadFile = path.join(__dirname,'../../uploadFile');
//



// 使用DBConfig.js的配置信息创建一个MySql链接池
var pool = mysql.createPool(dbConfig.mysql);

exports.setApp = function(app){
	console.log(path.join(__dirname,'../../uploadFile'),'获取存放上传文件的路劲')
	
	const multerObj = multer({ dest: '../../uploadFile'});////定义上传文件存储位置
	app.use('/uploadFile', express.static('../../uploadFile'));
	app.use(multerObj.array('image'));//定义文件上传接收文件的字段

	app.use(bodyParser.urlencoded({
		extended: false
	}));
}

exports.port = function(req, res) {
	res.render('imageList', {
		title: '图片列表',
		data: {}
	});
};

exports.insert = function(req, res, next) {	
	console.log(req.files[0], '前台传递文件1');
	
	var des_file = _uploadFile + '/' + req.files[0].originalname;//上传文件目录
	var fname = "/uploadFile/" + req.files[0].originalname;//文件路径
	var _title = req.body.title || "未知标题";
	var c_time = common.formatDateTime(new Date());
	var sql_add = 'INSERT INTO file_upload (file_name,title,c_time) VALUES ("' + fname + '","'+ _title +'","'+ c_time +'")';

	pool.getConnection(function(err, connection) {
		var _res = res;

		//验证是否有token
		var sUsername = req.body.mainId; //用户唯一标识(账户名称)
		var sToken = req.headers['authorization'];
		vTokenRoutes.verifyTokenFn(connection, sUsername, sToken, function(verData){
			if(verData.isPass) {
				connection.query(sql_add, function(err, res) {
					if(res) {
						//存储文件夹
						fs.readFile(req.files[0].path, function(err, data) {
							fs.writeFile(des_file, data, function(err) {
								if(err) {
									console.log(err);
									common.responseJSON(_res, {
										code: -1,
										msg: "操作失败",
										err: err
									})
								} else {
									common.responseJSON(_res, {
										code: 200,
										msg: "操作成功"
									});
								}
		
							});
						});
					}
		
				});

			}else{
				common.responseJSON(_res, {
					code: 0,
					msg: verData.msg
				});
			}
		})
		
	});
}
