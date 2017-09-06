<main class="content clearfix">
    <div class="container">
        <h1>{$_modx->resource.pagetitle}</h1>
        {if ('localizator_key' | option)=='en'}
            {if $_modx->resource.content==''}
                {$_modx->resource.localizator_content}
            {else}
                {$_modx->resource.content}
            {/if}
        {else}
        {$_modx->resource.content}
       {/if}
    </div>
</main>