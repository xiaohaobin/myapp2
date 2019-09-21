//输出日志模块
var log4js = require('log4js');
log4js.configure({ 
	appenders: { 
		pipe: { 
			type: 'dateFile', 
			filename: 'logs/log/',
			pattern: 'yyyy-MM-dd.log',
			alwaysIncludePattern: true,   
		} 
	}, // 日志位置
	replaceConsole: true, 
	categories: {
		default: { 
			appenders: ['pipe'], 
			level: 'info' ,//log4js的输出级别6个: trace, debug, info, warn, error, fatal(只为打印对应级别后面的,前面不会打印)
		} 
	}
});

var logger = log4js.getLogger('pipe');

exports.logger = logger;

