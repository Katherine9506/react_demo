<?php

namespace app\api\controller;

use app\common\model\Audio as AudioModel;
use app\common\model\AudioCategory as AudioCategoryModel;

class AudioCategory extends BaseController
{
    /* 音频类别 */
    public function getAll()
    {
        $categories = AudioCategoryModel::getCategory();
        return $this->successJson($categories);
    }

    /* 音频列表 */
    public function audios($category_id)
    {
        if ($category_id) {
            $audios = AudioCategoryModel::get($category_id)->audios()->paginate(15, false, request()->param());
        } else {
            $audios = AudioModel::order('sort', 'desc')->paginate(15, false, request()->param());
        }
        return $this->successJson($audios);
    }
}