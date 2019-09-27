var express = require('express');
var app = express();
var http=require('http').Server(app);
var io=require('socket.io')(http);

//在线用户
var onlineUser={};
var onlineCount=0;

//调用日志模块输出日志
var logger = require('../logs/log').logger;
logger.info('websocket模块：生成日志文件');


module.exports = {
	port: function(req, res) {
		res.render('websocket', {
			title: 'websocket long connect',
			data: {}
		});
	},
	wsFn:function(){
		
		io.on('connection',function (socket) {
		    console.log('新用户登录');
		
		    //监听新用户加入
		    socket.on('login',function (obj) {
		        socket.name=obj.userid;
		        //检查用户在线列表
		        if(!onlineUser.hasOwnProperty(obj.userid)){
		            onlineUser[obj.userid]=obj.username;
		            //在线人数+1
		            onlineCount++;
		        }
		        //给所有用户客户端广播消息
//		        io.emit('login',{onlineUser:onlineUser,onlineCount:onlineCount,user:obj});
		        console.log(obj.username+" 静悄悄进入了聊天室");
		        
		        var oRes = {
	        		onlineUser:onlineUser,
	        		onlineCount:onlineCount,
	        		user:obj,
	        		otherData:"大家好，我是"+ obj.username +"（系统消息）"
		        };
		       	//给除了自己以外的客户端广播消息（注册sysMsg事件发送前端）
//				socket.broadcast.emit("sysMsg",oRes); 
				socket.broadcast.emit("login",oRes); 
				socket.emit("ownLogin",oRes); //给自己发送广播
		    });
		
		    //监听用户退出
		    socket.on('disconnect',function () {
		        //将退出用户在在线列表删除，socket.name用户id
		        if(onlineUser.hasOwnProperty(socket.name)){
		            //退出用户信息
		            var obj={userid:socket.name, username:onlineUser[socket.name]};
		            //删除
		            delete onlineUser[socket.name];
		            //在线人数-1
		            onlineCount--;
		            //广播消息
		            io.emit('logout',{onlineUser:onlineUser,onlineCount:onlineCount,user:obj});
		            console.log(obj.username+" 骂骂咧咧的退出了群聊");
		        }
		    })
		
		    //监听用户发布聊天内容
		    socket.on('message', function(obj){
		        //向所有客户端广播发布的消息
		        io.emit('message', obj);
		        console.log(obj.username+'说：'+obj.content);
//		        socket.emit("ownMsg",{data:"就只有我"+ obj.username +"一个人"}); //给自己发送广播
		    });
		})
		http.listen(4000, function(){//不能用3000，3000端口已经被node服务占用了
		    console.log('listening on *:4000');
		});

	},
}

