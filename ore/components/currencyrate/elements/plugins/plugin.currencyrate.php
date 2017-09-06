<?php

$currencyrate = $modx->getService('currencyrate', 'currencyrate', $modx->getOption('currencyrate_core_path', null,
        $modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/', $scriptProperties);
if (!($currencyrate instanceof currencyrate)) {
    return '';
}

$eventName = $modx->event->name;
if (method_exists($currencyrate, $eventName) && $currencyrate->active) {
    $currencyrate->$eventName($scriptProperties);
}