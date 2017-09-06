<main class="content">
    <div class="container">
        <h1>{$_modx->resource.pagetitle}</h1>
        <div class="row msearch2" id="mse2_mfilter">
            <aside class="col-md-4 col-lg-3 sidebar">
                <form action="{$_modx->resource.id|url}" method="post" id="mse2_filters" class="form sidebar-form">
                    {$filters}
                </form>
            </aside>

            <div class="col-md-8 col-lg-9">
                <div class="row catalog" id="mse2_results">
                    {$results}
                </div>
                <div class="mse2_pagination button-section">
                    {$_modx->getPlaceholder('page.nav')}
                </div>
            </div>
        </div>
    </div>
</main>