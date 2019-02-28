<?php
namespace app\api\controller;

// use app\api\controller\Restrict;
use app\tplay\lib\TplayPro;
use \think\Db;
use think\Request;

class Upload extends TplayPro
{
    public function imageUpload()
    {
        $param = $this->request->param();

        $module = isset($param['module']) ? $param['module'] : 'images';
        $user = isset($param['user']) ? $param['user'] : 'images';
        $res = $this->upload($module, $user);

        if($res['code'] == 1)
        {
            $data['name'] = $res['name'];
            $data['path'] = $res['data'];
            $data['type'] = 1;
            $data['create_time'] = time();
            $file_id = Db::name('resource')->insertGetId($data);
            if ($file_id) 
            {
                $result['id'] = $file_id;
                $result['path'] = str_replace("\\", "/", $this->domain.$data['path']);
                return $this->show(1, '', $this->setSign($result));
            }
        }

        return $this->show(0,'ok',$this->setSign('fail'));
    }

    public function audioUpload()
    {
        $param = $this->request->param();

        $module = isset($param['module']) ? $param['module'] : 'audio';
        $user = isset($param['user']) ? $param['user'] : 'audio';
        $res = $this->upload($module, $user);

        if($res['code'] == 1)
        {
            $data['name'] = $res['name'];
            $data['path'] = $res['data'];
            $data['type'] = 2;
            $data['create_time'] = time();
            $file_id = Db::name('resource')->insertGetId($data);
            if ($file_id) 
            {
                $result['id'] = $file_id;
                $result['path'] = str_replace("\\", "/", $this->domain.$data['path']);
                return $this->show(1, '', $this->setSign($result));
            }
        }

        return $this->show(0,'ok',$this->setSign('fail'));
    }
}
