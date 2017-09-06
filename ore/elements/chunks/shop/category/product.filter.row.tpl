{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
{if ('localizator_key' | option)=='en'}
    {var $linkPrefix='en/'}
{/if}
<div class="col-sm-6 col-lg-4">
    <!-- card -->
    <div class="card">
        <a href="{$linkPrefix}{$uri}" class="card-image">
            <img src="{$list}" alt="{$pagetitle}">
        </a>
        <a href="{$linkPrefix}{$uri}" class="card__title">{$pagetitle}</a>
        <p class="card__text">{$introtext|truncate:50:'...'}</p>
        <!-- footer -->
        <div class="card-footer">
            <div class="card-price">
                <span class="card-price__new">{$price|number:0:'.':' '}</span>
                {if $old_price>0}
                    <span class="card-price__old">{$old_price|number:0:'.':' '}</span>
                {/if}
            </div>
            <form method="post" class="ms2_form">
                <button type="submit" name="ms2_action" value="cart/add" class="btn">
                    {'ms2_frontend_add_to_cart'|lexicon}
                </button>
                <input type="hidden" name="id" value="{$id}">
                <input type="hidden" name="count" value="1">
                <input type="hidden" name="options" value="[]">
            </form>
        </div>
    </div>
</div>