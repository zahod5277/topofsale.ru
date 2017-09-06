<?php

/**
 * Create an CRlist
 */
class modCRlistCreateProcessor extends modObjectCreateProcessor
{
    public $objectType = 'CRlist';
    public $classKey = 'CRlist';
    public $languageTopics = array('currencyrate');
    public $permission = '';

    /** {@inheritDoc} */
    public function beforeSet()
    {
        $name = trim($this->getProperty('name'));
        if (empty($name)) {
            $this->modx->error->addField('name', $this->modx->lexicon('currencyrate_err_ae'));
        }

        $numcode = trim($this->getProperty('numcode'));
        if (empty($numcode)) {
            $this->modx->error->addField('numcode', $this->modx->lexicon('currencyrate_err_ae'));
        }

        $charcode = trim($this->getProperty('charcode'));
        if (empty($numcode)) {
            $this->modx->error->addField('charcode', $this->modx->lexicon('currencyrate_err_ae'));
        }

        if ($this->modx->getCount($this->classKey, array(
            'numcode' => $numcode,
        ))
        ) {
            $this->modx->error->addField('numcode', $this->modx->lexicon('currencyrate_err_ae'));
        }

        if ($this->modx->getCount($this->classKey, array(
            'charcode' => $charcode,
        ))
        ) {
            $this->modx->error->addField('charcode', $this->modx->lexicon('currencyrate_err_ae'));
        }

        return parent::beforeSet();
    }

    /** {@inheritDoc} */
    public function beforeSave()
    {

        $data = $this->modx->currencyrate->calcData($this->object->toArray());
        $data['rank'] = $this->modx->getCount($this->classKey);
        $this->object->fromArray($data);

        return parent::beforeSave();
    }

    /** {@inheritDoc} */
    public function afterSave()
    {
        $this->modx->currencyrate->cleanCache();

        return true;
    }

}

return 'modCRlistCreateProcessor';