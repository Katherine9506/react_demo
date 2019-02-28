<?php
namespace app\admin\controller;

use app\common\model\System as SystemModel;

/**
 * 系统配置
 * Class System
 * @package app\admin\controller
 */
class System extends AdminBase
{
    public function _initialize()
    {
        parent::_initialize();
    }

    /**
     * 站点配置
     */
    public function siteConfig()
    {
        $items = SystemModel::getSystem();
        return $this->fetch('site_config', ["items" => $items]);
    }

    /**
     * 更新配置
     */
    public function updateSiteConfig()
    {
        if($post = $this->request->post())
        {
            $result = SystemModel::editSystem($post);

            if($result["status"])
            {
                $this->success($result["info"]);
            }
        }
    }

    /**
     * 清除缓存
     */
    public function clear()
    {
        if (delete_dir_file(CACHE_PATH) || delete_dir_file(TEMP_PATH))
        {
            $this->success('清除缓存成功');
        }
        else
        {
            $this->error('清除缓存失败');
        }
    }
}