<div class="container">
    <div class="row">
        <h2 class="title-section">
            <span>{'lw.news'|lexicon}</span>
        </h2>
        {$_modx->runSnippet('!pdoMenu',[
    'level' => 1,
    'parents' => 1721,
    'limit' => 3,
    'tplOuter' => '@FILE:chunks/news/news.outer.tpl',
    'tpl' => '@FILE:chunks/news/news.row.tpl',
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