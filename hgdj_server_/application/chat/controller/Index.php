<?php

namespace app\chat\controller;

use app\chat\service\ChatStart;

class Index extends \think\Controller
{
    public function index()
    {
        if (request()->isCli()) {
            (new ChatStart())->index();
        }
    }
}