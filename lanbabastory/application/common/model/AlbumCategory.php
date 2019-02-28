<?php

namespace app\common\model;

use think\Model;

// 专辑分类
class AlbumCategory extends Model
{
    // 状态列表
    public static $statusList =
        [
            1 => "启用",
            0 => "禁用",
        ];

    public function albums()
    {
        return $this->hasMany('Album', 'cid');
    }

    // 后台 - 专辑分类列表
    public static function getList()
    {
        $where = [];
        $order = [
            "status" => "DESC",
            "sort" => "ASC"
        ];

        $field = "id,title,sort,status";
        return self::where($where)
            ->field($field)
            ->order($order)
            ->select();
    }

    // 返回专辑
    public static function getCategory()
    {
        $where = ["status" => 1];
        $order = [
            "sort" => "ASC"
        ];

        return self::where($where)
            ->order($order)
            ->column("title", "id");
    }

    // 添加专辑分类
    public static function addCategory($post)
    {
        if (self::insert($post)) {
            return ["status" => 1, "msg" => "新增专辑分类成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 编辑专辑分类
    public static function editCategory($post)
    {
        if (self::update($post)) {
            return ["status" => 1, "msg" => "编辑专辑分类成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }

    // 专辑分类详情
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
        if (Album::hasAlbum($id)) {
            return ["status" => 0, "msg" => "分类下存在专辑,不能删除该分类!"];
        }

        if (self::where("id", "=", $id)->delete()) {
            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }
}