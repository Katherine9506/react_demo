<?php

namespace app\api\controller;

use app\common\model\Chat as ChatModel;
use app\common\model\User as UserModel;

class Chat extends BaseController
{
    /**
     * Add user chater
     */
    public function addToUserChater($user_id, $chater_id)
    {
        $user = UserModel::get($user_id);
        $chater = UserModel::get($chater_id);
        if (in_array($chater_id, $user->chaters()->column('chater_id'))) {
            return $this->noContent();
        }
        $user->chaters()->save($chater);
        $chater->chaters()->save($user);

        return $this->noContent();
    }

    /**
     * user's chat histories,with limit of terminal chat_id,handling messages need to be shown
     * @param $chat_id terminal chat_id
     */
    public function history($user_id, $chater_id, $chat_id = null)
    {
        $history = ChatModel::scope('users', $user_id, $chater_id, $chat_id)->order('id', 'desc')->paginate(20)->items();
        $history = array_reverse($history);
        foreach ($history as $chat) {
            $chat->timeShown = $this->getDateDiff(strtotime($chat->create_time), time());
            if ($chat->type == ChatModel::TYPE_AUDIO) {
                $chat->is_play = false;
            }
        }
        if (count($history) > 0) {
            return $this->succeed($history);
        }
        return $this->noContent();
    }

    /**
     * chaters with last message and un-read count
     * @param $user_id
     * @throws \think\exception\DbException
     */
    public function chaters($user_id)
    {
        $user = UserModel::get($user_id);
        if ($user) {
            $chaters = $user->chaters()->field('name,thumb')->select();
            foreach ($chaters as $chater) {
                //最后一条记录
                $last = ChatModel::scope('users', $user_id, $chater->pivot->chater_id)
                    ->order('id', 'desc')->find();
                $chater->lastMessage = $last ? $last->message : '你们已成为好友，开始聊天吧~';
                $chater->lastMsgType = $last ? $last->type : 1;
                $chater->timeShown = $last ? $this->getDateDiff(strtotime($last->create_time), time()) : $this->getDateDiff(time(), time());
                $chater->unRead = $last ? ChatModel::scope('notRead', $chater->pivot->chater_id, $user_id)->count() : 0;
            }
            return $this->succeed($chaters);
        } else {
            return $this->json([], 404);
        }
    }

    /**
     * change chat's is_read to true
     */
    public function read()
    {
        $params = $this->request->post();

        $res = ChatModel::scope('notRead', $params['chater_id'], $params['user_id'])->update(['is_read' => 1]);

        return $this->noContent();
    }

    /**
     * count unRead message
     */
    public function unRead($user_id)
    {
        $count = ChatModel::scope('notReadAll', $user_id)->count();
        return $this->succeed($count);
    }

    private function getDateDiff($start, $end)
    {
        //天数
        $timediff = $end - $start;
        $days = intval($timediff / 86400);
//        //小时数
//        $remain = $timediff % 86400;
//        $hours = intval($remain / 3600);
//        //分钟数
//        $remain = $timediff % 3600;
//        $minutes = intval($remain / 60);
//        //秒数
//        $secs = $remain % 60;
        if ($days > 365) {
            $timeShown = date("y/m/d H:i", $start);
        } else if ($days > 0) {
            $timeShown = date("m/d H:i", $start);
        } else {
            $timeShown = date("H:i", $start);
        }
        return $timeShown;
    }
}