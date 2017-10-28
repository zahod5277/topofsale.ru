{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
{if ('localizator_key' | option)=='en'}
    {var $linkPrefix='en/'}
{/if}
<div class="col-sm-6 col-lg-4">
    <!-- card -->
    <div class="card">
        {if (($sale)||($favorite)||($new)||($popular))}
            <div class="product-icon__outer">
                {if $sale==1}
                    <i class="product-icon product-icon--sale">
                        <span class="product-icon__tooltip">Распродажа</span>
                    </i>
                {/if}
                {if $new==1}
                    <i class="product-icon product-icon--new">
                        <span class="product-icon__tooltip">Новинка!</span>
                    </i>
                {/if}
                {if $popular==1}
                    <i class="product-icon product-icon--popular">
                        <span class="product-icon__tooltip">TOP продаж</span>
                    </i>
                {/if}
                {if $favorite==1}
                    <i class="product-icon product-icon--favorite">
                        <span class="product-icon__tooltip">Подарок за покупку!</span>
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
                <span class="card-price__new">{$price|number:0:'.':' '}</span>
                {if $old_price>0}
                    <span class="card-price__old">{$old_price|number:0:'.':' '}</span>
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