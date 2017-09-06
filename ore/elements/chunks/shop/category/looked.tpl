{$_modx->runSnippet('!looked',[
    'tpl' => '@FILE:chunks/shop/category/product.row.tpl',
    'limit' => 4,
    'includeThumbs' => 'list',
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