<?php

//MAILTO=zahod5277@mail.ru
define('MODX_API_MODE', true);
/** @noinspection PhpIncludeInspection */
require '/home/s10743/www/index.php';

// Запускает нужные службы MODX
$modx->getService('error', 'error.modError');
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget(XPDO_CLI_MODE ? 'ECHO' : 'HTML');

$corePath = $modx->getOption('sync_core_path', null, $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/sync/');
/** @var Sync $Sync */
$Sync = $modx->getService('sync');

$params = array(
    'service' => 'moysklad',
    'action' => 'mgr/mscategory/export',
    'sync_step' => 'sync_export',
);

$response = $Sync->curlExec($params);
