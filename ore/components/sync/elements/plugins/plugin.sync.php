<?php

/** @var array $scriptProperties */
/** @var Sync $Sync */
$corePath = $modx->getOption('sync_core_path', null,
    $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/sync/');
if (!$Sync = $modx->getService('sync', 'Sync', $corePath . 'model/sync/',
    array('core_path' => $corePath))
) {
    return;
}

$className = 'sync' . $modx->event->name;
$modx->loadClass('syncPlugin', $Sync->getOption('modelPath') . 'sync/systems/', true,
    true);
$modx->loadClass($className, $Sync->getOption('modelPath') . 'sync/systems/', true, true);
if (class_exists($className)) {
    /** @var syncPlugin $handler */
    $handler = new $className($modx, $scriptProperties);
    $handler->run();
}
return;