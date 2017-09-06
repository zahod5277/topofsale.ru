<?php
if (isset($input)) {
    $pdo = $modx->getService('pdoTools');
    $localizator = $modx->getService('localizator');
    if ($input == 'Б.У.'){
        $translate = 'Second Hand';
    } else {
        $translate = $localizator->translator_Yandex($input, 'ru', 'en');
    }
    return $translate;
} else {
    return;
}
