<ul class="menu-list">
    {$wrapper}
    {$_modx->runSnippet('!msMiniCart',[
        'tpl' => '@FILE:chunks/shop/cart/minicart.tpl'
    ])}
</ul>