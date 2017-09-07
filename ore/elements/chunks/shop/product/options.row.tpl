{var $idx = 0}
{foreach $options as $name => $values}
    <tr>
        <td>
            {('ms2_product_' ~ $name) | lexicon}:
            {if ('localizator_key' | option)!='ru'}
                {var $value = $_modx->runSnippet('@FILE:snippets/translator.php',[
                'input' => $values[0]
            ])}
            {else}
                {var $value = $values[0]}
            {/if}
        </td>
        <td>
            <span class="value">{$value}</span>
        </td>
    </tr>
{/foreach}