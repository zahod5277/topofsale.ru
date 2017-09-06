<?php
if (isset($key)&&(isset($resource_id))) {
    $where = [
        'resource_id' => $resource_id,
        'key' => $key
    ];
    $localizatorField = $modx->getObject('localizatorContent', $where);
    if (!is_null($localizatorField)){
    if (!isset($field)){
        $field = 'pagetitle';
    }    
    $output = $localizatorField->get('pagetitle');
    } else {
        $output = 'Для этого ресура нет перевода. Скажите там кому-нибудь, пусть добавят.';
    }
    return $output;
} else {
    return 'eee';
}