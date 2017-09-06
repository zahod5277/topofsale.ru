<!-- filter -->
<section class="line-filter">
    <form action="/katalog/" method="GET" id="filter" class="filter">
        <div class="select-wrapper">
            <select name="gender">
                <option disabled="disabled" selected="selected">{'lw.gender'|lexicon}</option>
                <option value="Мужской">{'lw.gender-male'|lexicon}</option>
                <option value="Женский">{'lw.gender-female'|lexicon}</option>
            </select>
        </div>
        <div class="select-wrapper">
            <select name="status">
                <option disabled="disabled" selected="selected">{'lw.product-status'|lexicon}</option>
                <option value="Новый">{'lw.status-new'|lexicon}</option>
                <option value="Вторые руки">{'lw.status-second'|lexicon}</option>
            </select>
        </div>
        <div class="select-wrapper">
            <select name="vendor">
                <option disabled="disabled" selected="selected">{'lw.brand'|lexicon}</option>
                {$_modx->runSnippet('@FILE:snippets/getVendors.php',[
                    'tpl' => '@FILE:chunks/main/vendorsList.tpl'
                ])}
            </select>
        </div>
        <button type="submit" class="btn btn_secondary">{'lw.find'|lexicon}</button>
    </form>
</section>