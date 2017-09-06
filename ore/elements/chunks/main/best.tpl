{$_modx->runSnippet('!msProducts',[
    'parents' => 2,
    'where' => '{"Data.favorite:=":"1"}',
    'includeThumbs' => 'list',
    'limit' => 4,
    'tplWrapper' => '@FILE:chunks/main/best.wrapper.tpl',
    'tpl' => '@FILE:chunks/shop/category/product.row.tpl',
    'leftJoin' => '{
        "localizator" : {
                "class" : "localizatorContent",
                "alias" : "localizator",
                "on" : "localizator.resource_id = msProduct.id"
        }
    }',
    'select' => '{ "localizator" : "msProduct.*, localizator.*, msProduct.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}'
])}
