let
    host = "http://lanbaba.cc",
    // host = "https://lanbaba.luogel.cn",
    api = {};
api.host = host;
/* 服务器登录 */
api.login = host + "/api/login/login";
/* 判断是否登录 */
api.is_login = host + "/api/login/isLogin";
/* 轮播图列表 */
api.slides = host + "/api/slide/getall";
/* 专辑详情 */
api.album_show = host + "/api/album/show";
/* 专辑音频列表 */
api.album_audios = host + "/api/album/audios";
/* 专辑标签列表 */
api.album_tags = host + "/api/album_tag/getall";
/* 专辑分类列表 */
api.album_categories = host + "/api/album_category/getall";
/* 专辑分类下专辑列表 */
api.album_category_albums = host + "/api/album_category/albums";
/* 专辑分类列表&专辑列表 */
api.album_categories_with_album = host + "/api/album_category/allWithAlbums";
/* 音频分类列表 */
api.audio_categories = host + "/api/audio_category/getall";
/* 音频分类下音频列表 */
api.audio_category_audios = host + "/api/audio_category/audios";
/* 专辑标签下专辑列表 */
api.album_tag_album = host + "/api/album_tag/albums";


/* 会员套餐列表 */
api.members = host + "/api/user/members";
/* 检查用户是否非连续签到 */
api.user_check_sign = host + "/api/user/checkSign";
/* 用户签到记录 */
api.user_signs = host + "/api/user/signs";
/* 用户签到操作 */
api.user_sign = host + "/api/user/sign";
/* 获取用户是否享受过免费会员 & 连续签到天数 */
api.user_free_member_check = host + "/api/user/freeMemberCheck";
/* 用户订单详情 */
api.user_order_detail = host + "/api/user/order";
/* 用户的会员购买记录 */
api.user_orders = host + "/api/user/orders";
/* 用户详情 */
api.user_detail = host + "/api/user/myself";
/* 用户签到 */
api.user_sign = host + "/api/user/sign";
/* 绑定手机号 */
api.user_bind_phone = host + "/api/user/bindPhone";
/* 获取短信验证码 */
api.user_get_captcha = host + "/api/user/getCaptcha";
/* 检查会员是否过期 */
api.user_check_member_valid = host + '/api/user/checkExpireDate';

/* 支付 */
/* 创建订单 */
api.order_create = host + "/api/order/create";
/* 支付订单 */
api.order_pay = host + "/api/order/pay";

/* 搜索 */
api.search = host + "/api/search/index";

module.exports = api;