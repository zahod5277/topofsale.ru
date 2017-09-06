<?php
$pdo = $modx->getService('pdoTools');
$vendors = $modx->getCollection('msVendor');

foreach ($vendors as $vendor){
    $output .= $pdo->getChunk($tpl,[
        'vendor_name' => $vendor->get('name'),
        'vendor_id' => $vendor->get('id')
    ]);
}

return $output;


