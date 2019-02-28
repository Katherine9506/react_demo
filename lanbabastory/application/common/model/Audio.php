<?php

namespace app\common\model;

// 音频管理
use think\db\Query;

class Audio extends \think\Model
{
    const STATUS_PUBLISH = 1;
    const STATUS_PRIVATE = 0;
    public static $statusList = [
        self::STATUS_PUBLISH => "发布",
        self::STATUS_PRIVATE => "不发布",
    ];

    const TYPE_FREE = 0;
    const TYPE_CHATGE = 1;
    public static $vipList = [
        self::TYPE_FREE => "免费",
        self::TYPE_CHATGE => "会员"
    ];

    const SEARCH_TITLE = 1;
    const TYPE_OF_SEARCH = [
        self::SEARCH_TITLE => '标题',
    ];

    /* 免费音频 */
    public function scopeFree($query)
    {
        $query->where('is_vip', self::TYPE_FREE);
    }

    /* 收费音频 */
    public function scopeCharge($query)
    {
        $query->where('is_vip', self::TYPE_CHATGE);
    }

    /* 名称搜索 */
    /**
     * @param $query Query
     * @param $title
     */
    public function scopeTitle($query, $title)
    {
        $query->whereLike('title', '%' . $title . '%');
    }

    /* 关联专辑 */
    public function albums()
    {
        return $this->belongsToMany('Album');
    }

    // 音频列表 - 后台列表
    public static function getList()
    {
        $where = [];

        $field = "id,cid,title,thumb,breif,introduce,audio,duration,size,is_vip,status,sort,seconds";
        return self::where($where)
            ->field($field)
            ->paginate(15, false, ["param" => request()->param()]);
    }

    // 通过查询Cid音频文件
    public static function getListByCid($cid)
    {
        $where = [];
        $field = "id,cid,title,thumb,breif,introduce,audio,duration,size,is_vip,status,sort,seconds";

        return self::field($field)->where($where)->select();
    }

    // 判断分类下是否有音频文件
    public static function hasAudio($cid)
    {
        $where = ["cid" => $cid];
        return self::where($where)->value("id");
    }

    // 新增音频
    public static function addAudio(array $post)
    {
        if (self::insert($post)) {
            return ["status" => 1, "msg" => "新增音频成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 编辑音频
    public static function editAudio(array $post)
    {
        if (self::update($post)) {
            return ["status" => 1, "msg" => "编辑音频成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // Audio 详情
    public static function detailAudio($id, $field = "")
    {
        $where = ["id" => $id];

        if (!$field) {
            $field = "id,cid,title,thumb,breif,introduce,audio,duration,size,is_vip,status,sort,seconds";
        }

        return self::where($where)->field($field)->find();
    }

    // 删除音频
    public static function deleteAudio($id)
    {
        $info = self::detailAudio($id, "thumb");

        if (!$info) {
            return ["status" => 0, "msg" => "音频不存在"];
        }

        if (self::where("id", $id)->delete()) {
            @unlink($info["thumb"]);

            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

}
