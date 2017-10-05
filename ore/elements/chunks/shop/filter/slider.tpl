<fieldset id="mse2_[[+table]][[+delimeter]][[+filter]]" class="widget">
    <div class="collapse">
        <h4 class="filter_title"></h4>
        <div class="collapse-header clicked">
            [[%mse2_filter_[[+table]]_[[+filter]]]] <i class="icon-angel-down"></i>
        </div>
        <div class="collapse-panel active">
            <div class="mse2_number_slider"></div>
            <div class="mse2_number_inputs formCost">
                {$rows}
                <span>&#8381;</span>
            </div>
        </div>
    </div>
</fieldset>
{if $_modx->resource.parent!=0}
    {var $class = ' active'}
{/if}
<fieldset class="widget">
    <div class="collapse">
        <div class="collapse-header clicked">
            {'lw.catalog'|lexicon} <i class="icon-angel-down"></i>
        </div>
        <div class="collapse-panel filter-catalog{$class}">
            {$_modx->runSnippet('pdoMenu',[
                'parents' => 2,
                'resources' => '-12,-30,-31',
                'level' => 3,
                'templates' => '-3',
                'leftJoin' => '{
                "localizator" : {
                    "class" : "localizatorContent",
                    "alias" : "localizator",
                    "on" : "localizator.resource_id = modResource.id"
                    }
                    }',
                'select' => '{ "localizator" : "modResource.*, localizator.*, modResource.id" }',
                'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}',
                'tplOuter' => '@FILE:chunks/shop/filter/catalogMenu.outer.tpl',
                'tplInner' => '@FILE:chunks/shop/filter/catalogMenu.outer.lev2.tpl',
                'tpl' => '@FILE:chunks/shop/filter/catalogMenu.lev1.row.tpl',
                'tplInnerRow' => '@FILE:chunks/shop/filter/catalogMenu.lev2.row.tpl',
            ])}
        </div>
    </div>
</fieldset>