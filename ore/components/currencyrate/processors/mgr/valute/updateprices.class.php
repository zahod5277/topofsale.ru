<?php

/**
 * Update Prices an CRlist
 */
class modCRlistsUpdatePricesProcessor extends modProcessor
{
    public $classKey = 'CRlist';
    public $message = array();
    public $total = 0;
    protected $valutes = array(
        'price_eur' => 'EUR',
        'price_usd' => 'USD'
    );

    public function process()
    {

        return $this->success('');

        /** @var currencyrate $currencyrate */
        if (!$currencyrate = $this->modx->getService('currencyrate', 'currencyrate',
            $this->modx->getOption('currencyrate_core_path', null,
                $this->modx->getOption('core_path') . 'components/currencyrate/') . 'model/currencyrate/', array())
        ) {
            return 'Could not load currencyrate class!';
        }
        foreach ($this->valutes as $field => $valute) {
            if (!$valute = $this->modx->getObject('CRlist', array('charcode' => $valute, 'active' => 1))) {
                continue;
            }
            $valuerate = $valute->get('valuerate');
            if (empty($valuerate)) {
                continue;
            }
            $sql = "UPDATE {$this->modx->getTableName('msProductData')} SET `price` = Ceil({$field} * {$valuerate}) WHERE {$field} > 0";
            $q = $this->modx->prepare($sql);
            $q->execute();
            ++$this->total;
        }
        if ($this->total > 0) {
            $this->message[] = "Выполнено обновление для {$this->total} валют.";
            $this->modx->cacheManager->refresh();
        }

        return $this->success(implode('<br>', $this->message));
    }
}

return 'modCRlistsUpdatePricesProcessor';