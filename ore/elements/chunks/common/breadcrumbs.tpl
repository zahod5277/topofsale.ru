<!--breadcrumbs-->
<div class="breadcrumbs">
    <div class="container">
        {$_modx->runSnippet('pdoCrumbs',[
            'showHome' => 1,
            'outputSeparator' => '',
            'exclude' => '27',
            'tpl' => '@FILE:chunks/common/breadcrumbsTpl.tpl',
            'tplCurrent' => '@FILE:chunks/common/breadcrumbsCurrentTpl.tpl',
            'tplWrapper' => '@FILE:chunks/common/breadcrumbsWrapper.tpl',
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
    </div>
</div>