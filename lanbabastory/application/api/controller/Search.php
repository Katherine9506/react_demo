<?php

namespace app\api\controller;

use app\common\model\Album as AlbumModel;
use app\common\model\Audio as AudioModel;
use app\common\model\AudioCategory as AudioCategoryModel;
use think\Request;

class Search extends BaseController
{
    /* 搜索音频 专辑 */
    public function index(Request $request)
    {
        $search = $request->post('content');
        $audios = AudioModel::scope('title', $search)->paginate(10)->each(function ($audio) {
            $audio->category = AudioCategoryModel::get($audio->cid)->title;
        });
        $albums = AlbumModel::scope('title', $search)->paginate(5);
        return $this->successJson(compact('audios', 'albums'));
    }

//    public function albums(Request $request)
//    {
//        $search = $request->post('content');
//        $albums = AlbumModel::scope('title', $search)->paginate();
//        return $this->successJson(compact('albums'));
//    }
}