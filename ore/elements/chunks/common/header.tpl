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
                    'resources' => '-29'
                ])}
                <ul class="menu-contacts">
                    <li><a href="tel:{$_modx->config.sitePhone}">{$_modx->config.sitePhone}</a>
                    </li>
                    <li>
                        <a href="#" data-popup="open" data-popup-id="#popup">{'lw.call-me'|lexicon}</a>
                    </li>
                </ul>
            </nav>
            <div class="swipe-panel"></div>
            <!-- lang -->
            {if ('localizator_key' | option)=='ru'}
                {var $localizLink = 'en/'}
                {var $linkTitle = 'English'}
            {else}
                {var $localizLink = ''}    
                {var $linkTitle = 'Русский'}
            {/if}
            <a href="{$localizLink ~ ($_modx->resource.uri)}" class="link-lang">
                <i class="fa fa-globe" aria-hidden="true"></i>
                {$linkTitle}
            </a>
        </div>
    </div>
</header>
<!-- header -->
<header id="header" class="header">
    <!-- bottom -->
    <div class="header-bottom">
        <div class="container">
            <!-- logo -->
            {if ('localizator_key' | option)!='ru'}
            <a href="{$_modx->config.site_url}en/" class="logo">
                <img src="assets/templates/default/images/logo-fin-eng.png" alt="logo">
            </a>
            {else}
            <a href="{$_modx->config.site_url}" class="logo">
                <img src="assets/templates/default/images/logo-fin.png" alt="logo">
            </a>
            {/if}
            <!-- info -->
            <div class="header-info">
                <!-- contacts -->
                <div class="header-info-contacts">
                    <a href="tel:{$_modx->config.sitePhone}" class="link-phone">
                        <img src="{$_modx->config.assets_url}templates/default/images/fone.png" alt="">
                    </a>
                    <span class="header__social-links">
                        <a href="#" class="header__social-links-item">
                            <i class="fa fa-vk" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="header__social-links-item">
                            <i class="fa fa-whatsapp" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="header__social-links-item">
                            <i class="fa fa-viber" aria-hidden="true"></i>
                        </a>
                        <a href="#" class="header__social-links-item">
                            <i class="fa fa-telegram" aria-hidden="true"></i>
                        </a>
                    </span>
                    <a href="#" class="more" data-popup="open" data-popup-id="#popup" style="font-size:0.975rem !important;color:#f6862d !important;font-style:normal;border-bottom:1px solid #f9b48a;">{'lw.call-me'|lexicon}</a>
                    <!-- value -->
                </div>
                <!-- address -->
            </div>
        </div>
    </div>
</header>