{ignore}<style>
    .breadcrumbs {display: none;}
</style>
{/ignore}

{if !count($products)}
    {'ms2_cart_is_empty' | lexicon}
{else}
    <div class="card-col-12">
        <div id="msCart" class="row container">
            {foreach $products as $product}
                <!-- card -->
                <div class="card card_basket" id="{$product.key}">
                    <div class="col-xs-12 col-sm-3 col-md-3 col-lg-2">
                        <a href="{$product.id|url}">
                        <img src="{$product.card}" alt="{$pagetitle}">
                    </a>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-6 col-lg-6">
                        <a href="{$product.id|url}" class="card__title">{$product.pagetitle}</a>
                       <!--  <p class="card__text">{$product.introtext|truncate:70:'...'}</p> -->
                        <span class="card-articul__number">{'lw.product_article'|lexicon} {$product.article}</span>
                    </div>
                    <div class="col-xs-12 col-sm-6 no-gutters">
                    <!-- price -->
                    <div class="card-footer">
                        <div class="card-price">
                            <span class="card-price__new">{$product.price|number:0:'.':' '}</span>
                            {if $product.old_price?}
                                <span class="card-price__old">{$product.old_price|number:0:'.':' '}</span>
                            {/if}
                            <form method="post" class="ms2_form form-inline" role="form">
                                <input type="hidden" name="key" value="{$product.key}"/>
                                <input type="hidden" name="count" value="1"/>                                   
                            </form>
                        </div>
                    </div>
                    </div>
                    <div class="col-xs-12 col-sm-6">
                    <!-- articul -->
                    <form method="post" class="ms2_form">
                        <input type="hidden" name="key" value="{$product.key}">
                        <div>
                            <button type="submit" name="ms2_action" value="cart/remove" class="card-articul__delete">{'lw.product-delete' | lexicon}</button>
                        </div>
                    </form>
                    </div>
                </div>
            {/foreach}
        </div>
    </div>
{/if}