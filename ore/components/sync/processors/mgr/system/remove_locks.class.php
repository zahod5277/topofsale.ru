<?php

class modSystemRemoveLocksProcessor extends modProcessor
{
    public function checkPermissions()
    {
        return $this->modx->hasPermission('remove_locks');
    }

    public function process()
    {
        
        /** @var modRegistry $registry */
        if ($registry = $this->modx->getService('registry', 'registry.modRegistry')) {
            $registry->getRegister('sync_locks', 'registry.modDbRegister');
            $registry->sync_locks->connect();

            $registry->sync_locks->subscribe("/lock/");
            $registry->sync_locks->read(array(
                'remove_read' => true,
                'poll_limit'  => 1,
                'msg_limit'   => 1000
            ));
        }

        return $this->success();
    }
}

return 'modSystemRemoveLocksProcessor';