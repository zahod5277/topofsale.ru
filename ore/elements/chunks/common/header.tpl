<header class="sticky-header">
    <!-- top -->
    <div class="header-top clearfix">
        <div class="container">
            <!-- button -->
            <button id="button-menu" type="button" class="btn-menu"><span class="icon icon-burger">{'lw.menu'|lexicon}</span>
            </button>
            {include 'file:chunks/shop/filter/search.form.tpl'}
            <!-- menu -->
            <nav class="menu">
                <!-- button -->
                <button id="close-menu" type="button" class="btn-close"><span class="icon icon-close">{'lw.close'|lexicon}</span>
                </button>
                {$_modx->runSnippet('!pdoMenu',[
                    'parents' => 6,
                    'level' => 1,
                    'sortby' => 'menuindex',
                    'leftJoin' => '{
                                    "localizator" : {
                                            "class" : "localizatorContent",
                                            "alias" : "localizator",
                                            "on" : "localizator.resource_id = modResource.id"
                                    }
                            }',
                    'select' => '{ "localizator" : "modResource.*, localizator.*, modResource.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}',
                    'tplOuter' => '@FILE:chunks/common/mainMenuOuter.tpl',
                    'tpl' => '@FILE:chunks/common/mainMenuRow.tpl',
                    'resources' => '-9,-8'
                ])}
                <ul class="menu-contacts">
                    <li><a href="tel:89558965636">8 (955) 896-56--36</a>
                    </li>
                    <li><a href="#" data-popup="open" data-popup-id="#popup">{'lw.call-me'|lexicon}</a>
                    </li>
                </ul>
            </nav>
            <div class="swipe-panel"></div>
            <!-- lang -->
            {if ('localizator_key' | option)=='ru'}
                {var $localizLink = 'en/'}
                {var $linkTitle = 'EN'}
            {else}
                {var $localizLink = ''}    
                {var $linkTitle = 'RU'}
            {/if}
            <a href="{$localizLink ~ ($_modx->resource.uri)}" class="link-lang">{$linkTitle}</a>
        </div>
    </div>
</header>
<!-- header -->
<header id="header" class="header">
    <!-- bottom -->
    <div class="header-bottom">
        <div class="container">
            <!-- logo -->
            <a href="./" class="logo">
                {*<img src="assets/templates/default/images/logo_h.png" alt="logo">*}
                {*<img src="assets/templates/default/images/off50.jpg" alt="logo"> *}
                <span class="logo-text">
                    <span class="logo-text__title">TOPOFSALE.RU</span>
                    {*<span class="logo-text__desc">{'lw.description'|lexicon}</span>*}
                </span>
            </a>
            <!-- info -->
            <div class="header-info">
                <!-- contacts -->
                <div class="header-info-contacts">
                    <a href="tel:{$_modx->config.sitePhone}" class="link-phone"><i class="icon icon-call-answer"></i> {$_modx->config.sitePhone}</a>
                    {*<div class="info-value">
                        <span class="info-value__dollars">$ {$_modx->getPlaceholder('+USD')|number: 2 : '.' : ' '+(0.4)}</span>
                        <span class="info-value__euro">€ {$_modx->getPlaceholder('+EUR')|number: 2 : '.' : ' '+(0.4)}</span>
                    </div>*}
                    <a href="#" class="more" data-popup="open" data-popup-id="#popup" style="font-size:0.975rem !important;color:#f6862d !important;font-style:normal;border-bottom:1px solid #f9b48a;">{'lw.call-me'|lexicon}</a>
                    <!-- value -->
                </div>
                <!-- address -->
                <div class="header-info-address">
                    <span><i class="icon icon-clock"></i> 9.00 - 21.00</span>
                    <span>г. Москва, ул. Гороховая, 35</span>
                    {*<span>{'lw.header-adress'|lexicon}</span>*}
                </div>
            </div>
        </div>
    </div>
</header>