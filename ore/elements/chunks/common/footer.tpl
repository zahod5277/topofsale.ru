<!-- footer -->
<footer class="footer">
    <div class="container">
        <!-- left -->
        <div class="footer-info-contacts">
        </div>
        <!-- address -->
        <div class="footer-address footer-info-contacts">
            <a href="tel:{$_modx->config.sitePhone}" class="link-phone"><i class="icon icon-call-answer-secondary"></i> {$_modx->config.sitePhone}</a>
            <a href="#" data-popup="open" data-popup-id="#popup" class="more">{'lw.call-me'|lexicon}</a>
            <div itemscope itemtype="http://schema.org/Organization" class="schemaOrg schemaOrg__organization">
                <a itemprop="url" href="https://topofsale.ru/"><div itemprop="name"><strong>Наручные часы | Карманные часы | Интерьерные часы | topofsale.ru</strong></div></a>
                <div itemprop="description">Интернет-магазин статусных предметов, где собрано все самое популярное!</div>
                <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                    <span itemprop="telephone">+79852279712</span>
                    <span itemprop="streetAddress">Нижний Кисловский пер., 7, стр. 1</span>
                    <span itemprop="addressLocality">Москва</span>
                    <span itemprop="name">TOPOFSALE.RU</span></div>
            </div>
        </div>
        <!-- center -->
        <div class="footer-center">
            <ul class="footer-list">
                <li>{'lw.productionTitle'|lexicon}</li>
                    {$_modx->runSnippet('!pdoMenu',[
                    'level' => 1,
                    'parents' => 2,
                    'resources' => '710,715,713,714,625,5',
                    'tplOuter' => '@INLINE {$wrapper}',
                    'tpl' => '@FILE:chunks/common/mainMenuRow.tpl',
                    'leftJoin' => '{
                                    "localizator" : {
                                            "class" : "localizatorContent",
                                            "alias" : "localizator",
                                            "on" : "localizator.resource_id = modResource.id"
                                    }
                            }',
                    'select' => '{ "localizator" : "modResource.*, localizator.*, modResource.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}'
                    
                ])}
            </ul>
            <ul class="footer-list">
                <li>{'lw.information'|lexicon}</li>
                    {$_modx->runSnippet('!pdoMenu',[
                    'level' => 1,
                    'parents' => 6,
                    'resources' => '9,28,29,911',
                    'showHidden' => 1,
                    'tplOuter' => '@INLINE {$wrapper}',
                    'tpl' => '@FILE:chunks/common/mainMenuRow.tpl',
                    'leftJoin' => '{
                                    "localizator" : {
                                            "class" : "localizatorContent",
                                            "alias" : "localizator",
                                            "on" : "localizator.resource_id = modResource.id"
                                    }
                            }',
                    'select' => '{ "localizator" : "modResource.*, localizator.*, modResource.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}'
                    
                ])}
            </ul>
            <ul class="footer-list">
                <li>{'lw.company'|lexicon}</li>
                    {$_modx->runSnippet('!pdoMenu',[
                    'level' => 1,
                    'parents' => 6,
                    'resources' => '7,10',
                    'tplOuter' => '@INLINE {$wrapper}',
                    'tpl' => '@FILE:chunks/common/mainMenuRow.tpl',
                    'leftJoin' => '{
                                    "localizator" : {
                                            "class" : "localizatorContent",
                                            "alias" : "localizator",
                                            "on" : "localizator.resource_id = modResource.id"
                                    }
                            }',
                    'select' => '{ "localizator" : "modResource.*, localizator.*, modResource.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}'
                    
                ])}
            </ul>
        </div>
</footer>