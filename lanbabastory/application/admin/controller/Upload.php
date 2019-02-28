<?php

namespace app\admin\controller;

use think\Controller;

include_once(EXTEND_PATH . DS . 'getID3' . DS . 'getid3' . DS . 'getid3.php');

/**
 * 上传控制器
 */
class Upload extends Controller
{
    //上传图片
    public function image()
    {
        if ($file = request()->file(array_keys($_FILES)[0])) {
            if ($info = $file->move(ROOT_PATH . "public/uploads")) {
                $file = "/uploads/" . date("Ymd") . '/' . $info->getFilename();

                if ($fn = request()->get("CKEditorFuncNum")) {
                    //CKEditor图片回显
                    return "<script>window.parent.CKEDITOR.tools.callFunction({$fn}, '{$file}', '');</script>";
                }

                //layui 上传回调
                return json(["code" => 0, "msg" => "上传图片成功", "data" => ["src" => $file]]);
            }
        }
    }

    //上传音频
    public function audio()
    {
        if ($file = request()->file(array_keys($_FILES)[0])) {
            $filesize = number_format($file->getSize() / 1024, 2, '.', '');
            if ($info = $file->move(ROOT_PATH . "public/uploads")) {

                $file = "/uploads/" . date("Ymd") . '/' . $info->getFilename();

                $getID3 = new \getID3();
                $fileInfo = $getID3->analyze(ROOT_PATH . 'public/' . $file);
                $playtime = $fileInfo['playtime_string'];
                $playSeconds = round($fileInfo['playtime_seconds']);

                return json(["code" => 0, "msg" => "上传音频成功", "data" => ["src" => $file, 'playtime' => $playtime, 'filesize' => $filesize, 'playSeconds' => $playSeconds]]);
            }
        }
    }
}
