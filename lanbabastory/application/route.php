<?php

use \think\Route;

// 埃尔首页
Route::get("/", "index/index/index");

// 数据渲染
Route::get("/data/:id", "index/index/data", [], ["id" => "\d+"]);

return 
[
    "/"     => "index/index/index",
    "/data" => "index/index/data"
];
