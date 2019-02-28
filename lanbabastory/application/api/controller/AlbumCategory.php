<?php

namespace app\api\controller;

use app\common\model\AlbumCategory as AlbumCategoryModel;

class AlbumCategory extends BaseController
{
    /* 专辑类别 */
    public function getAll()
    {
        $categories = AlbumCategoryModel::getCategory();
        return $this->successJson($categories);
    }

    /* 专辑列表 */
    public function albums($category_id)
    {
        $albums = AlbumCategoryModel::get($category_id)->albums()->paginate(15, false, request()->param());
        return $this->successJson($albums);
    }

    /* 专辑分类&专辑列表 */
    public function allWithAlbums()
    {
        $categories = AlbumCategoryModel::field('id,title')->select();
        foreach ($categories as $key => $category) {
            $categories[$key]['albums'] = $category->albums()->field('id,title,breif,thumb,is_vip,number')->limit(4)->select();
        }
        return $this->successJson($categories);
    }
}