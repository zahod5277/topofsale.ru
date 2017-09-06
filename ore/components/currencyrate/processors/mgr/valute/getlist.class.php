<?php

/**
 * Get a list of CRlist
 */
class modCRlistGetListProcessor extends modObjectGetListProcessor
{

    public $objectType = 'CRlist';
    public $classKey = 'CRlist';
    public $defaultSortField = 'rank';
    public $defaultSortDirection = 'ASC';
    public $languageTopics = array('default', 'currencyrate');
    public $permission = '';

    /**
     * @param xPDOQuery $c
     *
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {

        $active = $this->getProperty('active');
        if ($active != '') {
            $c->where("{$this->objectType}.active={$active}");
        }

        return $c;
    }

    /**
     * @param xPDOObject $object
     *
     * @return array
     */
    public function prepareRow(xPDOObject $object)
    {
        $array = $object->toArray();

        $icon = 'fa';
        $array['actions'] = array();

        // Edit
        $array['actions'][] = array(
            'cls'    => '',
            'icon'   => "$icon $icon-edit green",
            'title'  => $this->modx->lexicon('currencyrate_action_update'),
            'action' => 'update',
            'button' => true,
            'menu'   => true,
        );
        // sep
        $array['actions'][] = array(
            'cls'    => '',
            'icon'   => '',
            'title'  => '',
            'action' => 'sep',
            'button' => false,
            'menu'   => true,
        );
        if (!$array['active']) {
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => "$icon $icon-toggle-off red",
                'title'  => $this->modx->lexicon('currencyrate_action_active'),
                'action' => 'active',
                'button' => true,
                'menu'   => true,
            );
        } else {
            $array['actions'][] = array(
                'cls'    => '',
                'icon'   => "$icon $icon-toggle-on green",
                'title'  => $this->modx->lexicon('currencyrate_action_inactive'),
                'action' => 'inactive',
                'button' => true,
                'menu'   => true,
            );
        }
        // sep
        $array['actions'][] = array(
            'cls'    => '',
            'icon'   => '',
            'title'  => '',
            'action' => 'sep',
            'button' => false,
            'menu'   => true,
        );
        // Remove
        $array['actions'][] = array(
            'cls'    => '',
            'icon'   => "$icon $icon-trash-o red",
            'title'  => $this->modx->lexicon('currencyrate_action_remove'),
            'action' => 'remove',
            'button' => true,
            'menu'   => true,
        );

        return $array;
    }

}

return 'modCRlistGetListProcessor';