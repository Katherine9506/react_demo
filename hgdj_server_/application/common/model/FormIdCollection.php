<?php
/**
 * Created by PhpStorm.
 * User: 罗阁科技
 * Date: 2018/11/26
 * Time: 15:57
 */

namespace app\common\model;


// use app\common\model\Order as OrderModel;
use app\common\model\Redis as MyRedis;

// use WxPay\WxPayConfig;

class FormIdCollection
{
    private $openid;
    private $config;
    private $cache;
    private $cacheKey;

    public function __construct($openid, $config = [])
    {
        $this->openid = $openid;
        $this->config = $config;
        // $this->cache = Cache::store('redis');   // 用redis作为缓存驱动，记得要配置redis环境奥
        $this->cacheKey = $this->getCacheKey(); // 每个openid对应一个key
    }

    /**
     * 获取缓存key
     *
     */
    public function getCacheKey()
    {
        return 'mini_program_form_id_' . $this->openid;
    }

    /**
     * 发送模板消息
     *
     * @param $data 模板消息参数
     */
    // public function send($data)
    // {
    //     $mina = Factory::miniProgram([
    //         'app_id' => $this->config['app_id'],
    //         'secret' => $this->config['secret'],
    //     ]);
    //     // 获取一个可用的formId，然后删除掉
    //     $formId = $this->get(true);

    //     if (!$formId) {
    //         throw new \Exception('no formId');
    //     } else {
    //         $data['touser'] = $this->openid;
    //         $data['form_id'] = $formId;

    //         // 用overtrue/wechat包来发送模板消息
    //         $res = $mina->template_message->send($data);
    //         return $res;
    //     }
    // }

    /**
     * 存储formId
     *
     * @param $formId
     */
    public function save($formId)
    {
        $formIds = $this->gets();
        array_push($formIds, [
            'form_id' => $formId,
            'expire' => time() + 60 * 60 * 7 * 24 // formId过期时间
        ]);
        // $formIds->push([
        //     'form_id' => $formId,
        //     'expire' => time() + 60 * 7 * 24 // formId过期时间
        // ]);
        // 存储到redis缓存中
        // $this->cache->forever($this->cacheKey, $formIds->toArray());
        MyRedis::set($this->cacheKey, $formIds);
    }

    /**
     * 获取某个未过期的formId
     *
     * @param $delete 获取之后是否立即删除
     */
    public function get($delete = false)
    {
        $formIds = $this->gets();

        if (!count($formIds)) {
            // MyRedis::clear($this->cacheKey);
            return false;
        }
        // 筛选一个有效的formId，优先获取快过期的
        array_multisort(array_column($formIds, 'expire'), SORT_ASC, $formIds);
        $formId = '';
        foreach ($formIds as $key => $val) {
            if ($val['expire'] >= time()) {
                $formId = $val['form_id'];
                if ($delete && $formId) {
                    $this->delete($formId);
                }
                break;
            }
        }

        return $formId;
    }

    /**
     * 获取formId集合
     *
     * @return \Illuminate\Support\Collection
     */
    public function gets()
    {
        // $formIds = $this->cache->get($this->cacheKey);
        $formIds = MyRedis::get($this->cacheKey);
        return is_array($formIds) ? $formIds : [];
        // return collect($formIds ? $formIds : []);
    }

    /**
     * 删除某个formId
     *
     * @param $formId
     */
    public function delete($formId)
    {
        $formIds = $this->gets();
        foreach ($formIds as $key => $val) {
            if ($val['form_id'] == $formId) {
                unset($formIds[$key]);
                break;
            }
        }
        MyRedis::set($this->cacheKey, $formIds);

        // $formIds = $formIds->filter(function($item) use($formId) {
        //     return $item['form_id'] != $formId;
        // });
        // $this->cache->forever($this->cacheKey, $formIds->toArray());
    }

    /**
     * 清理所有已过期的formId
     *
     */
    // public function clearExpireFormIds() 
    // {
    //     $formIds = $this->gets();
    //     $time = time();
    //     $formIds = $formIds->filter(function($item) use($time) {
    //         return $item['expire'] > $time;
    //     });
    //     $this->cache->forever($this->cacheKey, $formIds->toArray());
    // }
}