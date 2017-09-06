{$_modx->runSnippet('!AjaxForm',[
    'snippet' => 'FormIt',
    'hooks' => 'spam,email,FormItSaveForm,filesender',
    'emailSubject' => 'Перезвоните мне',
    'emailTo' => $_modx->config.orderMail,
    'emailFrom' => $_modx->config.siteEmail,
    'emailTpl' => 'callme.email.tpl',
    'emailFromName' => 'Сайт .ru',
    'validate' => 'name:required,phone:required',
    'validationErrorMessage' => '<p>В форме содержатся ошибки!</p>',
    'successMessage' => '<p>Сообщение успешно отправлено. <br> Мы свяжемся в самое ближайшее время!</p>',
    'form' => '@FILE:chunks/forms/callme.form.tpl'
])}

{$_modx->runSnippet('!AjaxForm',[
    'snippet' => 'FormIt',
    'hooks' => 'spam,email,FormItSaveForm,filesender',
    'emailSubject' => 'Нашли дешевле',
    'emailTo' => $_modx->config.orderMail,
    'emailFrom' => $_modx->config.siteEmail,
    'emailTpl' => 'cheaper.email.tpl',
    'emailFromName' => 'Сайт .ru',
    'validate' => 'name:required,phone:required',
    'validationErrorMessage' => '<p>В форме содержатся ошибки!</p>',
    'successMessage' => '<p>Сообщение успешно отправлено. <br> Мы свяжемся в самое ближайшее время!</p>',
    'form' => '@FILE:chunks/forms/cheaper.form.tpl'
])}

<!-- modal -->
<div id="tocart-modal" class="popup" data-popup-name="gp-popup">
    <div class="popup-content">
        <header class="popup-header">
            <button class="popup__close" data-popup="close"><span class="icon-close">Close</span>
            </button>
            <h3 class="popup__title">{'lw.product-in-cart'|lexicon}!</h3>
        </header>
        <form action="" method="post" class="ajax_form form popup-body">
                <button class="btn" type="reset" data-popup="close">{'lw.continue-shopping'|lexicon}</button>
                <a href="{'27'|url}" class="btn">{'lw.proceed-to-checkout'|lexicon}</a>
        </form>
    </div>
    <div class="popup-overlay"></div>
</div>