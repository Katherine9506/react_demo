<?php

namespace app\api\controller;

use app\common\model\Album as AlbumModel;
use app\common\model\AlbumTag as AlbumTagModel;
use app\common\model\AlbumTags;
use think\Request;

class AlbumTag extends BaseController
{
    /* 专辑标签列表 */
    public function getAll()
    {
        $tags = AlbumTags::getTags();
        return $this->successJson($tags);
    }

    /* 特定专辑标签下的专辑列表 */
    public function albums($tag_id, Request $request)
    {
        $album_ids = AlbumTagModel::where('tag_id', $tag_id)->column('album_id');
        $albums = AlbumModel::scope('published')->whereIn('id', $album_ids)->field('id,title,breif,number,thumb,is_vip')->paginate(15, false, $request->param());
        return $this->successJson($albums);
    }
}