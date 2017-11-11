<div class="card-row">
{$_modx->runSnippet('!msCart',[
    'tpl' => '@FILE:chunks/shop/cart/cartOrder.tpl',
    'includeThumbs' => 'card',
        'leftJoin' => '{
        "localizator" : {
                "class" : "localizatorContent",
                "alias" : "localizator",
                "on" : "localizator.resource_id = msProduct.id"
        }
    }',
    'select' => '{ "localizator" : "msProduct.*, localizator.*, msProduct.id" }',
                    'where' => '{ "localizator.key" : "' ~ ('localizator_key' | option) ~ '"}'
])}
</div>
{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
<div class="card-col-12 row">
    <form id="msOrder" method="post" class="form form_order ms2_form">
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <div class="form-group" id="payments">
                <h3 class="form__title">{'ms2_frontend_payments' | lexicon}:</h3>
                {foreach $payments as $payment}
                    <div class="wrap-radio">
                        <input class="radio-input" type="radio" name="payment" value="{$payment.id}" id="payment_{$payment.id}"{$payment.id == $order.payment ? 'checked' : ''}>
                        <label class="payment radio-label" for="payment_{$payment.id}">
                            {if $payment.logo?}
                                {$payment.logo}
                            {/if}
                            {('lw.payment-'~$payment.id)|lexicon}
                        </label>
                    </div>
                {/foreach}
            </div>
            <div class="form-group" id="deliveries">
                <h3 class="form__title delivery__title">{'lw.delivery'|lexicon}</h3>
                {var $i = 0}
                {foreach $deliveries as $idx => $delivery}
                    {var $checked = !$order.delivery && $i == 0 || $delivery.id == $order.delivery}
                    {var $i += 1}
                    <div class="wrap-radio">
                        <input class="radio-input" type="radio" name="delivery" value="{$delivery.id}" id="delivery_{$delivery.id}"
                               data-payments="{$delivery.payments | json_encode}"
                               {$checked ? 'checked' : ''}>
                        <label class="delivery radio-label" for="delivery_{$delivery.id}">
                            {if $delivery.logo?}
                                {$delivery.logo}
                            {/if}
                            {('lw.delivery-'~$delivery.id)|lexicon}
                        </label>
                        <span class="delivery__description">{$delivery.description}</span>
                    </div>
                {/foreach}
            </div>
             <h3 class="form__title form__title--delivery">{'ms2_frontend_address' | lexicon}:</h3>
             <h3 class="form__title form__title--delivery-hidden"></h3>
            {foreach ['index','region','city'] as $field}
                <div class="form-group input-parent col-md-10">
                    <input type="text" id="{$field}" placeholder="{('ms2_frontend_' ~ $field) | lexicon}"
                           name="{$field}" value="{$form[$field]}"
                           class="form-input{($field in list $errors) ? ' error' : ''}">
                </div>
            {/foreach}
            {foreach ['street','building','room'] as $field}
                <div class="form-group input-parent col-md-10">
                    <input type="text" id="{$field}" placeholder="{('ms2_frontend_' ~ $field) | lexicon}"
                           name="{$field}" value="{$form[$field]}"
                           class="form-input{($field in list $errors) ? ' error' : ''}">
                </div>
            {/foreach}
        </div>
        <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">
            <h3 class="form__title">{'ms2_frontend_credentials' | lexicon}:</h3>
            {foreach ['email','receiver','phone'] as $field}
                <div class="form-group input-parent required">
                    <input type="text" id="{$field}" placeholder="{('ms2_frontend_' ~ $field) | lexicon}"
                           name="{$field}" value="{$form[$field]}"
                           class="form-input{($field in list $errors) ? ' error' : ''}">
                </div>
            {/foreach}
             <div class="form-group">
                    <textarea name="comment" id="comment" placeholder="{'ms2_frontend_comment' | lexicon}"
                              class="form-textarea form-control{('comment' in list $errors) ? ' error' : ''}">{$form.comment}</textarea>
            </div>
            <div class="form-group">
                <p>{'lw.politics-disclaimer'|lexicon}</p>
                <p><a href="{'29'|url}">{'lw.politics-link'|lexicon}</a></p>
                <button type="submit" class="btn btn_form" name="ms2_action" value="order/submit">{'lw.send-order'|lexicon}</button>
            </div>
        </div>
    </form>
</div>