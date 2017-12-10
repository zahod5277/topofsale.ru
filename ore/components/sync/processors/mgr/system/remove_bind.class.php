<?php

class modSystemRemoveBindProcessor extends modProcessor
{
    /** @var Sync $Sync */
    public $Sync;

    function __construct(modX & $modx, array $properties = array())
    {
        parent::__construct($modx, $properties);

        $corePath = $this->modx->getOption('sync_core_path', null,
            $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/sync/');
        if (!$this->Sync = $this->modx->getService('sync', 'Sync', $corePath . 'model/sync/',
            array('core_path' => $corePath))
        ) {
            return false;
        }
    }

    public function checkPermissions()
    {
        return $this->modx->hasPermission('remove_locks');
    }

    public function process()
    {
        $id = (int)$this->getProperty('sync_resource');
        /** @var modResource $resource */
        if ($id AND $resource = $this->modx->getObject('modResource', $id)) {
            $this->Sync->clearSyncResourceData($resource);
        }

        return $this->success();
    }
}

return 'modSystemRemoveBindProcessor';