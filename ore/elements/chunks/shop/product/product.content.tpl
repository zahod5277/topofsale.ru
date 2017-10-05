<main class="content">
    <div class="container">
        <!-- product -->
        <div class="product clearfix">
            {$_modx->runSnippet('!msGallery',[
                'tpl' => '@FILE:chunks/shop/product/gallery.tpl',
                'includeThumbs' => 'card'
            ])}
            <!-- info -->
            <div class="product-info">
                {var $category = $_modx->runSnippet('!pdoField',[
                    'field' => 'id',
                    'top' => 1,
                ])}
                {var $categoryTitle = $_modx->runSnippet('@FILE:snippets/localizatorField.php',[
                    'field' => 'pagetitle',
                    'resource_id' => $category,
                    'key' => ('cultureKey'|option)
                ])}
                <h1 class="product-info__title">{$_modx->resource.pagetitle}</h1>
                <!-- price -->
                {*Просчет в другой валюте временно отключен*}
                <div class="product-price">
                    <div class="product-price__value">{$price|number:0:'.':' '} &#8381;</div>
                    {if $old_price?}
                        <div class="product-price__value">
                            <span class="card-price__old card-price__old_product-content">{$old_price|number:0:'.':' '} &#8381;</span>
                        </div>    
                    {/if}
                    <div class="product-info-footer">
                        <form class="form-horizontal ms2_form" method="post">
                            <input type="hidden" name="id" value="{$_modx->resource.id}"/>
                            <button type="submit" name="ms2_action" value="cart/add"  class="btn">{'lw.buy'|lexicon}</button>
                            <a href="#" data-popup="open" data-popup-id="#cheaper">{'lw.cheaper'|lexicon}</a>
                            <input type="hidden" name="count" id="product_price" class="input-sm form-control" value="1"/>
                        </form>
                    </div>
                </div>
                <div class="col-xs-12">
                    <h3>{'lw.add_content'|lexicon}</h3>
                    {var $options = 
                            'article,
                             made_in,
                             body_diameter,
                             sex,
                             body_material,
                             clockwork,
                             calibr,
                             strap_color,
                             forma,
                             dial_color,
                             strap_type,
                             body_comment,
                             strap_comment,
                             jewerl_count,
                             water_resist,
                             backcap,
                             power_reserve,
                             limited,
                             complect'
                    }
                    <div class="table table-responsive">
                        <table class="table table-striped table-characteristics">
                            {$_modx->runSnippet('!msOptions',[
                                'options' => $options,
                                'tpl' => '@FILE:chunks/shop/product/options.row.tpl'
                                ])}
                        </table>
                    </div>
                </div>
            </div>
        </div>
       {$_modx->resource.content}
    </div>
</main>
{'!addLooked'|snippet:[
    'templates' => 3
]}