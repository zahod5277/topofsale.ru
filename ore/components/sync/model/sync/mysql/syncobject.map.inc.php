<?php
$xpdo_meta_map['syncObject']= array (
  'package' => 'sync',
  'version' => '1.1',
  'table' => 'sync_objects',
  'extends' => 'xPDOObject',
  'fields' => 
  array (
    'sync_id' => '',
    'sync_type' => '',
    'sync_action' => '',
    'sync_service' => '',
    'sync_path' => '',
    'sync_parent' => '',
    'sync_resource' => 0,
    'sync_processed' => 0,
    'sync_error' => 0,
    'sync_data' => NULL,
    'sync_error_msg' => NULL,
    'sync_idx' => 0,
  ),
  'fieldMeta' => 
  array (
    'sync_id' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'sync_type' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '50',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'sync_action' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '50',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'sync_service' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '50',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'pk',
    ),
    'sync_path' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'index',
    ),
    'sync_parent' => 
    array (
      'dbtype' => 'varchar',
      'precision' => '255',
      'phptype' => 'string',
      'null' => false,
      'default' => '',
      'index' => 'index',
    ),
    'sync_resource' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'index',
    ),
    'sync_processed' => 
    array (
      'dbtype' => 'tinyint',
      'precision' => '1',
      'attributes' => 'unsigned',
      'phptype' => 'boolean',
      'null' => false,
      'default' => 0,
      'index' => 'index',
    ),
    'sync_error' => 
    array (
      'dbtype' => 'int',
      'precision' => '5',
      'attributes' => 'unsigned',
      'phptype' => 'integer',
      'null' => false,
      'default' => 0,
      'index' => 'index',
    ),
    'sync_data' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'array',
      'null' => true,
    ),
    'sync_error_msg' => 
    array (
      'dbtype' => 'text',
      'phptype' => 'array',
      'null' => true,
    ),
    'sync_idx' => 
    array (
      'dbtype' => 'int',
      'precision' => '10',
      'phptype' => 'integer',
      'attributes' => 'unsigned',
      'null' => false,
      'default' => 0,
      'index' => 'index',
    ),
  ),
  'indexes' => 
  array (
    'PRIMARY' => 
    array (
      'alias' => 'PRIMARY',
      'primary' => true,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_id' => 
        array (
          'length' => '100',
          'collation' => 'A',
          'null' => false,
        ),
        'sync_type' => 
        array (
          'length' => '50',
          'collation' => 'A',
          'null' => false,
        ),
        'sync_action' => 
        array (
          'length' => '50',
          'collation' => 'A',
          'null' => false,
        ),
        'sync_service' => 
        array (
          'length' => '50',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sync_path' => 
    array (
      'alias' => 'sync_path',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_path' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sync_parent' => 
    array (
      'alias' => 'sync_parent',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_parent' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sync_resource' => 
    array (
      'alias' => 'sync_resource',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_resource' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sync_processed' => 
    array (
      'alias' => 'sync_processed',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_processed' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
    'sync_idx' => 
    array (
      'alias' => 'sync_idx',
      'primary' => false,
      'unique' => false,
      'type' => 'BTREE',
      'columns' => 
      array (
        'sync_idx' => 
        array (
          'length' => '',
          'collation' => 'A',
          'null' => false,
        ),
      ),
    ),
  ),
);
