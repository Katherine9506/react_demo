<?php

namespace app\chat\service;

use app\common\model\Chat as ChatModel;
use app\common\model\User as UserModel;
use stdClass;
use Workerman\Connection\TcpConnection;

class Chat
{
    const CODE_ERROR = 400;
    const CODE_NORMAL = 200;

    public static function onConnect(TcpConnection $connection)
    {
    }

    /**
     * @param TcpConnection $connection
     * @param stdClass $data
     */
    public static function onMessage(TcpConnection &$connection, stdClass $data)
    {
        //给connection设置一个lastMessageTime属性，用来记录上次收到消息的时间
        $connection->lastMessageTime = time();

        if (isset($data->is_keep_live) && $data->is_keep_live) {
            return;
        }

        $worker = $connection->worker;//当前连接所属进程

        if (!isset($connection->uid)) {
            $connection->uid = $data->send_uid;
            //保存uid到connection的映射，实现针对特定uid推送数据
            $worker->uidConnections[$connection->uid] = $connection;
        }

        var_dump(count($worker->uidConnections));

        if (isset($data->is_init_connet) && $data->is_init_connet) {
            return;
        }

        $chat = new ChatModel();
        $chat->data([
            'send_uid' => $data->send_uid,
            'rec_uid' => $data->rec_uid,
            'message' => $data->message,
            'type' => $data->type,
            'create_time' => time(),
        ]);
        if ($chat->save()) {
            $chat->sendUser = UserModel::get($data->send_uid);
            $res = ['code' => self::CODE_NORMAL, 'msg' => 'Chat succeed.', 'chat' => $chat];
        } else {
            $res = ['code' => self::CODE_ERROR, 'msg' => 'Error occured.'];
        }

        self::sendMessageByUid($connection, $data->rec_uid, json_encode($res));
    }

    //针对uid推送数据
    public static function sendMessageByUid(TcpConnection $connection, $uid, $message)
    {
        $worker = $connection->worker;
        if (isset($worker->uidConnections[$uid])) {
            $connection = $worker->uidConnections[$uid];
            $connection->send($message);
        }
    }

    //广播所有用户
    public static function broadcast(TcpConnection $connection, $message, $me)
    {
        $worker = $connection->worker;
        foreach ($worker->uidConnections as $connection) {
            if ($connection->uid == $me) {
                continue;
            }
            $connection->send($message);
        }
    }

    //调用TcpConnection::close触发
    public static function onClose(TcpConnection $connection)
    {
        unset($connection->worker->uidConnections[$connection->uid]);
    }

    public static function onError()
    {

    }

}