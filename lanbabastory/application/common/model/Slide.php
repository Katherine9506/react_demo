<?php
namespace app\common\model;

use think\Model;

//轮播图
class Slide extends Model
{
    // 后台轮播列表
    public static function getList()
    {
        $field = "id,name,image,link,status,sort";
        $where = [];
        $order = ["status" => "DESC", "sort" => "ASC"]; //升序排列

        return self::field($field)
            ->where($where)
            ->order($order)
            ->select();
    }

    // 小程序图片列表
    public static function getAppList()
    {
        $field = "name,image,link";
        $where = ["status" => 1];
        $order = ["sort" => "ASC"]; //升序排列

        return self::field($field)
            ->where($where)
            ->order($order)
            ->column($field, "id");
    }

    // 添加
    public static function addSlide($post)
    {
        if (self::insert($post))
        {
            return ["status" => 1, "msg" => "添加成功"];
        }

        return ["status" => 0, "msg" => "临时错误~"];
    }

    // 编辑
    public static function editSlide($post)
    {
        if (self::update($post))
        {
            return ["status" => 1, "msg" => "编辑成功"];
        }

        return ["status" => 0, "msg" => "临时错误~"];
    }

    // 详情
    public static function detailSlide($id, $field="")
    {
        $where = ["id" => $id];

        if (!$field)
        {
            $field = "id,name,image,link,status,sort";
        }

        return self::where($where)->field($field)->find();
    }

    // 删除
    public static function deleteSlide($id)
    {
        $detail = self::detailSlide($id, "image");

        if (!$detail)
        {
            return ["status" => 0, "msg" => "轮播不存在"];
        }

        if (self::where("id", "=", $id)->delete())
        {
            @unlink($detail["image"]);

            return ["status" => 1, "msg" => "删除成功"];
        }

        return ["status" => 0, "msg" => "临时错误"];
    }
}