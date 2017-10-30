<!-- footer -->
<footer class="footer">
    <div class="container">
        <!-- left -->
        <div class="footer-info-contacts">
        </div>
        <!-- address -->
        <div class="footer-address footer-info-contacts" itemscope itemtype="http://schema.org/Organization" >
            <a href="tel:{$_modx->config.sitePhone}" class="link-phone"><i class="icon icon-call-answer-secondary"></i> <span itemprop="telephone">{$_modx->config.sitePhone}</span></a>
            <a href="#" data-popup="open" data-popup-id="#popup" class="more">{'lw.call-me'|lexicon}</a>
            <div class="schemaOrg schemaOrg__organization">
                <a itemprop="url" href="https://topofsale.ru/">
                    <div itemprop="name">
                        <strong>{'lw.schemaDescription'|lexicon}</strong>
                    </div>
                </a>
                <div itemprop="description">{'lw.schemaSecondDescription'|lexicon}</div>
                <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                    <span itemprop="streetAddress">{'lw.header-adress'|lexicon}</span>
                    <span itemprop="addressLocality">{'lw.city'|lexicon}</span>
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
