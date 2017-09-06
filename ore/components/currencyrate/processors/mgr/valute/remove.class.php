<?php

/**
 * Remove a CRlist
 */
class modCRlistRemoveProcessor extends modObjectRemoveProcessor
{
    public $classKey = 'CRlist';
    public $languageTopics = array('currencyrate');
    public $permission = '';

    /** {@inheritDoc} */
    public function initialize()
    {
        if (!$this->modx->hasPermission($this->permission)) {
            return $this->modx->lexicon('access_denied');
        }

        return parent::initialize();
    }

    /** {@inheritDoc} */
    public function beforeRemove()
    {
        return parent::beforeRemove();
    }
}

return 'modCRlistRemoveProcessor';