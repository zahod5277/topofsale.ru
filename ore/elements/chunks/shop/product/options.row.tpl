{var $idx = 0}
{foreach $options as $name => $values}
    {if $idx==9}
        </ul>
        <ul class="characteristics-list">
    {/if}
    <li>{('ms2_product_' ~ $name) | lexicon}:
        {if ('localizator_key' | option)!='ru'}
            {var $value = $_modx->runSnippet('@FILE:snippets/translator.php',[
                'input' => $values[0]
            ])}
        {else}
            {var $value = $values[0]}
        {/if}
        <span class="value">{$value}</span></li>
    {var $idx=$idx+1}
{/foreach}