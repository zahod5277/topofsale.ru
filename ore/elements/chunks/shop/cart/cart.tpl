{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
{ignore}
<style>
    .breadcrumbs {display: none;}
</style>
{/ignore}
{if !count($products)}
    {'ms2_cart_is_empty' | lexicon}
{else}
    <div class="card-col-12">
        <div id="msCart" class="container">
            {foreach $products as $product}
                <!-- card -->
                <div class="card_basket" id="{$product.key}">
                    <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2">
                        <a href="{$product.id|url}">
                            <img src="{$product.card}" alt="{$pagetitle}">
                        </a>
                    </div>
                    <div class="col-xs-12 col-sm-7 col-md-6 col-lg-6">
                        <a href="{$product.id|url}" class="card__title">{$product.pagetitle}</a>
                       <!--  <p class="card__text">{$product.introtext|truncate:70:'...'}</p> -->
                        <span class="card-articul__number">{'lw.product_article'|lexicon} {$product.article}</span>
                    </div>
                    <div class="col-xs-12 col-sm-6  col-lg-3">
                        <!-- price -->
                        <div class="cart-item-footer">
                            <div class="card-price">
                                <span class="card-price__new">{$product.price|number:0:'.':' '}</span>
                                <i class="fa fa-rub"></i>
                                {if ('localizator_key' | option)=='en'}
                                    {var $usd = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
                                    'divider' => 'USD',
                                    'input' => ($product.price)
                                ])}
                                <span class="card-price__new card-price__new--usd">~ {$usd|number:0:'.':' '}</span>
                                    <i class="fa fa-usd"></i>
                                {/if}
                                {if $product.old_price?}
                                    <span class="card-price__old">{$product.old_price|number:0:'.':' '} <i class="fa fa-rub"></i></span>
                                {/if}
                                <form method="post" class="ms2_form form-inline" role="form">
                                    <input type="hidden" name="key" value="{$product.key}"/>
                                    <input type="hidden" name="count" value="1"/>                                   
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-lg-1">
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
        <div class="col-xs-12 container goToOrderBtn">
            <div class="col-xs-12 col-md-8">
                <h3>
                <span>{'lw.totalOrderSumm' | lexicon}</span>    
                <span class="ms2_total_cost">{$total.cost|number:0:'.':' '} <i class="fa fa-rub"></i></span>
                <span>{'ms2_frontend_currency' | lexicon}</span>
                {if ('localizator_key' | option)=='en'}
                    {var $usd = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
                    'divider' => 'USD',
                    'input' => ($total.cost)
                ])}
                <span class="card-price__new card-price__new--usd">~ {$usd|number:0:'.':' '}</span>
                <i class="fa fa-usd"></i>
                <span>USD</span>
                {/if}
                </h3>
            </div>
            <div class="col-xs-12 col-md-4">
                <a href="{'664'|url}" title="Оформить заказ" class="btn btn_form">
                    <i class="fa fa-credit-card"></i>  {'lw.goToCheckout'|lexicon}
                </a>
            </div>
        </div>
    </div>
{/if}