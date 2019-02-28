/**
 * emoji 支持
 *
 * page data:
 * emojiIcons:this.icons
 * type:选择类别 qq|tieba
 *
 */
var icons = [{
    type: 'tieba',
    name: "贴吧表情",
    path: "/tieba/",
    maxNum: 50,
    indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    file: ".jpg",
    placeholder: ":{alias}:",
    alias: {
        1: "hehe",
        2: "haha",
        3: "tushe",
        4: "a",
        5: "ku",
        6: "lu",
        7: "kaixin",
        8: "han",
        9: "lei",
        10: "heixian",
        11: "bishi",
        12: "bugaoxing",
        13: "zhenbang",
        14: "qian",
        15: "yiwen",
        16: "yinxian",
        17: "tu",
        18: "yi",
        19: "weiqu",
        20: "huaxin",
        21: "hu",
        22: "xiaonian",
        23: "neng",
        24: "taikaixin",
        25: "huaji",
        26: "mianqiang",
        27: "kuanghan",
        28: "guai",
        29: "shuijiao",
        30: "jinku",
        31: "shengqi",
        32: "jinya",
        33: "pen",
        34: "aixin",
        35: "xinsui",
        36: "meigui",
        37: "liwu",
        38: "caihong",
        39: "xxyl",
        40: "taiyang",
        41: "qianbi",
        42: "dnegpao",
        43: "chabei",
        44: "dangao",
        45: "yinyue",
        46: "haha2",
        47: "shenli",
        48: "damuzhi",
        49: "ruo",
        50: "OK"
    },
    title: {
        1: "呵呵",
        2: "哈哈",
        3: "吐舌",
        4: "啊",
        5: "酷",
        6: "怒",
        7: "开心",
        8: "汗",
        9: "泪",
        10: "黑线",
        11: "鄙视",
        12: "不高兴",
        13: "真棒",
        14: "钱",
        15: "疑问",
        16: "阴脸",
        17: "吐",
        18: "咦",
        19: "委屈",
        20: "花心",
        21: "呼~",
        22: "笑脸",
        23: "冷",
        24: "太开心",
        25: "滑稽",
        26: "勉强",
        27: "狂汗",
        28: "乖",
        29: "睡觉",
        30: "惊哭",
        31: "生气",
        32: "惊讶",
        33: "喷",
        34: "爱心",
        35: "心碎",
        36: "玫瑰",
        37: "礼物",
        38: "彩虹",
        39: "星星月亮",
        40: "太阳",
        41: "钱币",
        42: "灯泡",
        43: "茶杯",
        44: "蛋糕",
        45: "音乐",
        46: "haha",
        47: "胜利",
        48: "大拇指",
        49: "弱",
        50: "OK"
    },
}, {
    type: 'qq',
    name: "QQ表情",
    path: "/qq/",
    maxNum: 91,
    indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    file: ".gif",
    placeholder: "#qq_{alias}#",
}];

//初始化 type=tieba
function init(that) {
    console.log('初始化表情');
    var iconsGroup = icons;
    var groupLength = iconsGroup.length, notations;
    var name, path, maxNum, excludeNums, placeholder, alias, title, index, notation, file;
    //处理图片对应的标志，notation
    for (var i = 0; i < groupLength; i++) {
        name = iconsGroup[i].name || 'group' + (i + 1);
        path = iconsGroup[i].path;
        maxNum = iconsGroup[i].maxNum;
        excludeNums = iconsGroup[i].excludeNums;
        file = iconsGroup[i].file || '.jpg';
        placeholder = iconsGroup[i].placeholder || '#em' + (i + 1) + '_{alias}';
        alias = iconsGroup[i].alias;
        title = iconsGroup[i].title;
        notations = {};
        index = 0;

        for (var j = 1; j <= maxNum; j++) {
            if (excludeNums && excludeNums.indexOf(j) >= 0) {
                continue;
            }
            if (alias) {
                if (typeof alias !== 'object') {
                    break;
                }
                notation = placeholder.replace(new RegExp('{alias}', 'gi'), alias[j].toString());
            } else {
                notation = placeholder.replace(new RegExp('{alias}', 'gi'), j.toString());
            }
            notations[j] = notation;
            index++;
        }
        iconsGroup[i].notations = notations;
    }

    that.setData({
        type: 'tieba',
        emojiIcons: iconsGroup,
        showEmoji: false,
    })
}

//解析icon message
function emojiParse(prefix, message) {
    var iconsGroup = icons;
    var groupLength = iconsGroup.length;
    var path, file, placeholder, alias, placeholder, pattern, regexp, revertAlias = {};
    if (groupLength > 0) {
        for (var i = 0; i < groupLength; i++) {
            path = prefix + iconsGroup[i].path;
            file = iconsGroup[i].file || '.jpg';
            placeholder = iconsGroup[i].placeholder;
            alias = iconsGroup[i].alias;
            if (alias) {
                for (var attr in alias) {
                    if (alias.hasOwnProperty(attr)) {
                        revertAlias[alias[attr]] = attr;
                    }
                }
                pattern = placeholder.replace(new RegExp('{alias}', 'gi'), '([\\s\\S]+?)');
                regexp = new RegExp(pattern, 'gm');
                message = message.replace(regexp, function (temp0, temp1) {
                    var n = revertAlias[temp1];
                    if (n) {
                        return '<img class="emoji_icon" src="' + path + n + file + '"></img>';
                    } else {
                        return temp0;
                    }
                })
            } else {
                pattern = placeholder.replace(new RegExp('{alias}', 'gi'), '(\\d+?)');
                message = message.replace(new RegExp(pattern, 'gm'), '<img class="emoji_icon" src="' + path + 1 + file + '"></img>')
            }
        }
    }
    return message;
}

module.exports = {
    init: init,
    emojiParse: emojiParse,
};