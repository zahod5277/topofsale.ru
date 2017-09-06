{if ('localizator_key' | option)=='en'}
    {var $lang = 'en'}
{/if}
<li id="msMiniCart" class="{$total_count > 0 ? 'full' : ''}">
    <div class="empty"></div>
    <div class="not_empty">
        <a title="{'lw.cart'|lexicon}" href="{$lang}/checkout">{'lw.cart'|lexicon} (<span class="ms2_total_count">{$total_count}</span>)</a>
    </div>
</li>