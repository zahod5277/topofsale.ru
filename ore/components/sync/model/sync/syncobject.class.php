<?php

class syncObject extends xPDOObject
{
    public function save($cacheFlag = null)
    {
        $isNew = $this->isNew();
        if ($this->xpdo instanceof modX) {
            $this->xpdo->invokeEvent('syncOnSyncObjectBeforeSave', array(
                'mode'      => $isNew ? modSystemEvent::MODE_NEW : modSystemEvent::MODE_UPD,
                'object'    => &$this,
                'cacheFlag' => $cacheFlag,
            ));
        }

        $saved = parent:: save($cacheFlag);
        if ($saved && $this->xpdo instanceof modX) {
            $this->xpdo->invokeEvent('syncOnSyncObjectSave', array(
                'mode'      => $isNew ? modSystemEvent::MODE_NEW : modSystemEvent::MODE_UPD,
                'object'    => &$this,
                'cacheFlag' => $cacheFlag,
            ));
        }

        if ($this->get('sync_error') AND $this->xpdo->getOption('sync_show_sync_log', null)) {
            $row = $this->toArray();
            $this->xpdo->log(1, print_r($row, 1), 'FILE', __CLASS__);
        }

        return $saved;
    }

}