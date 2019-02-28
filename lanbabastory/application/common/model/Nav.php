<?php
namespace app\common\model;

use think\Model;

class Nav extends Model
{
	// 获取导航
    // type 0- 头部导航,1 - 底部导航
	public static function getNav($type)
	{
		$model = new self();

		$list = $model->field("name,link,target,type")
            ->cache("cache_nav")
		    ->where("status", 1)
            ->order("sort", "DESC")
            ->select();

		$data = [];

		foreach ($list as $row) {
            $data[$row["type"]][] = $row;
        }

        return $data[$type];
	}
}