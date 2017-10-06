{$_modx->runSnippet('!mFilter2',[
    'parents' => $_modx->resource.id,
    'element' => 'msProducts',
    'paginator' => 'pdoPage@filterPagination',
    'limit' => '24',
    'suggestions' => 0,
    'ajaxMode' => 'button',
    'sortby' => 'publishedon',
    'sortdir' => 'DESC',
    'tpl' => '@FILE:chunks/shop/category/product.filter.row.tpl',
    'includeThumbs' => 'list',
    'filters' => 'ms|price:number,ms|vendor:vendors,ms|made_in,ms|sex,ms|forma,ms|complication,ms|body_material,ms|strap_type,ms|dial_color,ms|body_diameter,ms|clockwork,ms|strap_color',
    'aliases' => 'ms|price==price,ms|vendor==vendor,ms|made_in==country,ms|sex==gender,ms|complication==complication,ms|forma==format,ms|body_material==material,ms|strap_type==strap_type,ms|dial_color==dial_color,ms|body_diameter==diameter,ms|clockwork==clockwork,ms|strap_color==strap_color',
    'tplOuter' => '@FILE:chunks/shop/filter/tpl.mFilter2.outer.tpl',
    'tplFilter.outer.default' => '@FILE:chunks/shop/filter/tplFilter.outer.default.tpl',
    'tplFilter.outer.price' => '@FILE:chunks/shop/filter/slider.tpl',
    'tplFilter.row.price' => '@FILE:chunks/shop/filter/tpl.mFilter2.filter.number.tpl',
    'tplFilter.row.default' => '@FILE:chunks/shop/filter/tpl.mFilter2.filter.checkbox.tpl',
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