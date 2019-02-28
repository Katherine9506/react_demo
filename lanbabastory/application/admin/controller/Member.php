<?php

namespace app\admin\controller;

use app\common\model\Member as MemberModel;
use http\Exception\BadQueryStringException;
use think\exception\ValidateException;
use think\Loader;
use think\Request;
use think\Validate;

class Member extends AdminBase
{
    /* 会员套餐列表 */
    public function index(Request $request)
    {
        $members = MemberModel::order('sort', 'ASC')->paginate(15, false, $request->param());
        return view('index', compact('members'));
    }

    public function add()
    {
        return view('detail');
    }

    public function edit(Request $request, $id)
    {
        if ($request->isPost()) {
            if (($validator = Loader::validate('Member')) && $validator->check($request->post())) {
                MemberModel::update($request->post());
                return $this->success('会员套餐修改成功');
            }
            throw  new ValidateException($validator->getError());
        }

        if ($request->isAjax()) {
            MemberModel::update(['is_active' => $request->post('is_active')]);
            return json(['msg' => '会员套餐状态切换成功']);
        }

        $member = MemberModel::get($id);
        return view('detail', compact('member'));
    }

    public function save(Request $request)
    {
        $param = $request->only(['title', 'duration', 'price', 'is_active', 'sort']);
        /** @var Validate $validator */
        $validator = Loader::validate('Member');
        if (!$validator->check($param)) {
            throw new ValidateException($validator->getError());
        }
        MemberModel::create($param);
        return $this->success('套餐添加成功');
    }

    public function delete(Request $request)
    {
        $member_id = $request->param('id', null);
        if ($member_id) {
            MemberModel::destroy($member_id);
            return $this->success('删除成功');
        }
        throw new BadQueryStringException('缺少会员套餐id参数');
    }
}