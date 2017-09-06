<?php

/*
 * обновление курса валют
 */

define('MODX_API_MODE', true);
require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/index.php';
$modx->getService('error', 'error.modError');
$modx->getRequest();
$modx->setLogLevel(modX::LOG_LEVEL_ERROR);
$modx->setLogTarget('FILE');
$modx->error->message = null;

$currencyrate = $modx->getService('currencyrate', 'currencyrate', $modx->getOption('currencyrate_core_path', null,
        $modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/');
if (!($currencyrate instanceof currencyrate)) {
    return '';
}

$currencyrate->rateIntoDb();