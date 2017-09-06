<?php

/**
 * Get an CRlist
 */
class modCRlistGetProcessor extends modObjectGetProcessor
{
    public $objectType = 'CRlist';
    public $classKey = 'CRlist';
    public $languageTopics = array('currencyrate');
    public $permission = '';

    /** {@inheritDoc} */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        return parent::process();
    }

}

return 'modCRlistGetProcessor';