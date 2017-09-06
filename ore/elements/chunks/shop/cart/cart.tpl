{ignore}<style>
    .breadcrumbs {display: none;}
</style>{/ignore}
{if !count($products)}
    {'ms2_cart_is_empty' | lexicon}
{else}
    <div class="card-col-12">
        <div id="msCart" class="row">
            {foreach $products as $product}
                <!-- card -->
                <div class="card card_basket" id="{$product.key}">
                    <div class="card-col-2">
                        <a href="{$product.id|url}" class="card-image">
                        <img src="{$product.card}" alt="{$pagetitle}">
                    </a>
                    </div>
                    <div class="card-col-5" style="margin-top:0%;">
                        <a href="{$product.id|url}" class="card__title">{$product.pagetitle}</a>
                       <!--  <p class="card__text">{$product.introtext|truncate:70:'...'}</p> -->
                        <span class="card-articul__number">{'lw.product_article'|lexicon} {$product.article}</span>
                    </div>
                    <div class="card-col-3" style="margin-top:4%;">
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
                    <div class="card-col-2" style="margin-top:4%;">
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