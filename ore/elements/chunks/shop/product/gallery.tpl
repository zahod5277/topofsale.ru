{if $files?}
<!--view-->
<div class="product-view" id="maGallery">
    <div class="wrap-carousel">
        <!--carousel-->
        <ul class="view-carousel">
            {foreach $files as $file}
            <li class="view-carousel-item">
                <a href="{$file['url']}" data-fancybox="gallery">
                    <img src="{$file['card']}" alt="{$_modx->resource.pagetitle}">
                </a>
            </li>
            {/foreach} 
        </ul>
    </div>
    <!-- thumbs -->
    <ul class="thumbs-view">
        {foreach $files as $file}
        <li class="thumbs-view-item">
            <a href="{$file['url']}">
                <img src="{$file['cardThumb']}" alt="{$_modx->resource.pagetitle}">
            </a>
        </li>
        {/foreach}
    </ul>
</div>
{/if}