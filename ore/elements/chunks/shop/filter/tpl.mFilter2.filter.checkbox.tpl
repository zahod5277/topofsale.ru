{if ('localizator_key' | option)!='ru'}
    {var $filter_title = $_modx->runSnippet('@FILE:snippets/translator.php',[
        'input' => $title
    ])}
    {if $filter_title == 'Switzerland'}
        {var $filter_title = 'Swiss'}
    {/if}    
    {else}
        {var $filter_title=$title}
{/if}
<li>
    <input value="{$value}" {$checked} {$disabled} name="{$filter_key}" id="mse2_{$table}{$delimeter}{$filter}_{$idx}" class="checkbox-input" type="checkbox" />
    <label class="checkbox-label {$disabled}}" for="mse2_{$table}{$delimeter}{$filter}_{$idx}">{$filter_title} <sup>{$num}</sup></label>
</li>