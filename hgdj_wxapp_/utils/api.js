/*!
 * 接口组件 - api.js
 * @author:wuquanyao
 * @date:2018-03
 */

let

    domain = "https://hgdj.luogel.cn/",
    // domain = "http://www.hgdj.cc/",

    chatHost = domain + "chat/",

    host = domain + "api/",
    api = {};
//模板消息ID
api.messageTemplates = {
    TRANS_IMFORM: 'kXgUtS7wqSz03U5D_vPK1-mG6UUuVy_n2_zafID-u6U',
    SUCCESS_IMFORM: 'BWV7K_lf8GyVp161xdotDfshMtREiH9c557CBULKRCY',
};
//发送模板消息
api.send_template_message = host + "common/sendTemplateMessage";


//阿里云域名
api.oss_domain = 'https://hgdj-server.oss-cn-hangzhou.aliyuncs.com';
//websocket访问域名
api.ws_domain = 'wss://hgdj.luogel.cn/wss';
// api.ws_domain = 'ws://127.0.0.1:444';

// 域名
api.domain = domain;

/**
 * 登录地址
 * @return string
 */
api.login = host + "common/login";

/**
 * 判断是否登录
 * @return string
 */
api.is_login = host + "common/isLogin";

/**
 * 获取首页banner图片
 * @return string
 */
api.banner = host + "index/carousel";

/**
 * 获取首页技能列表
 * @return string
 */
api.skill_list = host + "index/skillList";

/**
 * 获取用户技能信息
 * @return string
 */
api.user_skill = host + "common/userSkill";

/**
 * 获取用户技能信息
 * @return string
 */
api.user_skill_info = host + "common/userSkillInfo";

/**
 * 提交用户审核前获取信息
 * @return string
 */
api.user_check = host + "common/userCheck";

/**
 * 用户审核提交
 * @return string
 */
api.user_check_submit = host + "common/userCheckSubmit";

/**
 * 获取用户信息
 */
api.user_info = host + "common/getUserinfo";

/**
 * 设置用户信息
 */
api.user_info_set = host + "common/setUserinfo";

/**
 * 获取用户手机
 * @return string
 */
api.user_mobile = host + "common/userMobile";

/**
 * 获取用户手机
 * @return string
 */
api.user_skill_submit = host + "common/userSkillSubmit";

/**
 * 用户接单价格显示
 * @return string
 */
api.user_skill_unit = host + "common/userSkillUnit";

/**
 * 设置单元价格
 * @return string
 */
api.skill_unit_price = host + "common/skillUnitPrice";

/**
 * 设置单元价格
 * @return string
 */
api.price_list = host + "index/priceList";

api.price_list_via_search = host + "index/priceListViaSearch";

/**
 * 设置单元价格
 * @return string
 */
api.price_detail = host + "index/priceDetail";

//获取用户全部技能
api.get_user_skills = host + "index/getUserSkills";

/**
 * 订单价格页面数据
 * @return string
 */
api.order_price = host + "order/orderPrice";

/**
 * 用户本周订单
 */
api.order_week = host + "order/weekOrders";

/**
 * 创建新订单
 * @return string
 */
api.order_create = host + "order/orderCreate";

/**
 * 订单支付
 * @return string
 */
api.order_pay = host + "order/orderPay";

/* 订单取消 */
api.order_cancel = host + "order/cancel";

/**
 * 订单列表
 * @return string
 */
api.order_list = host + "order/orderList";

/**
 * 订单确认
 * @return string
 */
api.order_confirm = host + "order/orderConfirm";

/**
 * 更改订单状态
 */
api.order_status_change = host + "order/orderStatusChange";

/**
 * 获取用户已评价订单的综合评分
 */
api.get_order_rate = host + "order/orderRate";

/**
 * 陪玩师 提交验收
 */
api.order_acceptance_check = host + "order/acceptanceCheck";

/**
 * 订单详情信息
 * @return string
 */
api.order_detail = host + "order/orderDetail";

/**
 * 评价订单提交
 * @return string
 */
api.evaluate_submit = host + "order/evaluateSubmit";

/**
 * 图片上传
 * @return string
 */
api.image_upload = host + "upload/imageUpload";

/**
 * 音频上传
 * @return string
 */
api.audio_upload = host + "upload/audioUpload";

/**
 * 图片上传
 * @return string
 */
api.evaluate_list = host + "index/getEvaluate";

/**
 * 图片上传
 * @return string
 */
api.start_price = host + "index/startPrice";


/**
 * 提交表单信息
 * @return string
 */
api.form_data = host + "index/formData";

//意见反馈
api.feedback_create = host + "index/feedbackCreate";

//用户可提现订单列表
api.play_list = host + "order/playList";

//发起提现
api.withdraw = host + "order/withdraw";

//明细 余额明细，零钱明细
api.opDetails = host + "order/opDetails";

//历史聊天记录
api.chaters = host + "chat/chaters";
api.chat_history = host + "chat/history";

//确认当前聊天对象所有消息已读
api.chat_read = host + "chat/read";
//总消息未读数
api.chat_notread_all = host + "chat/unRead";
//添加user至聊天对象表
api.add_user_chater = host + "chat/addToUserChater";
//获取formId
api.get_form_id = host + "common/collectFormId";
//获取协议详情
api.protocol_detail = host + "common/protocolDetail";
//暴露接口
module.exports = api;
