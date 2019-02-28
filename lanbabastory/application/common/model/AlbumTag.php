<?php
namespace app\common\model;

use think\Model;

// 专辑标签
class AlbumTag extends Model
{
    // 获取专辑标签
    public static function getTags($id)
    {
        $where = ["album_id" => $id];
        return self::where($where)->column("tag_id", "id");
    }

    // 判断专辑标签下是否有专辑
    public static function hasTag($tid)
    {
        $where = ["tag_id" => $tid];
        return self::where($where)->value("id");
    }

    /**
     * 添加专辑多个标签
     * @param array $tags 标签
     * @param int $album_id
     * @param string $type insert or update
     * @return array
     */
    public static function addTags($tags, $album_id, $type)
    {
        if ("insert" == $type)
        {
            $data = [];

            foreach ($tags as $tag)
            {
                $data[] = ["tag_id" => $tag, "album_id" => $album_id];
            }

            if (!self::insertAll($data))
            {
                return ["status" => 0, "msg" => "添加标签失败"];
            }

            return ["status" => 1, "msg" => "添加标签成功"];
        }

        $where = ["album_id" => $album_id];

        $result = self::where($where)->column("tag_id", "id");

        // 交集
        $intersect = array_intersect($result, $tags);

        // 差集1
        $diff1 = array_diff($result, $intersect);

        if (!empty($diff1))
        {
            $where =
            [
                "tag_id" => ["IN", $diff1],
                "album_id" => $album_id
            ];

            // 删除没交集
            if (!self::where($where)->delete())
            {
                return ["status" => 0, "msg" => "删除没交集的标签失败"];
            }
        }

        // 差集2
        $diff2 = array_diff($tags, $intersect);

        if (!empty($diff2))
        {
            $data = [];

            foreach ($diff2 as $tid)
            {
                $data[] = ["tag_id" => $tid, "album_id" => $album_id];
            }

            if (!self::insertAll($data))
            {
                return ["status" => 0, "msg" => "添加标签失败"];
            }
        }

        return ["status" => 1, "msg" => "添加标签成功"];
    }
}