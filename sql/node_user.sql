/*
Navicat MySQL Data Transfer

Source Server         : 新建测试连接1
Source Server Version : 50515
Source Host           : localhost:3306
Source Database       : my_datatables_1

Target Server Type    : MYSQL
Target Server Version : 50515
File Encoding         : 65001

Date: 2019-09-19 11:00:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `node_user`
-- ----------------------------
DROP TABLE IF EXISTS `node_user`;
CREATE TABLE `node_user` (
  `uid` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `age` int(20) DEFAULT NULL,
  `phone` bigint(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `_class` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of node_user
-- ----------------------------
INSERT INTO `node_user` VALUES ('1', 'sunce4', '1800', '1328877', '4998@qq.com', '9', '15', '中国广东省落户', 'sunce4', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('2', 'yangjian', '18', '1328877', '4998@qq.com', '9', '15', '中国广东省落户', 'yangjian', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('3', 'yase', '13', '333', 'sd@1233', '10', '5', '王者大陆', 'yase', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('6', 'dongfangyao', '18', '1328877', '4998@qq.com', '9', '15', '中国广东省落户', 'dongfangyao', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('7', 'guanyunchang', '18', '1328877', '4998@qq.com', '9', '15', '中国广东省落户', 'guanyunchang', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('21', '', null, null, null, null, null, null, 'xhb', '5cd9e8fec0b3da3b80dae458f8e7ca80');
INSERT INTO `node_user` VALUES ('22', '', null, null, null, null, null, null, 'libai', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('23', '', null, null, null, null, null, null, 'xhb000', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('24', '', null, null, null, null, null, null, 'xhb2dd', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('25', '', null, null, null, null, null, null, 'xhb0', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('26', '', null, null, null, null, null, null, 'lvbu', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('27', '', null, null, null, null, null, null, 'diaochan', 'e10adc3949ba59abbe56e057f20f883e');
INSERT INTO `node_user` VALUES ('29', '', null, null, null, null, null, null, '宫本', 'e10adc3949ba59abbe56e057f20f883e');
