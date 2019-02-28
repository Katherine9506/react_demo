<?php
namespace app\admin\controller;

use app\common\model\AudioAlbum as AlbumModel;

/**
 * 音频专辑管理
 * Class Album
 */
class AudioAlbum extends AdminBase
{
    /**
     * 音频专辑管理
     */
    public function index()
    {
        $this->assign("list", AlbumModel::getList());
        return $this->fetch();
    }

    /**
     * 添加音频专辑
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post())
        {
            $result = AlbumModel::addAlbum($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑音频专辑
     */
    public function edit($id = null)
    {
        if ($post = request()->post())
        {
            $result = AlbumModel::editAlbum($post);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", AlbumModel::detailAlbum($id));
        return $this->fetch("save");
    }

    public function del($id = null)
    {
        if (request()->isAjax())
        {
            $result = AlbumModel::deleteAlbum($id);

            if ($result["status"])
            {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }
}
