<?php

namespace app\admin\controller;

use app\common\model\Album as AlbumModel;
use app\common\model\Audio as AudioModel;
use app\common\model\AudioCategory as AudioCategoryModel;
use think\Request;

/**
 * 音频管理管理
 */
class Audio extends AdminBase
{
    protected function _initialize()
    {
        parent::_initialize();

        $this->assign("vipList", AlbumModel::$vipList);
        $this->assign("statusList", AlbumModel::$statusList);
        $this->assign('category', AudioCategoryModel::getList());
        $this->assign('search_types', AudioModel::TYPE_OF_SEARCH);
    }

    /**
     * 音频管理
     */
    public function index()
    {
        $this->assign("list", AudioModel::getList());

        return $this->fetch();
    }

    /**
     * 添加音频
     * @return mixed
     */
    public function add()
    {
        if ($post = request()->post()) {
            $result = AudioModel::addAudio($post);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        return $this->fetch("save");
    }

    /**
     * 编辑音频
     */
    public function edit($id = null)
    {
        if ($post = request()->post()) {
            $result = AudioModel::editAudio($post);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }

        $this->assign("detail", AudioModel::detailAudio($id));
        return $this->fetch("save");
    }

    public function del($id = null)
    {
        if (request()->isAjax()) {
            $result = AudioModel::deleteAudio($id);

            if ($result["status"]) {
                return $this->success($result["msg"]);
            }

            return $this->error($result["msg"]);
        }
    }

    /* 音频检索 */
    public function search(Request $request)
    {
        $searchType = $request->param('searchType', '');
        $searchKey = $request->param('searchKey', AudioModel::SEARCH_TITLE);
        $where = [];
        switch ($searchType) {
            case AudioModel::SEARCH_TITLE:
                $where['title'] = ['like', "%{$searchKey}%"];
                break;
        }
        $list = AudioModel::where($where)->paginate(15, false, array_merge($request->param(), ['searchType' => $searchType, 'searchKey' => $searchKey]))
            ->appends(['searchType' => $searchType, 'searchKey' => $searchKey]);
        return view('index', compact('list', 'searchType', 'searchKey'));
    }
}
