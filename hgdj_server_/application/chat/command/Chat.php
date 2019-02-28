<?php

namespace app\chat\command;

use \think\console\Command;
use \think\console\Input;
use \think\console\Output;

use app\chat\service\ChatStart;

class Chat extends Command
{
    /**
     * 配置指令
     */
    protected function configure()
    {
        $this->setName("start")->setDescription("Live Chat");
    }

    /**
     * 执行指令
     * @param Input $input
     * @param Output $output
     * @return null|int
     * @throws \LogicException
     * @see setCode()
     */
    protected function execute(Input $input, Output $output)
    {
        if (request()->isCli()) {
            (new ChatStart())->index();
        }

        // $output->writeln("hello   ");
    }
}