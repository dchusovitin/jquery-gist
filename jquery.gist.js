(function($) {

    "use strict";

    var GIST_URL = "https://gist.github.com",
        GIST_REGEXP = /^https?:\/\/gist\.github\.com(?:\/[^/]+)*\/([0-9a-z]+)\/?$/,
        $stylesheetContainer = $("head"),
        stylesheetLoaded = false,
        defaults = {
            timeout     : 5000,
            onLoadError : $.noop,
            onBeforeLoad: $.noop
        };

    function Gist(container, options) {
        var $container           = $(container),
            gistId               = $container.data("gist"),
            matches;

        if (
            "number" == typeof gistId ||
            (
                "string" == typeof gistId &&
                (/^[0-9]+/.test("gistId") || (matches = gistId.match(GIST_REGEXP)))
            )
        )
        {
            if (matches) {
                gistId = matches[1];
            }
        }
        else {
            // invalid gist id
            return;
        }

        $.ajax({
            url       : "https://gist.github.com/" + gistId + ".json",
            dataType  : "jsonp",
            timeout   : options.timeout,
            beforeSend: $.proxy(options.onBeforeLoad, $container)
        })
        .done(function(response) {
            if (response.stylesheet && !stylesheetLoaded) {
                stylesheetLoaded = true;
                
                $stylesheetContainer.append(
                    "<link rel='stylesheet' href='" + response.stylesheet + "' type='text/css' />"
                );
            }

            if (response.div) {
                $container.html(response.div);
            }
        })
        .error($.proxy(options.onLoadError, $container));
    }

    $.fn.gist = function(options) {
        options = $.extend({}, defaults, options);

        return this.each(function() {
            (new Gist(this, options));
        });
    };

})(jQuery);