<?php

namespace app\common\model;

use think\Model;

// 音频分类
class AudioCategory extends Model
{
    // 状态列表
    public static $statusList = [
        1 => "启用",
        0 => "禁用",
    ];

    public function audios()
    {
        return $this->hasMany('Audio', 'cid');
    }

    // 后台 - 音频分类列表
    public static function getList()
    {
        $where = [];
        $field = "id,title,sort,status";

        return self::where($where)
            ->field($field)
            ->order("sort", "ASC")// 降序排列
            ->select();
    }

    public static function getCategory()
    {
        return self::where('status', 1)->order('sort', 'asc')->field('id,title')->select();
    }

    // 添加音频分类
    public static function addCategory($post)
    {
        if (self::insert($post)) {
            return ["status" => 1, "msg" => "新增音频分类成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 编辑音频分类
    public static function editCategory($post)
    {
        if (self::update($post)) {
            return ["status" => 1, "msg" => "编辑音频分类成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 音频分类详情
    public static function detailCategory($id, $field = "")
    {
        if (!$field) {
            $field = "id,title,status,sort";
        }

        return self::field($field)->where("id", "=", $id)->find();
    }

    // 删除
    public static function deleteCategory($id)
    {
        if (Audio::hasAudio($id)) {
            return ["status" => 0, "msg" => "分类下存在音频,不能删除该分类!"];
        }

        if (self::where("id", "=", $id)->delete()) {
            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }
}