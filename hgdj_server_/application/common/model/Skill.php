<?php
// +----------------------------------------------------------------------
// | Tplay [ WE ONLY DO WHAT IS NECESSARY ]
// +----------------------------------------------------------------------
// | Copyright (c) 2018 http://tplay.pengyichen.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: yuanyuan < 38625673@qq.com >
// +----------------------------------------------------------------------

namespace app\common\model;

use think\Model;

class Skill extends Model
{
//    protected $hidden = ['create_time'];

    public function paragraphs()
    {
        return $this->hasMany('Paragraph', 'sid');
    }
}