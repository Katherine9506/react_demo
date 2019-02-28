<?php

namespace app\admin\controller;

use app\common\model\Album as AlbumModel;
use app\common\model\AlbumTag as AlbumTagModel;
use app\common\model\AlbumTags as AlbumTagsModel;
use app\common\model\AlbumCategory as AlbumCategoryModel;
use app\common\model\Audio as AudioModel;

/**
 * 专辑管理
 */
class Album extends AdminBase
{
    protected function _initialize()
    {
        parent::_initialize();

        $this->assign("vipList", AlbumModel::$vipList);
        $this->assign("statusList", AlbumModel::$statusList);
        $this->assign("category", AlbumCategoryModel::getCategory());
    }

    /**
     * 专辑分类管理
     */
    public function index()
    {
        $this->assign("list", AlbumModel::getList());
        return $this->fetch();
    }

    /**
     * 添加专辑分类--绑定音频
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post()) {
            $result = AlbumModel::addAlbum($post);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("tags", AlbumTagsModel::getTags());
        return $this->fetch("save");
    }

    /**
     * 编辑专辑分类
     */
    public function edit($id = null)
    {
        if ($post = request()->post()) {
            $result = AlbumModel::editAlbum($post);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $detail = AlbumModel::detailAlbum($id);

        if ($detail) {
            $this->assign("category", AlbumCategoryModel::getCategory());
            $this->assign("tags", AlbumTagsModel::getTags());
            $this->assign("selected_tags", AlbumTagModel::getTags($id));
            $this->assign("detail", $detail);

            return $this->fetch("save");
        }
    }

    public function del($id = null)
    {
        if (request()->isAjax()) {
            $result = AlbumModel::deleteAlbum($id);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }

    public function audios($id = null)
    {
        if ($post = request()->post()) {
            $album = AlbumModel::get($post['id']);
            $audio_id = (int)$post['audio_id'];
            $status = (boolean)$post['status'];
            if ($status) {
                if ($album->hasAudio($audio_id)) {
                    $result = ['status' => 0, 'msg' => '已存在'];
                } else {
                    $result = $album->addAudio($audio_id);
                }
            } else {
                $result = $album->deleteAudio($audio_id);
            }
            if ($result['status']) {
                return $this->success($result['msg']);
            }
            return $this->error($result['msg']);
        }
        $detail = AlbumModel::detailAlbum($id);
        if ($detail->is_vip) {
            $audios = AudioModel::scope('charge')->paginate(15, false, request()->param());
        } else {
            $audios = AudioModel::scope('free')->paginate(15, false, request()->param());
        }
        $selected_audios = $detail->audios;
        $selected_audio_ids = [];
        foreach ($selected_audios as $audio) {
            $selected_audio_ids[] = $audio->id;
        }

        return $this->fetch('audios', compact('detail', 'audios', 'selected_audio_ids'));
    }
}
