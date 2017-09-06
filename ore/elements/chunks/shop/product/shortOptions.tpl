{var $idx = 0}
{foreach $options as $name => $values}
    {if ('localizator_key' | option)!='ru'}
            {var $value = $_modx->runSnippet('@FILE:snippets/translator.php',[
                'input' => $values[0]
            ])}
    {else}
        {var $value = $values[0]}
    {/if}
    <li>{$value}</li>
{/foreach}