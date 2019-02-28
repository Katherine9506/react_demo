<?php

namespace app\api\controller;

use app\api\service\CaptchaService;
use app\common\model\Member as MemberModel;
use app\common\model\Order as OrderModel;
use app\common\model\Sign as SignModel;
use app\common\model\User as UserModel;
use think\Request;

class User extends BaseController
{
    public function _initialize()
    {
        parent::_initialize();
        Request::instance()->bind('user', UserModel::get($this->request->param('uuid')));
    }

    /* 用户详情 */
    public function myself(UserModel $user)
    {
        return $this->successJson($user);
    }

    /* 用户的会员购买记录 */
    public function orders(UserModel $user)
    {
        $orders = $user->orders()->paginate(15, false, request()->param());
        return $this->successJson($orders);
    }

    /* 用户订单详情 */
    public function order(Request $request)
    {
        $order_id = $request->get('order_id', null);
        if ($order_id) {
            $order = OrderModel::get($order_id);
            return $this->successJson(['status' => true, 'order' => $order]);
        }
        return $this->errorJson(['status' => false, 'msg' => '缺少order_id请求参数']);
    }

    /* 用户签到记录 */
    public function signs(UserModel $user)
    {
        $signs = $user->signs()->paginate(15, false, request()->param());
        return $this->successJson($signs);
    }

    /* 检查用户是否非连续签到 可添加支付补签机制 */
    public function checkSign(UserModel $user)
    {
        $lastSign = $user->signs()->whereTime('sign_at', 'yesterday')->select();
        if (!$lastSign) {
            /* 如果不连续，检查是否有签到记录 */
            $hasSign = $user->signs()->count();
            $status = $hasSign ? SignModel::SIGN_DISCRETE : SignModel::SIGN_NEVER;
        } else {
            $status = SignModel::SIGN_CONTINUOUS;
        }
        return $this->successJson(['status' => $status, 'msg' => SignModel::SIGNS[$status]]);
    }

    /* 用户签到操作 */
    public function sign(UserModel $user, $signStatus)
    {
        if ($user->sign_member) {
            return $this->noContent('您已享受过签到会员!');
        }

        /* 清空历史记录 */
        if ($signStatus == SignModel::SIGN_DISCRETE) {
            $user->signs()->delete();
        }

        SignModel::create(['user_id' => $user->id]);

        /* 判断是否满足签到天数 */
        $signDays = $user->signs()->count();
        if ($signDays >= SignModel::_MEMBER_SIGN_DAYS) {
            /* 更新用户会员信息和会员过期日期 */
            $expire_date = !$user->expire_date ? date('Y-m-d', strtotime('+' . SignModel::_MEMBER_SIGN_FREE_DAYS . ' day')) : date('Y-m-d', strtotime('+' . SignModel::_MEMBER_SIGN_FREE_DAYS . ' day', strtotime($user->expire_date)));
            $user->isUpdate(true)->save(['sign_member' => 1, 'is_member' => 1, 'expire_date' => $expire_date]);
            return $this->successJson(['signDays' => $signDays, 'member' => true, 'freeDays' => SignModel::_MEMBER_SIGN_FREE_DAYS, 'expire_date' => $expire_date]);
        }
        return $this->successJson(['signDays' => $signDays, 'msg' => '签到成功', 'member' => false]);
    }

    /* 获取用户连续签到天数 */
    public function freeMemberCheck(UserModel $user)
    {
        if ($user->sign_member) {
            $member = true;
            $count = SignModel::_MEMBER_SIGN_DAYS;
        } else {
            $count = $user->signs()->count();
            $member = false;
        }
        $hasSignToday = $user->signs()->whereTime('sign_at', 'd')->select() ? true : false;
        return $this->successJson(compact('member', 'count', 'hasSignToday'));
    }

    /* 会员套餐列表 */
    public function members()
    {
        $members = MemberModel::scope('active')->field('id,title,price')->order('sort', 'ASC')->select();
        foreach ($members as $key => $member) {
            $members[$key]->desc = $member->price . '元 / ' . $member->title;
        }
        return $this->successJson($members);
    }

    /* 获取短信验证码 */
    public function getCaptcha(Request $request, $phone)
    {
        if ($request->isGet()) {
            $captchaService = new CaptchaService($phone);
            $res = $captchaService->send();
            if ($res['status']) {
                return $this->successJson([], '验证码已发送');
            }
            return $this->json([], 400, $res['msg']);
        }
        return $this->json([], 400, '不合法的请求方式');
    }

    /* 用户绑定手机号 唯一 */
    public function bindPhone(UserModel $user, $phone, $captcha)
    {
        if ($user->phone) {
            return $this->successJson(false, '已绑定手机号');
        }

        if ($cacheCaptcha = CaptchaService::checkCaptchaValidation($phone)) {
            if (trim($captcha) == $cacheCaptcha) {
                $res = $user->isUpdate(true)->save(['phone' => $phone]);
                if ($res) {
                    CaptchaService::deleteUsedCaptcha($phone);
                    return $this->successJson(true, '手机绑定成功');
                }
                return $this->errorJson(false, '临时错误');
            }
            return $this->errorJson(false, '验证码错误');
        }
        return $this->errorJson(false, '验证码已失效');
    }

    /* 检查会员是否过期 */
    public function checkExpireDate(UserModel $user)
    {
        if ($user->is_member && $user->whereTime('expire_date', '<', date('Y-m-d'))->find()) {
            $res = $user->isUpdate(true)->save([
                'expire_date' => null,
                'is_member' => 0
            ]);
            if (!$res) {
                return $this->json([], 500, '检查会员是否过期时发生错误');
            }
        }
        return $this->successJson(['is_member' => $user->is_member, 'desc' => UserModel::USER_DESC[$user->is_member], 'expire_date' => $user->expire_date]);
    }
}