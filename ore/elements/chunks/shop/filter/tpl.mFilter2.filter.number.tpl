{if $idx == 0}
    {var $class='min'}
    {elseif $idx == 1}
    {var $class='max'}
{/if}
<label for="mse2_{$table}{$delimeter}{$filter}_{$idx}">{$title}</label>
<input type="text" name="{$filter_key}" id="mse2_{$table}{$delimeter}{$filter}_{$idx}" value="{$value}" class="{$class}">
<span style="display: none" class="hidden {$class}-range">{$value}</span>