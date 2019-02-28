<?php

namespace app\chat\service;

use Workerman\Lib\Timer;
use Workerman\Worker;

// wokerman-mysql
require_once ROOT_PATH . '/extend/mysql-master/src/Connection.php';

/**
 * Workerman 启动文件
 */
class ChatStart
{
    public function index()
    {
        // Worker日志
        Worker::$logFile = ROOT_PATH . "/workerman.log";
        //pid log file
        Worker::$pidFile = ROOT_PATH . '/workerman.pid';
        // 以守护进程方式允许
        Worker::$daemonize = true;

        //心跳间隔55秒
        define('HEARTBEAT_TIME', 55);

        $ws_wx_worker = new Worker('websocket://0.0.0.0:444');
        $ws_wx_worker->name = 'Wechat Worker';
        $ws_wx_worker->count = 1;
        $ws_wx_worker->reloadable = false;

        // 新增加一个属性，用来保存uid到connection的映射(uid是用户id或者客户端唯一标识)
        $ws_wx_worker->uidConnections = array();

        //子进程启动时触发
        $ws_wx_worker->onWorkerStart = function ($worker) {
            //给子进程添加一个定时器,保持连接活性
            Timer::add(1, function () use ($worker) {
                $time_now = time();
                foreach ($worker->connections as $connection) {
                    if (empty($connection->lastMessageTime)) {
                        $connection->lastMessageTime = $time_now;
                        continue;
                    }
                    if ($time_now - $connection->lastMessageTime > HEARTBEAT_TIME) {
                        $connection->close();
                    }
                }
            });
        };

        //客户端连接服务端时触发
        $ws_wx_worker->onConnect = function ($connection) {
            Chat::onConnect($connection);
        };

        //接受客户端消息时触发
        /**
         * @param $connection \Workerman\Connection\TcpConnection
         * @param $data
         */
        $ws_wx_worker->onMessage = function ($connection, $data) {
            $data = json_decode($data);
            Chat::onMessage($connection, $data);
        };

        // 触发错误
        $ws_wx_worker->onError = function ($connection, $code, $msg) {
            $date = date("Y-m-d H:i:s");
            echo "错误代码:{$code}, 错误信息:{$msg}, 时间:{$date}\r\n";
        };

        $ws_wx_worker->onClose = function ($connection) {
            Chat::onClose($connection);
        };

        Worker::runAll();
    }
}