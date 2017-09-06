<?php
$xpdo_meta_map['CRlist']= array (
  'package' => 'currencyrate',
  'version' => '1.1',
  'table' => 'currency_rate_list',
  'extends' => 'xPDOSimpleObject',
  'fields' => 
  array (
    'numcode' => 0,
    'charcode' => '',
    'nominal' => 0,
    'name' => '',
    'value' => 0,
    'rate' => '0',
    'valuerate' => 0,
    'active' => 0,
    'rank' => 0,
  ),
  'fieldMeta' => 
  array (
    'numcode' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'charcode' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '3',
      'phptype' => 'varchar',
      'null' => true,
      'default' => '',
    ),
    'nominal' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'name' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'varchar',
      'null' => true,
      'default' => '',
    ),
    'value' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '12,4',
      'phptype' => 'float',
      'null' => true,
      'default' => 0,
    ),
    'rate' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '100',
      'phptype' => 'varchar',
      'null' => true,
      'default' => '0',
    ),
    'valuerate' => 
    array (
      'dbtype' => 'decimal',
      'precision' => '12,4',
      'phptype' => 'float',
      'null' => true,
      'default' => 0,
    ),
    'active' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'null' => true,
      'default' => 0,
    ),
    'rank' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => true,
      'default' => 0,
    ),
  ),
  'indexes' => 
  array (
    'numcode' => 
    array (
      'alias' => 'numcode',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'numcode' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'charcode' => 
    array (
      'alias' => 'charcode',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'charcode' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'nominal' => 
    array (
      'alias' => 'nominal',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'nominal' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'name' => 
    array (
      'alias' => 'name',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'name' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'value' => 
    array (
      'alias' => 'value',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'value' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'rate' => 
    array (
      'alias' => 'rate',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'rate' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'valuerate' => 
    array (
      'alias' => 'valuerate',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'valuerate' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'active' => 
    array (
      'alias' => 'active',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'active' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
);
