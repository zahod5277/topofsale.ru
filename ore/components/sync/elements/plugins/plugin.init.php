<?php

switch ($modx->event->name) {

    case 'OnMODXInit':
        $modx->loadClass('modResource');

        $modx->map['modResource']['fields']['sync_id'] = '';
        $modx->map['modResource']['fieldMeta']['sync_id'] = array(
            'dbtype'    => 'varchar',
            'precision' => 255,
            'phptype'   => 'string',
            'null'      => false,
            'default'   => '',
        );
        $modx->map['modResource']['indexes']['sync_id'] = array(
            'alias'   => 'sync_id',
            'primary' => false,
            'unique'  => false,
            'type'    => 'BTREE',
            'columns' => array(
                'sync_id' => array(
                    'length'    => '',
                    'collation' => 'A',
                    'null'      => false,
                    'default'   => '',
                )
            )
        );

        $modx->map['modResource']['fields']['sync_service'] = '';
        $modx->map['modResource']['fieldMeta']['sync_service'] = array(
            'dbtype'    => 'varchar',
            'precision' => 50,
            'phptype'   => 'string',
            'null'      => false,
            'default'   => '',
        );
        $modx->map['modResource']['indexes']['sync_service'] = array(
            'alias'   => 'sync_service',
            'primary' => false,
            'unique'  => false,
            'type'    => 'BTREE',
            'columns' => array(
                'sync_service' => array(
                    'length'    => '',
                    'collation' => 'A',
                    'null'      => false,
                    'default'   => '',
                )
            )
        );

        $modx->map['modResource']['fields']['sync_data'] = null;
        $modx->map['modResource']['fieldMeta']['sync_data'] = array(
            'dbtype'  => 'text',
            'phptype' => 'array',
            'null'    => true,
        );

        /* add syncEventObject */
        $modx->map['syncEventObject'] = array(
            'table'  => '',
            'fields' => array()
        );

        if (!class_exists('syncEventObject')) {
            class syncEventObject extends xPDOObject
            {
            }

            class syncEventObject_mysql extends syncEventObject
            {
            }
        }


        break;
}
