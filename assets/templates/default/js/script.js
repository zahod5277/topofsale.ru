$(document).ready(function () {
    App.init();
    App.Range();
    App.ionRange();
    App.catalogFilterDropdown();
    App.adressTitleChanger();
});

var App = {
    init: function () {
        $("[data-fancybox]").fancybox();
        $('body').on('change', '#deliveries .radio-input', function(){
            App.adressTitleChanger();
        });
    },
    Range: function () {
        jQuery("#price-slider").slider({
            min: 0,
            max: 1000,
            values: [0, 1000],
            range: true,
            stop: function (event, ui) {
                jQuery("input#minCost").val(jQuery("#price-slider").slider("values", 0));
                jQuery("input#maxCost").val(jQuery("#price-slider").slider("values", 1));
            },
            slide: function (event, ui) {
                jQuery("input#minCost").val(jQuery("#price-slider").slider("values", 0));
                jQuery("input#maxCost").val(jQuery("#price-slider").slider("values", 1));
            }
        });
        /*range slider*/
        jQuery("input#minCost").change(function () {
            var value1 = jQuery("input#minCost").val();
            var value2 = jQuery("input#maxCost").val();

            if (parseInt(value1) > parseInt(value2)) {
                value1 = value2;
                jQuery("input#minCost").val(value1);
            }
            jQuery("#price-slider").slider("values", 0, value1);
        });

        jQuery("input#maxCost").change(function () {
            var value1 = jQuery("input#minCost").val();
            var value2 = jQuery("input#maxCost").val();
            jQuery("#price-slider").slider("values", 1, value2);
        });
    },
    ionRange: function () {
        $('.rangeSlider').each(function () {
            var $exRange = $(this),
                    min = $('.formCost').find('.min-range').text(),
                    max = $('.formCost').find('.max-range').text(),
            from = $(this).parent().find('.min').val() ? $(this).parent().find('.min').val() : min, 
            to = $(this).parent().find('.max').val() ? $(this).parent().find('.max').val() : max;
            $exRange.ionRangeSlider({
                type: "double",
                grid: false,
                min: min,
                max: max,
                from: from,
                to: to,
                prefix: "",
                onStart: function (data) {},
                onChange: function (data) {},
                onFinish: function (data) {
                    $('.formCost').find('.min').val(data.from);
                    $('.formCost').find('.max').val(data.to);
                    $(data.slider).parents('form').trigger('change');
                },
                onUpdate: function (data) {}
            });
        });
    },
    catalogFilterDropdown: function(){
        $('.filter-catalog__item-level1>a').on('click', function (e) {
            $(this).parent('li').toggleClass('filter-catalog__item-level1--active');
        });
        $('.filter-catalog__item-level1 .active').parents('.filter-catalog__item-level1').addClass('filter-catalog__item-level1--active');
    },
    adressTitleChanger: function(){
        if ($('#deliveries .radio-input:checked').val()=='1'){
            $('.form__title--delivery-hidden').html($('#deliveries .radio-input:checked').parents('.wrap-radio').find('.delivery__description').html()
                    + '<script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3Aa30ec3bdc16535b97e680acefe457d9c017f0823655b0330122c7f7eb8e74720&amp;width=100%25&amp;height=400&amp;lang=ru_RU&amp;scroll=true"></script>'
                    );
            $('.form__title--delivery').hide();
        } else {
            $('.form__title--delivery').show();
            $('.form__title--delivery-hidden').html('');
        }
    }
};