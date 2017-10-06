$(document).ready(function () {
    App.init();
    App.Range();
    App.ionRange();
});

var App = {
    init: function () {
        $("[data-fancybox]").fancybox();
        jQuery('[data-popup-id="#order"]').on('click', function () {
            var productName = jQuery(this).parents('.ms2_form').find('input[name="pagetitle"]').val();
            jQuery('#order .popup__title').html('Заказ ' + productName);
            jQuery('#order [name="product"]').val(productName);
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
            console.log(min+'----'+max+'---'+from+'---'+to);
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
    }
};