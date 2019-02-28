<?php

namespace app\common\model;

use think\Model;

// 标签管理
class AlbumTags extends Model
{
    // 状态列表
    public static $statusList =
        [
            1 => "启用",
            0 => "禁用",
        ];

    // 后台 - 标签列表
    public static function getList()
    {
        $where = [];
        $order = [
            "status" => "DESC",
            "sort" => "ASC"
        ];

        $field = "id,title,sort,status,image";

        return self::where($where)
            ->field($field)
            ->order($order)
            ->select();
    }

    // 返回标签
    public static function getTags()
    {
        $where = ["status" => 1];
        $order = [
            "sort" => "ASC"
        ];

        return self::where($where)
            ->order($order)
            ->column("title,image", "id");
    }

    // 添加标签
    public static function addTag($post)
    {
        if (self::insert($post)) {
            return ["status" => 1, "msg" => "新增标签成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 编辑标签
    public static function editTag($post)
    {
        if (self::update($post)) {
            return ["status" => 1, "msg" => "编辑标签成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 标签详情
    public static function detailTag($id, $field = "")
    {
        if (!$field) {
            $field = "id,title,status,sort,image";
        }

        return self::field($field)->where("id", "=", $id)->find();
    }

    /**
     * 删除标签
     * @param int $id 标签ID
     * @return array
     */
    public static function deleteTag($id)
    {
        if (AlbumTag::hasTag($id)) {
            return ["status" => 0, "msg" => "标签下存在专辑,不能删除该标签!"];
        }

        $image = self::where("id", "=", $id)->value("image");

        if (null === $image) {
            return ["status" => 0, "msg" => "标签不存在!"];
        }

        if (self::where("id", "=", $id)->delete()) {
            @unlink($image);
            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }
}