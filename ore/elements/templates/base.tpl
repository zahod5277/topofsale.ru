<!DOCTYPE html>
<html lang="ru">
    {block 'HEAD'}
        {include 'file:chunks/common/head.tpl'}
    {/block}
    {if $_modx->resource.id==1}
        {var $class=' class="home"'}
    {/if}
    <body{$class}>
        {block 'HEADER'}
            {include 'file:chunks/common/header.tpl'}
        {/block}
        <main class="wrapper">
            {block 'CONTENT'}
            {/block}
        </main>
        {block 'FOOTER'}
            {include 'file:chunks/common/footer.tpl'}
        {/block}
        {block 'modal'}
            {include 'file:chunks/common/modal.tpl'}
        {/block}
        {block 'SCRIPTS'}
            {include 'file:chunks/common/scripts.tpl'}
        {/block}
    </body>
    <script>
        miniShop2.Callbacks.Cart.add.response.success = function(response) {
        $('#tocart-modal').gpPopup('show')
    }
    </script>
</html>