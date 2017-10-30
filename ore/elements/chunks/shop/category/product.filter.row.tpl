{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
{var $currencyIco = '<i class="fa fa-rub" aria-hidden="true"></i>'}
{if ('localizator_key' | option)=='en'}
    {var $linkPrefix='en/'}
    {var $usd = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
    'divider' => 'USD',
    'input' => ($price)
    ])}
    {var $currencyIco = '<i class="fa fa-usd" aria-hidden="true"></i>'}
{/if}
<div class="col-sm-6 col-lg-4">
    <!-- card -->
    <div class="card">
        {if (($sale)||($favorite)||($new)||($popular))}
            <div class="product-icon__outer">
                {if $sale==1}
                    <i class="product-icon product-icon--sale">
                        <span class="product-icon__tooltip">{'lw.sale'|lexicon}</span>
                    </i>
                {/if}
                {if $new==1}
                    <i class="product-icon product-icon--new">
                        <span class="product-icon__tooltip">{'lw.new'|lexicon}</span>
                    </i>
                {/if}
                {if $popular==1}
                    <i class="product-icon product-icon--popular">
                        <span class="product-icon__tooltip">{'lw.top'|lexicon}</span>
                    </i>
                {/if}
                {if $favorite==1}
                    <i class="product-icon product-icon--favorite">
                        <span class="product-icon__tooltip">{'lw.gift'|lexicon}</span>
                    </i>
                {/if}
            </div>
        {/if}
        <a href="{$linkPrefix}{$uri}" class="card-image">
            <img src="{$list}" alt="{$pagetitle}">
        </a>
        <a href="{$linkPrefix}{$uri}" class="card__title">{$pagetitle}</a>
        <p class="card__text">{$introtext|truncate:100:'...'}</p>
        <!-- footer -->
        <div class="card-footer">
            <div class="card-price">
                {if $usd?}
                    {var $price = $usd}
                {/if}
                <span class="card-price__new">{$price|number:0:'.':' '} {$currencyIco}</span>
                {if $old_price>0}
                    {if $usd?}
                        {var $old_price = $_modx->runSnippet('@FILE:snippets/CRCalc.php',[
                            'divider' => 'USD',
                            'input' => ($old_price)
                        ])}
                    {/if}
                    <span class="card-price__old">{$old_price|number:0:'.':' '} {$currencyIco}</span>
                {/if}
            </div>
            <form method="post" class="ms2_form">
                <input type="hidden" name="pagetitle" value="{$pagetitle}"/>
                <button type="submit" name="ms2_action" value="cart/add"  class="btn">
                    {'ms2_frontend_add_to_cart'|lexicon}
                </button>
                <input type="hidden" name="id" value="{$id}">
                <input type="hidden" name="count" value="1">
                <input type="hidden" name="options" value="[]">
            </form>
        </div>
    </div>
</div>