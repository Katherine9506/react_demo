<?php

namespace app\console;

use app\api\logic\OrderRedis;
use app\common\model\Order;
use app\common\model\Redis as MyRedis;
use app\common\model\User;
use think\console\Command;
use think\console\Input;
use think\console\Output;
use think\Db;

/**
 * Class OrderCancel
 * @desc 命令-取消订单
 * @package app\console\command
 */
class OrderCancel extends Command
{
    protected function configure()
    {
        $this->setName('order:cancel')->setDescription('Dispose expired order, change status to STATUS_CANCELED.');
    }

    //执行方法
    protected function execute(Input $input, Output $output)
    {
        /**
         * 1.获取所有orders
         * 2.判断所有order是否过期
         * 3.过期订单，改变订单状态，返还用户支付金额至账户余额
         * 4.非过期订单，略过
         *
         * /**
         * 1.订单未支付 1分钟
         * 2.订单已支付未接单 3分钟
         * 3.订单已支付且已接单 10分钟
         */
        $orders = OrderRedis::getOrders();
        foreach ($orders as $order => $user) {
            $create_time = MyRedis::hGet($user, $order);
            $orderModel = Order::get(explode(':', $order)[1]);
            $timeDiff = time() - $create_time;
            if ($timeDiff > 1 * 60) {
                if ($orderModel->status == Order::STATUS_UNPAID) {
                    $orderModel->save(['status' => Order::STATUS_CANCLED_UNPAID]);
                    $this->deleteCancleableOrder($user, $order);
                }
            }
            if ($timeDiff > 3 * 60) {
                if ($orderModel->status == Order::STATUS_UNTAKE) {
                    Db::startTrans();
                    try {
                        $orderModel->save(['status' => Order::STATUS_CANCLED_PAID]);
                        $user = User::get($orderModel->boss_uid);
                        $user->save(['balance' => ($user->balance + $orderModel->pay_total)]);
                        Db::commit();
                        $this->deleteCancleableOrder($user, $order);
                    } catch (\Exception $e) {
                        Db::rollback();
                    }
                }
            }
            if ($timeDiff > 10 * 60) {
                $this->deleteCancleableOrder($user, $order);
            }
        }
    }

    //删除可取消订单缓存键
    private function deleteCancleableOrder($user, $order)
    {
        MyRedis::hDel('orders:', $order);
        MyRedis::hDel($user, $order);
    }
}