<?php

return array(
    'fields' => array(
        'complect' => NULL,
        'body_material' => NULL,
        'body_diameter' => NULL,
        'clockwork' => NULL,
        'sex' => NULL,
        'strap_type' => NULL,
        'strap_color' => NULL,
        'dial_color' => NULL,
        'stat' => NULL,
        'forma' => NULL,
        'complication' => NULL,
        'functions' => NULL,
        'water_resist' => NULL,
        'glass' => NULL,
        'calibr' => NULL,
        'power_reserve' => NULL,
        'limited' => NULL,
        'year' => NULL,
        'bezel' => NULL,
        'body_comment' => NULL,
        'strap_comment' => NULL,
        'backcap' => NULL,
        'jewerl_count' => NULL
    ),
    'fieldMeta' => array(
        'complect' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'body_material' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'body_diameter' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'clockwork' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'sex' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'strap_type' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'strap_color' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'dial_color' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'stat' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'forma' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'complication' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'json'
            , 'null' => true
            , 'default' => NULL
        ),
        'functions' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'json'
            , 'null' => true
            , 'default' => NULL
        ),
        'water_resist' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'glass' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'calibr' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'power_reserve' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'limited' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'year' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'bezel' => array(
            'dbtype' => 'text'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'body_comment' => array(
            'dbtype' => 'text'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'strap_comment' => array(
            'dbtype' => 'text'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'backcap' => array(
            'dbtype' => 'varchar'
            , 'precision' => '255'
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        ),
        'jewerl_count' => array(
              'dbtype' => 'varchar'
            , 'precision' => 255
            , 'phptype' => 'string'
            , 'null' => true
            , 'default' => NULL
        )
    ),
    'indexes' => array(
        'complect' => array(
            'alias' => 'complect'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'complect' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'body_material' => array(
            'alias' => 'body_material'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'body_material' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'body_diameter' => array(
            'alias' => 'body_diameter'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'body_diameter' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'clockwork' => array(
            'alias' => 'clockwork'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'clockwork' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'sex' => array(
            'alias' => 'sex'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'sex' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'strap_type' => array(
            'alias' => 'strap_type'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'strap_type' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'strap_color' => array(
            'alias' => 'strap_color'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'strap_color' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'dial_color' => array(
            'alias' => 'dial_color'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'dial_color' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'stat' => array(
            'alias' => 'stat'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'stat' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'forma' => array(
            'alias' => 'forma'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'forma' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'complication' => array(
            'alias' => 'complication'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'complication' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'functions' => array(
            'alias' => 'functions'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'functions' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'water_resist' => array(
            'alias' => 'water_resist'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'water_resist' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'glass' => array(
            'alias' => 'glass'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'glass' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'calibr' => array(
            'alias' => 'calibr'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'calibr' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'power_reserve' => array(
            'alias' => 'power_reserve'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'power_reserve' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'limited' => array(
            'alias' => 'limited'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'limited' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'year' => array(
            'alias' => 'year'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'bezel' => array(
            'alias' => 'bezel'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'body_comment' => array(
            'alias' => 'body_comment'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'strap_comment' => array(
            'alias' => 'strap_comment'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'backcap' => array(
            'alias' => 'backcap'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        ),
        'jewerl_count' => array(
            'alias' => 'jewerl_count'
            , 'primary' => false
            , 'unique' => false
            , 'type' => 'BTREE'
            , 'columns' => array(
                'year' => array(
                    'length' => ''
                    , 'collation' => 'A'
                    , 'null' => false
                )
            )
        )
    )
);
