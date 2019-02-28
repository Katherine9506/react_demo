<?php

namespace app\common\model;

use think\Model;

/**
 * 系统配置
 * Class System
 * @package app\common\model
 */
class System extends Model
{
    /**
     * 读取配置
     * @return array
     */
    public static function getSystem()
    {
        $model = new self();
        $where = ["status" => 1];
        $order = ["sort" => "DESC"];

        $items = $model->field("title,name,value,type,rule,classify,extra")->where($where)->order($order)->select();
        $data  = [];

        //配置分组
        foreach($items as $item)
        {
            $data[$item['classify']][] = $item->getData();
        }

        return $data;
    }

    /**
     * 编辑配置
     * @param array $data 编辑数据
     */
    public static function editSystem($data)
    {
        $model = new self();

        $keys = implode("','", array_keys($data));
        $when = "";

        foreach($data as $key => $value)
        {
            $when .= "WHEN '{$key}' THEN '{$value}' ";
        }

        $when .= "END";
        $prefix = config("database")["prefix"];
        $sql   = "UPDATE `{$prefix}system` SET `value`=CASE `name` {$when} WHERE `name` IN ('{$keys}')";

        $rows = $model->execute($sql);

        //清除缓存
        cache("cache_key_system", null);
        
        return ['status' => 1, 'info' => '操作成功'];
    }

    /**
     * 获取配置数据
     * @return array
     */
    public static function getValue()
    {
        $model = new self();
        $where = ["status" => 1];
        $field = "name,value";

        return $model->cache("cache_key_system")
            ->field($field)
            ->where($where)
            ->column("value", "name");
    }
}
