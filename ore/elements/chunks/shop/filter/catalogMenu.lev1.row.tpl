{if $wrapper != ''}
    {var $class = 'filter-catalog__item-level1'}
    {else}
    {var $class = 'filter-catalog__item-level2'}
{/if}
<li class="{$class}">
     <a href="{$link}">{$menutitle}</a>
     {$wrapper}
 </li>