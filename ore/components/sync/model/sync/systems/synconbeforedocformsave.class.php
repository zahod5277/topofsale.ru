<?php

class syncOnBeforeDocFormSave extends syncPlugin
{
    public function run()
    {
        /** @var xPDOObject $object */
        if (!$resource = $this->modx->getOption('resource', $this->scriptProperties)) {
            return;
        }

        foreach (array('sync_id', 'sync_service', 'sync_data') as $k) {
            $v = $this->modx->getOption($k, $_POST);
            if (is_null($v)) {
                continue;
            }
            $v = trim($v);

            switch ($k) {
                case 'sync_data':
                    if (!is_array($v)) {
                        $v = json_decode($v, true);
                    }
                    if (empty($v)) {
                        $v = null;
                    }
                    break;
                default:
                    break;
            }
            $resource->set($k, $v);
        }

    }
}
