<?php

class syncOnResourceDuplicate extends syncPlugin
{
    public function run()
    {
        /** @var modResource $resource */
        $newResource = $this->modx->getOption('newResource', $this->scriptProperties, null, true);
        $oldResource = $this->modx->getOption('oldResource', $this->scriptProperties, null, true);

        $this->Sync->clearSyncResourceData($newResource);
    }
}
