{extends 'file:templates/base.tpl'}
{block 'CONTENT'}
    {include 'file:chunks/common/breadcrumbs.tpl'}
    {include 'file:chunks/shop/product/product.content.tpl'}
    {include 'file:chunks/shop/category/looked.tpl'}
{/block}