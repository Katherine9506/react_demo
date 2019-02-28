<?php

namespace app\common\model;

use think\Model;

// 专辑
class Album extends Model
{
    // 状态列表
    public static $statusList = [
        1 => "发布",
        0 => "不发布",
    ];

    // VIP状态
    public static $vipList = [
        0 => "免费",
        1 => "会员"
    ];

    public function scopePublished($query)
    {
        $query->where('status', 1);
    }

    /* 名称搜索 */
    public function scopeTitle($query, $title)
    {
        $query->whereLike('title', '%' . $title . '%');
    }

    /* 关联标签 */
    public function tags()
    {
        return $this->belongsToMany('AlbumTag', 'album_tag');
    }

    /* 关联音频 */
    public function audios()
    {
        return $this->belongsToMany('Audio');
    }

    /* 标记 */

    // 后台 - 专辑列表
    public static function getList()
    {
        $where = [];
        $field = "id,cid,title,breif,introduce,number,thumb,banner,sort,status,is_vip,create_time";

        return self::where($where)
            ->field($field)
            ->order("sort", "ASC")// 降序排列
            ->paginate(20, false, ["param" => request()->param()]);
    }

    // 添加专辑
    public static function addAlbum($post)
    {
        if (empty($post["tags"])) {
            return ["status" => 1, "msg" => "请选择专辑的关联标签!"];
        }

        if (!isset($post["create_time"])) {
            $post["create_time"] = time();
        }

        if ($id = self::insertGetId($post)) {
            $result = AlbumTag::addTags($post["tags"], $id, "insert");

            if (!$result["status"]) {
                return ["status" => 0, "msg" => $result["msg"]];
            }

            return ["status" => 1, "msg" => "新增专辑成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 编辑专辑
    public static function editAlbum($post)
    {
        if (empty($post["tags"])) {
            return ["status" => 1, "msg" => "请选择专辑的关联标签!"];
        }

        if (self::update($post)) {
            $result = AlbumTag::addTags($post["tags"], $post["id"], "update");

            if (!$result["status"]) {
                return ["status" => 0, "msg" => $result["msg"]];
            }

            return ["status" => 1, "msg" => "编辑专辑成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 专辑详情
    public static function detailAlbum($id, $field = "")
    {
        if (!$field) {
            $field = "id,cid,title,breif,introduce,number,thumb,banner,sort,status,is_vip,create_time";
        }

        return self::field($field)->where("id", "=", $id)->find();
    }

    // 删除专辑
    public static function deleteAlbum($id)
    {
        if (Audio::hasAudio($id)) {
            return ["status" => 0, "msg" => "专辑下存在音频,不能删除该专辑!"];
        }

        if (self::where("id", "=", $id)->delete()) {
            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 判断专辑下是否有专辑
    public static function hasAlbum($cid)
    {
        $where = ["cid" => $cid];
        return self::where($where)->value("id");
    }

    /* 添加音频 */
    public function addAudio($id)
    {
        if ($this->audios()->save($id)) {
            /* 更新专辑音频数 */
            $this->isUpdate(true)->save(['number' => ($this->number + 1)]);
            return ['status' => 1, 'msg' => '添加音频成功'];
        }
        return ['status' => 0, 'msg' => '临时错误'];
    }

    public function deleteAudio($id)
    {
        if ($this->audios()->detach($id)) {
            /* 更新专辑音频数 */
            $this->isUpdate(true)->save(['number' => ($this->number - 1)]);
            return ['status' => 1, 'msg' => '取消音频成功'];
        }
        return ['status' => 0, 'msg' => '临时错误'];
    }

    /* 专辑是否含有某个音频 */
    public function hasAudio($audio_id)
    {
        return $this->audios()->wherePivot('audio_id', '=', $audio_id)->find();
    }
}