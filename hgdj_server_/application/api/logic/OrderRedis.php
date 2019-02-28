<?php

namespace app\api\logic;

use app\common\model\Redis as MyRedis;

/**
 * 对订单缓存的存取操作
 * 订单缓存数据结构：
 * namespace: orders
 * -----order:order_id => user:user_id
 * namespace: user:user_id
 * -----order:order_id => create_time
 */
class OrderRedis
{
    /* 新增订单 */
    public static function addNewOrder($order, $user)
    {
        MyRedis::hSet('orders:', $order, $user);
        MyRedis::hSet($user, $order, time());
    }

    /* 删除可取消订单 */
    public static function deleteOrder($order, $user)
    {
        MyRedis::hDel('orders:', $order);
        MyRedis::hDel($user, $order);
    }

    /* 获取订单缓存时间 */
    public static function getOrderCacheTime($order, $user)
    {
        return MyRedis::hGet($user, $order);
    }

    /* 获取所有订单 */
    public static function getOrders()
    {
        return MyRedis::hGetAll('orders:');
    }

    /* 重置订单缓存时间 */
    public static function resetOrder($user, $order)
    {
        return MyRedis::hSet($user, $order, time());
    }

    /* 用户可取消订单 */
    public static function cancelableOrders($user)
    {
        $orders = MyRedis::hGetAll($user);
        $order_ids = [];
        foreach ($orders as $order => $time) {
            $order_ids[] = explode(':', $order)[-1];
        }
        return $order_ids;
    }
}