<?php

namespace app\api\controller;

use app\common\model\Album as AlbumModel;
use app\common\model\AlbumTag;
use app\common\model\AlbumTags;

class Album extends BaseController
{
    /* 所有音频 */
    public function audios($album_id)
    {
        $audios = AlbumModel::get($album_id)->audios()->paginate(15, false, request()->param());
//        $audios = AlbumModel::get($album_id)->audios;
        return $this->successJson($audios);
    }

    /* 专辑详情 */
    public function show($album_id)
    {
        $album = AlbumModel::get($album_id);
        $tag_ids = AlbumTag::getTags($album_id);
        $album->tags = AlbumTags::whereIn('id', $tag_ids)->column('title');
        return $this->successJson($album);
    }
}