<?php
/** @var array $scriptProperties */
/** @var currencyrate $currencyrate */
if (!$currencyrate = $modx->getService('currencyrate', 'currencyrate', $modx->getOption('currencyrate_core_path', null,
        $modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/', $scriptProperties)
) {
    return 'Could not load currencyrate class!';
}
$currencyrate->initialize($modx->context->key, $scriptProperties);
if (empty($selected)) {
    $selected = '';
}
if (empty($outputSeparator)) {
    $outputSeparator = "\n";
}
if (!empty($currencyrate->currency)) {
    $selected = $currencyrate->currency;
}
$class = 'CRlist';
// Start building "Where" expression
$where = array();
if (empty($showInactive)) {
    $where[$class . '.active'] = 1;
}
// Add
$innerJoin = array();
// Fields to select
$select = array(
    $class => implode(',', array_keys($modx->getFieldMeta($class)))
);
// Add custom parameters
foreach (array('where', 'innerJoin', 'select') as $v) {
    if (!empty($scriptProperties[$v])) {
        $tmp = $modx->fromJSON($scriptProperties[$v]);
        if (is_array($tmp)) {
            $$v = array_merge($$v, $tmp);
        }
    }
    unset($scriptProperties[$v]);
}
$currencyrate->pdoTools->addTime('Conditions prepared');
$default = array(
    'class'             => $class,
    'innerJoin'         => $modx->toJSON($innerJoin),
    'where'             => $modx->toJSON($where),
    'select'            => $modx->toJSON($select),
    'groupby'           => $class . '.id',
    'sortby'            => $class . '.rank',
    'sortdir'           => 'ASC',
    'fastMode'          => false,
    'return'            => !empty($returnIds) ? 'ids' : 'data',
    'nestedChunkPrefix' => 'cr_',
    'disableConditions' => true
);
// Merge all properties and run!
$currencyrate->pdoTools->addTime('Query parameters ready');
$currencyrate->pdoTools->setConfig(array_merge($default, $scriptProperties), false);
$data = $currencyrate->pdoTools->run();
// Processing rows
$rows = array();
if (!empty($data) && is_array($data)) {
    foreach ($data as $k => $row) {
        $row['idx'] = $currencyrate->pdoTools->idx++;
        $row['selected'] = $row['charcode'] == $selected ? 'selected' : '';
        $rows[] = empty($tplRow) ? $row : $currencyrate->pdoTools->getChunk($tplRow, $row);
    }
}
$rows = implode($outputSeparator, $rows);
$output = empty($tplOuter)
    ? $currencyrate->pdoTools->getChunk('', array('rows' => $rows))
    : $currencyrate->pdoTools->getChunk($tplOuter, array_merge($scriptProperties, array('rows' => $rows)));
$currencyrate->pdoTools->addTime('Returning processed chunks');
$log = '';
if ($modx->user->hasSessionContext('mgr') && !empty($showLog)) {
    $log .= '<pre class="crLog">' . print_r($currencyrate->pdoTools->getTime(), 1) . '</pre>';
}
$output .= $log;
if (!empty($toPlaceholder)) {
    $modx->setPlaceholder($toPlaceholder, $output);
} else {
    return $output;
}