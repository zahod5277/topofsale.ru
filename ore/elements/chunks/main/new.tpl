<!-- products	 -->
<section class="products-block">
    <div class="container">
        <h2 class="title-section">
            <span>{'lw.newProducts'|lexicon}</span>
        </h2>
       
        <div id="pdopage">
        <div class="catalog cards-list rows row">
        {$_modx->runSnippet('!pdoPage',[
            'element' => 'msProducts',
            'parents' => 2,
            'sortby' => 'publishedon',
            'setMeta' => 0,
            'sortdir' => 'DESC',
            'includeThumbs' => 'list',
            'leftJoin' => '{
                    "localizator" : {
                            "class" : "localizatorContent",
                            "alias" : "localizator",
                            "on" : "localizator.resource_id = msProduct.id"
                    }
                }',
                'select' => '{"localizator" : "msProduct.*, localizator.*, msProduct.id" }',
                                'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}',
            'tpl' => '@FILE:chunks/shop/category/product.row.tpl',
            'limit' => 4,
            'ajaxMode' => 'button',
            'ajaxTplMore' => '@INLINE <div class="button-section"><a href="#" class="btn-more more">'~('lw.loadMore'|lexicon)~'</a></div>',
        ])}   
        </div>
        {$_modx->getPlaceholder('page.nav')}
        </div>
    </div>
</section>