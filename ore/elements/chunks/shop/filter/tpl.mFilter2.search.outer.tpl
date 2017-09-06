<h1>{$_modx->resource.pagetitle}</h1>
<div class="row msearch2" id="mse2_mfilter">
    <aside class="col-md-4 col-lg-3 sidebar">
        <form action="{$_modx->resource.id|url}" method="post" id="mse2_filters" class="form sidebar-form">
            {$filters}
            <br/>
            {if $filters?}
                <button type="reset" class="btn btn-default hidden">{'mse2_reset'|lexicon}</button>
                <button type="submit" class="btn btn-success pull-right hidden">{'mse2_submit'|lexicon}</button>
                <div class="clearfix"></div>
            {/if}
        </form>

        <div>{'mse2_limit'|lexicon}
            <select name="mse_limit" id="mse2_limit">
                <option value="10" [[+limit:is=`10`:then=`selected`]]>10</option>
                <option value="25" [[+limit:is=`25`:then=`selected`]]>25</option>
                <option value="50" [[+limit:is=`50`:then=`selected`]]>50</option>
                <option value="100" [[+limit:is=`100`:then=`selected`]]>100</option>
            </select>
        </div>
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
