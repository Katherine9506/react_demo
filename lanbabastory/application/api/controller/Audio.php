<?php

namespace app\api\controller;

use app\common\model\Audio as AudioModel;

class Audio extends BaseController
{
    /* 排行榜 */
    public function ranking()
    {

    }

    /* 音频详情 */
    public function show($audio_id)
    {
        $audio = AudioModel::get($audio_id);
        return $this->successJson($audio);
    }
}