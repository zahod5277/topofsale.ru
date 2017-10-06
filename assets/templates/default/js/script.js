$(document).ready(function(){
   App.init(); 
});

var App = {
    init: function() {
        $("[data-fancybox]").fancybox();
        jQuery("#price-slider").slider({
            min: 0,
            max: 1000,
            values: [0, 1000],
            range: true,
            stop: function(event, ui) {
                jQuery("input#minCost").val(jQuery("#price-slider").slider("values", 0));
                jQuery("input#maxCost").val(jQuery("#price-slider").slider("values", 1));
            },
            slide: function(event, ui) {
                jQuery("input#minCost").val(jQuery("#price-slider").slider("values", 0));
                jQuery("input#maxCost").val(jQuery("#price-slider").slider("values", 1));
            }
        });
        /*range slider*/
        jQuery("input#minCost").change(function() {
            var value1 = jQuery("input#minCost").val();
            var value2 = jQuery("input#maxCost").val();

            if (parseInt(value1) > parseInt(value2)) {
                value1 = value2;
                jQuery("input#minCost").val(value1);
            }
            jQuery("#price-slider").slider("values", 0, value1);
        });

        jQuery("input#maxCost").change(function() {
            var value1 = jQuery("input#minCost").val();
            var value2 = jQuery("input#maxCost").val();
            jQuery("#price-slider").slider("values", 1, value2);
        });

        jQuery('[data-popup-id="#order"]').on('click', function() {
            var productName = jQuery(this).parents('.ms2_form').find('input[name="pagetitle"]').val();
            jQuery('#order .popup__title').html('Заказ ' + productName);
            jQuery('#order [name="product"]').val(productName);
        });
    }
};