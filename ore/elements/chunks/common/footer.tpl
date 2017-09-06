<!-- footer -->
<footer class="footer">
    <div class="container">
        <!-- left -->
        <div class="footer-info-contacts">
            <a href="tel:{$_modx->config.sitePhone}" class="link-phone"><i class="icon icon-call-answer-secondary"></i> {$_modx->config.sitePhone}</a>
            <a href="#" data-popup="open" data-popup-id="#popup" class="more">{'lw.call-me'|lexicon}</a>
            <!-- value -->
            <div class="info-value">
                <span class="info-value__dollars">$ {$_modx->getPlaceholder('+USD')|number: 2 : '.' : ' '+(0.4)}</span>
                <span class="info-value__euro">€ {$_modx->getPlaceholder('+EUR')|number: 2 : '.' : ' '+(0.4)}</span>
            </div>
        </div>
        <!-- address -->
        <div class="footer-address">
            <span><i class="icon icon-clock-secondary"></i> 9.00 - 21.00</span>
            <span>г. Москва, ул. Гороховая, 35</span>
            {*<span>{'lw.header-adress'|lexicon}</span>*}
        </div>
        <!-- center -->
        <div class="footer-center">
            <ul class="footer-list">
                <li>{'lw.productionTitle'|lexicon}</li>
                {$_modx->runSnippet('!pdoMenu',[
                    'level' => 1,
                    'parents' => 2,
                    'resources' => '12,30,31',
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
                    'resources' => '29,8,9',
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
    </div>
</footer>