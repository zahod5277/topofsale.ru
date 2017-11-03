{var $idx = 0}
{foreach $options as $name => $values}
    <tr>
        <td>
            {('ms2_product_' ~ $name) | lexicon}:
            {if ('localizator_key' | option)!='ru'}
                {var $value = $_modx->runSnippet('@FILE:snippets/translator.php',[
                'input' => ($values|join)
            ])}
            {else}
                {var $value = ($values|join)}
            {/if}
        </td>
        <td>
            <span class="value">{$value}</span>
        </td>
    </tr>
{/foreach}