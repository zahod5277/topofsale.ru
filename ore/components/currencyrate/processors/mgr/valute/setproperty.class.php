<?php

/**
 * SetProperty a CRlist
 */
class modCRlistSetPropertyProcessor extends modObjectUpdateProcessor
{
    /** @var CRlist $object */
    public $object;
    public $objectType = 'CRlist';
    public $classKey = 'CRlist';
    public $languageTopics = array('currencyrate');
    public $permission = '';

    /** {@inheritDoc} */
    public function beforeSet()
    {
        $fieldName = $this->getProperty('field_name', null);
        $fieldValue = $this->getProperty('field_value', null);

        $this->properties = array();

        if (!is_null($fieldName) && !is_null($fieldValue)) {
            $this->setProperty('field_name', $fieldName);
            $this->setProperty('field_value', $fieldValue);
        }

        return true;
    }

    /** {@inheritDoc} */
    public function beforeSave()
    {
        $fieldName = $this->getProperty('field_name', null);
        $fieldValue = $this->getProperty('field_value', null);
        if (!is_null($fieldName) && !is_null($fieldValue)) {
            $array = $this->object->toArray();
            if (isset($array[$fieldName])) {
                $this->object->fromArray(array(
                    $fieldName => $fieldValue,
                ));
            }
        }

        return parent::beforeSave();
    }
}

return 'modCRlistSetPropertyProcessor';