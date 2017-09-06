<?php

class localizatorLanguageRemoveProcessor extends modObjectProcessor
{
    public $objectType = 'localizatorLanguage';
    public $classKey = 'localizatorLanguage';
    public $languageTopics = array('localizator');
    //public $permission = 'remove';


    /**
     * @return array|string
     */
    public function process()
    {
        if (!$this->checkPermissions()) {
            return $this->failure($this->modx->lexicon('access_denied'));
        }

        $ids = $this->modx->fromJSON($this->getProperty('ids'));
        if (empty($ids)) {
            return $this->failure($this->modx->lexicon('localizator_item_err_ns'));
        }

        foreach ($ids as $id) {
            /** @var localizatorLanguage $object */
            if (!$object = $this->modx->getObject($this->classKey, $id)) {
                return $this->failure($this->modx->lexicon('localizator_item_err_nf'));
            }

            $object->remove();
        }

        return $this->success();
    }

}

return 'localizatorLanguageRemoveProcessor';