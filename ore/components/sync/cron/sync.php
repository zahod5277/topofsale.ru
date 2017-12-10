<?php

define('MODX_API_MODE', true);

$developmentConfig = dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))) . '/core/config/config.inc.php';
$productionConfig = dirname(dirname(dirname(dirname(__FILE__)))) . '/config/config.inc.php';

if (file_exists($developmentConfig)) {
    /** @noinspection PhpIncludeInspection */
    require_once $developmentConfig;
} else {
    /** @noinspection PhpIncludeInspection */
    //require_once $productionConfig;
}
/** @noinspection PhpIncludeInspection */
require_once MODX_BASE_PATH . 'index.php';

$modx->getService('error', 'error.modError');
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');
$modx->error->message = null;

/** @var Sync $Sync */
$Sync = $modx->getService('sync', 'Sync',
    $modx->getOption('sync_core_path', null,
        $modx->getOption('core_path') . 'components/sync/') . 'model/sync/');
$corePath = $modx->getOption('sync_core_path', null, $modx->getOption('core_path') . 'components/sync/');
$modx->lexicon->load('sync:default');

$params = array(
    'service'   => 'moysklad',
    'action'    => 'mgr/mscategory/sync',
    'sync_step' => 'sync_init',
);

$response = $Sync->curlExec($params);

//var_dump($response);



