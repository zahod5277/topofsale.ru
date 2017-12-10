<?php

class syncOnDocFormPrerender extends syncPlugin
{
    public function run()
    {
        $mode = $this->modx->getOption('mode', $this->scriptProperties, modSystemEvent::MODE_NEW, true);
        if ($mode == modSystemEvent::MODE_NEW) {
            return;
        }

        /** @var modResource $resource */
        $resource = $this->modx->getOption('resource', $this->scriptProperties, null, true);
        if (
            !$resource
            OR
            !$this->Sync->isWorkingTemplates($resource)
        ) {
            return;
        }

        $this->Sync->loadControllerJsCss($this->modx->controller, array(
            'type'            => 'resource',
            'css'             => true,
            'config'          => true,
            'tools'           => true,
            'sync'            => true,
            'resource/inject' => true,
        ));
    }
}