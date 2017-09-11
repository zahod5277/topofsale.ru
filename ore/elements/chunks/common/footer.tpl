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