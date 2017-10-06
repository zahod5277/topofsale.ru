{var $timestamp = ''|date_format:'%s'}
<!-- jquery -->
<script src="assets/templates/default/js/jquery.min.js"></script>
<!-- app -->
<script src="assets/templates/default/js/app.js"></script>
<script src="assets/templates/default/js/ion.rangeSlider.min.js"></script>
<script src="assets/templates/default/js/script.js?{$timestamp}"></script>
{ignore}
<!-- Yandex.Metrika counter -->
<script type="text/javascript" >
    (function (d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter46151025 = new Ya.Metrika({
                    id:46151025,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true,
                    webvisor:true,
                    trackHash:true
                });
            } catch(e) { }
        });

        var n = d.getElementsByTagName("script")[0],
            s = d.createElement("script"),
            f = function () { n.parentNode.insertBefore(s, n); };
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://mc.yandex.ru/metrika/watch.js";

        if (w.opera == "[object Opera]") {
            d.addEventListener("DOMContentLoaded", f, false);
        } else { f(); }
    })(document, window, "yandex_metrika_callbacks");
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/46151025" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
<!-- /Yandex.Metrika counter -->
{/ignore}