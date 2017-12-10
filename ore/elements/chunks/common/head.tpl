<head>
    <meta charset="utf-8" />
    {if ('localizator_key' | option)!='ru'}
    {if $_modx->resource.template==3}
        {var $title = $_modx->runSnippet('pdoField',[
        'field' => 'pagetitle',
        'id' => $_modx->resource.parent
        ])~' '~$_modx->resource.pagetitle}
        {else}
            {if $_modx->resource.seotitle?}
                {var $title = $_modx->resource.seotitle~'| topofsale.ru'}
            {else}
                {var $title = $_modx->resource.pagetitle~'| topofsale.ru'} 
            {/if}
    {/if}
    {if $_modx->resource.description?}
        {var $description = $_modx->resource.description}
    {/if}
    {/if}
    {if ('localizator_key' | option)=='ru'}
        {switch $_modx->resource.template}
        {case '1'}
        {var $title = '🚀TOPOFSALE.RU | Интернет магазин лучших цен!'}
        {var $description = 'В нашем интернет-магазине «TOPOFSALE.RU» Вы наверняка найдете то, что ищете. ⭐⭐⭐⭐⭐Подарок для близкого человека, презент деловому партнеру или же что-то из того, о чем Вы давно мечтали сами – все это есть у нас!🎁'}
        {case '2','5','3'}
        {var $title = '🚀'~$_modx->resource.pagetitle~' купить в Москве по доступной цене | topofsale.ru'}
        {var $description = $_modx->resource.pagetitle~' недорого в интернет-магазине «TOPOFSALE.RU» по цене от 1000 рублей! ⭐⭐⭐⭐⭐Доставка по Москве и России, выгодные цены для наших клиентов!🎁'}
        {case '4'}
        {var $title = $_modx->resource.pagetitle~' | topofsale.ru'}
        {var $description = $_modx->resource.pagetitle~' интернет-магазина «TOPOFSALE.RU»⭐⭐⭐⭐⭐'}
        {/switch}
    {/if}
    <title>{$title}</title>
    <meta name="keywords" content="keywords" />
    {if $description?}
    <meta name="description" content="{$description}" />
    {/if}
    <base href="{$_modx->config.site_url}">
    <!--favicon-->
    <link rel="apple-touch-icon" sizes="57x57" href="assets/templates/default/favicons//apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="assets/templates/default/favicons//apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="assets/templates/default/favicons//apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="assets/templates/default/favicons//apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="assets/templates/default/favicons//apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="assets/templates/default/favicons//apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="assets/templates/default/favicons//apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="assets/templates/default/favicons//apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/templates/default/favicons//apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192" href="assets/templates/default/favicons//android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/templates/default/favicons//favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/templates/default/favicons//favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="assets/templates/default/favicons//favicon-16x16.png">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="assets/templates/default/favicons//ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <!--viewport-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0" />
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,400i,600,700,800&amp;subset=cyrillic" rel="stylesheet">
    <!--modernizr-->
    <script src="assets/templates/default/js/modernizr-custom.min.js"></script>
    <!--styles-->
    {var $timestamp = ''|date_format:'%s'}
    <link rel="stylesheet" type="text/css" href="assets/templates/default/css/app.min.css" />
    <!-- <meta name="viewport" content="width=device-width, initial-scale=1.0" /> -->
    {if ('localizator_key' | option)=='en'}
        {var $lang = 'en/'}
    {/if}
    {if $_modx->resource.id==1}
    <link rel="canonical" href="{$_modx->config.site_url}{$lang}"/>
    {else}
    <link rel="canonical" href="{$_modx->config.site_url}{$lang}{$_modx->resource.id|url}"/>
    {/if}
</head>