<?php

if (isset($input)) {
    if (!$data = $modx->cacheManager->get($input)) {
        $pdo = $modx->getService('pdoTools');
        $localizator = $modx->getService('localizator');
        if ($input == 'Б.У.') {
            $translate = 'Second Hand';
        } else {
            $translate = $localizator->translator_Yandex($input, 'ru', 'en');
        }
        $modx->cacheManager->set($input, $translate, 86400);
    } else {
        $translate = $data;
    }
    return $translate;
} else {
    return;
}