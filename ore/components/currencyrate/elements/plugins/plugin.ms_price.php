<?php
switch ($modx->event->name) {
    case 'msOnGetProductPrice':
        if ($modx->context->key == 'mgr') {
            return '';
        }
        $currencyrate = $modx->getService('currencyrate', 'currencyrate',
            $modx->getOption('currencyrate_core_path', null,
                $modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/', $scriptProperties);
        if (!($currencyrate instanceof currencyrate)) {
            return '';
        }
        $currency = $currencyrate->currency;
        if ($currency == $modx->getOption('currencyrate_currency')) {
            return '';
        }
        $list = $currencyrate->getList();
        if (!isset($modx->event->returnedValues['price'])) {
            $modx->event->returnedValues['price'] = $price;
        }
        $price = &$modx->event->returnedValues['price'];
        $new_price = $price / $list[$currency];
        if ($new_price !== false) {
            $price = $new_price;
        }

        break;

}