<?php

namespace app\api\controller;

use app\api\logic\OrderRedis;
use app\api\service\WxApp as WxAppService;
use app\common\model\Order as OrderModel;
use app\common\model\Redis as MyRedis;
use app\common\model\Skill;
use app\common\model\Unit;
use app\common\model\User as UserModel;
use app\common\model\Withdraw;
use think\Db;
use think\Request;
use think\Validate;

class Order extends Base
{
    protected $service_unit = [
        ['id' => 1, 'title' => '小时', 'name' => 'hour'],
        ['id' => 2, 'title' => '局', 'name' => 'game']
    ];

    public function orderPrice()
    {
        $pid = $this->request->post('pid');
        $price_detail = Db::name('skill_price')->where(['id' => $pid])->find();
        $user_info = Db::name('user')->field('thumb,name,gender,city')->where(['id' => $price_detail['uid']])->find();
        $skill_name = Db::name('skill')->where(['id' => $price_detail['sid']])->value('name');
        $unit = '';
        foreach ($this->service_unit as $key => $val) {
            if ($val['id'] == $price_detail['unit_id']) {
                $unit = $val['title'];
            }
        }
        $result['user_info'] = $user_info;
        $result['skill_name'] = $skill_name;
        $result['unit'] = $unit;
        $result['price'] = $price_detail['price'];
        return $this->show(1, 'ok', $this->setSign($result));
    }

    //添加订单
    public function orderCreate()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        $data = $this->request->post();
        $order_data = $data['data'];
        $price_detail = Db::name('skill_price')->where(['id' => $order_data['price_id']])->find();
//        unset($order_data['price_id']);

        $order_data['boss_uid'] = $uid;
        $order_data['play_uid'] = $price_detail['uid'];
        $order_data['sid'] = $price_detail['sid'];
        $order_data['unit_id'] = $price_detail['unit_id'];
        $order_data['order_no'] = makeOrderNo();
        $order_data['status'] = 1;
        $order_data['create_time'] = time();

        $order_id = Db::name('order')->insertGetId($order_data);

        /* 创建订单后，写入缓存数据 */
        OrderRedis::addNewOrder('order:' . $order_id, 'user:' . $order_data['boss_uid']);

        return $this->show(1, 'ok', $this->setSign($order_id));
    }

    //支付订单
    public function orderPay()
    {
        $order_id = $this->request->post('id/d');
        $order = Db::name('order')->field('order_no,boss_uid,id,pay_total')->where(['id' => $order_id])->find();
        $order['openid'] = Db::name('user')->where(['id' => $order['boss_uid']])->value('openid');
        $data = (new WxAppService())->pay($order);
        //重置缓存订单时间
        // OrderRedis::resetOrder('user:' . $order['boss_uid'], 'order:' . $order_id);
        return $this->show(1, '', $this->setSign($data));
    }

    //用户手动取消订单---修改订单状态
    public function cancel()
    {
        $order_id = $this->request->post('order_id/d');
        $order = OrderModel::get($order_id);
        $price = 0;

        $cancelTransaction = true;
        $message = "";

        if (MyRedis::hGet('orders:', 'order:' . $order_id)) {
            if ($order->status == OrderModel::STATUS_CANCLED_UNPAID || $order->status == OrderModel::STATUS_CANCLED_PAID) {
                $cancelTransaction = false;
                $message = "订单已取消";
            } else {
                if ($order->status == OrderModel::STATUS_UNPAID) {
                    $message = "订单取消成功";
                    $order->save(['status' => OrderModel::STATUS_CANCLED_UNPAID]);
                    $cancelTransaction = true;
                } else {
                    $message = "订单取消成功，退款中";
                    Db::startTrans();
                    $cancelTransaction = true;
                    try {
                        $order->save(['status' => OrderModel::STATUS_CANCLED_PAID]);
                        $user = UserModel::get($order->boss_uid);
                        $user->save(['balance' => ($user->balance + $order->pay_total)]);
                        Db::commit();
                        $price = $order->pay_total;
                    } catch (\Exception $e) {
                        $cancelTransaction = false;
                        $message = '订单取消失败';
                        Db::rollback();
                    }
                }
            }
            /* 手动取消成功后，清理缓存 */
            if ($cancelTransaction) {
                OrderRedis::deleteOrder('order:' . $order_id, 'user:' . $order->boss_uid);
            }
        } else {
            /* 无缓存，两种可能：1.订单接单后十分钟内用户无手动取消操作 2.订单被自动取消 3.订单手动取消 */
            if ($order->status != OrderModel::STATUS_CANCLED_UNPAID && $order->status != OrderModel::STATUS_CANCLED_PAID) {
                $message = "陪玩师接单已超过十分钟，不可取消订单";
            } else {
                $message = "订单已自动取消";
            }
            $cancelTransaction = false;
        }

        if ($cancelTransaction) {
            return self::show(1, $message, ['status' => $order->status, 'price' => $price]);
        } else {
            return self::show(0, $message, ['status' => $order->status, 'price' => $price]);
        }
    }

    //用户中心订单列表
    public function orderList()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        $limit = isset($this->param['rows']) ? $this->param['rows'] : 10;
        $page = isset($this->param['page']) ? $this->param['page'] : 1;
        if ($this->request->has('type')) {
            $type = $this->request->param('type');
        }

        $query = model('common/Order');
        if (isset($type) && in_array($type, ['play', 'boss'])) {
            $query->where("{$type}_uid", $uid);
        } else {
            $query->where('boss_uid|play_uid', '=', $uid);
        }

        $data = $query->order('create_time desc')
            ->paginate($limit, false, ['query' => $this->param, 'page' => $page])
            ->each(function ($item, $key) {
                $unit_title = Db::name('unit')->where('id', $item->unit_id)->value('title');
                $item->label = Db::name('skill')->where(['id' => $item->sid])->value('name') . ' ' . $item->count . '*' . $unit_title;
                $item->player = Db::name('user')->field('name,openid,thumb')->where(['id' => $item->play_uid])->find();
                $item->boss = Db::name('user')->field('name,openid,thumb')->where(['id' => $item->boss_uid])->find();
//                $item->cancelable = MyRedis::hGet('orders:', 'order:' . $item->id) ? true : false;
                $item->cancelable = MyRedis::hGet('user:' . $item->boss_uid, 'order:' . $item->id) ? true : false;
            });

        return $this->show(1, '', $this->setSign($data));
    }

    /**
     * 用户可提现订单表
     * @return int
     * @throws \think\Exception
     * @throws \think\exception\PDOException
     */
    public function playList()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

//        $orders = Db::name('order')->field('id,boss_uid,total_price,sid')
//            ->where(['play_uid' => $uid, 'withdrawable' => 0])
//            ->whereIn('status', [OrderModel::STATUS_UNCOMMENT, OrderModel::STATUS_COMMENTED])->select();
        $orders = Db::name('order')->field('id,boss_uid,total_price,sid')
            ->where(function ($query) use ($uid) {
                $query->where(['play_uid' => $uid, 'withdrawable' => 0])
                    ->whereIn('status', [OrderModel::STATUS_UNCOMMENT, OrderModel::STATUS_COMMENTED]);
            })
            ->whereOr(function ($query) use ($uid) {
                $query->where(['boss_uid' => $uid, 'withdrawable' => 0])
                    ->where('status', OrderModel::STATUS_CANCLED_PAID);
            })
            ->select();
        foreach ($orders as $key => $order) {
            $orders[$key]['boss_uname'] = model('common/User')->find($order['boss_uid'])->name;
            $orders[$key]['service'] = model('common/Skill')->find($order['sid'])->name;
        }
        return self::show(1, '', self::setSign($orders));
    }

    //订单金额提现
    public function withdraw()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $user = Db::name('user')->field('id,balance')->where(['openid' => $openid])->find();

        $params = $this->request->only(['name', 'plays', 'withdraw', 'account', 'group', 'withdrawWithInterest']);

        $validate = new Validate([
            'account' => 'require',
            'name' => 'require',
        ], [
            'account.require' => '微信企业账号需提供',
            'name.require' => '提现账户的真实姓名需正确提供'
        ]);
        if (!$validate->check($params)) {
            return self::show(0, $validate->getError());
        }
        $oids = array();
        foreach ($params['plays'] as $play) {
            $oids[] = $play['id'];
        }
        $status = [
            ['id' => 0, 'desc' => Withdraw::WITHDRAW_STATUS[0], 'timestamp' => time()]
        ];

        $data = [
            'uid' => $user['id'],
            'oids' => json_encode($oids),
            'alipay_name' => $params['name'],
            'alipay_account' => $params['account'],
            'amount' => $params['withdrawWithInterest'],
            'group' => $params['group'],
            'status' => json_encode($status),
            'final' => Withdraw::STATUS_COMMIT,
            'balance' => $user['balance'] - $params['withdraw'],
        ];
        $withdraw = model('common/Withdraw')->insertGetId($data);
        if ($withdraw) {
            \app\common\model\User::find($user['id'])->data(['balance' => $user['balance'] - $params['withdraw']])->save();
            Db::name('order')->whereIn('id', $oids)->update(['withdrawable' => $withdraw]);
        }

        //更新订单已提现
        return self::show(1, "已提现，正在处理中...");
    }

    //确认订单
    public function orderConfirm()
    {
        $order_id = $this->request->post('id/d');
        $res = Db::name('order')->where(['id' => $order_id])->update(['status' => 6]);

        if ($res) {
            return $this->show(1, '', $this->setSign('ok'));
        }
        return $this->show(0, '', $this->setSign('fail'));
    }

    //更改订单状态
    public function orderStatusChange()
    {
        $params = $this->request->only('id,status');
        $order = model('common/Order')->find($params['id']);

        if ($order->status == OrderModel::STATUS_CANCLED_UNPAID || $order->status == OrderModel::STATUS_CANCLED_PAID) {
            if (MyRedis::hGet('orders:', 'order:' . $order->id)) {
                MyRedis::hDel('orders:', 'order:' . $order->id);
                MyRedis::hDel('user:' . $order->boss_uid, 'order:' . $order->id);
            }
            return self::show(0, '订单已自动取消');
        }

        /* 用户确认订单完成，删除缓存可取消订单 */
        if ($params['status'] == OrderModel::STATUS_UNCOMMENT) {
            MyRedis::hDel('orders:', 'order:' . $order->id);
            MyRedis::hDel('user:' . $order->boss_uid, 'order:' . $order->id);
        }

        /* 陪玩师接单，重置缓存订单时间 */
        if ($params['status'] == OrderModel::STATUS_UNSTART) {
            OrderRedis::resetOrder('user:' . $order->boss_uid, 'order:' . $order->id);
        }

        if ($order->status == $params['status']) {
            return self::show(0, '勿重复操作');
        }

        $res = $order->allowField(['status'])->save($params);
        if ($res) {
            //Todo: 用户最终确认订单时更新用户可提现余额：table：user field：balance
            if ($order->status == OrderModel::STATUS_UNCOMMENT) {
                $player = model('common/User')->find($order->play_uid);
                $player->save(['balance' => $player->balance + $order->total_price]);
            }
            return $this->show(1, '已确认完成', $this->setSign('ok'));
        }
        return $this->show(0, '操作失败，尝试刷新并再次操作', $this->setSign('fail'));
    }

    //陪玩师--提交验收
    public function acceptanceCheck()
    {
        $params = $this->request->only('id,status,figure_imgs');

        $order = model('common/Order')->find($params['id']);
        if ($order->status >= 5) {
            return self::show(1, '已提交过验收，请勿重复提交!');
        }
        $res = $order->allowField(['status', 'figure_imgs'])->save($params, ['id' => $params['id']]);
        if ($res) {
            return $this->show(1, '验收请求已确认', $this->setSign('ok'));
        } else {
            return $this->show(0, '验收请求发送失败，尝试刷新并重新提交验收!', $this->setSign('fail'));
        }
    }

    //订单详情信息
    public function orderDetail()
    {
        $order_id = $this->request->post('id/d');
        $order = OrderModel::get($order_id);
        $order->boss = UserModel::get($order->boss_uid);
        $order->boss = ['name' => $order->boss->name, 'thumb' => $order->boss->thumb];
        $order->player = UserModel::get($order->play_uid);
        $order->player = ['name' => $order->player->name, 'thumb' => $order->player->thumb];
        $unit_title = Unit::get($order['unit_id'])->value('title');
        $order->label = Skill::get($order['sid'])->value('name') . " " . $order['count'] . '*' . $unit_title;
        /* 查缓存，确认订单是否可取消或者仍有效 */
        $time = OrderRedis::getOrderCacheTime('order:' . $order->id, 'user:' . $order->boss_uid);
        if ($time) {
            $order->cancelable = true;
            /* 如果订单仍有缓存：1.待支付 2.待接单 */
            if ($order->status == OrderModel::STATUS_UNPAID) {
                $order->remain_time = $time + 1 * 60 - time();
            }
            if ($order->status == OrderModel::STATUS_UNTAKE) {
                $order->remain_time = $time + 3 * 60 - time();
            }
            if ($order->status > OrderModel::STATUS_UNTAKE) {
                $order->remain_time = $time + 10 * 60 - time();
            }
        } else {
            $order->cancelable = false;
        }
        if (isset($order->remain_time) && $order->remain_time <= 0) {
            $order->cancelable = false;
        }
        return $this->show(1, '', $this->setSign($order));
    }

    //订单评价提交
    public function evaluateSubmit()
    {
        $post_data = $this->request->post();
        $data = $post_data['data'];
        $data['create_time'] = time();

        $order = model('common/Order')->find($data['order_id']);
        if ($order->status == 7) {
            return self::show(1, '已评价，不可重复评价!');
        }

        $res = Db::name('evaluate')->insert($data);
        if ($res) {
            //修改订单状态
            $order->save(['status' => 7]);
            return $this->show(1, '', $this->setSign($res));
        }
        return $this->show(0, '', $this->setSign('fail'));
    }

    //明细 withdraw | change
    public function opDetails($type, $page)
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        if ($type === 'withdraw') {
            $data = model('common/Withdraw')->where('uid', $uid)->order('id', 'desc')->paginate(15, false, ['page' => $page]);
        }
        if ($type === 'change') {
            $data = model('common/Order')->where('boss_uid|play_uid', '=', $uid)->order('id', 'desc')->paginate(15, false, ['page' => $page]);
        }
        return self::show(1, '', self::setSign($data));
    }

    //最近一周订单--成功订单数和金额
    public function weekOrders()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        $weekorders = OrderModel::scope('complete', $uid)->where('create_time', '>=', time() - 6 * 24 * 60 * 60)->field('total_price')->select();
        return self::show(1, '', $weekorders);
    }

    //获取用户订单评分
    public function orderRate()
    {
        $skey = Request::instance()->header('X-WX-Skey');
        $openid = Db::name('session')->where(['skey' => $skey])->value('openid');
        $uid = Db::name('user')->where(['openid' => $openid])->value('id');

        $ratedOrders = OrderModel::scope('rated', $uid)->field('rate')->select();
        $orderCount = count($ratedOrders);
        if ($orderCount <= 0) {
            return self::show(1, '', 0);
        }
        $rates = 0;
        foreach ($ratedOrders as $order) {
            $rates += $order->rate;
        }
        return self::show(1, '', $rates / $orderCount);
    }
}
