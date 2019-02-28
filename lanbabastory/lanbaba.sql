-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2018-11-27 09:27:54
-- 服务器版本： 5.7.21-1
-- PHP 版本： 7.0.29-1+b1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `child_music`
--

-- --------------------------------------------------------

--
-- 表的结构 `mus_admin_user`
--

CREATE TABLE `mus_admin_user` (
  `id` smallint(5) UNSIGNED NOT NULL,
  `username` varchar(20) NOT NULL DEFAULT '' COMMENT '管理员用户名',
  `password` varchar(50) NOT NULL DEFAULT '' COMMENT '管理员密码',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '状态 1 启用 0 禁用',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(20) DEFAULT NULL COMMENT '最后登录IP'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='管理员表';

--
-- 转存表中的数据 `mus_admin_user`
--

INSERT INTO `mus_admin_user` (`id`, `username`, `password`, `status`, `create_time`, `last_login_time`, `last_login_ip`) VALUES
(1, 'admin', '7b79e788e94c1c41b6d4e1b1280c4bdb', 1, '2016-10-18 15:28:37', '2018-11-27 09:10:31', '127.0.0.1');

-- --------------------------------------------------------

--
-- 表的结构 `mus_album`
--

CREATE TABLE `mus_album` (
  `id` int(11) NOT NULL,
  `cid` int(10) UNSIGNED NOT NULL COMMENT '专辑分类',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '专辑名称',
  `breif` varchar(100) NOT NULL DEFAULT '' COMMENT '专辑简介',
  `introduce` text NOT NULL COMMENT '专辑描述',
  `number` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '专辑歌曲数',
  `thumb` varchar(255) NOT NULL DEFAULT '' COMMENT '封面',
  `banner` varchar(255) NOT NULL DEFAULT '' COMMENT 'banner图',
  `sort` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '排序',
  `tags` varchar(500) NOT NULL DEFAULT '' COMMENT '标签',
  `is_vip` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '1:会员专享,0:免费',
  `create_time` int(10) UNSIGNED NOT NULL COMMENT '添加时间',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1:发布,0:禁用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='音频专辑';

--
-- 转存表中的数据 `mus_album`
--

INSERT INTO `mus_album` (`id`, `cid`, `title`, `breif`, `introduce`, `number`, `thumb`, `banner`, `sort`, `tags`, `is_vip`, `create_time`, `status`) VALUES
(1, 1, '小猴子的故事', '一个关于小猴子的故事', '这是关于小猴子的故事，它们生活在森林里，它们成群生活在一起!', 0, '/uploads/20181126/8c9014f0f8c1401cc48a03159741ee7c.png', '/uploads/20181126/8c4e22382b7ee050f2a9bab13972b31a.jpg', 0, '1', 0, 1543216712, 1),
(4, 2, '狼来啦', '狼来啦的故事', '狼来啦故事讲述一个小孩放羊，狼来啦的故事!', 0, '/uploads/20181126/9a65778c54346f2d1dfa6adcc75e7982.jpg', '/uploads/20181126/4a2f113f8e808f44614382d6e14f13de.jpg', 0, '', 0, 1543224963, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_album_audio`
--

CREATE TABLE `mus_album_audio` (
  `id` int(11) NOT NULL,
  `album_id` int(10) UNSIGNED NOT NULL,
  `audio_id` int(10) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='专辑音频';

-- --------------------------------------------------------

--
-- 表的结构 `mus_album_category`
--

CREATE TABLE `mus_album_category` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL DEFAULT '''''' COMMENT '专辑分类名称',
  `sort` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '升序排列',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1:发布,0:不发布'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `mus_album_category`
--

INSERT INTO `mus_album_category` (`id`, `title`, `sort`, `status`) VALUES
(1, '每日限免', 0, 1),
(2, '国学经典', 0, 1),
(3, '热门专辑', 0, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_album_tag`
--

CREATE TABLE `mus_album_tag` (
  `id` int(10) UNSIGNED NOT NULL,
  `tag_id` int(10) UNSIGNED NOT NULL,
  `album_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `mus_album_tag`
--

INSERT INTO `mus_album_tag` (`id`, `tag_id`, `album_id`) VALUES
(8, 1, 4),
(2, 2, 1),
(9, 2, 4),
(5, 3, 1),
(10, 3, 4),
(6, 4, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_album_tags`
--

CREATE TABLE `mus_album_tags` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(20) NOT NULL COMMENT '标签名称',
  `image` varchar(255) NOT NULL DEFAULT '' COMMENT '标签图标',
  `sort` tinyint(1) UNSIGNED NOT NULL COMMENT '降序排列',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1:启用,0:不用'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='专辑标签';

--
-- 转存表中的数据 `mus_album_tags`
--

INSERT INTO `mus_album_tags` (`id`, `title`, `image`, `sort`, `status`) VALUES
(1, '小知识', '/uploads/20181126/4240e8c24085397e184f81ecaf8fa197.png', 0, 1),
(2, '英文', '/uploads/20181126/b246a9ff9cc65de057e60dd99bcd20d0.png', 0, 1),
(3, '哄睡', '/uploads/20181126/a9c59abf5e41055264c69617d2f17047.png', 0, 1),
(4, '精品', '/uploads/20181126/a86286718e52c2b6b24c3c51134efeb2.png', 0, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_audio`
--

CREATE TABLE `mus_audio` (
  `id` int(11) UNSIGNED NOT NULL,
  `cid` int(10) UNSIGNED NOT NULL COMMENT '音频分类',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '音频名称',
  `thumb` varchar(255) NOT NULL DEFAULT '' COMMENT '封面',
  `breif` varchar(100) NOT NULL DEFAULT '' COMMENT '简介',
  `introduce` text NOT NULL COMMENT '描述',
  `audio` varchar(255) NOT NULL DEFAULT '' COMMENT '音频路径',
  `duration` char(5) NOT NULL DEFAULT '00:00' COMMENT '时长',
  `size` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '文件大小B',
  `is_vip` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0:免费,1:会员专享',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1:发布,0:不发布'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='音频管理';

-- --------------------------------------------------------

--
-- 表的结构 `mus_audio_category`
--

CREATE TABLE `mus_audio_category` (
  `id` int(11) NOT NULL,
  `title` varchar(20) NOT NULL DEFAULT '' COMMENT '分类名称',
  `sort` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '升序排列',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '1:发布,0:不发布'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='音频分类';

--
-- 转存表中的数据 `mus_audio_category`
--

INSERT INTO `mus_audio_category` (`id`, `title`, `sort`, `status`) VALUES
(1, '哄睡', 0, 1),
(2, '故事', 0, 1),
(3, '朗读', 0, 1),
(4, '歌曲', 0, 1),
(5, '童话', 0, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_auth_group`
--

CREATE TABLE `mus_auth_group` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `title` char(100) NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `rules` text NOT NULL COMMENT '权限规则ID'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='权限组表';

--
-- 转存表中的数据 `mus_auth_group`
--

INSERT INTO `mus_auth_group` (`id`, `title`, `status`, `rules`) VALUES
(1, '超级管理组', 1, '1,2,3,6,7,8,9,10,11,12,39,40,42,43,57,68,69,70,71,72,73,74,116,18,49,50,51,52,53,19,31,32,33,34,35,36,37');

-- --------------------------------------------------------

--
-- 表的结构 `mus_auth_group_access`
--

CREATE TABLE `mus_auth_group_access` (
  `uid` mediumint(8) UNSIGNED NOT NULL,
  `group_id` mediumint(8) UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='权限组规则表';

--
-- 转存表中的数据 `mus_auth_group_access`
--

INSERT INTO `mus_auth_group_access` (`uid`, `group_id`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- 表的结构 `mus_auth_rule`
--

CREATE TABLE `mus_auth_rule` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL DEFAULT '' COMMENT '规则名称',
  `title` varchar(20) NOT NULL,
  `type` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  `pid` smallint(5) UNSIGNED NOT NULL COMMENT '父级ID',
  `icon` varchar(50) DEFAULT '' COMMENT '图标',
  `sort` tinyint(4) UNSIGNED NOT NULL COMMENT '排序',
  `condition` char(100) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='规则表';

--
-- 转存表中的数据 `mus_auth_rule`
--

INSERT INTO `mus_auth_rule` (`id`, `name`, `title`, `type`, `status`, `pid`, `icon`, `sort`, `condition`) VALUES
(1, 'admin/System/default', '系统配置', 1, 1, 0, 'fa fa-gears', 1, ''),
(2, 'admin/System/siteConfig', '站点配置', 1, 1, 1, '', 3, ''),
(3, 'admin/System/updateSiteConfig', '更新配置', 1, 0, 1, '', 0, ''),
(6, 'admin/Menu/index', '后台菜单', 1, 1, 1, '', 2, ''),
(7, 'admin/Menu/add', '添加菜单', 1, 0, 6, '', 0, ''),
(8, 'admin/Menu/save', '保存菜单', 1, 0, 6, '', 0, ''),
(9, 'admin/Menu/edit', '编辑菜单', 1, 0, 6, '', 0, ''),
(10, 'admin/Menu/update', '更新菜单', 1, 0, 6, '', 0, ''),
(11, 'admin/Menu/delete', '删除菜单', 1, 0, 6, '', 0, ''),
(12, 'admin/Nav/index', '导航管理', 1, 0, 1, '', 0, ''),
(18, 'admin/AdminUser/index', '管理员', 1, 1, 116, '', 0, ''),
(19, 'admin/AuthGroup/index', '权限组', 1, 1, 116, 'fa fa-user', 0, ''),
(31, 'admin/AuthGroup/add', '添加权限组', 1, 0, 19, '', 0, ''),
(32, 'admin/AuthGroup/save', '保存权限组', 1, 0, 19, '', 0, ''),
(33, 'admin/AuthGroup/edit', '编辑权限组', 1, 0, 19, '', 0, ''),
(34, 'admin/AuthGroup/update', '更新权限组', 1, 0, 19, '', 0, ''),
(35, 'admin/AuthGroup/delete', '删除权限组', 1, 0, 19, '', 0, ''),
(36, 'admin/AuthGroup/auth', '授权', 1, 0, 19, '', 0, ''),
(37, 'admin/AuthGroup/updateAuthGroupRule', '更新权限组规则', 1, 0, 19, '', 0, ''),
(39, 'admin/Nav/add', '添加导航', 1, 0, 12, '', 0, ''),
(40, 'admin/Nav/save', '保存导航', 1, 0, 12, '', 0, ''),
(42, 'admin/Nav/update', '更新导航', 1, 0, 12, '', 0, ''),
(43, 'admin/Nav/delete', '删除导航', 1, 0, 12, '', 0, ''),
(49, 'admin/AdminUser/add', '添加管理员', 1, 0, 18, '', 0, ''),
(50, 'admin/AdminUser/save', '保存管理员', 1, 0, 18, '', 0, ''),
(51, 'admin/AdminUser/edit', '编辑管理员', 1, 0, 18, '', 0, ''),
(52, 'admin/AdminUser/update', '更新管理员', 1, 0, 18, '', 0, ''),
(53, 'admin/AdminUser/delete', '删除管理员', 1, 0, 18, '', 0, ''),
(73, 'admin/ChangePassword/index', '修改密码', 1, 0, 1, '', 0, ''),
(74, 'admin/ChangePassword/updatePassword', '更新密码', 1, 0, 1, '', 0, ''),
(128, 'admin/album/del', '删除专辑', 1, 0, 121, '', 0, ''),
(127, 'admin/album/edit', '编辑专辑', 1, 0, 121, '', 0, ''),
(116, '/', '权限管理', 1, 1, 0, 'fa fa-lock', 1, ''),
(126, 'admin/album/add', '添加专辑', 1, 0, 121, '', 0, ''),
(125, 'admin/audio/index', '音频列表', 1, 1, 120, '', 0, ''),
(124, 'admin/audio/del', '删除音频', 1, 0, 120, '', 0, ''),
(123, 'admin/audio/edit', '编辑音频', 1, 0, 120, '', 0, ''),
(122, 'admin/audio/add', '添加音频', 1, 0, 120, '', 0, ''),
(121, 'admin/album/index', '专辑列表', 1, 1, 133, '', 0, ''),
(120, 'admin/audio', '音频管理', 1, 1, 0, 'fa fa-cube', 0, ''),
(133, 'admin/album', '专辑管理', 1, 1, 0, 'fa fa-cube', 0, ''),
(56, 'admin/Slide/index', '轮播列表', 1, 1, 1, '', 0, ''),
(132, 'admin/audio_category/delete', '删除分类', 1, 0, 129, '', 0, ''),
(131, 'admin/audio_category/edit', '编辑分类', 1, 0, 129, '', 0, ''),
(130, 'admin/audio_category/add', '添加分类', 1, 0, 129, '', 0, ''),
(63, 'admin/Slide/add', '添加轮播', 1, 0, 56, '', 0, ''),
(64, 'admin/Slide/save', '保存轮播', 1, 0, 56, '', 0, ''),
(65, 'admin/Slide/edit', '编辑轮播', 1, 0, 56, '', 0, ''),
(66, 'admin/Slide/update', '更新轮播', 1, 0, 56, '', 0, ''),
(67, 'admin/Slide/delete', '删除轮播', 1, 0, 56, '', 0, ''),
(129, 'admin/audio_category/index', '音频分类', 1, 1, 120, '', 0, ''),
(134, 'admin/album_category/index', '专辑分类', 1, 1, 133, '', 0, ''),
(135, 'admin/album_category/add', '添加分类', 1, 0, 134, '', 0, ''),
(136, 'admin/album_category/edit', '编辑分类', 1, 0, 134, '', 0, ''),
(137, 'admin/album_category/del', '删除分类', 1, 0, 134, '', 0, ''),
(138, 'admin/album_tags/index', '专辑标签', 1, 1, 133, '', 0, ''),
(139, 'admin/album_tags/add', '添加标签', 1, 0, 138, '', 0, ''),
(140, 'admin/album_tags/edit', '编辑标签', 1, 0, 138, '', 0, ''),
(141, 'admin/album_tags/del', '删除标签', 1, 0, 138, '', 0, '');

-- --------------------------------------------------------

--
-- 表的结构 `mus_link`
--

CREATE TABLE `mus_link` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL DEFAULT '' COMMENT '链接名称',
  `link` varchar(255) DEFAULT '' COMMENT '链接地址',
  `image` varchar(255) DEFAULT '' COMMENT '链接图片',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '排序',
  `type` tinyint(1) UNSIGNED DEFAULT '0' COMMENT '0:合作伙伴,1:友情链接',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '状态 1 显示  2 隐藏'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='友情链接表';

-- --------------------------------------------------------

--
-- 表的结构 `mus_nav`
--

CREATE TABLE `mus_nav` (
  `id` int(10) UNSIGNED NOT NULL,
  `pid` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '父ID',
  `name` varchar(20) NOT NULL COMMENT '导航名称',
  `alias` varchar(20) DEFAULT '' COMMENT '导航别称',
  `link` varchar(255) DEFAULT '' COMMENT '导航链接',
  `icon` varchar(255) DEFAULT '' COMMENT '导航图标',
  `target` varchar(10) DEFAULT '' COMMENT '打开方式',
  `type` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '0:顶部菜单,1:脚部菜单',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '状态  0 隐藏  1 显示',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='导航表';

-- --------------------------------------------------------

--
-- 表的结构 `mus_slide`
--

CREATE TABLE `mus_slide` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL COMMENT '轮播图名称',
  `image` varchar(255) DEFAULT '' COMMENT '轮播图片',
  `link` varchar(50) NOT NULL DEFAULT '' COMMENT '链接',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '状态  1 显示  0  隐藏',
  `sort` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '排序'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='轮播图表';

--
-- 转存表中的数据 `mus_slide`
--

INSERT INTO `mus_slide` (`id`, `name`, `image`, `link`, `status`, `sort`) VALUES
(1, '图片一', '/uploads/20181124/5ab3e4901ccd5d1bdd5bd0d409da41b9.jpg', '', 1, 0),
(2, '图片二', '/uploads/20181124/4ee16d0fb31efe44c2b01437f4a5009d.jpg', '', 1, 0),
(8, '图片三', '/uploads/20181124/09b6bf9f916d7e227acc752c7c08b789.jpg', '', 1, 0);

-- --------------------------------------------------------

--
-- 表的结构 `mus_system`
--

CREATE TABLE `mus_system` (
  `system_id` int(11) UNSIGNED NOT NULL,
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '配置标题',
  `name` varchar(20) NOT NULL DEFAULT '',
  `value` varchar(255) NOT NULL DEFAULT '',
  `sort` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '越大越靠前',
  `type` tinyint(1) UNSIGNED NOT NULL DEFAULT '0' COMMENT '1:文本,2:文本框,3:上传,4:单选,5:多选,6:下拉',
  `classify` varchar(10) NOT NULL DEFAULT '' COMMENT '配置分类',
  `extra` varchar(100) NOT NULL DEFAULT '' COMMENT '附加项',
  `status` tinyint(1) UNSIGNED NOT NULL DEFAULT '1' COMMENT '0:不使用',
  `rule` varchar(20) DEFAULT '' COMMENT 'layui 验证规则'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='系统配置';

--
-- 转存表中的数据 `mus_system`
--

INSERT INTO `mus_system` (`system_id`, `title`, `name`, `value`, `sort`, `type`, `classify`, `extra`, `status`, `rule`) VALUES
(1, '允许上传的最大音频文件,单位字节(B)', 'audio_max_size', '10485760', 2, 1, 'media', '', 1, 'required');

-- --------------------------------------------------------

--
-- 表的结构 `ssw_auth_rule`
--

CREATE TABLE `ssw_auth_rule` (
  `id` mediumint(8) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL DEFAULT '' COMMENT '规则名称',
  `title` varchar(20) NOT NULL,
  `type` tinyint(1) UNSIGNED NOT NULL DEFAULT '1',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态',
  `pid` smallint(5) UNSIGNED NOT NULL COMMENT '父级ID',
  `icon` varchar(50) DEFAULT '' COMMENT '图标',
  `sort` tinyint(4) UNSIGNED NOT NULL COMMENT '排序',
  `condition` char(100) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COMMENT='规则表';

--
-- 转存表中的数据 `ssw_auth_rule`
--

INSERT INTO `ssw_auth_rule` (`id`, `name`, `title`, `type`, `status`, `pid`, `icon`, `sort`, `condition`) VALUES
(55, 'admin/SlideCategory/index', '轮播分类', 1, 1, 81, '', 0, ''),
(56, 'admin/Slide/index', '轮播图管理', 1, 1, 81, '', 0, ''),
(59, 'admin/SlideCategory/save', '保存分类', 1, 0, 55, '', 0, ''),
(60, 'admin/SlideCategory/edit', '编辑分类', 1, 0, 55, '', 0, ''),
(61, 'admin/SlideCategory/update', '更新分类', 1, 0, 55, '', 0, ''),
(62, 'admin/SlideCategory/delete', '删除分类', 1, 0, 55, '', 0, ''),
(63, 'admin/Slide/add', '添加轮播', 1, 0, 56, '', 0, ''),
(64, 'admin/Slide/save', '保存轮播', 1, 0, 56, '', 0, ''),
(65, 'admin/Slide/edit', '编辑轮播', 1, 0, 56, '', 0, ''),
(66, 'admin/Slide/update', '更新轮播', 1, 0, 56, '', 0, ''),
(67, 'admin/Slide/delete', '删除轮播', 1, 0, 56, '', 0, ''),
(81, 'admin/slide', '轮播管理', 1, 1, 0, 'fa fa-photo', 0, '');

--
-- 转储表的索引
--

--
-- 表的索引 `mus_admin_user`
--
ALTER TABLE `mus_admin_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`) USING BTREE;

--
-- 表的索引 `mus_album`
--
ALTER TABLE `mus_album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cid` (`cid`);

--
-- 表的索引 `mus_album_audio`
--
ALTER TABLE `mus_album_audio`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_album_category`
--
ALTER TABLE `mus_album_category`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_album_tag`
--
ALTER TABLE `mus_album_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tag_id` (`tag_id`,`album_id`),
  ADD KEY `tag_id_2` (`tag_id`);

--
-- 表的索引 `mus_album_tags`
--
ALTER TABLE `mus_album_tags`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_audio`
--
ALTER TABLE `mus_audio`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_audio_category`
--
ALTER TABLE `mus_audio_category`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_auth_group`
--
ALTER TABLE `mus_auth_group`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_auth_group_access`
--
ALTER TABLE `mus_auth_group_access`
  ADD UNIQUE KEY `uid_group_id` (`uid`,`group_id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `group_id` (`group_id`);

--
-- 表的索引 `mus_auth_rule`
--
ALTER TABLE `mus_auth_rule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`) USING BTREE;

--
-- 表的索引 `mus_link`
--
ALTER TABLE `mus_link`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_nav`
--
ALTER TABLE `mus_nav`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_slide`
--
ALTER TABLE `mus_slide`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `mus_system`
--
ALTER TABLE `mus_system`
  ADD PRIMARY KEY (`system_id`);

--
-- 表的索引 `ssw_auth_rule`
--
ALTER TABLE `ssw_auth_rule`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`) USING BTREE;

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `mus_admin_user`
--
ALTER TABLE `mus_admin_user`
  MODIFY `id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- 使用表AUTO_INCREMENT `mus_album`
--
ALTER TABLE `mus_album`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `mus_album_audio`
--
ALTER TABLE `mus_album_audio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `mus_album_category`
--
ALTER TABLE `mus_album_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `mus_album_tag`
--
ALTER TABLE `mus_album_tag`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- 使用表AUTO_INCREMENT `mus_album_tags`
--
ALTER TABLE `mus_album_tags`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- 使用表AUTO_INCREMENT `mus_audio`
--
ALTER TABLE `mus_audio`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `mus_audio_category`
--
ALTER TABLE `mus_audio_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `mus_auth_group`
--
ALTER TABLE `mus_auth_group`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用表AUTO_INCREMENT `mus_auth_rule`
--
ALTER TABLE `mus_auth_rule`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- 使用表AUTO_INCREMENT `mus_link`
--
ALTER TABLE `mus_link`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- 使用表AUTO_INCREMENT `mus_nav`
--
ALTER TABLE `mus_nav`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- 使用表AUTO_INCREMENT `mus_slide`
--
ALTER TABLE `mus_slide`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- 使用表AUTO_INCREMENT `mus_system`
--
ALTER TABLE `mus_system`
  MODIFY `system_id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- 使用表AUTO_INCREMENT `ssw_auth_rule`
--
ALTER TABLE `ssw_auth_rule`
  MODIFY `id` mediumint(8) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
