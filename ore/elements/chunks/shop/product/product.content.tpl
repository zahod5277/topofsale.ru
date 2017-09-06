{*Просчет в другой валюте временно отключен*}
{*{var $usd = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
    'divider' => 'USD',
    'input' => ($price)
])}
{var $eur = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
    'divider' => 'EUR',
    'input' => ($price)
])}*}
<main class="content">
    <div class="container">
        <h1>{$_modx->resource.pagetitle}</h1>
        <!-- product -->
        <div class="product clearfix">
            {$_modx->runSnippet('!msGallery',[
                'tpl' => '@FILE:chunks/shop/product/gallery.tpl'
            ])}
            <!-- info -->
            <div class="product-info">
                {var $category = $_modx->runSnippet('!pdoField',[
                    'field' => 'id',
                    'top' => 1,
                ])}
                {var $categoryTitle = $_modx->runSnippet('@FILE:snippets/localizatorField.php',[
                    'field' => 'pagetitle',
                    'resource_id' => $category,
                    'key' => ('cultureKey'|option)
                ])}
                <h2 class="product-info__title">{$categoryTitle}</h2>
                <!-- <ul>{($price|number:'':'':'')}
                    <li>{$_modx->resource.introtext}</li>
                    {$_modx->runSnippet('!msOptions',[
                        'options' => 'stat,complect,complication',
                        'tpl' => '@FILE:chunks/shop/product/shortOptions.tpl'
                    ])}
                </ul>
                <a href="#characteristics" class="more scroll">Подробнее</a> -->
                <!-- price -->
                {*Просчет в другой валюте временно отключен*}
                <div class="product-price">
                    <div class="product-price__value">{$price|number:0:'.':' '} &#8381;</div>
                    {*<div class="product-price__currency">
                        <span><span class="rub">$</span> {$usd|number:0:' ':' '}</span>
                        <span>€ {$eur|number:0:' ':' '}</span>
                    </div>
                    *}
                </div>
                <div class="product-info-footer">
                     <form class="form-horizontal ms2_form" method="post">
                    <input type="hidden" name="id" value="{$_modx->resource.id}"/>
                    <button type="submit" name="ms2_action" value="cart/add"  class="btn">{'lw.buy'|lexicon}</button>
                    <a href="#" data-popup="open" data-popup-id="#cheaper">{'lw.cheaper'|lexicon}</a>
                     <input type="hidden" name="count" id="product_price" class="input-sm form-control" value="1"/>
                    </form>
                </div>
                <div class="col-xs-12">
                    <h3>{'lw.add_content'|lexicon}</h3>
                    {$_modx->resource.localizator_content}
                </div>
            </div>
        </div>
        <!-- characteristics -->
        <div id="characteristics" class="product-characteristics clearfix">
            <ul class="tabs">
                <li class="tab-link tab-link_active" data-tab="tab-1">{'lw.tab-description'|lexicon}</li>
                <li class="tab-link" data-tab="tab-2">{'lw.tab-payment'|lexicon}</li>
                <li class="tab-link" data-tab="tab-3">{'lw.tab-shipping'|lexicon}</li>
                <li class="tab-link" data-tab="tab-4">{'lw.tab-guarantee'|lexicon}</li>
            </ul>
            <!-- tab content -->
            <div class="tab-content">
                <div id="tab-1" class="tab-pane tab-pane_active">
                    <ul class="characteristics-list">
                        {var $options = 
                            'article,
                             made_in,
                             body_diameter,
                             sex,
                             body_material,
                             clockwork,
                             strap_color,
                             forma,
                             dial_color,
                             strap_type,
                             body_comment,
                             strap_comment,
                             jewerl_count,
                             water_resist,
                             backcap,
                             power_reserve,
                             limited'
                        }
                        {$_modx->runSnippet('!msOptions',[
                            'options' => $options,
                            'tpl' => '@FILE:chunks/shop/product/options.row.tpl'
                        ])}
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <div id="tab-2" class="tab-pane">
                    {$_modx->runSnippet('@FILE:snippets/localizatorField.php',[
                        'field' => 'content',
                        'resource_id' => 9,
                        'key' => ('cultureKey'|option)
                    ])}
                </div>
                <div id="tab-3" class="tab-pane">
                    {$_modx->runSnippet('@FILE:snippets/localizatorField.php',[
                        'field' => 'content',
                        'resource_id' => 8,
                        'key' => ('cultureKey'|option)
                    ])}
                </div>
                <div id="tab-4" class="tab-pane">
                    {$_modx->runSnippet('@FILE:snippets/localizatorField.php',[
                        'field' => 'content',
                        'resource_id' => 28,
                        'key' => ('cultureKey'|option)
                    ])}
                </div>
            </div>
        </div>
    </div>
</main>
{'!addLooked'|snippet:[
    'templates' => 3
]}