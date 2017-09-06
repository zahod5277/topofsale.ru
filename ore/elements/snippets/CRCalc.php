<?php
/** @var array $scriptProperties */
/** @var currencyrate $currencyrate */
if (!$currencyrate = $modx->getService('currencyrate', 'currencyrate', $modx->getOption('currencyrate_core_path', null,
        $modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/', $scriptProperties)
) {
    return 'Could not load currencyrate class!';
}
if (empty($input)) {
    return '';
}
$list = $currencyrate->getList();
if (!empty($multiplier)) {
    $multiplier = $list[$multiplier];
    $output = $currencyrate->formatPrice(($input * ($multiplier+0.4)), $format, $noZeros);
}
if (!empty($divider)) {
    $divider = !empty($list[$divider]) ? $list[$divider] : 1;
    $output = $currencyrate->formatPrice(($input / ($divider+0.4)), $format, $noZeros);
}
if (!empty($toPlaceholder)) {
    $modx->setPlaceholder($toPlaceholder, $output);
} else {
    return $output;
}