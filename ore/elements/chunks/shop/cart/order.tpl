{$_modx->lexicon->load(('cultureKey' | option) ~ ':minishop2:default')}
</br>
<div class="card-col-12 row">
    <form id="msOrder" method="post" class="form form_order ms2_form">
        <div class="card-col-6">
            <div class="form__title">{'lw.order-heading'|lexicon}</div>
            <p>{'lw.order-description'|lexicon}</p>
            <br>
            <p>Ваш заказ на сумму:  &nbsp;&nbsp;<span class="card-price__new" style="font-size:2rem; font-weight: 600;"> $ </span><span id="ms2_order_cost" class="card-price__new"> [[+order_cost:default=`0`]]</span></p>
        </div>    
        <!-- bodyw -->
        <div class="card-col-6">
        <div class="form-body">
            {foreach ['email','receiver','phone'] as $field}
                <div class="form-group input-parent">
                    <input type="text" id="{$field}" placeholder="{('ms2_frontend_' ~ $field) | lexicon}"
                           name="{$field}" value="{$form[$field]}"
                           class="form-input {($field in list $errors) ? ' error' : ''}">

                </div>
            {/foreach}
            <div class="form-group">
                <input type="text" name="comment" id="comment" placeholder="{'ms2_frontend_comment' | lexicon}"
                       class="form-input {('comment' in list $errors) ? ' error' : ''}">
            </div>
            <div class="form-group" id="payments">
                <h3 class="form__title">{'lw.payments'|lexicon}</h3>
                {foreach $payments as $payment}
                    <div class="wrap-radio">
                        <input class="radio-input" type="radio" name="payment" value="{$payment.id}" id="payment_{$payment.id}"
                                   {$payment.id == $order.payment ? 'checked' : ''}>
                        <label class="payment radio-label" for="payment_{$payment.id}">
                            {('lw.payment-'~$payment.id)|lexicon}
                        </label>
                    </div>
                {/foreach}
            </div>
            <div class="form-group" id="deliveries">
                <h3 class="form__title">{'lw.delivery'|lexicon}</h3>
                {var $i = 0}
                {foreach $deliveries as $idx => $delivery}
                    {var $checked = !$order.delivery && $i == 0 || $delivery.id == $order.delivery}
                    {var $i += 1}
                    <div class="wrap-radio">
                         <input class="radio-input" type="radio" name="delivery" value="{$delivery.id}" id="delivery_{$delivery.id}"
                                   data-payments="{$delivery.payments | json_encode}"
                                   {$checked ? 'checked' : ''}>
                        <label class="delivery radio-label" for="delivery_{$delivery.id}">
                            {('lw.delivery-'~$delivery.id)|lexicon}
                        </label>
                    </div>
                {/foreach}
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn_form" name="ms2_action" value="order/submit">{'lw.send-order'|lexicon}</button>
            </div>
        </div>
        </div>
    </form>
</div>