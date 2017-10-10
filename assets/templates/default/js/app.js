/*JQUERY PLUGINS*/
/*!
 * jQuery Migrate - v3.0.0 - 2016-06-09
 * Copyright jQuery Foundation and other contributors
 */
(function (jQuery, window) {
    "use strict";


    jQuery.migrateVersion = "3.0.0";


    (function () {

        // Support: IE9 only
        // IE9 only creates console object when dev tools are first opened
        // Also, avoid Function#bind here to simplify PhantomJS usage
        var log = window.console && window.console.log &&
                function () {
                    window.console.log.apply(window.console, arguments);
                },
                rbadVersions = /^[12]\./;

        if (!log) {
            return;
        }

        // Need jQuery 3.0.0+ and no older Migrate loaded
        if (!jQuery || rbadVersions.test(jQuery.fn.jquery)) {
            log("JQMIGRATE: jQuery 3.0.0+ REQUIRED");
        }
        if (jQuery.migrateWarnings) {
            log("JQMIGRATE: Migrate plugin loaded multiple times");
        }

        // Show a message on the console so devs know we're active
        log("JQMIGRATE: Migrate is installed" +
                (jQuery.migrateMute ? "" : " with logging active") +
                ", version " + jQuery.migrateVersion);

    })();

    var warnedAbout = {};

// List of warnings already given; public read only
    jQuery.migrateWarnings = [];

// Set to false to disable traces that appear with warnings
    if (jQuery.migrateTrace === undefined) {
        jQuery.migrateTrace = true;
    }

// Forget any warnings we've already given; public
    jQuery.migrateReset = function () {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    };

    function migrateWarn(msg) {
        var console = window.console;
        if (!warnedAbout[ msg ]) {
            warnedAbout[ msg ] = true;
            jQuery.migrateWarnings.push(msg);
            if (console && console.warn && !jQuery.migrateMute) {
                console.warn("JQMIGRATE: " + msg);
                if (jQuery.migrateTrace && console.trace) {
                    console.trace();
                }
            }
        }
    }

    function migrateWarnProp(obj, prop, value, msg) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get: function () {
                migrateWarn(msg);
                return value;
            }
        });
    }

    if (document.compatMode === "BackCompat") {

        // JQuery has never supported or tested Quirks Mode
        migrateWarn("jQuery is not compatible with Quirks Mode");
    }


    var oldInit = jQuery.fn.init,
            oldIsNumeric = jQuery.isNumeric,
            oldFind = jQuery.find,
            rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/,
            rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g;

    jQuery.fn.init = function (arg1) {
        var args = Array.prototype.slice.call(arguments);

        if (typeof arg1 === "string" && arg1 === "#") {

            // JQuery( "#" ) is a bogus ID selector, but it returned an empty set before jQuery 3.0
            migrateWarn("jQuery( '#' ) is not a valid selector");
            args[ 0 ] = [];
        }

        return oldInit.apply(this, args);
    };
    jQuery.fn.init.prototype = jQuery.fn;

    jQuery.find = function (selector) {
        var args = Array.prototype.slice.call(arguments);

        // Support: PhantomJS 1.x
        // String#match fails to match when used with a //g RegExp, only on some strings
        if (typeof selector === "string" && rattrHashTest.test(selector)) {

            // The nonstandard and undocumented unquoted-hash was removed in jQuery 1.12.0
            // First see if qS thinks it's a valid selector, if so avoid a false positive
            try {
                document.querySelector(selector);
            } catch (err1) {

                // Didn't *look* valid to qSA, warn and try quoting what we think is the value
                selector = selector.replace(rattrHashGlob, function (_, attr, op, value) {
                    return "[" + attr + op + "\"" + value + "\"]";
                });

                // If the regexp *may* have created an invalid selector, don't update it
                // Note that there may be false alarms if selector uses jQuery extensions
                try {
                    document.querySelector(selector);
                    migrateWarn("Attribute selector with '#' must be quoted: " + args[ 0 ]);
                    args[ 0 ] = selector;
                } catch (err2) {
                    migrateWarn("Attribute selector with '#' was not fixed: " + args[ 0 ]);
                }
            }
        }

        return oldFind.apply(this, args);
    };

// Copy properties attached to original jQuery.find method (e.g. .attr, .isXML)
    var findProp;
    for (findProp in oldFind) {
        if (Object.prototype.hasOwnProperty.call(oldFind, findProp)) {
            jQuery.find[ findProp ] = oldFind[ findProp ];
        }
    }

// The number of elements contained in the matched element set
    jQuery.fn.size = function () {
        migrateWarn("jQuery.fn.size() is deprecated; use the .length property");
        return this.length;
    };

    jQuery.parseJSON = function () {
        migrateWarn("jQuery.parseJSON is deprecated; use JSON.parse");
        return JSON.parse.apply(null, arguments);
    };

    jQuery.isNumeric = function (val) {

        // The jQuery 2.2.3 implementation of isNumeric
        function isNumeric2(obj) {
            var realStringObj = obj && obj.toString();
            return !jQuery.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
        }

        var newValue = oldIsNumeric(val),
                oldValue = isNumeric2(val);

        if (newValue !== oldValue) {
            migrateWarn("jQuery.isNumeric() should not be called on constructed objects");
        }

        return oldValue;
    };

    migrateWarnProp(jQuery, "unique", jQuery.uniqueSort,
            "jQuery.unique is deprecated, use jQuery.uniqueSort");

// Now jQuery.expr.pseudos is the standard incantation
    migrateWarnProp(jQuery.expr, "filters", jQuery.expr.pseudos,
            "jQuery.expr.filters is now jQuery.expr.pseudos");
    migrateWarnProp(jQuery.expr, ":", jQuery.expr.pseudos,
            "jQuery.expr[\":\"] is now jQuery.expr.pseudos");


    var oldAjax = jQuery.ajax;

    jQuery.ajax = function ( ) {
        var jQXHR = oldAjax.apply(this, arguments);

        // Be sure we got a jQXHR (e.g., not sync)
        if (jQXHR.promise) {
            migrateWarnProp(jQXHR, "success", jQXHR.done,
                    "jQXHR.success is deprecated and removed");
            migrateWarnProp(jQXHR, "error", jQXHR.fail,
                    "jQXHR.error is deprecated and removed");
            migrateWarnProp(jQXHR, "complete", jQXHR.always,
                    "jQXHR.complete is deprecated and removed");
        }

        return jQXHR;
    };


    var oldRemoveAttr = jQuery.fn.removeAttr,
            oldToggleClass = jQuery.fn.toggleClass,
            rmatchNonSpace = /\S+/g;

    jQuery.fn.removeAttr = function (name) {
        var self = this;

        jQuery.each(name.match(rmatchNonSpace), function (i, attr) {
            if (jQuery.expr.match.bool.test(attr)) {
                migrateWarn("jQuery.fn.removeAttr no longer sets boolean properties: " + attr);
                self.prop(attr, false);
            }
        });

        return oldRemoveAttr.apply(this, arguments);
    };

    jQuery.fn.toggleClass = function (state) {

        // Only deprecating no-args or single boolean arg
        if (state !== undefined && typeof state !== "boolean") {
            return oldToggleClass.apply(this, arguments);
        }

        migrateWarn("jQuery.fn.toggleClass( boolean ) is deprecated");

        // Toggle entire class name of each element
        return this.each(function () {
            var className = this.getAttribute && this.getAttribute("class") || "";

            if (className) {
                jQuery.data(this, "__className__", className);
            }

            // If the element has a class name or if we're passed `false`,
            // then remove the whole classname (if there was one, the above saved it).
            // Otherwise bring back whatever was previously saved (if anything),
            // falling back to the empty string if nothing was stored.
            if (this.setAttribute) {
                this.setAttribute("class",
                        className || state === false ?
                        "" :
                        jQuery.data(this, "__className__") || ""
                        );
            }
        });
    };


    var internalSwapCall = false;

// If this version of jQuery has .swap(), don't false-alarm on internal uses
    if (jQuery.swap) {
        jQuery.each(["height", "width", "reliableMarginRight"], function (_, name) {
            var oldHook = jQuery.cssHooks[ name ] && jQuery.cssHooks[ name ].get;

            if (oldHook) {
                jQuery.cssHooks[ name ].get = function () {
                    var ret;

                    internalSwapCall = true;
                    ret = oldHook.apply(this, arguments);
                    internalSwapCall = false;
                    return ret;
                };
            }
        });
    }

    jQuery.swap = function (elem, options, callback, args) {
        var ret, name,
                old = {};

        if (!internalSwapCall) {
            migrateWarn("jQuery.swap() is undocumented and deprecated");
        }

        // Remember the old values, and insert the new ones
        for (name in options) {
            old[ name ] = elem.style[ name ];
            elem.style[ name ] = options[ name ];
        }

        ret = callback.apply(elem, args || []);

        // Revert the old values
        for (name in options) {
            elem.style[ name ] = old[ name ];
        }

        return ret;
    };

    var oldData = jQuery.data;

    jQuery.data = function (elem, name, value) {
        var curData;

        // If the name is transformed, look for the un-transformed name in the data object
        if (name && name !== jQuery.camelCase(name)) {
            curData = jQuery.hasData(elem) && oldData.call(this, elem);
            if (curData && name in curData) {
                migrateWarn("jQuery.data() always sets/gets camelCased names: " + name);
                if (arguments.length > 2) {
                    curData[ name ] = value;
                }
                return curData[ name ];
            }
        }

        return oldData.apply(this, arguments);
    };

    var oldTweenRun = jQuery.Tween.prototype.run;

    jQuery.Tween.prototype.run = function (percent) {
        if (jQuery.easing[ this.easing ].length > 1) {
            migrateWarn(
                    "easing function " +
                    "\"jQuery.easing." + this.easing.toString() +
                    "\" should use only first argument"
                    );

            jQuery.easing[ this.easing ] = jQuery.easing[ this.easing ].bind(
                    jQuery.easing,
                    percent, this.options.duration * percent, 0, 1, this.options.duration
                    );
        }

        oldTweenRun.apply(this, arguments);
    };

    var oldLoad = jQuery.fn.load,
            originalFix = jQuery.event.fix;

    jQuery.event.props = [];
    jQuery.event.fixHooks = {};

    jQuery.event.fix = function (originalEvent) {
        var event,
                type = originalEvent.type,
                fixHook = this.fixHooks[ type ],
                props = jQuery.event.props;

        if (props.length) {
            migrateWarn("jQuery.event.props are deprecated and removed: " + props.join());
            while (props.length) {
                jQuery.event.addProp(props.pop());
            }
        }

        if (fixHook && !fixHook._migrated_) {
            fixHook._migrated_ = true;
            migrateWarn("jQuery.event.fixHooks are deprecated and removed: " + type);
            if ((props = fixHook.props) && props.length) {
                while (props.length) {
                    jQuery.event.addProp(props.pop());
                }
            }
        }

        event = originalFix.call(this, originalEvent);

        return fixHook && fixHook.filter ? fixHook.filter(event, originalEvent) : event;
    };

    jQuery.each(["load", "unload", "error"], function (_, name) {

        jQuery.fn[ name ] = function () {
            var args = Array.prototype.slice.call(arguments, 0);

            // If this is an ajax load() the first arg should be the string URL;
            // technically this could also be the "Anything" arg of the event .load()
            // which just goes to show why this dumb signature has been deprecated!
            // jQuery custom builds that exclude the Ajax module justifiably die here.
            if (name === "load" && typeof args[ 0 ] === "string") {
                return oldLoad.apply(this, args);
            }

            migrateWarn("jQuery.fn." + name + "() is deprecated");

            args.splice(0, 0, name);
            if (arguments.length) {
                return this.on.apply(this, args);
            }

            // Use .triggerHandler here because:
            // - load and unload events don't need to bubble, only applied to window or image
            // - error event should not bubble to window, although it does pre-1.7
            // See http://bugs.jquery.com/ticket/11820
            this.triggerHandler.apply(this, args);
            return this;
        };

    });

// Trigger "ready" event only once, on document ready
    jQuery(function () {
        jQuery(document).triggerHandler("ready");
    });

    jQuery.event.special.ready = {
        setup: function () {
            if (this === document) {
                migrateWarn("'ready' event is deprecated");
            }
        }
    };

    jQuery.fn.extend({

        bind: function (types, data, fn) {
            migrateWarn("jQuery.fn.bind() is deprecated");
            return this.on(types, null, data, fn);
        },
        unbind: function (types, fn) {
            migrateWarn("jQuery.fn.unbind() is deprecated");
            return this.off(types, null, fn);
        },
        delegate: function (selector, types, data, fn) {
            migrateWarn("jQuery.fn.delegate() is deprecated");
            return this.on(types, selector, data, fn);
        },
        undelegate: function (selector, types, fn) {
            migrateWarn("jQuery.fn.undelegate() is deprecated");
            return arguments.length === 1 ?
                    this.off(selector, "**") :
                    this.off(types, selector || "**", fn);
        }
    });


    var oldOffset = jQuery.fn.offset;

    jQuery.fn.offset = function () {
        var docElem,
                elem = this[ 0 ],
                origin = {top: 0, left: 0};

        if (!elem || !elem.nodeType) {
            migrateWarn("jQuery.fn.offset() requires a valid DOM element");
            return origin;
        }

        docElem = (elem.ownerDocument || document).documentElement;
        if (!jQuery.contains(docElem, elem)) {
            migrateWarn("jQuery.fn.offset() requires an element connected to a document");
            return origin;
        }

        return oldOffset.apply(this, arguments);
    };


    var oldParam = jQuery.param;

    jQuery.param = function (data, traditional) {
        var ajaxTraditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;

        if (traditional === undefined && ajaxTraditional) {

            migrateWarn("jQuery.param() no longer uses jQuery.ajaxSettings.traditional");
            traditional = ajaxTraditional;
        }

        return oldParam.call(this, data, traditional);
    };

    var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

    jQuery.fn.andSelf = function () {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
        return oldSelf.apply(this, arguments);
    };


    var oldDeferred = jQuery.Deferred,
            tuples = [

                // Action, add listener, callbacks, .then handlers, final state
                ["resolve", "done", jQuery.Callbacks("once memory"),
                    jQuery.Callbacks("once memory"), "resolved"],
                ["reject", "fail", jQuery.Callbacks("once memory"),
                    jQuery.Callbacks("once memory"), "rejected"],
                ["notify", "progress", jQuery.Callbacks("memory"),
                    jQuery.Callbacks("memory")]
            ];

    jQuery.Deferred = function (func) {
        var deferred = oldDeferred(),
                promise = deferred.promise();

        deferred.pipe = promise.pipe = function ( /* fnDone, fnFail, fnProgress */ ) {
            var fns = arguments;

            migrateWarn("deferred.pipe() is deprecated");

            return jQuery.Deferred(function (newDefer) {
                jQuery.each(tuples, function (i, tuple) {
                    var fn = jQuery.isFunction(fns[ i ]) && fns[ i ];

                    // Deferred.done(function() { bind to newDefer or newDefer.resolve })
                    // deferred.fail(function() { bind to newDefer or newDefer.reject })
                    // deferred.progress(function() { bind to newDefer or newDefer.notify })
                    deferred[ tuple[ 1 ] ](function () {
                        var returned = fn && fn.apply(this, arguments);
                        if (returned && jQuery.isFunction(returned.promise)) {
                            returned.promise()
                                    .done(newDefer.resolve)
                                    .fail(newDefer.reject)
                                    .progress(newDefer.notify);
                        } else {
                            newDefer[ tuple[ 0 ] + "With" ](
                                    this === promise ? newDefer.promise() : this,
                                    fn ? [returned] : arguments
                                    );
                        }
                    });
                });
                fns = null;
            }).promise();

        };

        if (func) {
            func.call(deferred, deferred);
        }

        return deferred;
    };



})(jQuery, window);

/*!
 * jQuery Validation Plugin v1.15.0
 *
 * http://jqueryvalidation.org/
 *
 * Copyright (c) 2016 Jörn Zaefferer
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("jquery"));
    } else {
        factory(jQuery);
    }
}(function ($) {

    $.extend($.fn, {

        // http://jqueryvalidation.org/validate/
        validate: function (options) {

            // If nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // Check if a validator for this form was already created
            var validator = $.data(this[ 0 ], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(options, this[ 0 ]);
            $.data(this[ 0 ], "validator", validator);

            if (validator.settings.onsubmit) {

                this.on("click.validate", ":submit", function (event) {
                    if (validator.settings.submitHandler) {
                        validator.submitButton = event.target;
                    }

                    // Allow suppressing validation by adding a cancel class to the submit button
                    if ($(this).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }

                    // Allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(this).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });

                // Validate the form on submit
                this.on("submit.validate", function (event) {
                    if (validator.settings.debug) {

                        // Prevent form submit to be able to see console output
                        event.preventDefault();
                    }
                    function handle() {
                        var hidden, result;
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {

                                // Insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>")
                                        .attr("name", validator.submitButton.name)
                                        .val($(validator.submitButton).val())
                                        .appendTo(validator.currentForm);
                            }
                            result = validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (validator.submitButton) {

                                // And clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            if (result !== undefined) {
                                return result;
                            }
                            return false;
                        }
                        return true;
                    }

                    // Prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },

        // http://jqueryvalidation.org/valid/
        valid: function () {
            var valid, validator, errorList;

            if ($(this[ 0 ]).is("form")) {
                valid = this.validate().form();
            } else {
                errorList = [];
                valid = true;
                validator = $(this[ 0 ].form).validate();
                this.each(function () {
                    valid = validator.element(this) && valid;
                    if (!valid) {
                        errorList = errorList.concat(validator.errorList);
                    }
                });
                validator.errorList = errorList;
            }
            return valid;
        },

        // http://jqueryvalidation.org/rules/
        rules: function (command, argument) {

            // If nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                return;
            }

            var element = this[ 0 ],
                    settings, staticRules, existingRules, data, param, filtered;

            if (command) {
                settings = $.data(element.form, "validator").settings;
                staticRules = settings.rules;
                existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));

                        // Remove messages from rules, but allow them to be set separately
                        delete existingRules.messages;
                        staticRules[ element.name ] = existingRules;
                        if (argument.messages) {
                            settings.messages[ element.name ] = $.extend(settings.messages[ element.name ], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[ element.name ];
                            return existingRules;
                        }
                        filtered = {};
                        $.each(argument.split(/\s/), function (index, method) {
                            filtered[ method ] = existingRules[ method ];
                            delete existingRules[ method ];
                            if (method === "required") {
                                $(element).removeAttr("aria-required");
                            }
                        });
                        return filtered;
                }
            }

            data = $.validator.normalizeRules(
                    $.extend(
                            {},
                            $.validator.classRules(element),
                            $.validator.attributeRules(element),
                            $.validator.dataRules(element),
                            $.validator.staticRules(element)
                            ), element);

            // Make sure required is at front
            if (data.required) {
                param = data.required;
                delete data.required;
                data = $.extend({required: param}, data);
                $(element).attr("aria-required", "true");
            }

            // Make sure remote is at back
            if (data.remote) {
                param = data.remote;
                delete data.remote;
                data = $.extend(data, {remote: param});
            }

            return data;
        }
    });

// Custom selectors
    $.extend($.expr[ ":" ], {

        // http://jqueryvalidation.org/blank-selector/
        blank: function (a) {
            return !$.trim("" + $(a).val());
        },

        // http://jqueryvalidation.org/filled-selector/
        filled: function (a) {
            var val = $(a).val();
            return val !== null && !!$.trim("" + val);
        },

        // http://jqueryvalidation.org/unchecked-selector/
        unchecked: function (a) {
            return !$(a).prop("checked");
        }
    });

// Constructor for validator
    $.validator = function (options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

// http://jqueryvalidation.org/jQuery.validator.format/
    $.validator.format = function (source, params) {
        if (arguments.length === 1) {
            return function () {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (params === undefined) {
            return source;
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function () {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {

        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            pendingClass: "pending",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: false,
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            ignore: ":hidden",
            ignoreTitle: false,
            onfocusin: function (element) {
                this.lastActive = element;

                // Hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.hideThese(this.errorsFor(element));
                }
            },
            onfocusout: function (element) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function (element, event) {

                // Avoid revalidate the field when pressing one of the following keys
                // Shift       => 16
                // Ctrl        => 17
                // Alt         => 18
                // Caps lock   => 20
                // End         => 35
                // Home        => 36
                // Left arrow  => 37
                // Up arrow    => 38
                // Right arrow => 39
                // Down arrow  => 40
                // Insert      => 45
                // Num lock    => 144
                // AltGr key   => 225
                var excludedKeys = [
                    16, 17, 18, 20, 35, 36, 37,
                    38, 39, 40, 45, 144, 225
                ];

                if (event.which === 9 && this.elementValue(element) === "" || $.inArray(event.keyCode, excludedKeys) !== -1) {
                    return;
                } else if (element.name in this.submitted || element.name in this.invalid) {
                    this.element(element);
                }
            },
            onclick: function (element) {

                // Click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);

                    // Or option elements, check parent select in that case
                } else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function (element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },

        // http://jqueryvalidation.org/jQuery.validator.setDefaults/
        setDefaults: function (settings) {
            $.extend($.validator.defaults, settings);
        },

        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date ( ISO ).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            equalTo: "Please enter the same value again.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}."),
            step: $.validator.format("Please enter a multiple of {0}.")
        },

        autoCreateRanges: false,

        prototype: {

            init: function () {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {}),
                        rules;
                $.each(this.settings.groups, function (key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function (index, name) {
                        groups[ name ] = key;
                    });
                });
                rules = this.settings.rules;
                $.each(rules, function (key, value) {
                    rules[ key ] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this.form, "validator"),
                            eventType = "on" + event.type.replace(/^validate/, ""),
                            settings = validator.settings;
                    if (settings[ eventType ] && !$(this).is(settings.ignore)) {
                        settings[ eventType ].call(validator, this, event);
                    }
                }

                $(this.currentForm)
                        .on("focusin.validate focusout.validate keyup.validate",
                                ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], " +
                                "[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], " +
                                "[type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], " +
                                "[type='radio'], [type='checkbox'], [contenteditable]", delegate)

                        // Support: Chrome, oldIE
                        // "select" is provided as event.target when clicking a option
                        .on("click.validate", "select, option, [type='radio'], [type='checkbox']", delegate);

                if (this.settings.invalidHandler) {
                    $(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler);
                }

                // Add aria-required to any Static/Data/Class required fields before first validation
                // Screen readers require this attribute to be present before the initial submission http://www.w3.org/TR/WCAG-TECHS/ARIA2.html
                $(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true");
            },

            // http://jqueryvalidation.org/Validator.form/
            form: function () {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },

            checkForm: function () {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[ i ]; i++) {
                    this.check(elements[ i ]);
                }
                return this.valid();
            },

            // http://jqueryvalidation.org/Validator.element/
            element: function (element) {
                var cleanElement = this.clean(element),
                        checkElement = this.validationTargetFor(cleanElement),
                        v = this,
                        result = true,
                        rs, group;

                if (checkElement === undefined) {
                    delete this.invalid[ cleanElement.name ];
                } else {
                    this.prepareElement(checkElement);
                    this.currentElements = $(checkElement);

                    // If this element is grouped, then validate all group elements already
                    // containing a value
                    group = this.groups[ checkElement.name ];
                    if (group) {
                        $.each(this.groups, function (name, testgroup) {
                            if (testgroup === group && name !== checkElement.name) {
                                cleanElement = v.validationTargetFor(v.clean(v.findByName(name)));
                                if (cleanElement && cleanElement.name in v.invalid) {
                                    v.currentElements.push(cleanElement);
                                    result = result && v.check(cleanElement);
                                }
                            }
                        });
                    }

                    rs = this.check(checkElement) !== false;
                    result = result && rs;
                    if (rs) {
                        this.invalid[ checkElement.name ] = false;
                    } else {
                        this.invalid[ checkElement.name ] = true;
                    }

                    if (!this.numberOfInvalids()) {

                        // Hide error containers on last error
                        this.toHide = this.toHide.add(this.containers);
                    }
                    this.showErrors();

                    // Add aria-invalid status for screen readers
                    $(element).attr("aria-invalid", !rs);
                }

                return result;
            },

            // http://jqueryvalidation.org/Validator.showErrors/
            showErrors: function (errors) {
                if (errors) {
                    var validator = this;

                    // Add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = $.map(this.errorMap, function (message, name) {
                        return {
                            message: message,
                            element: validator.findByName(name)[ 0 ]
                        };
                    });

                    // Remove items from success list
                    this.successList = $.grep(this.successList, function (element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                } else {
                    this.defaultShowErrors();
                }
            },

            // http://jqueryvalidation.org/Validator.resetForm/
            resetForm: function () {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.invalid = {};
                this.submitted = {};
                this.prepareForm();
                this.hideErrors();
                var elements = this.elements()
                        .removeData("previousValue")
                        .removeAttr("aria-invalid");

                this.resetElements(elements);
            },

            resetElements: function (elements) {
                var i;

                if (this.settings.unhighlight) {
                    for (i = 0; elements[ i ]; i++) {
                        this.settings.unhighlight.call(this, elements[ i ],
                                this.settings.errorClass, "");
                        this.findByName(elements[ i ].name).removeClass(this.settings.validClass);
                    }
                } else {
                    elements
                            .removeClass(this.settings.errorClass)
                            .removeClass(this.settings.validClass);
                }
            },

            numberOfInvalids: function () {
                return this.objectLength(this.invalid);
            },

            objectLength: function (obj) {
                /* jshint unused: false */
                var count = 0,
                        i;
                for (i in obj) {
                    if (obj[ i ]) {
                        count++;
                    }
                }
                return count;
            },

            hideErrors: function () {
                this.hideThese(this.toHide);
            },

            hideThese: function (errors) {
                errors.not(this.containers).text("");
                this.addWrapper(errors).hide();
            },

            valid: function () {
                return this.size() === 0;
            },

            size: function () {
                return this.errorList.length;
            },

            focusInvalid: function () {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[ 0 ].element || [])
                                .filter(":visible")
                                .focus()

                                // Manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                                .trigger("focusin");
                    } catch (e) {

                        // Ignore IE throwing errors when focusing hidden elements
                    }
                }
            },

            findLastActive: function () {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function (n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },

            elements: function () {
                var validator = this,
                        rulesCache = {};

                // Select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                        .find("input, select, textarea, [contenteditable]")
                        .not(":submit, :reset, :image, :disabled")
                        .not(this.settings.ignore)
                        .filter(function () {
                            var name = this.name || $(this).attr("name"); // For contenteditable
                            if (!name && validator.settings.debug && window.console) {
                                console.error("%o has no name assigned", this);
                            }

                            // Set form expando on contenteditable
                            if (this.hasAttribute("contenteditable")) {
                                this.form = $(this).closest("form")[ 0 ];
                            }

                            // Select only the first element for each name, and only those with rules specified
                            if (name in rulesCache || !validator.objectLength($(this).rules())) {
                                return false;
                            }

                            rulesCache[ name ] = true;
                            return true;
                        });
            },

            clean: function (selector) {
                return $(selector)[ 0 ];
            },

            errors: function () {
                var errorClass = this.settings.errorClass.split(" ").join(".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },

            resetInternals: function () {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
            },

            reset: function () {
                this.resetInternals();
                this.currentElements = $([]);
            },

            prepareForm: function () {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },

            prepareElement: function (element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },

            elementValue: function (element) {
                var $element = $(element),
                        type = element.type,
                        val, idx;

                if (type === "radio" || type === "checkbox") {
                    return this.findByName(element.name).filter(":checked").val();
                } else if (type === "number" && typeof element.validity !== "undefined") {
                    return element.validity.badInput ? "NaN" : $element.val();
                }

                if (element.hasAttribute("contenteditable")) {
                    val = $element.text();
                } else {
                    val = $element.val();
                }

                if (type === "file") {

                    // Modern browser (chrome & safari)
                    if (val.substr(0, 12) === "C:\\fakepath\\") {
                        return val.substr(12);
                    }

                    // Legacy browsers
                    // Unix-based path
                    idx = val.lastIndexOf("/");
                    if (idx >= 0) {
                        return val.substr(idx + 1);
                    }

                    // Windows-based path
                    idx = val.lastIndexOf("\\");
                    if (idx >= 0) {
                        return val.substr(idx + 1);
                    }

                    // Just the file name
                    return val;
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },

            check: function (element) {
                element = this.validationTargetFor(this.clean(element));

                var rules = $(element).rules(),
                        rulesCount = $.map(rules, function (n, i) {
                            return i;
                        }).length,
                        dependencyMismatch = false,
                        val = this.elementValue(element),
                        result, method, rule;

                // If a normalizer is defined for this element, then
                // call it to retreive the changed value instead
                // of using the real one.
                // Note that `this` in the normalizer is `element`.
                if (typeof rules.normalizer === "function") {
                    val = rules.normalizer.call(element, val);

                    if (typeof val !== "string") {
                        throw new TypeError("The normalizer should return a string value.");
                    }

                    // Delete the normalizer from rules to avoid treating
                    // it as a pre-defined method.
                    delete rules.normalizer;
                }

                for (method in rules) {
                    rule = {method: method, parameters: rules[ method ]};
                    try {
                        result = $.validator.methods[ method ].call(this, val, element, rule.parameters);

                        // If a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch" && rulesCount === 1) {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }

                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        if (e instanceof TypeError) {
                            e.message += ".  Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.";
                        }

                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },

            // Return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            // return the generic message if present and no method specific message is present
            customDataMessage: function (element, method) {
                return $(element).data("msg" + method.charAt(0).toUpperCase() +
                        method.substring(1).toLowerCase()) || $(element).data("msg");
            },

            // Return the custom message for the given element name and validation method
            customMessage: function (name, method) {
                var m = this.settings.messages[ name ];
                return m && (m.constructor === String ? m : m[ method ]);
            },

            // Return the first defined argument, allowing empty strings
            findDefined: function () {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[ i ] !== undefined) {
                        return arguments[ i ];
                    }
                }
                return undefined;
            },

            defaultMessage: function (element, rule) {
                var message = this.findDefined(
                        this.customMessage(element.name, rule.method),
                        this.customDataMessage(element, rule.method),
                        // 'title' is never undefined, so handle empty string as undefined
                        !this.settings.ignoreTitle && element.title || undefined,
                        $.validator.messages[ rule.method ],
                        "<strong>Warning: No message defined for " + element.name + "</strong>"
                        ),
                        theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }

                return message;
            },

            formatAndAdd: function (element, rule) {
                var message = this.defaultMessage(element, rule);

                this.errorList.push({
                    message: message,
                    element: element,
                    method: rule.method
                });

                this.errorMap[ element.name ] = message;
                this.submitted[ element.name ] = message;
            },

            addWrapper: function (toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },

            defaultShowErrors: function () {
                var i, elements, error;
                for (i = 0; this.errorList[ i ]; i++) {
                    error = this.errorList[ i ];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[ i ]; i++) {
                        this.showLabel(this.successList[ i ]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[ i ]; i++) {
                        this.settings.unhighlight.call(this, elements[ i ], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },

            validElements: function () {
                return this.currentElements.not(this.invalidElements());
            },

            invalidElements: function () {
                return $(this.errorList).map(function () {
                    return this.element;
                });
            },

            showLabel: function (element, message) {
                var place, group, errorID, v,
                        error = this.errorsFor(element),
                        elementID = this.idOrName(element),
                        describedBy = $(element).attr("aria-describedby");

                if (error.length) {

                    // Refresh error/success class
                    error.removeClass(this.settings.validClass).addClass(this.settings.errorClass);

                    // Replace message on existing label
                    error.html(message);
                } else {

                    // Create error element
                    error = $("<" + this.settings.errorElement + ">")
                            .attr("id", elementID + "-error")
                            .addClass(this.settings.errorClass)
                            .html(message || "");

                    // Maintain reference to the element to be placed into the DOM
                    place = error;
                    if (this.settings.wrapper) {

                        // Make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        place = error.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (this.labelContainer.length) {
                        this.labelContainer.append(place);
                    } else if (this.settings.errorPlacement) {
                        this.settings.errorPlacement(place, $(element));
                    } else {
                        place.insertAfter(element);
                    }

                    // Link error back to the element
                    if (error.is("label")) {

                        // If the error is a label, then associate using 'for'
                        error.attr("for", elementID);

                        // If the element is not a child of an associated label, then it's necessary
                        // to explicitly apply aria-describedby
                    } else if (error.parents("label[for='" + this.escapeCssMeta(elementID) + "']").length === 0) {
                        errorID = error.attr("id");

                        // Respect existing non-error aria-describedby
                        if (!describedBy) {
                            describedBy = errorID;
                        } else if (!describedBy.match(new RegExp("\\b" + this.escapeCssMeta(errorID) + "\\b"))) {

                            // Add to end of list if not already present
                            describedBy += " " + errorID;
                        }
                        $(element).attr("aria-describedby", describedBy);

                        // If this element is grouped, then assign to all elements in the same group
                        group = this.groups[ element.name ];
                        if (group) {
                            v = this;
                            $.each(v.groups, function (name, testgroup) {
                                if (testgroup === group) {
                                    $("[name='" + v.escapeCssMeta(name) + "']", v.currentForm)
                                            .attr("aria-describedby", error.attr("id"));
                                }
                            });
                        }
                    }
                }
                if (!message && this.settings.success) {
                    error.text("");
                    if (typeof this.settings.success === "string") {
                        error.addClass(this.settings.success);
                    } else {
                        this.settings.success(error, element);
                    }
                }
                this.toShow = this.toShow.add(error);
            },

            errorsFor: function (element) {
                var name = this.escapeCssMeta(this.idOrName(element)),
                        describer = $(element).attr("aria-describedby"),
                        selector = "label[for='" + name + "'], label[for='" + name + "'] *";

                // 'aria-describedby' should directly reference the error element
                if (describer) {
                    selector = selector + ", #" + this.escapeCssMeta(describer)
                            .replace(/\s+/g, ", #");
                }

                return this
                        .errors()
                        .filter(selector);
            },

            // See https://api.jquery.com/category/selectors/, for CSS
            // meta-characters that should be escaped in order to be used with JQuery
            // as a literal part of a name/id or any selector.
            escapeCssMeta: function (string) {
                return string.replace(/([\\!"#$%&'()*+,./:;<=>?@\[\]^`{|}~])/g, "\\$1");
            },

            idOrName: function (element) {
                return this.groups[ element.name ] || (this.checkable(element) ? element.name : element.id || element.name);
            },

            validationTargetFor: function (element) {

                // If radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name);
                }

                // Always apply ignore filter
                return $(element).not(this.settings.ignore)[ 0 ];
            },

            checkable: function (element) {
                return (/radio|checkbox/i).test(element.type);
            },

            findByName: function (name) {
                return $(this.currentForm).find("[name='" + this.escapeCssMeta(name) + "']");
            },

            getLength: function (value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },

            depend: function (param, element) {
                return this.dependTypes[ typeof param ] ? this.dependTypes[ typeof param ](param, element) : true;
            },

            dependTypes: {
                "boolean": function (param) {
                    return param;
                },
                "string": function (param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function (param, element) {
                    return param(element);
                }
            },

            optional: function (element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },

            startRequest: function (element) {
                if (!this.pending[ element.name ]) {
                    this.pendingRequest++;
                    $(element).addClass(this.settings.pendingClass);
                    this.pending[ element.name ] = true;
                }
            },

            stopRequest: function (element, valid) {
                this.pendingRequest--;

                // Sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[ element.name ];
                $(element).removeClass(this.settings.pendingClass);
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },

            previousValue: function (element, method) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, {method: method})
                });
            },

            // Cleans up all forms and elements, removes validator-specific events
            destroy: function () {
                this.resetForm();

                $(this.currentForm)
                        .off(".validate")
                        .removeData("validator")
                        .find(".validate-equalTo-blur")
                        .off(".validate-equalTo")
                        .removeClass("validate-equalTo-blur");
            }

        },

        classRuleSettings: {
            required: {required: true},
            email: {email: true},
            url: {url: true},
            date: {date: true},
            dateISO: {dateISO: true},
            number: {number: true},
            digits: {digits: true},
            creditcard: {creditcard: true}
        },

        addClassRules: function (className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[ className ] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },

        classRules: function (element) {
            var rules = {},
                    classes = $(element).attr("class");

            if (classes) {
                $.each(classes.split(" "), function () {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[ this ]);
                    }
                });
            }
            return rules;
        },

        normalizeAttributeRule: function (rules, type, method, value) {

            // Convert the value to a number for number inputs, and for text for backwards compability
            // allows type="date" and others to be compared as strings
            if (/min|max|step/.test(method) && (type === null || /number|range|text/.test(type))) {
                value = Number(value);

                // Support Opera Mini, which returns NaN for undefined minlength
                if (isNaN(value)) {
                    value = undefined;
                }
            }

            if (value || value === 0) {
                rules[ method ] = value;
            } else if (type === method && type !== "range") {

                // Exception: the jquery validate 'range' method
                // does not test for the html5 'range' type
                rules[ method ] = true;
            }
        },

        attributeRules: function (element) {
            var rules = {},
                    $element = $(element),
                    type = element.getAttribute("type"),
                    method, value;

            for (method in $.validator.methods) {

                // Support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = element.getAttribute(method);

                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }

                    // Force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                this.normalizeAttributeRule(rules, type, method, value);
            }

            // 'maxlength' may be returned as -1, 2147483647 ( IE ) and 524288 ( safari ) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },

        dataRules: function (element) {
            var rules = {},
                    $element = $(element),
                    type = element.getAttribute("type"),
                    method, value;

            for (method in $.validator.methods) {
                value = $element.data("rule" + method.charAt(0).toUpperCase() + method.substring(1).toLowerCase());
                this.normalizeAttributeRule(rules, type, method, value);
            }
            return rules;
        },

        staticRules: function (element) {
            var rules = {},
                    validator = $.data(element.form, "validator");

            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[ element.name ]) || {};
            }
            return rules;
        },

        normalizeRules: function (rules, element) {

            // Handle dependency check
            $.each(rules, function (prop, val) {

                // Ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[ prop ];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[ prop ] = val.param !== undefined ? val.param : true;
                    } else {
                        $.data(element.form, "validator").resetElements($(element));
                        delete rules[ prop ];
                    }
                }
            });

            // Evaluate parameters
            $.each(rules, function (rule, parameter) {
                rules[ rule ] = $.isFunction(parameter) && rule !== "normalizer" ? parameter(element) : parameter;
            });

            // Clean number parameters
            $.each(["minlength", "maxlength"], function () {
                if (rules[ this ]) {
                    rules[ this ] = Number(rules[ this ]);
                }
            });
            $.each(["rangelength", "range"], function () {
                var parts;
                if (rules[ this ]) {
                    if ($.isArray(rules[ this ])) {
                        rules[ this ] = [Number(rules[ this ][ 0 ]), Number(rules[ this ][ 1 ])];
                    } else if (typeof rules[ this ] === "string") {
                        parts = rules[ this ].replace(/[\[\]]/g, "").split(/[\s,]+/);
                        rules[ this ] = [Number(parts[ 0 ]), Number(parts[ 1 ])];
                    }
                }
            });

            if ($.validator.autoCreateRanges) {

                // Auto-create ranges
                if (rules.min != null && rules.max != null) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength != null && rules.maxlength != null) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },

        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function (data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function () {
                    transformed[ this ] = true;
                });
                data = transformed;
            }
            return data;
        },

        // http://jqueryvalidation.org/jQuery.validator.addMethod/
        addMethod: function (name, method, message) {
            $.validator.methods[ name ] = method;
            $.validator.messages[ name ] = message !== undefined ? message : $.validator.messages[ name ];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },

        // http://jqueryvalidation.org/jQuery.validator.methods/
        methods: {

            // http://jqueryvalidation.org/required-method/
            required: function (value, element, param) {

                // Check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {

                    // Could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return value.length > 0;
            },

            // http://jqueryvalidation.org/email-method/
            email: function (value, element) {

                // From https://html.spec.whatwg.org/multipage/forms.html#valid-e-mail-address
                // Retrieved 2014-01-14
                // If you have a problem with this implementation, report a bug against the above spec
                // Or use custom methods to implement your own email validation
                return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value);
            },

            // http://jqueryvalidation.org/url-method/
            url: function (value, element) {

                // Copyright (c) 2010-2013 Diego Perini, MIT licensed
                // https://gist.github.com/dperini/729294
                // see also https://mathiasbynens.be/demo/url-regex
                // modified to allow protocol-relative URLs
                return this.optional(element) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
            },

            // http://jqueryvalidation.org/date-method/
            date: function (value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },

            // http://jqueryvalidation.org/dateISO-method/
            dateISO: function (value, element) {
                return this.optional(element) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value);
            },

            // http://jqueryvalidation.org/number-method/
            number: function (value, element) {
                return this.optional(element) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },

            // http://jqueryvalidation.org/digits-method/
            digits: function (value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },

            // http://jqueryvalidation.org/minlength-method/
            minlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length >= param;
            },

            // http://jqueryvalidation.org/maxlength-method/
            maxlength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || length <= param;
            },

            // http://jqueryvalidation.org/rangelength-method/
            rangelength: function (value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength(value, element);
                return this.optional(element) || (length >= param[ 0 ] && length <= param[ 1 ]);
            },

            // http://jqueryvalidation.org/min-method/
            min: function (value, element, param) {
                return this.optional(element) || value >= param;
            },

            // http://jqueryvalidation.org/max-method/
            max: function (value, element, param) {
                return this.optional(element) || value <= param;
            },

            // http://jqueryvalidation.org/range-method/
            range: function (value, element, param) {
                return this.optional(element) || (value >= param[ 0 ] && value <= param[ 1 ]);
            },

            // http://jqueryvalidation.org/step-method/
            step: function (value, element, param) {
                var type = $(element).attr("type"),
                        errorMessage = "Step attribute on input type " + type + " is not supported.",
                        supportedTypes = ["text", "number", "range"],
                        re = new RegExp("\\b" + type + "\\b"),
                        notSupported = type && !re.test(supportedTypes.join());

                // Works only for text, number and range input types
                // TODO find a way to support input types date, datetime, datetime-local, month, time and week
                if (notSupported) {
                    throw new Error(errorMessage);
                }
                return this.optional(element) || (value % param === 0);
            },

            // http://jqueryvalidation.org/equalTo-method/
            equalTo: function (value, element, param) {

                // Bind to the blur event of the target in order to revalidate whenever the target field is updated
                var target = $(param);
                if (this.settings.onfocusout && target.not(".validate-equalTo-blur").length) {
                    target.addClass("validate-equalTo-blur").on("blur.validate-equalTo", function () {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },

            // http://jqueryvalidation.org/remote-method/
            remote: function (value, element, param, method) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                method = typeof method === "string" && method || "remote";

                var previous = this.previousValue(element, method),
                        validator, data, optionDataString;

                if (!this.settings.messages[ element.name ]) {
                    this.settings.messages[ element.name ] = {};
                }
                previous.originalMessage = previous.originalMessage || this.settings.messages[ element.name ][ method ];
                this.settings.messages[ element.name ][ method ] = previous.message;

                param = typeof param === "string" && {url: param} || param;
                optionDataString = $.param($.extend({data: value}, param.data));
                if (previous.old === optionDataString) {
                    return previous.valid;
                }

                previous.old = optionDataString;
                validator = this;
                this.startRequest(element);
                data = {};
                data[ element.name ] = value;
                $.ajax($.extend(true, {
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    context: validator.currentForm,
                    success: function (response) {
                        var valid = response === true || response === "true",
                                errors, message, submitted;

                        validator.settings.messages[ element.name ][ method ] = previous.originalMessage;
                        if (valid) {
                            submitted = validator.formSubmitted;
                            validator.resetInternals();
                            validator.toHide = validator.errorsFor(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            validator.invalid[ element.name ] = false;
                            validator.showErrors();
                        } else {
                            errors = {};
                            message = response || validator.defaultMessage(element, {method: method, parameters: value});
                            errors[ element.name ] = previous.message = message;
                            validator.invalid[ element.name ] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }
        }

    });

// Ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()

    var pendingRequests = {},
            ajax;

// Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function (settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[ port ]) {
                    pendingRequests[ port ].abort();
                }
                pendingRequests[ port ] = xhr;
            }
        });
    } else {

        // Proxy ajax
        ajax = $.ajax;
        $.ajax = function (settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                    port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[ port ]) {
                    pendingRequests[ port ].abort();
                }
                pendingRequests[ port ] = ajax.apply(this, arguments);
                return pendingRequests[ port ];
            }
            return ajax.apply(this, arguments);
        };
    }

}));
/*!
 * @fileOverview TouchSwipe - jQuery Plugin
 * @version 1.6.18
 *
 * @author Matt Bryson http://www.github.com/mattbryson
 * @see https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
 * @see http://labs.rampinteractive.co.uk/touchSwipe/
 * @see http://plugins.jquery.com/project/touchSwipe
 * @license
 * Copyright (c) 2010-2015 Matt Bryson
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 */


(function (factory) {
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {
        // AMD. Register as anonymous module.
        define(['jquery'], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        // CommonJS Module
        factory(require("jquery"));
    } else {
        // Browser globals.
        factory(jQuery);
    }
}(function ($) {
    "use strict";

    //Constants
    var VERSION = "1.6.18",
            LEFT = "left",
            RIGHT = "right",
            UP = "up",
            DOWN = "down",
            IN = "in",
            OUT = "out",
            NONE = "none",
            AUTO = "auto",
            SWIPE = "swipe",
            PINCH = "pinch",
            TAP = "tap",
            DOUBLE_TAP = "doubletap",
            LONG_TAP = "longtap",
            HOLD = "hold",
            HORIZONTAL = "horizontal",
            VERTICAL = "vertical",
            ALL_FINGERS = "all",
            DOUBLE_TAP_THRESHOLD = 10,
            PHASE_START = "start",
            PHASE_MOVE = "move",
            PHASE_END = "end",
            PHASE_CANCEL = "cancel",
            SUPPORTS_TOUCH = 'ontouchstart' in window,
            SUPPORTS_POINTER_IE10 = window.navigator.msPointerEnabled && !window.navigator.pointerEnabled && !SUPPORTS_TOUCH,
            SUPPORTS_POINTER = (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && !SUPPORTS_TOUCH,
            PLUGIN_NS = 'TouchSwipe';



    /**
     * The default configuration, and available options to configure touch swipe with.
     * You can set the default values by updating any of the properties prior to instantiation.
     * @name $.fn.swipe.defaults
     * @namespace
     * @property {int} [fingers=1] The number of fingers to detect in a swipe. Any swipes that do not meet this requirement will NOT trigger swipe handlers.
     * @property {int} [threshold=75] The number of pixels that the user must move their finger by before it is considered a swipe.
     * @property {int} [cancelThreshold=null] The number of pixels that the user must move their finger back from the original swipe direction to cancel the gesture.
     * @property {int} [pinchThreshold=20] The number of pixels that the user must pinch their finger by before it is considered a pinch.
     * @property {int} [maxTimeThreshold=null] Time, in milliseconds, between touchStart and touchEnd must NOT exceed in order to be considered a swipe.
     * @property {int} [fingerReleaseThreshold=250] Time in milliseconds between releasing multiple fingers.  If 2 fingers are down, and are released one after the other, if they are within this threshold, it counts as a simultaneous release.
     * @property {int} [longTapThreshold=500] Time in milliseconds between tap and release for a long tap
     * @property {int} [doubleTapThreshold=200] Time in milliseconds between 2 taps to count as a double tap
     * @property {function} [swipe=null] A handler to catch all swipes. See {@link $.fn.swipe#event:swipe}
     * @property {function} [swipeLeft=null] A handler that is triggered for "left" swipes. See {@link $.fn.swipe#event:swipeLeft}
     * @property {function} [swipeRight=null] A handler that is triggered for "right" swipes. See {@link $.fn.swipe#event:swipeRight}
     * @property {function} [swipeUp=null] A handler that is triggered for "up" swipes. See {@link $.fn.swipe#event:swipeUp}
     * @property {function} [swipeDown=null] A handler that is triggered for "down" swipes. See {@link $.fn.swipe#event:swipeDown}
     * @property {function} [swipeStatus=null] A handler triggered for every phase of the swipe. See {@link $.fn.swipe#event:swipeStatus}
     * @property {function} [pinchIn=null] A handler triggered for pinch in events. See {@link $.fn.swipe#event:pinchIn}
     * @property {function} [pinchOut=null] A handler triggered for pinch out events. See {@link $.fn.swipe#event:pinchOut}
     * @property {function} [pinchStatus=null] A handler triggered for every phase of a pinch. See {@link $.fn.swipe#event:pinchStatus}
     * @property {function} [tap=null] A handler triggered when a user just taps on the item, rather than swipes it. If they do not move, tap is triggered, if they do move, it is not.
     * @property {function} [doubleTap=null] A handler triggered when a user double taps on the item. The delay between taps can be set with the doubleTapThreshold property. See {@link $.fn.swipe.defaults#doubleTapThreshold}
     * @property {function} [longTap=null] A handler triggered when a user long taps on the item. The delay between start and end can be set with the longTapThreshold property. See {@link $.fn.swipe.defaults#longTapThreshold}
     * @property (function) [hold=null] A handler triggered when a user reaches longTapThreshold on the item. See {@link $.fn.swipe.defaults#longTapThreshold}
     * @property {boolean} [triggerOnTouchEnd=true] If true, the swipe events are triggered when the touch end event is received (user releases finger).  If false, it will be triggered on reaching the threshold, and then cancel the touch event automatically.
     * @property {boolean} [triggerOnTouchLeave=false] If true, then when the user leaves the swipe object, the swipe will end and trigger appropriate handlers.
     * @property {string|undefined} [allowPageScroll='auto'] How the browser handles page scrolls when the user is swiping on a touchSwipe object. See {@link $.fn.swipe.pageScroll}.  <br/><br/>
     <code>"auto"</code> : all undefined swipes will cause the page to scroll in that direction. <br/>
     <code>"none"</code> : the page will not scroll when user swipes. <br/>
     <code>"horizontal"</code> : will force page to scroll on horizontal swipes. <br/>
     <code>"vertical"</code> : will force page to scroll on vertical swipes. <br/>
     * @property {boolean} [fallbackToMouseEvents=true] If true mouse events are used when run on a non touch device, false will stop swipes being triggered by mouse events on non touch devices.
     * @property {string} [excludedElements=".noSwipe"] A jquery selector that specifies child elements that do NOT trigger swipes. By default this excludes elements with the class .noSwipe .
     * @property {boolean} [preventDefaultEvents=true] by default default events are cancelled, so the page doesn't move.  You can disable this so both native events fire as well as your handlers.
     
     */
    var defaults = {
        fingers: 1,
        threshold: 75,
        cancelThreshold: null,
        pinchThreshold: 20,
        maxTimeThreshold: null,
        fingerReleaseThreshold: 250,
        longTapThreshold: 500,
        doubleTapThreshold: 200,
        swipe: null,
        swipeLeft: null,
        swipeRight: null,
        swipeUp: null,
        swipeDown: null,
        swipeStatus: null,
        pinchIn: null,
        pinchOut: null,
        pinchStatus: null,
        click: null, //Deprecated since 1.6.2
        tap: null,
        doubleTap: null,
        longTap: null,
        hold: null,
        triggerOnTouchEnd: true,
        triggerOnTouchLeave: false,
        allowPageScroll: "auto",
        fallbackToMouseEvents: true,
        excludedElements: ".noSwipe",
        preventDefaultEvents: true
    };



    /**
     * Applies TouchSwipe behaviour to one or more jQuery objects.
     * The TouchSwipe plugin can be instantiated via this method, or methods within
     * TouchSwipe can be executed via this method as per jQuery plugin architecture.
     * An existing plugin can have its options changed simply by re calling .swipe(options)
     * @see TouchSwipe
     * @class
     * @param {Mixed} method If the current DOMNode is a TouchSwipe object, and <code>method</code> is a TouchSwipe method, then
     * the <code>method</code> is executed, and any following arguments are passed to the TouchSwipe method.
     * If <code>method</code> is an object, then the TouchSwipe class is instantiated on the current DOMNode, passing the
     * configuration properties defined in the object. See TouchSwipe
     *
     */
    $.fn.swipe = function (method) {
        var $this = $(this),
                plugin = $this.data(PLUGIN_NS);

        //Check if we are already instantiated and trying to execute a method
        if (plugin && typeof method === 'string') {
            if (plugin[method]) {
                return plugin[method].apply(plugin, Array.prototype.slice.call(arguments, 1));
            } else {
                $.error('Method ' + method + ' does not exist on jQuery.swipe');
            }
        }

        //Else update existing plugin with new options hash
        else if (plugin && typeof method === 'object') {
            plugin['option'].apply(plugin, arguments);
        }

        //Else not instantiated and trying to pass init object (or nothing)
        else if (!plugin && (typeof method === 'object' || !method)) {
            return init.apply(this, arguments);
        }

        return $this;
    };

    /**
     * The version of the plugin
     * @readonly
     */
    $.fn.swipe.version = VERSION;



    //Expose our defaults so a user could override the plugin defaults
    $.fn.swipe.defaults = defaults;

    /**
     * The phases that a touch event goes through.  The <code>phase</code> is passed to the event handlers.
     * These properties are read only, attempting to change them will not alter the values passed to the event handlers.
     * @namespace
     * @readonly
     * @property {string} PHASE_START Constant indicating the start phase of the touch event. Value is <code>"start"</code>.
     * @property {string} PHASE_MOVE Constant indicating the move phase of the touch event. Value is <code>"move"</code>.
     * @property {string} PHASE_END Constant indicating the end phase of the touch event. Value is <code>"end"</code>.
     * @property {string} PHASE_CANCEL Constant indicating the cancel phase of the touch event. Value is <code>"cancel"</code>.
     */
    $.fn.swipe.phases = {
        PHASE_START: PHASE_START,
        PHASE_MOVE: PHASE_MOVE,
        PHASE_END: PHASE_END,
        PHASE_CANCEL: PHASE_CANCEL
    };

    /**
     * The direction constants that are passed to the event handlers.
     * These properties are read only, attempting to change them will not alter the values passed to the event handlers.
     * @namespace
     * @readonly
     * @property {string} LEFT Constant indicating the left direction. Value is <code>"left"</code>.
     * @property {string} RIGHT Constant indicating the right direction. Value is <code>"right"</code>.
     * @property {string} UP Constant indicating the up direction. Value is <code>"up"</code>.
     * @property {string} DOWN Constant indicating the down direction. Value is <code>"cancel"</code>.
     * @property {string} IN Constant indicating the in direction. Value is <code>"in"</code>.
     * @property {string} OUT Constant indicating the out direction. Value is <code>"out"</code>.
     */
    $.fn.swipe.directions = {
        LEFT: LEFT,
        RIGHT: RIGHT,
        UP: UP,
        DOWN: DOWN,
        IN: IN,
        OUT: OUT
    };

    /**
     * The page scroll constants that can be used to set the value of <code>allowPageScroll</code> option
     * These properties are read only
     * @namespace
     * @readonly
     * @see $.fn.swipe.defaults#allowPageScroll
     * @property {string} NONE Constant indicating no page scrolling is allowed. Value is <code>"none"</code>.
     * @property {string} HORIZONTAL Constant indicating horizontal page scrolling is allowed. Value is <code>"horizontal"</code>.
     * @property {string} VERTICAL Constant indicating vertical page scrolling is allowed. Value is <code>"vertical"</code>.
     * @property {string} AUTO Constant indicating either horizontal or vertical will be allowed, depending on the swipe handlers registered. Value is <code>"auto"</code>.
     */
    $.fn.swipe.pageScroll = {
        NONE: NONE,
        HORIZONTAL: HORIZONTAL,
        VERTICAL: VERTICAL,
        AUTO: AUTO
    };

    /**
     * Constants representing the number of fingers used in a swipe.  These are used to set both the value of <code>fingers</code> in the
     * options object, as well as the value of the <code>fingers</code> event property.
     * These properties are read only, attempting to change them will not alter the values passed to the event handlers.
     * @namespace
     * @readonly
     * @see $.fn.swipe.defaults#fingers
     * @property {string} ONE Constant indicating 1 finger is to be detected / was detected. Value is <code>1</code>.
     * @property {string} TWO Constant indicating 2 fingers are to be detected / were detected. Value is <code>2</code>.
     * @property {string} THREE Constant indicating 3 finger are to be detected / were detected. Value is <code>3</code>.
     * @property {string} FOUR Constant indicating 4 finger are to be detected / were detected. Not all devices support this. Value is <code>4</code>.
     * @property {string} FIVE Constant indicating 5 finger are to be detected / were detected. Not all devices support this. Value is <code>5</code>.
     * @property {string} ALL Constant indicating any combination of finger are to be detected.  Value is <code>"all"</code>.
     */
    $.fn.swipe.fingers = {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        ALL: ALL_FINGERS
    };

    /**
     * Initialise the plugin for each DOM element matched
     * This creates a new instance of the main TouchSwipe class for each DOM element, and then
     * saves a reference to that instance in the elements data property.
     * @internal
     */
    function init(options) {
        //Prep and extend the options
        if (options && (options.allowPageScroll === undefined && (options.swipe !== undefined || options.swipeStatus !== undefined))) {
            options.allowPageScroll = NONE;
        }

        //Check for deprecated options
        //Ensure that any old click handlers are assigned to the new tap, unless we have a tap
        if (options.click !== undefined && options.tap === undefined) {
            options.tap = options.click;
        }

        if (!options) {
            options = {};
        }

        //pass empty object so we dont modify the defaults
        options = $.extend({}, $.fn.swipe.defaults, options);

        //For each element instantiate the plugin
        return this.each(function () {
            var $this = $(this);

            //Check we havent already initialised the plugin
            var plugin = $this.data(PLUGIN_NS);

            if (!plugin) {
                plugin = new TouchSwipe(this, options);
                $this.data(PLUGIN_NS, plugin);
            }
        });
    }

    /**
     * Main TouchSwipe Plugin Class.
     * Do not use this to construct your TouchSwipe object, use the jQuery plugin method $.fn.swipe(); {@link $.fn.swipe}
     * @private
     * @name TouchSwipe
     * @param {DOMNode} element The HTML DOM object to apply to plugin to
     * @param {Object} options The options to configure the plugin with.  @link {$.fn.swipe.defaults}
     * @see $.fh.swipe.defaults
     * @see $.fh.swipe
     * @class
     */
    function TouchSwipe(element, options) {

        //take a local/instacne level copy of the options - should make it this.options really...
        var options = $.extend({}, options);

        var useTouchEvents = (SUPPORTS_TOUCH || SUPPORTS_POINTER || !options.fallbackToMouseEvents),
                START_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerDown' : 'pointerdown') : 'touchstart') : 'mousedown',
                MOVE_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerMove' : 'pointermove') : 'touchmove') : 'mousemove',
                END_EV = useTouchEvents ? (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerUp' : 'pointerup') : 'touchend') : 'mouseup',
                LEAVE_EV = useTouchEvents ? (SUPPORTS_POINTER ? 'mouseleave' : null) : 'mouseleave', //we manually detect leave on touch devices, so null event here
                CANCEL_EV = (SUPPORTS_POINTER ? (SUPPORTS_POINTER_IE10 ? 'MSPointerCancel' : 'pointercancel') : 'touchcancel');



        //touch properties
        var distance = 0,
                direction = null,
                currentDirection = null,
                duration = 0,
                startTouchesDistance = 0,
                endTouchesDistance = 0,
                pinchZoom = 1,
                pinchDistance = 0,
                pinchDirection = 0,
                maximumsMap = null;



        //jQuery wrapped element for this instance
        var $element = $(element);

        //Current phase of th touch cycle
        var phase = "start";

        // the current number of fingers being used.
        var fingerCount = 0;

        //track mouse points / delta
        var fingerData = {};

        //track times
        var startTime = 0,
                endTime = 0,
                previousTouchEndTime = 0,
                fingerCountAtRelease = 0,
                doubleTapStartTime = 0;

        //Timeouts
        var singleTapTimeout = null,
                holdTimeout = null;

        // Add gestures to all swipable areas if supported
        try {
            $element.bind(START_EV, touchStart);
            $element.bind(CANCEL_EV, touchCancel);
        } catch (e) {
            $.error('events not supported ' + START_EV + ',' + CANCEL_EV + ' on jQuery.swipe');
        }

        //
        //Public methods
        //

        /**
         * re-enables the swipe plugin with the previous configuration
         * @function
         * @name $.fn.swipe#enable
         * @return {DOMNode} The Dom element that was registered with TouchSwipe
         * @example $("#element").swipe("enable");
         */
        this.enable = function () {
            //Incase we are already enabled, clean up...
            this.disable();
            $element.bind(START_EV, touchStart);
            $element.bind(CANCEL_EV, touchCancel);
            return $element;
        };

        /**
         * disables the swipe plugin
         * @function
         * @name $.fn.swipe#disable
         * @return {DOMNode} The Dom element that is now registered with TouchSwipe
         * @example $("#element").swipe("disable");
         */
        this.disable = function () {
            removeListeners();
            return $element;
        };

        /**
         * Destroy the swipe plugin completely. To use any swipe methods, you must re initialise the plugin.
         * @function
         * @name $.fn.swipe#destroy
         * @example $("#element").swipe("destroy");
         */
        this.destroy = function () {
            removeListeners();
            $element.data(PLUGIN_NS, null);
            $element = null;
        };


        /**
         * Allows run time updating of the swipe configuration options.
         * @function
         * @name $.fn.swipe#option
         * @param {String} property The option property to get or set, or a has of multiple options to set
         * @param {Object} [value] The value to set the property to
         * @return {Object} If only a property name is passed, then that property value is returned. If nothing is passed the current options hash is returned.
         * @example $("#element").swipe("option", "threshold"); // return the threshold
         * @example $("#element").swipe("option", "threshold", 100); // set the threshold after init
         * @example $("#element").swipe("option", {threshold:100, fingers:3} ); // set multiple properties after init
         * @example $("#element").swipe({threshold:100, fingers:3} ); // set multiple properties after init - the "option" method is optional!
         * @example $("#element").swipe("option"); // Return the current options hash
         * @see $.fn.swipe.defaults
         *
         */
        this.option = function (property, value) {

            if (typeof property === 'object') {
                options = $.extend(options, property);
            } else if (options[property] !== undefined) {
                if (value === undefined) {
                    return options[property];
                } else {
                    options[property] = value;
                }
            } else if (!property) {
                return options;
            } else {
                $.error('Option ' + property + ' does not exist on jQuery.swipe.options');
            }

            return null;
        }



        //
        // Private methods
        //

        //
        // EVENTS
        //
        /**
         * Event handler for a touch start event.
         * Stops the default click event from triggering and stores where we touched
         * @inner
         * @param {object} jqEvent The normalised jQuery event object.
         */
        function touchStart(jqEvent) {

            //If we already in a touch event (a finger already in use) then ignore subsequent ones..
            if (getTouchInProgress()) {
                return;
            }

            //Check if this element matches any in the excluded elements selectors,  or its parent is excluded, if so, DON'T swipe
            if ($(jqEvent.target).closest(options.excludedElements, $element).length > 0) {
                return;
            }

            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;


            //If we have a pointer event, whoes type is 'mouse' and we have said NO mouse events, then dont do anything.
            if (event.pointerType && event.pointerType == "mouse" && options.fallbackToMouseEvents == false) {
                return;
            }
            ;

            var ret,
                    touches = event.touches,
                    evt = touches ? touches[0] : event;

            phase = PHASE_START;

            //If we support touches, get the finger count
            if (touches) {
                // get the total number of fingers touching the screen
                fingerCount = touches.length;
            }
            //Else this is the desktop, so stop the browser from dragging content
            else if (options.preventDefaultEvents !== false) {
                jqEvent.preventDefault(); //call this on jq event so we are cross browser
            }

            //clear vars..
            distance = 0;
            direction = null;
            currentDirection = null;
            pinchDirection = null;
            duration = 0;
            startTouchesDistance = 0;
            endTouchesDistance = 0;
            pinchZoom = 1;
            pinchDistance = 0;
            maximumsMap = createMaximumsData();
            cancelMultiFingerRelease();

            //Create the default finger data
            createFingerData(0, evt);

            // check the number of fingers is what we are looking for, or we are capturing pinches
            if (!touches || (fingerCount === options.fingers || options.fingers === ALL_FINGERS) || hasPinches()) {
                // get the coordinates of the touch
                startTime = getTimeStamp();

                if (fingerCount == 2) {
                    //Keep track of the initial pinch distance, so we can calculate the diff later
                    //Store second finger data as start
                    createFingerData(1, touches[1]);
                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
                }

                if (options.swipeStatus || options.pinchStatus) {
                    ret = triggerHandler(event, phase);
                }
            } else {
                //A touch with more or less than the fingers we are looking for, so cancel
                ret = false;
            }

            //If we have a return value from the users handler, then return and cancel
            if (ret === false) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
                return ret;
            } else {
                if (options.hold) {
                    holdTimeout = setTimeout($.proxy(function () {
                        //Trigger the event
                        $element.trigger('hold', [event.target]);
                        //Fire the callback
                        if (options.hold) {
                            ret = options.hold.call($element, event, event.target);
                        }
                    }, this), options.longTapThreshold);
                }

                setTouchInProgress(true);
            }

            return null;
        }
        ;



        /**
         * Event handler for a touch move event.
         * If we change fingers during move, then cancel the event
         * @inner
         * @param {object} jqEvent The normalised jQuery event object.
         */
        function touchMove(jqEvent) {

            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

            //If we are ending, cancelling, or within the threshold of 2 fingers being released, don't track anything..
            if (phase === PHASE_END || phase === PHASE_CANCEL || inMultiFingerRelease())
                return;

            var ret,
                    touches = event.touches,
                    evt = touches ? touches[0] : event;


            //Update the  finger data
            var currentFinger = updateFingerData(evt);
            endTime = getTimeStamp();

            if (touches) {
                fingerCount = touches.length;
            }

            if (options.hold) {
                clearTimeout(holdTimeout);
            }

            phase = PHASE_MOVE;

            //If we have 2 fingers get Touches distance as well
            if (fingerCount == 2) {

                //Keep track of the initial pinch distance, so we can calculate the diff later
                //We do this here as well as the start event, in case they start with 1 finger, and the press 2 fingers
                if (startTouchesDistance == 0) {
                    //Create second finger if this is the first time...
                    createFingerData(1, touches[1]);

                    startTouchesDistance = endTouchesDistance = calculateTouchesDistance(fingerData[0].start, fingerData[1].start);
                } else {
                    //Else just update the second finger
                    updateFingerData(touches[1]);

                    endTouchesDistance = calculateTouchesDistance(fingerData[0].end, fingerData[1].end);
                    pinchDirection = calculatePinchDirection(fingerData[0].end, fingerData[1].end);
                }

                pinchZoom = calculatePinchZoom(startTouchesDistance, endTouchesDistance);
                pinchDistance = Math.abs(startTouchesDistance - endTouchesDistance);
            }

            if ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !touches || hasPinches()) {

                //The overall direction of the swipe. From start to now.
                direction = calculateDirection(currentFinger.start, currentFinger.end);

                //The immediate direction of the swipe, direction between the last movement and this one.
                currentDirection = calculateDirection(currentFinger.last, currentFinger.end);

                //Check if we need to prevent default event (page scroll / pinch zoom) or not
                validateDefaultEvent(jqEvent, currentDirection);

                //Distance and duration are all off the main finger
                distance = calculateDistance(currentFinger.start, currentFinger.end);
                duration = calculateDuration();

                //Cache the maximum distance we made in this direction
                setMaxDistance(direction, distance);

                //Trigger status handler
                ret = triggerHandler(event, phase);


                //If we trigger end events when threshold are met, or trigger events when touch leaves element
                if (!options.triggerOnTouchEnd || options.triggerOnTouchLeave) {

                    var inBounds = true;

                    //If checking if we leave the element, run the bounds check (we can use touchleave as its not supported on webkit)
                    if (options.triggerOnTouchLeave) {
                        var bounds = getbounds(this);
                        inBounds = isInBounds(currentFinger.end, bounds);
                    }

                    //Trigger end handles as we swipe if thresholds met or if we have left the element if the user has asked to check these..
                    if (!options.triggerOnTouchEnd && inBounds) {
                        phase = getNextPhase(PHASE_MOVE);
                    }
                    //We end if out of bounds here, so set current phase to END, and check if its modified
                    else if (options.triggerOnTouchLeave && !inBounds) {
                        phase = getNextPhase(PHASE_END);
                    }

                    if (phase == PHASE_CANCEL || phase == PHASE_END) {
                        triggerHandler(event, phase);
                    }
                }
            } else {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }

            if (ret === false) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }
        }




        /**
         * Event handler for a touch end event.
         * Calculate the direction and trigger events
         * @inner
         * @param {object} jqEvent The normalised jQuery event object.
         */
        function touchEnd(jqEvent) {
            //As we use Jquery bind for events, we need to target the original event object
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent,
                    touches = event.touches;

            //If we are still in a touch with the device wait a fraction and see if the other finger comes up
            //if it does within the threshold, then we treat it as a multi release, not a single release and end the touch / swipe
            if (touches) {
                if (touches.length && !inMultiFingerRelease()) {
                    startMultiFingerRelease(event);
                    return true;
                } else if (touches.length && inMultiFingerRelease()) {
                    return true;
                }
            }

            //If a previous finger has been released, check how long ago, if within the threshold, then assume it was a multifinger release.
            //This is used to allow 2 fingers to release fractionally after each other, whilst maintaining the event as containing 2 fingers, not 1
            if (inMultiFingerRelease()) {
                fingerCount = fingerCountAtRelease;
            }

            //Set end of swipe
            endTime = getTimeStamp();

            //Get duration incase move was never fired
            duration = calculateDuration();

            //If we trigger handlers at end of swipe OR, we trigger during, but they didnt trigger and we are still in the move phase
            if (didSwipeBackToCancel() || !validateSwipeDistance()) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            } else if (options.triggerOnTouchEnd || (options.triggerOnTouchEnd === false && phase === PHASE_MOVE)) {
                //call this on jq event so we are cross browser
                if (options.preventDefaultEvents !== false && jqEvent.cancelable !== false) {
                    jqEvent.preventDefault();
                }
                phase = PHASE_END;
                triggerHandler(event, phase);
            }
            //Special cases - A tap should always fire on touch end regardless,
            //So here we manually trigger the tap end handler by itself
            //We dont run trigger handler as it will re-trigger events that may have fired already
            else if (!options.triggerOnTouchEnd && hasTap()) {
                //Trigger the pinch events...
                phase = PHASE_END;
                triggerHandlerForGesture(event, phase, TAP);
            } else if (phase === PHASE_MOVE) {
                phase = PHASE_CANCEL;
                triggerHandler(event, phase);
            }

            setTouchInProgress(false);

            return null;
        }



        /**
         * Event handler for a touch cancel event.
         * Clears current vars
         * @inner
         */
        function touchCancel() {
            // reset the variables back to default values
            fingerCount = 0;
            endTime = 0;
            startTime = 0;
            startTouchesDistance = 0;
            endTouchesDistance = 0;
            pinchZoom = 1;

            //If we were in progress of tracking a possible multi touch end, then re set it.
            cancelMultiFingerRelease();

            setTouchInProgress(false);
        }


        /**
         * Event handler for a touch leave event.
         * This is only triggered on desktops, in touch we work this out manually
         * as the touchleave event is not supported in webkit
         * @inner
         */
        function touchLeave(jqEvent) {
            //If these events are being programmatically triggered, we don't have an original event object, so use the Jq one.
            var event = jqEvent.originalEvent ? jqEvent.originalEvent : jqEvent;

            //If we have the trigger on leave property set....
            if (options.triggerOnTouchLeave) {
                phase = getNextPhase(PHASE_END);
                triggerHandler(event, phase);
            }
        }

        /**
         * Removes all listeners that were associated with the plugin
         * @inner
         */
        function removeListeners() {
            $element.unbind(START_EV, touchStart);
            $element.unbind(CANCEL_EV, touchCancel);
            $element.unbind(MOVE_EV, touchMove);
            $element.unbind(END_EV, touchEnd);

            //we only have leave events on desktop, we manually calculate leave on touch as its not supported in webkit
            if (LEAVE_EV) {
                $element.unbind(LEAVE_EV, touchLeave);
            }

            setTouchInProgress(false);
        }


        /**
         * Checks if the time and distance thresholds have been met, and if so then the appropriate handlers are fired.
         */
        function getNextPhase(currentPhase) {

            var nextPhase = currentPhase;

            // Ensure we have valid swipe (under time and over distance  and check if we are out of bound...)
            var validTime = validateSwipeTime();
            var validDistance = validateSwipeDistance();
            var didCancel = didSwipeBackToCancel();

            //If we have exceeded our time, then cancel
            if (!validTime || didCancel) {
                nextPhase = PHASE_CANCEL;
            }
            //Else if we are moving, and have reached distance then end
            else if (validDistance && currentPhase == PHASE_MOVE && (!options.triggerOnTouchEnd || options.triggerOnTouchLeave)) {
                nextPhase = PHASE_END;
            }
            //Else if we have ended by leaving and didn't reach distance, then cancel
            else if (!validDistance && currentPhase == PHASE_END && options.triggerOnTouchLeave) {
                nextPhase = PHASE_CANCEL;
            }

            return nextPhase;
        }


        /**
         * Trigger the relevant event handler
         * The handlers are passed the original event, the element that was swiped, and in the case of the catch all handler, the direction that was swiped, "left", "right", "up", or "down"
         * @param {object} event the original event object
         * @param {string} phase the phase of the swipe (start, end cancel etc) {@link $.fn.swipe.phases}
         * @inner
         */
        function triggerHandler(event, phase) {



            var ret,
                    touches = event.touches;

            // SWIPE GESTURES
            if (didSwipe() || hasSwipes()) {
                ret = triggerHandlerForGesture(event, phase, SWIPE);
            }

            // PINCH GESTURES (if the above didn't cancel)
            if ((didPinch() || hasPinches()) && ret !== false) {
                ret = triggerHandlerForGesture(event, phase, PINCH);
            }

            // CLICK / TAP (if the above didn't cancel)
            if (didDoubleTap() && ret !== false) {
                //Trigger the tap events...
                ret = triggerHandlerForGesture(event, phase, DOUBLE_TAP);
            }

            // CLICK / TAP (if the above didn't cancel)
            else if (didLongTap() && ret !== false) {
                //Trigger the tap events...
                ret = triggerHandlerForGesture(event, phase, LONG_TAP);
            }

            // CLICK / TAP (if the above didn't cancel)
            else if (didTap() && ret !== false) {
                //Trigger the tap event..
                ret = triggerHandlerForGesture(event, phase, TAP);
            }



            // If we are cancelling the gesture, then manually trigger the reset handler
            if (phase === PHASE_CANCEL) {

                touchCancel(event);
            }




            // If we are ending the gesture, then manually trigger the reset handler IF all fingers are off
            if (phase === PHASE_END) {
                //If we support touch, then check that all fingers are off before we cancel
                if (touches) {
                    if (!touches.length) {
                        touchCancel(event);
                    }
                } else {
                    touchCancel(event);
                }
            }

            return ret;
        }



        /**
         * Trigger the relevant event handler
         * The handlers are passed the original event, the element that was swiped, and in the case of the catch all handler, the direction that was swiped, "left", "right", "up", or "down"
         * @param {object} event the original event object
         * @param {string} phase the phase of the swipe (start, end cancel etc) {@link $.fn.swipe.phases}
         * @param {string} gesture the gesture to trigger a handler for : PINCH or SWIPE {@link $.fn.swipe.gestures}
         * @return Boolean False, to indicate that the event should stop propagation, or void.
         * @inner
         */
        function triggerHandlerForGesture(event, phase, gesture) {

            var ret;

            //SWIPES....
            if (gesture == SWIPE) {
                //Trigger status every time..
                $element.trigger('swipeStatus', [phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection]);

                if (options.swipeStatus) {
                    ret = options.swipeStatus.call($element, event, phase, direction || null, distance || 0, duration || 0, fingerCount, fingerData, currentDirection);
                    //If the status cancels, then dont run the subsequent event handlers..
                    if (ret === false)
                        return false;
                }

                if (phase == PHASE_END && validateSwipe()) {

                    //Cancel any taps that were in progress...
                    clearTimeout(singleTapTimeout);
                    clearTimeout(holdTimeout);

                    $element.trigger('swipe', [direction, distance, duration, fingerCount, fingerData, currentDirection]);

                    if (options.swipe) {
                        ret = options.swipe.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                        //If the status cancels, then dont run the subsequent event handlers..
                        if (ret === false)
                            return false;
                    }

                    //trigger direction specific event handlers
                    switch (direction) {
                        case LEFT:
                            $element.trigger('swipeLeft', [direction, distance, duration, fingerCount, fingerData, currentDirection]);

                            if (options.swipeLeft) {
                                ret = options.swipeLeft.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                            }
                            break;

                        case RIGHT:
                            $element.trigger('swipeRight', [direction, distance, duration, fingerCount, fingerData, currentDirection]);

                            if (options.swipeRight) {
                                ret = options.swipeRight.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                            }
                            break;

                        case UP:
                            $element.trigger('swipeUp', [direction, distance, duration, fingerCount, fingerData, currentDirection]);

                            if (options.swipeUp) {
                                ret = options.swipeUp.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                            }
                            break;

                        case DOWN:
                            $element.trigger('swipeDown', [direction, distance, duration, fingerCount, fingerData, currentDirection]);

                            if (options.swipeDown) {
                                ret = options.swipeDown.call($element, event, direction, distance, duration, fingerCount, fingerData, currentDirection);
                            }
                            break;
                    }
                }
            }


            //PINCHES....
            if (gesture == PINCH) {
                $element.trigger('pinchStatus', [phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

                if (options.pinchStatus) {
                    ret = options.pinchStatus.call($element, event, phase, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                    //If the status cancels, then dont run the subsequent event handlers..
                    if (ret === false)
                        return false;
                }

                if (phase == PHASE_END && validatePinch()) {

                    switch (pinchDirection) {
                        case IN:
                            $element.trigger('pinchIn', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

                            if (options.pinchIn) {
                                ret = options.pinchIn.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                            }
                            break;

                        case OUT:
                            $element.trigger('pinchOut', [pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData]);

                            if (options.pinchOut) {
                                ret = options.pinchOut.call($element, event, pinchDirection || null, pinchDistance || 0, duration || 0, fingerCount, pinchZoom, fingerData);
                            }
                            break;
                    }
                }
            }

            if (gesture == TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {

                    clearTimeout(singleTapTimeout);
                    clearTimeout(holdTimeout);

                    //If we are also looking for doubelTaps, wait incase this is one...
                    if (hasDoubleTap() && !inDoubleTap()) {
                        doubleTapStartTime = getTimeStamp();

                        //Now wait for the double tap timeout, and trigger this single tap
                        //if its not cancelled by a double tap
                        singleTapTimeout = setTimeout($.proxy(function () {
                            doubleTapStartTime = null;
                            $element.trigger('tap', [event.target]);

                            if (options.tap) {
                                ret = options.tap.call($element, event, event.target);
                            }
                        }, this), options.doubleTapThreshold);

                    } else {
                        doubleTapStartTime = null;
                        $element.trigger('tap', [event.target]);
                        if (options.tap) {
                            ret = options.tap.call($element, event, event.target);
                        }
                    }
                }
            } else if (gesture == DOUBLE_TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {
                    clearTimeout(singleTapTimeout);
                    clearTimeout(holdTimeout);
                    doubleTapStartTime = null;
                    $element.trigger('doubletap', [event.target]);

                    if (options.doubleTap) {
                        ret = options.doubleTap.call($element, event, event.target);
                    }
                }
            } else if (gesture == LONG_TAP) {
                if (phase === PHASE_CANCEL || phase === PHASE_END) {
                    clearTimeout(singleTapTimeout);
                    doubleTapStartTime = null;

                    $element.trigger('longtap', [event.target]);
                    if (options.longTap) {
                        ret = options.longTap.call($element, event, event.target);
                    }
                }
            }

            return ret;
        }


        //
        // GESTURE VALIDATION
        //

        /**
         * Checks the user has swipe far enough
         * @return Boolean if <code>threshold</code> has been set, return true if the threshold was met, else false.
         * If no threshold was set, then we return true.
         * @inner
         */
        function validateSwipeDistance() {
            var valid = true;
            //If we made it past the min swipe distance..
            if (options.threshold !== null) {
                valid = distance >= options.threshold;
            }

            return valid;
        }

        /**
         * Checks the user has swiped back to cancel.
         * @return Boolean if <code>cancelThreshold</code> has been set, return true if the cancelThreshold was met, else false.
         * If no cancelThreshold was set, then we return true.
         * @inner
         */
        function didSwipeBackToCancel() {
            var cancelled = false;
            if (options.cancelThreshold !== null && direction !== null) {
                cancelled = (getMaxDistance(direction) - distance) >= options.cancelThreshold;
            }

            return cancelled;
        }

        /**
         * Checks the user has pinched far enough
         * @return Boolean if <code>pinchThreshold</code> has been set, return true if the threshold was met, else false.
         * If no threshold was set, then we return true.
         * @inner
         */
        function validatePinchDistance() {
            if (options.pinchThreshold !== null) {
                return pinchDistance >= options.pinchThreshold;
            }
            return true;
        }

        /**
         * Checks that the time taken to swipe meets the minimum / maximum requirements
         * @return Boolean
         * @inner
         */
        function validateSwipeTime() {
            var result;
            //If no time set, then return true
            if (options.maxTimeThreshold) {
                if (duration >= options.maxTimeThreshold) {
                    result = false;
                } else {
                    result = true;
                }
            } else {
                result = true;
            }

            return result;
        }


        /**
         * Checks direction of the swipe and the value allowPageScroll to see if we should allow or prevent the default behaviour from occurring.
         * This will essentially allow page scrolling or not when the user is swiping on a touchSwipe object.
         * @param {object} jqEvent The normalised jQuery representation of the event object.
         * @param {string} direction The direction of the event. See {@link $.fn.swipe.directions}
         * @see $.fn.swipe.directions
         * @inner
         */
        function validateDefaultEvent(jqEvent, direction) {

            //If the option is set, allways allow the event to bubble up (let user handle weirdness)
            if (options.preventDefaultEvents === false) {
                return;
            }

            if (options.allowPageScroll === NONE) {
                jqEvent.preventDefault();
            } else {
                var auto = options.allowPageScroll === AUTO;

                switch (direction) {
                    case LEFT:
                        if ((options.swipeLeft && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
                            jqEvent.preventDefault();
                        }
                        break;

                    case RIGHT:
                        if ((options.swipeRight && auto) || (!auto && options.allowPageScroll != HORIZONTAL)) {
                            jqEvent.preventDefault();
                        }
                        break;

                    case UP:
                        if ((options.swipeUp && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
                            jqEvent.preventDefault();
                        }
                        break;

                    case DOWN:
                        if ((options.swipeDown && auto) || (!auto && options.allowPageScroll != VERTICAL)) {
                            jqEvent.preventDefault();
                        }
                        break;

                    case NONE:

                        break;
                }
            }
        }


        // PINCHES
        /**
         * Returns true of the current pinch meets the thresholds
         * @return Boolean
         * @inner
         */
        function validatePinch() {
            var hasCorrectFingerCount = validateFingers();
            var hasEndPoint = validateEndPoint();
            var hasCorrectDistance = validatePinchDistance();
            return hasCorrectFingerCount && hasEndPoint && hasCorrectDistance;

        }

        /**
         * Returns true if any Pinch events have been registered
         * @return Boolean
         * @inner
         */
        function hasPinches() {
            //Enure we dont return 0 or null for false values
            return !!(options.pinchStatus || options.pinchIn || options.pinchOut);
        }

        /**
         * Returns true if we are detecting pinches, and have one
         * @return Boolean
         * @inner
         */
        function didPinch() {
            //Enure we dont return 0 or null for false values
            return !!(validatePinch() && hasPinches());
        }




        // SWIPES
        /**
         * Returns true if the current swipe meets the thresholds
         * @return Boolean
         * @inner
         */
        function validateSwipe() {
            //Check validity of swipe
            var hasValidTime = validateSwipeTime();
            var hasValidDistance = validateSwipeDistance();
            var hasCorrectFingerCount = validateFingers();
            var hasEndPoint = validateEndPoint();
            var didCancel = didSwipeBackToCancel();

            // if the user swiped more than the minimum length, perform the appropriate action
            // hasValidDistance is null when no distance is set
            var valid = !didCancel && hasEndPoint && hasCorrectFingerCount && hasValidDistance && hasValidTime;

            return valid;
        }

        /**
         * Returns true if any Swipe events have been registered
         * @return Boolean
         * @inner
         */
        function hasSwipes() {
            //Enure we dont return 0 or null for false values
            return !!(options.swipe || options.swipeStatus || options.swipeLeft || options.swipeRight || options.swipeUp || options.swipeDown);
        }


        /**
         * Returns true if we are detecting swipes and have one
         * @return Boolean
         * @inner
         */
        function didSwipe() {
            //Enure we dont return 0 or null for false values
            return !!(validateSwipe() && hasSwipes());
        }

        /**
         * Returns true if we have matched the number of fingers we are looking for
         * @return Boolean
         * @inner
         */
        function validateFingers() {
            //The number of fingers we want were matched, or on desktop we ignore
            return ((fingerCount === options.fingers || options.fingers === ALL_FINGERS) || !SUPPORTS_TOUCH);
        }

        /**
         * Returns true if we have an end point for the swipe
         * @return Boolean
         * @inner
         */
        function validateEndPoint() {
            //We have an end value for the finger
            return fingerData[0].end.x !== 0;
        }

        // TAP / CLICK
        /**
         * Returns true if a click / tap events have been registered
         * @return Boolean
         * @inner
         */
        function hasTap() {
            //Enure we dont return 0 or null for false values
            return !!(options.tap);
        }

        /**
         * Returns true if a double tap events have been registered
         * @return Boolean
         * @inner
         */
        function hasDoubleTap() {
            //Enure we dont return 0 or null for false values
            return !!(options.doubleTap);
        }

        /**
         * Returns true if any long tap events have been registered
         * @return Boolean
         * @inner
         */
        function hasLongTap() {
            //Enure we dont return 0 or null for false values
            return !!(options.longTap);
        }

        /**
         * Returns true if we could be in the process of a double tap (one tap has occurred, we are listening for double taps, and the threshold hasn't past.
         * @return Boolean
         * @inner
         */
        function validateDoubleTap() {
            if (doubleTapStartTime == null) {
                return false;
            }
            var now = getTimeStamp();
            return (hasDoubleTap() && ((now - doubleTapStartTime) <= options.doubleTapThreshold));
        }

        /**
         * Returns true if we could be in the process of a double tap (one tap has occurred, we are listening for double taps, and the threshold hasn't past.
         * @return Boolean
         * @inner
         */
        function inDoubleTap() {
            return validateDoubleTap();
        }


        /**
         * Returns true if we have a valid tap
         * @return Boolean
         * @inner
         */
        function validateTap() {
            return ((fingerCount === 1 || !SUPPORTS_TOUCH) && (isNaN(distance) || distance < options.threshold));
        }

        /**
         * Returns true if we have a valid long tap
         * @return Boolean
         * @inner
         */
        function validateLongTap() {
            //slight threshold on moving finger
            return ((duration > options.longTapThreshold) && (distance < DOUBLE_TAP_THRESHOLD));
        }

        /**
         * Returns true if we are detecting taps and have one
         * @return Boolean
         * @inner
         */
        function didTap() {
            //Enure we dont return 0 or null for false values
            return !!(validateTap() && hasTap());
        }


        /**
         * Returns true if we are detecting double taps and have one
         * @return Boolean
         * @inner
         */
        function didDoubleTap() {
            //Enure we dont return 0 or null for false values
            return !!(validateDoubleTap() && hasDoubleTap());
        }

        /**
         * Returns true if we are detecting long taps and have one
         * @return Boolean
         * @inner
         */
        function didLongTap() {
            //Enure we dont return 0 or null for false values
            return !!(validateLongTap() && hasLongTap());
        }




        // MULTI FINGER TOUCH
        /**
         * Starts tracking the time between 2 finger releases, and keeps track of how many fingers we initially had up
         * @inner
         */
        function startMultiFingerRelease(event) {
            previousTouchEndTime = getTimeStamp();
            fingerCountAtRelease = event.touches.length + 1;
        }

        /**
         * Cancels the tracking of time between 2 finger releases, and resets counters
         * @inner
         */
        function cancelMultiFingerRelease() {
            previousTouchEndTime = 0;
            fingerCountAtRelease = 0;
        }

        /**
         * Checks if we are in the threshold between 2 fingers being released
         * @return Boolean
         * @inner
         */
        function inMultiFingerRelease() {

            var withinThreshold = false;

            if (previousTouchEndTime) {
                var diff = getTimeStamp() - previousTouchEndTime
                if (diff <= options.fingerReleaseThreshold) {
                    withinThreshold = true;
                }
            }

            return withinThreshold;
        }


        /**
         * gets a data flag to indicate that a touch is in progress
         * @return Boolean
         * @inner
         */
        function getTouchInProgress() {
            //strict equality to ensure only true and false are returned
            return !!($element.data(PLUGIN_NS + '_intouch') === true);
        }

        /**
         * Sets a data flag to indicate that a touch is in progress
         * @param {boolean} val The value to set the property to
         * @inner
         */
        function setTouchInProgress(val) {

            //If destroy is called in an event handler, we have no el, and we have already cleaned up, so return.
            if (!$element) {
                return;
            }

            //Add or remove event listeners depending on touch status
            if (val === true) {
                $element.bind(MOVE_EV, touchMove);
                $element.bind(END_EV, touchEnd);

                //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
                if (LEAVE_EV) {
                    $element.bind(LEAVE_EV, touchLeave);
                }
            } else {

                $element.unbind(MOVE_EV, touchMove, false);
                $element.unbind(END_EV, touchEnd, false);

                //we only have leave events on desktop, we manually calcuate leave on touch as its not supported in webkit
                if (LEAVE_EV) {
                    $element.unbind(LEAVE_EV, touchLeave, false);
                }
            }


            //strict equality to ensure only true and false can update the value
            $element.data(PLUGIN_NS + '_intouch', val === true);
        }


        /**
         * Creates the finger data for the touch/finger in the event object.
         * @param {int} id The id to store the finger data under (usually the order the fingers were pressed)
         * @param {object} evt The event object containing finger data
         * @return finger data object
         * @inner
         */
        function createFingerData(id, evt) {
            var f = {
                start: {
                    x: 0,
                    y: 0
                },
                last: {
                    x: 0,
                    y: 0
                },
                end: {
                    x: 0,
                    y: 0
                }
            };
            f.start.x = f.last.x = f.end.x = evt.pageX || evt.clientX;
            f.start.y = f.last.y = f.end.y = evt.pageY || evt.clientY;
            fingerData[id] = f;
            return f;
        }

        /**
         * Updates the finger data for a particular event object
         * @param {object} evt The event object containing the touch/finger data to upadte
         * @return a finger data object.
         * @inner
         */
        function updateFingerData(evt) {
            var id = evt.identifier !== undefined ? evt.identifier : 0;
            var f = getFingerData(id);

            if (f === null) {
                f = createFingerData(id, evt);
            }

            f.last.x = f.end.x;
            f.last.y = f.end.y;

            f.end.x = evt.pageX || evt.clientX;
            f.end.y = evt.pageY || evt.clientY;

            return f;
        }

        /**
         * Returns a finger data object by its event ID.
         * Each touch event has an identifier property, which is used
         * to track repeat touches
         * @param {int} id The unique id of the finger in the sequence of touch events.
         * @return a finger data object.
         * @inner
         */
        function getFingerData(id) {
            return fingerData[id] || null;
        }


        /**
         * Sets the maximum distance swiped in the given direction.
         * If the new value is lower than the current value, the max value is not changed.
         * @param {string}  direction The direction of the swipe
         * @param {int}  distance The distance of the swipe
         * @inner
         */
        function setMaxDistance(direction, distance) {
            if (direction == NONE)
                return;
            distance = Math.max(distance, getMaxDistance(direction));
            maximumsMap[direction].distance = distance;
        }

        /**
         * gets the maximum distance swiped in the given direction.
         * @param {string}  direction The direction of the swipe
         * @return int  The distance of the swipe
         * @inner
         */
        function getMaxDistance(direction) {
            if (maximumsMap[direction])
                return maximumsMap[direction].distance;
            return undefined;
        }

        /**
         * Creats a map of directions to maximum swiped values.
         * @return Object A dictionary of maximum values, indexed by direction.
         * @inner
         */
        function createMaximumsData() {
            var maxData = {};
            maxData[LEFT] = createMaximumVO(LEFT);
            maxData[RIGHT] = createMaximumVO(RIGHT);
            maxData[UP] = createMaximumVO(UP);
            maxData[DOWN] = createMaximumVO(DOWN);

            return maxData;
        }

        /**
         * Creates a map maximum swiped values for a given swipe direction
         * @param {string} The direction that these values will be associated with
         * @return Object Maximum values
         * @inner
         */
        function createMaximumVO(dir) {
            return {
                direction: dir,
                distance: 0
            }
        }


        //
        // MATHS / UTILS
        //

        /**
         * Calculate the duration of the swipe
         * @return int
         * @inner
         */
        function calculateDuration() {
            return endTime - startTime;
        }

        /**
         * Calculate the distance between 2 touches (pinch)
         * @param {point} startPoint A point object containing x and y co-ordinates
         * @param {point} endPoint A point object containing x and y co-ordinates
         * @return int;
         * @inner
         */
        function calculateTouchesDistance(startPoint, endPoint) {
            var diffX = Math.abs(startPoint.x - endPoint.x);
            var diffY = Math.abs(startPoint.y - endPoint.y);

            return Math.round(Math.sqrt(diffX * diffX + diffY * diffY));
        }

        /**
         * Calculate the zoom factor between the start and end distances
         * @param {int} startDistance Distance (between 2 fingers) the user started pinching at
         * @param {int} endDistance Distance (between 2 fingers) the user ended pinching at
         * @return float The zoom value from 0 to 1.
         * @inner
         */
        function calculatePinchZoom(startDistance, endDistance) {
            var percent = (endDistance / startDistance) * 1;
            return percent.toFixed(2);
        }


        /**
         * Returns the pinch direction, either IN or OUT for the given points
         * @return string Either {@link $.fn.swipe.directions.IN} or {@link $.fn.swipe.directions.OUT}
         * @see $.fn.swipe.directions
         * @inner
         */
        function calculatePinchDirection() {
            if (pinchZoom < 1) {
                return OUT;
            } else {
                return IN;
            }
        }


        /**
         * Calculate the length / distance of the swipe
         * @param {point} startPoint A point object containing x and y co-ordinates
         * @param {point} endPoint A point object containing x and y co-ordinates
         * @return int
         * @inner
         */
        function calculateDistance(startPoint, endPoint) {
            return Math.round(Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2)));
        }

        /**
         * Calculate the angle of the swipe
         * @param {point} startPoint A point object containing x and y co-ordinates
         * @param {point} endPoint A point object containing x and y co-ordinates
         * @return int
         * @inner
         */
        function calculateAngle(startPoint, endPoint) {
            var x = startPoint.x - endPoint.x;
            var y = endPoint.y - startPoint.y;
            var r = Math.atan2(y, x); //radians
            var angle = Math.round(r * 180 / Math.PI); //degrees

            //ensure value is positive
            if (angle < 0) {
                angle = 360 - Math.abs(angle);
            }

            return angle;
        }

        /**
         * Calculate the direction of the swipe
         * This will also call calculateAngle to get the latest angle of swipe
         * @param {point} startPoint A point object containing x and y co-ordinates
         * @param {point} endPoint A point object containing x and y co-ordinates
         * @return string Either {@link $.fn.swipe.directions.LEFT} / {@link $.fn.swipe.directions.RIGHT} / {@link $.fn.swipe.directions.DOWN} / {@link $.fn.swipe.directions.UP}
         * @see $.fn.swipe.directions
         * @inner
         */
        function calculateDirection(startPoint, endPoint) {

            if (comparePoints(startPoint, endPoint)) {
                return NONE;
            }

            var angle = calculateAngle(startPoint, endPoint);

            if ((angle <= 45) && (angle >= 0)) {
                return LEFT;
            } else if ((angle <= 360) && (angle >= 315)) {
                return LEFT;
            } else if ((angle >= 135) && (angle <= 225)) {
                return RIGHT;
            } else if ((angle > 45) && (angle < 135)) {
                return DOWN;
            } else {
                return UP;
            }
        }


        /**
         * Returns a MS time stamp of the current time
         * @return int
         * @inner
         */
        function getTimeStamp() {
            var now = new Date();
            return now.getTime();
        }



        /**
         * Returns a bounds object with left, right, top and bottom properties for the element specified.
         * @param {DomNode} The DOM node to get the bounds for.
         */
        function getbounds(el) {
            el = $(el);
            var offset = el.offset();

            var bounds = {
                left: offset.left,
                right: offset.left + el.outerWidth(),
                top: offset.top,
                bottom: offset.top + el.outerHeight()
            }

            return bounds;
        }


        /**
         * Checks if the point object is in the bounds object.
         * @param {object} point A point object.
         * @param {int} point.x The x value of the point.
         * @param {int} point.y The x value of the point.
         * @param {object} bounds The bounds object to test
         * @param {int} bounds.left The leftmost value
         * @param {int} bounds.right The righttmost value
         * @param {int} bounds.top The topmost value
         * @param {int} bounds.bottom The bottommost value
         */
        function isInBounds(point, bounds) {
            return (point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom);
        }
        ;

        /**
         * Checks if the two points are equal
         * @param {object} point A point object.
         * @param {object} point B point object.
         * @return true of the points match
         */
        function comparePoints(pointA, pointB) {
            return (pointA.x == pointB.x && pointA.y == pointB.y);
        }


    }




    /**
     * A catch all handler that is triggered for all swipe directions.
     * @name $.fn.swipe#swipe
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user swiped in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */




    /**
     * A handler that is triggered for "left" swipes.
     * @name $.fn.swipe#swipeLeft
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user swiped in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */

    /**
     * A handler that is triggered for "right" swipes.
     * @name $.fn.swipe#swipeRight
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user swiped in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */

    /**
     * A handler that is triggered for "up" swipes.
     * @name $.fn.swipe#swipeUp
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user swiped in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */

    /**
     * A handler that is triggered for "down" swipes.
     * @name $.fn.swipe#swipeDown
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user swiped in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */

    /**
     * A handler triggered for every phase of the swipe. This handler is constantly fired for the duration of the pinch.
     * This is triggered regardless of swipe thresholds.
     * @name $.fn.swipe#swipeStatus
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {string} phase The phase of the swipe event. See {@link $.fn.swipe.phases}
     * @param {string} direction The direction the user swiped in. This is null if the user has yet to move. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user swiped. This is 0 if the user has yet to move.
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {object} fingerData The coordinates of fingers in event
     * @param {string} currentDirection The current direction the user is swiping.
     */

    /**
     * A handler triggered for pinch in events.
     * @name $.fn.swipe#pinchIn
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user pinched in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user pinched
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {int} zoom The zoom/scale level the user pinched too, 0-1.
     * @param {object} fingerData The coordinates of fingers in event
     */

    /**
     * A handler triggered for pinch out events.
     * @name $.fn.swipe#pinchOut
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user pinched in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user pinched
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {int} zoom The zoom/scale level the user pinched too, 0-1.
     * @param {object} fingerData The coordinates of fingers in event
     */

    /**
     * A handler triggered for all pinch events. This handler is constantly fired for the duration of the pinch. This is triggered regardless of thresholds.
     * @name $.fn.swipe#pinchStatus
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {int} direction The direction the user pinched in. See {@link $.fn.swipe.directions}
     * @param {int} distance The distance the user pinched
     * @param {int} duration The duration of the swipe in milliseconds
     * @param {int} fingerCount The number of fingers used. See {@link $.fn.swipe.fingers}
     * @param {int} zoom The zoom/scale level the user pinched too, 0-1.
     * @param {object} fingerData The coordinates of fingers in event
     */

    /**
     * A click handler triggered when a user simply clicks, rather than swipes on an element.
     * This is deprecated since version 1.6.2, any assignment to click will be assigned to the tap handler.
     * You cannot use <code>on</code> to bind to this event as the default jQ <code>click</code> event will be triggered.
     * Use the <code>tap</code> event instead.
     * @name $.fn.swipe#click
     * @event
     * @deprecated since version 1.6.2, please use {@link $.fn.swipe#tap} instead
     * @default null
     * @param {EventObject} event The original event object
     * @param {DomObject} target The element clicked on.
     */

    /**
     * A click / tap handler triggered when a user simply clicks or taps, rather than swipes on an element.
     * @name $.fn.swipe#tap
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {DomObject} target The element clicked on.
     */

    /**
     * A double tap handler triggered when a user double clicks or taps on an element.
     * You can set the time delay for a double tap with the {@link $.fn.swipe.defaults#doubleTapThreshold} property.
     * Note: If you set both <code>doubleTap</code> and <code>tap</code> handlers, the <code>tap</code> event will be delayed by the <code>doubleTapThreshold</code>
     * as the script needs to check if its a double tap.
     * @name $.fn.swipe#doubleTap
     * @see  $.fn.swipe.defaults#doubleTapThreshold
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {DomObject} target The element clicked on.
     */

    /**
     * A long tap handler triggered once a tap has been release if the tap was longer than the longTapThreshold.
     * You can set the time delay for a long tap with the {@link $.fn.swipe.defaults#longTapThreshold} property.
     * @name $.fn.swipe#longTap
     * @see  $.fn.swipe.defaults#longTapThreshold
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {DomObject} target The element clicked on.
     */

    /**
     * A hold tap handler triggered as soon as the longTapThreshold is reached
     * You can set the time delay for a long tap with the {@link $.fn.swipe.defaults#longTapThreshold} property.
     * @name $.fn.swipe#hold
     * @see  $.fn.swipe.defaults#longTapThreshold
     * @event
     * @default null
     * @param {EventObject} event The original event object
     * @param {DomObject} target The element clicked on.
     */

}));
!function (root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
            define([], function () {
                return root.svg4everybody = factory();
            }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but
            // only CommonJS-like environments that support module.exports,
            // like Node.
            module.exports = factory() : root.svg4everybody = factory();
}(this, function () {
    /*! svg4everybody v2.1.8 | github.com/jonathantneal/svg4everybody */
    function embed(parent, svg, target) {
        // if the target exists
        if (target) {
            // create a document fragment to hold the contents of the target
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            // conditionally set the viewBox on the svg
            viewBox && svg.setAttribute("viewBox", viewBox);
            // copy the contents of the clone into the fragment
            for (// clone the target
                    var clone = target.cloneNode(!0); clone.childNodes.length; ) {
                fragment.appendChild(clone.firstChild);
            }
            // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr) {
        // listen to changes in the request
        xhr.onreadystatechange = function () {
            // if the request is ready
            if (4 === xhr.readyState) {
                // get the cached html document
                var cachedDocument = xhr._cachedDocument;
                // ensure the cached html document based on the xhr response
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                        cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                        xhr._embeds.splice(0).map(function (item) {
                    // get the cached target
                    var target = xhr._cachedTarget[item.id];
                    // ensure the cached target
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                            // embed the target into the svg
                            embed(item.parent, item.svg, target);
                });
            }
        }, // test the ready state change immediately
                xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            // while the index exists in the live <use> collection
            for (// get the cached <use> index
                    var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent);
                if (svg) {
                    var src = use.getAttribute("xlink:href") || use.getAttribute("href");
                    !src && opts.attributeName && (src = use.getAttribute(opts.attributeName));
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            // remove the <use> element
                            parent.removeChild(use);
                            // parse the src and get the url and id
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            // if the link is external
                            if (url.length) {
                                // get the cached xhr request
                                var xhr = requests[url];
                                // ensure the xhr request exists
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                        xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                        xhr._embeds.push({
                                            parent: parent,
                                            svg: svg,
                                            id: id
                                        }), // prepare the xhr ready state change event
                                        loadreadystatechange(xhr);
                            } else {
                                // embed the local id into the svg
                                embed(parent, svg, document.getElementById(id));
                            }
                        } else {
                            // increase the index when the previous value was not "valid"
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    // increase the index when the previous value was not "valid"
                    ++index;
                }
            }
            // continue the interval
            (!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        // create xhr requests object
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        // conditionally start the interval if the polyfill is active
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {
        }
        return svg;
    }
    return svg4everybody;
});
/*
 _ _      _       _
 ___| (_) ___| | __  (_)___
 / __| | |/ __| |/ /  | / __|
 \__ \ | | (__|   < _ | \__ \
 |___/_|_|\___|_|\_(_)/ |___/
 |__/
 
 Version: 1.6.0
 Author: Ken Wheeler
 Website: http://kenwheeler.github.io
 Docs: http://kenwheeler.github.io/slick
 Repo: http://github.com/kenwheeler/slick
 Issues: http://github.com/kenwheeler/slick/issues
 
 */
/* global window, document, define, jQuery, setInterval, clearInterval */
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function ($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function () {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button type="button" data-role="none" class="slick-prev" aria-label="Previous" tabindex="0" role="button">Previous</button>',
                nextArrow: '<button type="button" data-role="none" class="slick-next" aria-label="Next" tabindex="0" role="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function (slider, i) {
                    return $('<button type="button" data-role="none" role="button" tabindex="0" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function () {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {

        var _ = this;

        if (typeof (index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof (index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function (index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function () {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function (targetLeft, callback) {

        var animProps = {},
                _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function (now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                    now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                    now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function () {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function () {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function () {

        var _ = this,
                asNavFor = _.options.asNavFor;

        if (asNavFor && asNavFor !== null) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function (index) {

        var _ = this,
                asNavFor = _.getNavTarget();

        if (asNavFor !== null && typeof asNavFor === 'object') {
            asNavFor.each(function () {
                var target = $(this).slick('getSlick');
                if (!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function (slide) {

        var _ = this,
                transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function () {

        var _ = this;

        _.autoPlayClear();

        if (_.slideCount > _.options.slidesToShow) {
            _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
        }

    };

    Slick.prototype.autoPlayClear = function () {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function () {

        var _ = this,
                slideTo = _.currentSlide + _.options.slidesToScroll;

        if (!_.paused && !_.interrupted && !_.focussed) {

            if (_.options.infinite === false) {

                if (_.direction === 1 && (_.currentSlide + 1) === (_.slideCount - 1)) {
                    _.direction = 0;
                } else if (_.direction === 0) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if (_.currentSlide - 1 === 0) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler(slideTo);

        }

    };

    Slick.prototype.buildArrows = function () {

        var _ = this;

        if (_.options.arrows === true) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if (_.slideCount > _.options.slidesToShow) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                            .addClass('slick-disabled')
                            .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add(_.$nextArrow)

                        .addClass('slick-hidden')
                        .attr({
                            'aria-disabled': 'true',
                            'tabindex': '-1'
                        });

            }

        }

    };

    Slick.prototype.buildDots = function () {

        var _ = this,
                i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active').attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.buildOut = function () {

        var _ = this;

        _.$slides =
                _.$slider
                .children(_.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function (index, element) {
            $(element)
                    .attr('data-slick-index', index)
                    .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
                $('<div class="slick-track"/>').appendTo(_.$slider) :
                _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
                '<div aria-live="polite" class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function () {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides, slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if (_.options.rows > 1) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                    originalSlides.length / slidesPerSection
                    );

            for (a = 0; a < numOfSlides; a++) {
                var slide = document.createElement('div');
                for (b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for (c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                    .css({
                        'width': (100 / _.options.slidesPerRow) + '%',
                        'display': 'inline-block'
                    });

        }

    };

    Slick.prototype.checkResponsive = function (initial, forceUpdate) {

        var _ = this,
                breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if (_.options.responsive &&
                _.options.responsive.length &&
                _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                                targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                    _.breakpointSettings[
                                            targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                        targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if (!initial && triggerBreakpoint !== false) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function (event, dontAnimate) {

        var _ = this,
                $target = $(event.currentTarget),
                indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if ($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if (!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                        event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function (index) {

        var _ = this,
                navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function () {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                    .off('click.slick', _.changeSlide)
                    .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                    .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).off('ready.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function () {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function () {

        var _ = this, originalSlides;

        if (_.options.rows > 1) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function (event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function (refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }


        if (_.$prevArrow && _.$prevArrow.length) {

            _.$prevArrow
                    .removeClass('slick-disabled slick-arrow slick-hidden')
                    .removeAttr('aria-hidden aria-disabled tabindex')
                    .css('display', '');

            if (_.htmlExpr.test(_.options.prevArrow)) {
                _.$prevArrow.remove();
            }
        }

        if (_.$nextArrow && _.$nextArrow.length) {

            _.$nextArrow
                    .removeClass('slick-disabled slick-arrow slick-hidden')
                    .removeAttr('aria-hidden aria-disabled tabindex')
                    .css('display', '');

            if (_.htmlExpr.test(_.options.nextArrow)) {
                _.$nextArrow.remove();
            }

        }


        if (_.$slides) {

            _.$slides
                    .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                    .removeAttr('aria-hidden')
                    .removeAttr('data-slick-index')
                    .each(function () {
                        $(this).attr('style', $(this).data('originalStyling'));
                    });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if (!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function (slide) {

        var _ = this,
                transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function (slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function () {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function (slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function () {

        var _ = this;

        _.$slider
                .off('focus.slick blur.slick')
                .on('focus.slick blur.slick',
                        '*:not(.slick-arrow)', function (event) {

                            event.stopImmediatePropagation();
                            var $sf = $(this);

                            setTimeout(function () {

                                if (_.options.pauseOnFocus) {
                                    _.focussed = $sf.is(':focus');
                                    _.autoPlay();
                                }

                            }, 0);

                        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function () {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if (!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        } else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function (slideIndex) {

        var _ = this,
                targetLeft,
                verticalHeight,
                verticalOffset = 0,
                targetSlide;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                verticalOffset = (verticalHeight * _.options.slidesToShow) * -1;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft = 0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft = 0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function () {

        var _ = this,
                breakPoint = 0,
                counter = 0,
                indexes = [],
                max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function () {

        return this;

    };

    Slick.prototype.getSlideCount = function () {

        var _ = this,
                slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function (index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function (creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if (_.options.autoplay) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function () {
        var _ = this;
        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        _.$slideTrack.attr('role', 'listbox');

        _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
            $(this).attr({
                'role': 'option',
                'aria-describedby': 'slick-slide' + _.instanceUid + i + ''
            });
        });

        if (_.$dots !== null) {
            _.$dots.attr('role', 'tablist').find('li').each(function (i) {
                $(this).attr({
                    'role': 'presentation',
                    'aria-selected': 'false',
                    'aria-controls': 'navigation' + _.instanceUid + i + '',
                    'id': 'slick-slide' + _.instanceUid + i + ''
                });
            })
                    .first().attr('aria-selected', 'true').end()
                    .find('button').attr('role', 'button').end()
                    .closest('div').attr('role', 'toolbar');
        }
        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
                    .off('click.slick')
                    .on('click.slick', {
                        message: 'previous'
                    }, _.changeSlide);
            _.$nextArrow
                    .off('click.slick')
                    .on('click.slick', {
                        message: 'next'
                    }, _.changeSlide);
        }

    };

    Slick.prototype.initDotEvents = function () {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true) {

            $('li', _.$dots)
                    .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                    .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function () {

        var _ = this;

        if (_.options.pauseOnHover) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function () {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(document).on('ready.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.initUI = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function (event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' : 'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function () {

        var _ = this,
                loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function () {

                var image = $(this),
                        imageSource = $(this).attr('data-lazy'),
                        imageToLoad = document.createElement('img');

                imageToLoad.onload = function () {

                    image
                            .animate({opacity: 0}, 100, function () {
                                image
                                        .attr('src', imageSource)
                                        .animate({opacity: 1}, 200, function () {
                                            image
                                                    .removeAttr('data-lazy')
                                                    .removeClass('slick-loading');
                                        });
                                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                            });

                };

                imageToLoad.onerror = function () {

                    image
                            .removeAttr('data-lazy')
                            .removeClass('slick-loading')
                            .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0)
                    rangeStart--;
                if (rangeEnd <= _.slideCount)
                    rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function () {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function () {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function () {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function () {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function (index) {

        var _ = this;

        if (!_.unslicked) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            _.setPosition();

            _.swipeLeft = null;

            if (_.options.autoplay) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function () {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function (event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function (tryCount) {

        tryCount = tryCount || 1;

        var _ = this,
                $imgsToLoad = $('img[data-lazy]', _.$slider),
                image,
                imageSource,
                imageToLoad;

        if ($imgsToLoad.length) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function () {

                image
                        .attr('src', imageSource)
                        .removeAttr('data-lazy')
                        .removeClass('slick-loading');

                if (_.options.adaptiveHeight === true) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function () {

                if (tryCount < 3) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout(function () {
                        _.progressiveLazyLoad(tryCount + 1);
                    }, 500);

                } else {

                    image
                            .removeAttr('data-lazy')
                            .removeClass('slick-loading')
                            .addClass('slick-lazyload-error');

                    _.$slider.trigger('lazyLoadError', [_, image, imageSource]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [_]);

        }

    };

    Slick.prototype.refresh = function (initializing) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if (!_.options.infinite && (_.currentSlide > lastVisibleIndex)) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, {currentSlide: currentSlide});

        _.init();

        if (!initializing) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function () {

        var _ = this, breakpoint, currentBreakpoint, l,
                responsiveSettings = _.options.responsive || null;

        if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {

            _.respondTo = _.options.respondTo || 'window';

            for (breakpoint in responsiveSettings) {

                l = _.breakpoints.length - 1;
                currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while (l >= 0) {
                        if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
                            _.breakpoints.splice(l, 1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function (a, b) {
                return (_.options.mobileFirst) ? a - b : b - a;
            });

        }

    };

    Slick.prototype.reinit = function () {

        var _ = this;

        _.$slides =
                _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function () {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function () {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if (!_.unslicked) {
                    _.setPosition();
                }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {

        var _ = this;

        if (typeof (index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function (position) {

        var _ = this,
                positionProps = {},
                x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function () {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false)
            _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function () {

        var _ = this,
                targetLeft;

        _.$slides.each(function (index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function () {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
            Slick.prototype.slickSetOption = function () {

                /**
                 * accepts arguments in format of:
                 *
                 *  - for changing a single option's value:
                 *     .slick("setOption", option, value, refresh )
                 *
                 *  - for changing a set of responsive options:
                 *     .slick("setOption", 'responsive', [{}, ...], refresh )
                 *
                 *  - for updating multiple values at once (not responsive)
                 *     .slick("setOption", { 'option': value, ... }, refresh )
                 */

                var _ = this, l, item, option, value, refresh = false, type;

                if ($.type(arguments[0]) === 'object') {

                    option = arguments[0];
                    refresh = arguments[1];
                    type = 'multiple';

                } else if ($.type(arguments[0]) === 'string') {

                    option = arguments[0];
                    value = arguments[1];
                    refresh = arguments[2];

                    if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {

                        type = 'responsive';

                    } else if (typeof arguments[1] !== 'undefined') {

                        type = 'single';

                    }

                }

                if (type === 'single') {

                    _.options[option] = value;


                } else if (type === 'multiple') {

                    $.each(option, function (opt, val) {

                        _.options[opt] = val;

                    });


                } else if (type === 'responsive') {

                    for (item in value) {

                        if ($.type(_.options.responsive) !== 'array') {

                            _.options.responsive = [value[item]];

                        } else {

                            l = _.options.responsive.length - 1;

                            // loop through the responsive object and splice out duplicates.
                            while (l >= 0) {

                                if (_.options.responsive[l].breakpoint === value[item].breakpoint) {

                                    _.options.responsive.splice(l, 1);

                                }

                                l--;

                            }

                            _.options.responsive.push(value[item]);

                        }

                    }

                }

                if (refresh) {

                    _.unload();
                    _.reinit();

                }

            };

    Slick.prototype.setPosition = function () {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function () {

        var _ = this,
                bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
                bodyStyle.MozTransition !== undefined ||
                bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if (_.options.fade) {
            if (typeof _.options.zIndex === 'number') {
                if (_.options.zIndex < 3) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
                _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined)
                _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined)
                _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined)
                _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function (index) {

        var _ = this,
                centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
                .find('.slick-slide')
                .removeClass('slick-active slick-center slick-current')
                .attr('aria-hidden', 'true');

        _.$slides
                .eq(index)
                .addClass('slick-current');

        if (_.options.centerMode === true) {

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {

                    _.$slides
                            .slice(index - centerOffset, index + centerOffset + 1)
                            .addClass('slick-active')
                            .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                            .slice(indexOffset - centerOffset + 1, indexOffset + centerOffset + 2)
                            .addClass('slick-active')
                            .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                            .eq(allSlides.length - 1 - _.options.slidesToShow)
                            .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                            .eq(_.options.slidesToShow)
                            .addClass('slick-center');

                }

            }

            _.$slides
                    .eq(index)
                    .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                        .slice(index, index + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                            .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                            .addClass('slick-active')
                            .attr('aria-hidden', 'false');

                } else {

                    allSlides
                            .slice(indexOffset, indexOffset + _.options.slidesToShow)
                            .addClass('slick-active')
                            .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand') {
            _.lazyLoad();
        }

    };

    Slick.prototype.setupInfinite = function () {

        var _ = this,
                i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                            .attr('data-slick-index', slideIndex - _.slideCount)
                            .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                            .attr('data-slick-index', slideIndex + _.slideCount)
                            .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function (toggle) {

        var _ = this;

        if (!toggle) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function (event) {

        var _ = this;

        var targetElement =
                $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index)
            index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.setSlideClasses(index);
            _.asNavFor(index);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function (index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
                _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true) {
                    _.animateSlide(slideLeft, function () {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if (_.options.autoplay) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if (_.options.asNavFor) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if (navTarget.slideCount <= navTarget.options.slidesToShow) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function () {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true) {
            _.animateSlide(targetLeft, function () {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function () {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function () {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function (event) {

        var _ = this,
                slideCount,
                direction;

        _.dragging = false;
        _.interrupted = false;
        _.shouldClick = (_.touchObject.swipeLength > 10) ? false : true;

        if (_.touchObject.curX === undefined) {
            return false;
        }

        if (_.touchObject.edgeHit === true) {
            _.$slider.trigger('edge', [_, _.swipeDirection()]);
        }

        if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {

            direction = _.swipeDirection();

            switch (direction) {

                case 'left':
                case 'down':

                    slideCount =
                            _.options.swipeToSlide ?
                            _.checkNavigable(_.currentSlide + _.getSlideCount()) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                            _.options.swipeToSlide ?
                            _.checkNavigable(_.currentSlide - _.getSlideCount()) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if (direction != 'vertical') {

                _.slideHandler(slideCount);
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction]);

            }

        } else {

            if (_.touchObject.startX !== _.touchObject.curX) {

                _.slideHandler(_.currentSlide);
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function (event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
                event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
                .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                    .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function (event) {

        var _ = this,
                edgeWasHit = false,
                curLeft, swipeDirection, swipeLength, positionOffset, touches;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
                Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = Math.round(Math.sqrt(
                    Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
        }

        swipeDirection = _.swipeDirection();

        if (swipeDirection === 'vertical') {
            return;
        }

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function (event) {

        var _ = this,
                touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function () {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
                .removeClass('slick-slide slick-active slick-visible slick-current')
                .attr('aria-hidden', 'true')
                .css('width', '');

    };

    Slick.prototype.unslick = function (fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function () {

        var _ = this,
                centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if (_.options.arrows === true &&
                _.slideCount > _.options.slidesToShow &&
                !_.options.infinite) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function () {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                    .find('li')
                    .removeClass('slick-active')
                    .attr('aria-hidden', 'true');

            _.$dots
                    .find('li')
                    .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

        }

    };

    Slick.prototype.visibility = function () {

        var _ = this;

        if (_.options.autoplay) {

            if (document[_.hidden]) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function () {
        var _ = this,
                opt = arguments[0],
                args = Array.prototype.slice.call(arguments, 1),
                l = _.length,
                i,
                ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined')
                return ret;
        }
        return _;
    };

}));

/*! jQuery UI - v1.12.1 - 2017-05-17
 * http://jqueryui.com
 * Includes: widget.js, keycode.js, widgets/mouse.js, widgets/slider.js
 * Copyright jQuery Foundation and other contributors; Licensed MIT */

(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define(["jquery"], factory);
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    $.ui = $.ui || {};

    var version = $.ui.version = "1.12.1";


    /*!
     * jQuery UI Widget 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Widget
//>>group: Core
//>>description: Provides a factory for creating stateful widgets with a common API.
//>>docs: http://api.jqueryui.com/jQuery.widget/
//>>demos: http://jqueryui.com/widget/



    var widgetUuid = 0;
    var widgetSlice = Array.prototype.slice;

    $.cleanData = (function (orig) {
        return function (elems) {
            var events, elem, i;
            for (i = 0; (elem = elems[ i ]) != null; i++) {
                try {

                    // Only trigger remove when necessary to save time
                    events = $._data(elem, "events");
                    if (events && events.remove) {
                        $(elem).triggerHandler("remove");
                    }

                    // Http://bugs.jquery.com/ticket/8235
                } catch (e) {
                }
            }
            orig(elems);
        };
    })($.cleanData);

    $.widget = function (name, base, prototype) {
        var existingConstructor, constructor, basePrototype;

        // ProxiedPrototype allows the provided prototype to remain unmodified
        // so that it can be used as a mixin for multiple widgets (#8876)
        var proxiedPrototype = {};

        var namespace = name.split(".")[ 0 ];
        name = name.split(".")[ 1 ];
        var fullName = namespace + "-" + name;

        if (!prototype) {
            prototype = base;
            base = $.Widget;
        }

        if ($.isArray(prototype)) {
            prototype = $.extend.apply(null, [{}].concat(prototype));
        }

        // Create selector for plugin
        $.expr[ ":" ][ fullName.toLowerCase() ] = function (elem) {
            return !!$.data(elem, fullName);
        };

        $[ namespace ] = $[ namespace ] || {};
        existingConstructor = $[ namespace ][ name ];
        constructor = $[ namespace ][ name ] = function (options, element) {

            // Allow instantiation without "new" keyword
            if (!this._createWidget) {
                return new constructor(options, element);
            }

            // Allow instantiation without initializing for simple inheritance
            // must use "new" keyword (the code above always passes args)
            if (arguments.length) {
                this._createWidget(options, element);
            }
        };

        // Extend with the existing constructor to carry over any static properties
        $.extend(constructor, existingConstructor, {
            version: prototype.version,

            // Copy the object used to create the prototype in case we need to
            // redefine the widget later
            _proto: $.extend({}, prototype),

            // Track widgets that inherit from this widget in case this widget is
            // redefined after a widget inherits from it
            _childConstructors: []
        });

        basePrototype = new base();

        // We need to make the options hash a property directly on the new instance
        // otherwise we'll modify the options hash on the prototype that we're
        // inheriting from
        basePrototype.options = $.widget.extend({}, basePrototype.options);
        $.each(prototype, function (prop, value) {
            if (!$.isFunction(value)) {
                proxiedPrototype[ prop ] = value;
                return;
            }
            proxiedPrototype[ prop ] = (function () {
                function _super() {
                    return base.prototype[ prop ].apply(this, arguments);
                }

                function _superApply(args) {
                    return base.prototype[ prop ].apply(this, args);
                }

                return function () {
                    var __super = this._super;
                    var __superApply = this._superApply;
                    var returnValue;

                    this._super = _super;
                    this._superApply = _superApply;

                    returnValue = value.apply(this, arguments);

                    this._super = __super;
                    this._superApply = __superApply;

                    return returnValue;
                };
            })();
        });
        constructor.prototype = $.widget.extend(basePrototype, {

            // TODO: remove support for widgetEventPrefix
            // always use the name + a colon as the prefix, e.g., draggable:start
            // don't prefix for widgets that aren't DOM-based
            widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
        }, proxiedPrototype, {
            constructor: constructor,
            namespace: namespace,
            widgetName: name,
            widgetFullName: fullName
        });

        // If this widget is being redefined then we need to find all widgets that
        // are inheriting from it and redefine all of them so that they inherit from
        // the new version of this widget. We're essentially trying to replace one
        // level in the prototype chain.
        if (existingConstructor) {
            $.each(existingConstructor._childConstructors, function (i, child) {
                var childPrototype = child.prototype;

                // Redefine the child widget using the same prototype that was
                // originally used, but inherit from the new version of the base
                $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor,
                        child._proto);
            });

            // Remove the list of existing child constructors from the old constructor
            // so the old child constructors can be garbage collected
            delete existingConstructor._childConstructors;
        } else {
            base._childConstructors.push(constructor);
        }

        $.widget.bridge(name, constructor);

        return constructor;
    };

    $.widget.extend = function (target) {
        var input = widgetSlice.call(arguments, 1);
        var inputIndex = 0;
        var inputLength = input.length;
        var key;
        var value;

        for (; inputIndex < inputLength; inputIndex++) {
            for (key in input[ inputIndex ]) {
                value = input[ inputIndex ][ key ];
                if (input[ inputIndex ].hasOwnProperty(key) && value !== undefined) {

                    // Clone objects
                    if ($.isPlainObject(value)) {
                        target[ key ] = $.isPlainObject(target[ key ]) ?
                                $.widget.extend({}, target[ key ], value) :
                                // Don't extend strings, arrays, etc. with objects
                                $.widget.extend({}, value);

                        // Copy everything else by reference
                    } else {
                        target[ key ] = value;
                    }
                }
            }
        }
        return target;
    };

    $.widget.bridge = function (name, object) {
        var fullName = object.prototype.widgetFullName || name;
        $.fn[ name ] = function (options) {
            var isMethodCall = typeof options === "string";
            var args = widgetSlice.call(arguments, 1);
            var returnValue = this;

            if (isMethodCall) {

                // If this is an empty collection, we need to have the instance method
                // return undefined instead of the jQuery instance
                if (!this.length && options === "instance") {
                    returnValue = undefined;
                } else {
                    this.each(function () {
                        var methodValue;
                        var instance = $.data(this, fullName);

                        if (options === "instance") {
                            returnValue = instance;
                            return false;
                        }

                        if (!instance) {
                            return $.error("cannot call methods on " + name +
                                    " prior to initialization; " +
                                    "attempted to call method '" + options + "'");
                        }

                        if (!$.isFunction(instance[ options ]) || options.charAt(0) === "_") {
                            return $.error("no such method '" + options + "' for " + name +
                                    " widget instance");
                        }

                        methodValue = instance[ options ].apply(instance, args);

                        if (methodValue !== instance && methodValue !== undefined) {
                            returnValue = methodValue && methodValue.jquery ?
                                    returnValue.pushStack(methodValue.get()) :
                                    methodValue;
                            return false;
                        }
                    });
                }
            } else {

                // Allow multiple hashes to be passed on init
                if (args.length) {
                    options = $.widget.extend.apply(null, [options].concat(args));
                }

                this.each(function () {
                    var instance = $.data(this, fullName);
                    if (instance) {
                        instance.option(options || {});
                        if (instance._init) {
                            instance._init();
                        }
                    } else {
                        $.data(this, fullName, new object(options, this));
                    }
                });
            }

            return returnValue;
        };
    };

    $.Widget = function ( /* options, element */ ) {};
    $.Widget._childConstructors = [];

    $.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        defaultElement: "<div>",

        options: {
            classes: {},
            disabled: false,

            // Callbacks
            create: null
        },

        _createWidget: function (options, element) {
            element = $(element || this.defaultElement || this)[ 0 ];
            this.element = $(element);
            this.uuid = widgetUuid++;
            this.eventNamespace = "." + this.widgetName + this.uuid;

            this.bindings = $();
            this.hoverable = $();
            this.focusable = $();
            this.classesElementLookup = {};

            if (element !== this) {
                $.data(element, this.widgetFullName, this);
                this._on(true, this.element, {
                    remove: function (event) {
                        if (event.target === element) {
                            this.destroy();
                        }
                    }
                });
                this.document = $(element.style ?
                        // Element within the document
                        element.ownerDocument :
                        // Element is window or document
                        element.document || element);
                this.window = $(this.document[ 0 ].defaultView || this.document[ 0 ].parentWindow);
            }

            this.options = $.widget.extend({},
                    this.options,
                    this._getCreateOptions(),
                    options);

            this._create();

            if (this.options.disabled) {
                this._setOptionDisabled(this.options.disabled);
            }

            this._trigger("create", null, this._getCreateEventData());
            this._init();
        },

        _getCreateOptions: function () {
            return {};
        },

        _getCreateEventData: $.noop,

        _create: $.noop,

        _init: $.noop,

        destroy: function () {
            var that = this;

            this._destroy();
            $.each(this.classesElementLookup, function (key, value) {
                that._removeClass(value, key);
            });

            // We can probably remove the unbind calls in 2.0
            // all event bindings should go through this._on()
            this.element
                    .off(this.eventNamespace)
                    .removeData(this.widgetFullName);
            this.widget()
                    .off(this.eventNamespace)
                    .removeAttr("aria-disabled");

            // Clean up events and states
            this.bindings.off(this.eventNamespace);
        },

        _destroy: $.noop,

        widget: function () {
            return this.element;
        },

        option: function (key, value) {
            var options = key;
            var parts;
            var curOption;
            var i;

            if (arguments.length === 0) {

                // Don't return a reference to the internal hash
                return $.widget.extend({}, this.options);
            }

            if (typeof key === "string") {

                // Handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                options = {};
                parts = key.split(".");
                key = parts.shift();
                if (parts.length) {
                    curOption = options[ key ] = $.widget.extend({}, this.options[ key ]);
                    for (i = 0; i < parts.length - 1; i++) {
                        curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
                        curOption = curOption[ parts[ i ] ];
                    }
                    key = parts.pop();
                    if (arguments.length === 1) {
                        return curOption[ key ] === undefined ? null : curOption[ key ];
                    }
                    curOption[ key ] = value;
                } else {
                    if (arguments.length === 1) {
                        return this.options[ key ] === undefined ? null : this.options[ key ];
                    }
                    options[ key ] = value;
                }
            }

            this._setOptions(options);

            return this;
        },

        _setOptions: function (options) {
            var key;

            for (key in options) {
                this._setOption(key, options[ key ]);
            }

            return this;
        },

        _setOption: function (key, value) {
            if (key === "classes") {
                this._setOptionClasses(value);
            }

            this.options[ key ] = value;

            if (key === "disabled") {
                this._setOptionDisabled(value);
            }

            return this;
        },

        _setOptionClasses: function (value) {
            var classKey, elements, currentElements;

            for (classKey in value) {
                currentElements = this.classesElementLookup[ classKey ];
                if (value[ classKey ] === this.options.classes[ classKey ] ||
                        !currentElements ||
                        !currentElements.length) {
                    continue;
                }

                // We are doing this to create a new jQuery object because the _removeClass() call
                // on the next line is going to destroy the reference to the current elements being
                // tracked. We need to save a copy of this collection so that we can add the new classes
                // below.
                elements = $(currentElements.get());
                this._removeClass(currentElements, classKey);

                // We don't use _addClass() here, because that uses this.options.classes
                // for generating the string of classes. We want to use the value passed in from
                // _setOption(), this is the new value of the classes option which was passed to
                // _setOption(). We pass this value directly to _classes().
                elements.addClass(this._classes({
                    element: elements,
                    keys: classKey,
                    classes: value,
                    add: true
                }));
            }
        },

        _setOptionDisabled: function (value) {
            this._toggleClass(this.widget(), this.widgetFullName + "-disabled", null, !!value);

            // If the widget is becoming disabled, then nothing is interactive
            if (value) {
                this._removeClass(this.hoverable, null, "ui-state-hover");
                this._removeClass(this.focusable, null, "ui-state-focus");
            }
        },

        enable: function () {
            return this._setOptions({disabled: false});
        },

        disable: function () {
            return this._setOptions({disabled: true});
        },

        _classes: function (options) {
            var full = [];
            var that = this;

            options = $.extend({
                element: this.element,
                classes: this.options.classes || {}
            }, options);

            function processClassString(classes, checkOption) {
                var current, i;
                for (i = 0; i < classes.length; i++) {
                    current = that.classesElementLookup[ classes[ i ] ] || $();
                    if (options.add) {
                        current = $($.unique(current.get().concat(options.element.get())));
                    } else {
                        current = $(current.not(options.element).get());
                    }
                    that.classesElementLookup[ classes[ i ] ] = current;
                    full.push(classes[ i ]);
                    if (checkOption && options.classes[ classes[ i ] ]) {
                        full.push(options.classes[ classes[ i ] ]);
                    }
                }
            }

            this._on(options.element, {
                "remove": "_untrackClassesElement"
            });

            if (options.keys) {
                processClassString(options.keys.match(/\S+/g) || [], true);
            }
            if (options.extra) {
                processClassString(options.extra.match(/\S+/g) || []);
            }

            return full.join(" ");
        },

        _untrackClassesElement: function (event) {
            var that = this;
            $.each(that.classesElementLookup, function (key, value) {
                if ($.inArray(event.target, value) !== -1) {
                    that.classesElementLookup[ key ] = $(value.not(event.target).get());
                }
            });
        },

        _removeClass: function (element, keys, extra) {
            return this._toggleClass(element, keys, extra, false);
        },

        _addClass: function (element, keys, extra) {
            return this._toggleClass(element, keys, extra, true);
        },

        _toggleClass: function (element, keys, extra, add) {
            add = (typeof add === "boolean") ? add : extra;
            var shift = (typeof element === "string" || element === null),
                    options = {
                        extra: shift ? keys : extra,
                        keys: shift ? element : keys,
                        element: shift ? this.element : element,
                        add: add
                    };
            options.element.toggleClass(this._classes(options), add);
            return this;
        },

        _on: function (suppressDisabledCheck, element, handlers) {
            var delegateElement;
            var instance = this;

            // No suppressDisabledCheck flag, shuffle arguments
            if (typeof suppressDisabledCheck !== "boolean") {
                handlers = element;
                element = suppressDisabledCheck;
                suppressDisabledCheck = false;
            }

            // No element argument, shuffle and use this.element
            if (!handlers) {
                handlers = element;
                element = this.element;
                delegateElement = this.widget();
            } else {
                element = delegateElement = $(element);
                this.bindings = this.bindings.add(element);
            }

            $.each(handlers, function (event, handler) {
                function handlerProxy() {

                    // Allow widgets to customize the disabled handling
                    // - disabled as an array instead of boolean
                    // - disabled class as method for disabling individual parts
                    if (!suppressDisabledCheck &&
                            (instance.options.disabled === true ||
                                    $(this).hasClass("ui-state-disabled"))) {
                        return;
                    }
                    return (typeof handler === "string" ? instance[ handler ] : handler)
                            .apply(instance, arguments);
                }

                // Copy the guid so direct unbinding works
                if (typeof handler !== "string") {
                    handlerProxy.guid = handler.guid =
                            handler.guid || handlerProxy.guid || $.guid++;
                }

                var match = event.match(/^([\w:-]*)\s*(.*)$/);
                var eventName = match[ 1 ] + instance.eventNamespace;
                var selector = match[ 2 ];

                if (selector) {
                    delegateElement.on(eventName, selector, handlerProxy);
                } else {
                    element.on(eventName, handlerProxy);
                }
            });
        },

        _off: function (element, eventName) {
            eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") +
                    this.eventNamespace;
            element.off(eventName).off(eventName);

            // Clear the stack to avoid memory leaks (#10056)
            this.bindings = $(this.bindings.not(element).get());
            this.focusable = $(this.focusable.not(element).get());
            this.hoverable = $(this.hoverable.not(element).get());
        },

        _delay: function (handler, delay) {
            function handlerProxy() {
                return (typeof handler === "string" ? instance[ handler ] : handler)
                        .apply(instance, arguments);
            }
            var instance = this;
            return setTimeout(handlerProxy, delay || 0);
        },

        _hoverable: function (element) {
            this.hoverable = this.hoverable.add(element);
            this._on(element, {
                mouseenter: function (event) {
                    this._addClass($(event.currentTarget), null, "ui-state-hover");
                },
                mouseleave: function (event) {
                    this._removeClass($(event.currentTarget), null, "ui-state-hover");
                }
            });
        },

        _focusable: function (element) {
            this.focusable = this.focusable.add(element);
            this._on(element, {
                focusin: function (event) {
                    this._addClass($(event.currentTarget), null, "ui-state-focus");
                },
                focusout: function (event) {
                    this._removeClass($(event.currentTarget), null, "ui-state-focus");
                }
            });
        },

        _trigger: function (type, event, data) {
            var prop, orig;
            var callback = this.options[ type ];

            data = data || {};
            event = $.Event(event);
            event.type = (type === this.widgetEventPrefix ?
                    type :
                    this.widgetEventPrefix + type).toLowerCase();

            // The original event may come from any element
            // so we need to reset the target on the new event
            event.target = this.element[ 0 ];

            // Copy original event properties over to the new event
            orig = event.originalEvent;
            if (orig) {
                for (prop in orig) {
                    if (!(prop in event)) {
                        event[ prop ] = orig[ prop ];
                    }
                }
            }

            this.element.trigger(event, data);
            return !($.isFunction(callback) &&
                    callback.apply(this.element[ 0 ], [event].concat(data)) === false ||
                    event.isDefaultPrevented());
        }
    };

    $.each({show: "fadeIn", hide: "fadeOut"}, function (method, defaultEffect) {
        $.Widget.prototype[ "_" + method ] = function (element, options, callback) {
            if (typeof options === "string") {
                options = {effect: options};
            }

            var hasOptions;
            var effectName = !options ?
                    method :
                    options === true || typeof options === "number" ?
                    defaultEffect :
                    options.effect || defaultEffect;

            options = options || {};
            if (typeof options === "number") {
                options = {duration: options};
            }

            hasOptions = !$.isEmptyObject(options);
            options.complete = callback;

            if (options.delay) {
                element.delay(options.delay);
            }

            if (hasOptions && $.effects && $.effects.effect[ effectName ]) {
                element[ method ](options);
            } else if (effectName !== method && element[ effectName ]) {
                element[ effectName ](options.duration, options.easing, callback);
            } else {
                element.queue(function (next) {
                    $(this)[ method ]();
                    if (callback) {
                        callback.call(element[ 0 ]);
                    }
                    next();
                });
            }
        };
    });

    var widget = $.widget;


    /*!
     * jQuery UI Keycode 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Keycode
//>>group: Core
//>>description: Provide keycodes as keynames
//>>docs: http://api.jqueryui.com/jQuery.ui.keyCode/


    var keycode = $.ui.keyCode = {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
    };




// This file is deprecated
    var ie = $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

    /*!
     * jQuery UI Mouse 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Mouse
//>>group: Widgets
//>>description: Abstracts mouse-based interactions to assist in creating certain widgets.
//>>docs: http://api.jqueryui.com/mouse/



    var mouseHandled = false;
    $(document).on("mouseup", function () {
        mouseHandled = false;
    });

    var widgetsMouse = $.widget("ui.mouse", {
        version: "1.12.1",
        options: {
            cancel: "input, textarea, button, select, option",
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var that = this;

            this.element
                    .on("mousedown." + this.widgetName, function (event) {
                        return that._mouseDown(event);
                    })
                    .on("click." + this.widgetName, function (event) {
                        if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                            $.removeData(event.target, that.widgetName + ".preventClickEvent");
                            event.stopImmediatePropagation();
                            return false;
                        }
                    });

            this.started = false;
        },

        // TODO: make sure destroying one instance of mouse doesn't mess with
        // other instances of mouse
        _mouseDestroy: function () {
            this.element.off("." + this.widgetName);
            if (this._mouseMoveDelegate) {
                this.document
                        .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
                        .off("mouseup." + this.widgetName, this._mouseUpDelegate);
            }
        },

        _mouseDown: function (event) {

            // don't let more than one widget handle mouseStart
            if (mouseHandled) {
                return;
            }

            this._mouseMoved = false;

            // We may have missed mouseup (out of window)
            (this._mouseStarted && this._mouseUp(event));

            this._mouseDownEvent = event;

            var that = this,
                    btnIsLeft = (event.which === 1),
                    // event.target.nodeName works around a bug in IE 8 with
                    // disabled inputs (#7620)
                    elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ?
                            $(event.target).closest(this.options.cancel).length : false);
            if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                return true;
            }

            this.mouseDelayMet = !this.options.delay;
            if (!this.mouseDelayMet) {
                this._mouseDelayTimer = setTimeout(function () {
                    that.mouseDelayMet = true;
                }, this.options.delay);
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(event) !== false);
                if (!this._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }

            // Click event may never have fired (Gecko & Opera)
            if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                $.removeData(event.target, this.widgetName + ".preventClickEvent");
            }

            // These delegates are required to keep context
            this._mouseMoveDelegate = function (event) {
                return that._mouseMove(event);
            };
            this._mouseUpDelegate = function (event) {
                return that._mouseUp(event);
            };

            this.document
                    .on("mousemove." + this.widgetName, this._mouseMoveDelegate)
                    .on("mouseup." + this.widgetName, this._mouseUpDelegate);

            event.preventDefault();

            mouseHandled = true;
            return true;
        },

        _mouseMove: function (event) {

            // Only check for mouseups outside the document if you've moved inside the document
            // at least once. This prevents the firing of mouseup in the case of IE<9, which will
            // fire a mousemove event if content is placed under the cursor. See #7778
            // Support: IE <9
            if (this._mouseMoved) {

                // IE mouseup check - mouseup happened when mouse was out of window
                if ($.ui.ie && (!document.documentMode || document.documentMode < 9) &&
                        !event.button) {
                    return this._mouseUp(event);

                    // Iframe mouseup check - mouseup occurred in another document
                } else if (!event.which) {

                    // Support: Safari <=8 - 9
                    // Safari sets which to 0 if you press any of the following keys
                    // during a drag (#14461)
                    if (event.originalEvent.altKey || event.originalEvent.ctrlKey ||
                            event.originalEvent.metaKey || event.originalEvent.shiftKey) {
                        this.ignoreMissingWhich = true;
                    } else if (!this.ignoreMissingWhich) {
                        return this._mouseUp(event);
                    }
                }
            }

            if (event.which || event.button) {
                this._mouseMoved = true;
            }

            if (this._mouseStarted) {
                this._mouseDrag(event);
                return event.preventDefault();
            }

            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted =
                        (this._mouseStart(this._mouseDownEvent, event) !== false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }

            return !this._mouseStarted;
        },

        _mouseUp: function (event) {
            this.document
                    .off("mousemove." + this.widgetName, this._mouseMoveDelegate)
                    .off("mouseup." + this.widgetName, this._mouseUpDelegate);

            if (this._mouseStarted) {
                this._mouseStarted = false;

                if (event.target === this._mouseDownEvent.target) {
                    $.data(event.target, this.widgetName + ".preventClickEvent", true);
                }

                this._mouseStop(event);
            }

            if (this._mouseDelayTimer) {
                clearTimeout(this._mouseDelayTimer);
                delete this._mouseDelayTimer;
            }

            this.ignoreMissingWhich = false;
            mouseHandled = false;
            event.preventDefault();
        },

        _mouseDistanceMet: function (event) {
            return (Math.max(
                    Math.abs(this._mouseDownEvent.pageX - event.pageX),
                    Math.abs(this._mouseDownEvent.pageY - event.pageY)
                    ) >= this.options.distance
                    );
        },

        _mouseDelayMet: function ( /* event */ ) {
            return this.mouseDelayMet;
        },

        // These are placeholder methods, to be overriden by extending plugin
        _mouseStart: function ( /* event */ ) {},
        _mouseDrag: function ( /* event */ ) {},
        _mouseStop: function ( /* event */ ) {},
        _mouseCapture: function ( /* event */ ) {
            return true;
        }
    });


    /*!
     * jQuery UI Slider 1.12.1
     * http://jqueryui.com
     *
     * Copyright jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

//>>label: Slider
//>>group: Widgets
//>>description: Displays a flexible slider with ranges and accessibility via keyboard.
//>>docs: http://api.jqueryui.com/slider/
//>>demos: http://jqueryui.com/slider/
//>>css.structure: ../../themes/base/core.css
//>>css.structure: ../../themes/base/slider.css
//>>css.theme: ../../themes/base/theme.css



    var widgetsSlider = $.widget("ui.slider", $.ui.mouse, {
        version: "1.12.1",
        widgetEventPrefix: "slide",

        options: {
            animate: false,
            classes: {
                "ui-slider": "ui-corner-all",
                "ui-slider-handle": "ui-corner-all",

                // Note: ui-widget-header isn't the most fittingly semantic framework class for this
                // element, but worked best visually with a variety of themes
                "ui-slider-range": "ui-corner-all ui-widget-header"
            },
            distance: 0,
            max: 100,
            min: 0,
            orientation: "horizontal",
            range: false,
            step: 1,
            value: 0,
            values: null,

            // Callbacks
            change: null,
            slide: null,
            start: null,
            stop: null
        },

        // Number of pages in a slider
        // (how many times can you page up/down to go through the whole range)
        numPages: 5,

        _create: function () {
            this._keySliding = false;
            this._mouseSliding = false;
            this._animateOff = true;
            this._handleIndex = null;
            this._detectOrientation();
            this._mouseInit();
            this._calculateNewMax();

            this._addClass("ui-slider ui-slider-" + this.orientation,
                    "ui-widget ui-widget-content");

            this._refresh();

            this._animateOff = false;
        },

        _refresh: function () {
            this._createRange();
            this._createHandles();
            this._setupEvents();
            this._refreshValue();
        },

        _createHandles: function () {
            var i, handleCount,
                    options = this.options,
                    existingHandles = this.element.find(".ui-slider-handle"),
                    handle = "<span tabindex='0'></span>",
                    handles = [];

            handleCount = (options.values && options.values.length) || 1;

            if (existingHandles.length > handleCount) {
                existingHandles.slice(handleCount).remove();
                existingHandles = existingHandles.slice(0, handleCount);
            }

            for (i = existingHandles.length; i < handleCount; i++) {
                handles.push(handle);
            }

            this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

            this._addClass(this.handles, "ui-slider-handle", "ui-state-default");

            this.handle = this.handles.eq(0);

            this.handles.each(function (i) {
                $(this)
                        .data("ui-slider-handle-index", i)
                        .attr("tabIndex", 0);
            });
        },

        _createRange: function () {
            var options = this.options;

            if (options.range) {
                if (options.range === true) {
                    if (!options.values) {
                        options.values = [this._valueMin(), this._valueMin()];
                    } else if (options.values.length && options.values.length !== 2) {
                        options.values = [options.values[ 0 ], options.values[ 0 ]];
                    } else if ($.isArray(options.values)) {
                        options.values = options.values.slice(0);
                    }
                }

                if (!this.range || !this.range.length) {
                    this.range = $("<div>")
                            .appendTo(this.element);

                    this._addClass(this.range, "ui-slider-range");
                } else {
                    this._removeClass(this.range, "ui-slider-range-min ui-slider-range-max");

                    // Handle range switching from true to min/max
                    this.range.css({
                        "left": "",
                        "bottom": ""
                    });
                }
                if (options.range === "min" || options.range === "max") {
                    this._addClass(this.range, "ui-slider-range-" + options.range);
                }
            } else {
                if (this.range) {
                    this.range.remove();
                }
                this.range = null;
            }
        },

        _setupEvents: function () {
            this._off(this.handles);
            this._on(this.handles, this._handleEvents);
            this._hoverable(this.handles);
            this._focusable(this.handles);
        },

        _destroy: function () {
            this.handles.remove();
            if (this.range) {
                this.range.remove();
            }

            this._mouseDestroy();
        },

        _mouseCapture: function (event) {
            var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
                    that = this,
                    o = this.options;

            if (o.disabled) {
                return false;
            }

            this.elementSize = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
            this.elementOffset = this.element.offset();

            position = {x: event.pageX, y: event.pageY};
            normValue = this._normValueFromMouse(position);
            distance = this._valueMax() - this._valueMin() + 1;
            this.handles.each(function (i) {
                var thisDistance = Math.abs(normValue - that.values(i));
                if ((distance > thisDistance) ||
                        (distance === thisDistance &&
                                (i === that._lastChangedValue || that.values(i) === o.min))) {
                    distance = thisDistance;
                    closestHandle = $(this);
                    index = i;
                }
            });

            allowed = this._start(event, index);
            if (allowed === false) {
                return false;
            }
            this._mouseSliding = true;

            this._handleIndex = index;

            this._addClass(closestHandle, null, "ui-state-active");
            closestHandle.trigger("focus");

            offset = closestHandle.offset();
            mouseOverHandle = !$(event.target).parents().addBack().is(".ui-slider-handle");
            this._clickOffset = mouseOverHandle ? {left: 0, top: 0} : {
                left: event.pageX - offset.left - (closestHandle.width() / 2),
                top: event.pageY - offset.top -
                        (closestHandle.height() / 2) -
                        (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) -
                        (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) +
                        (parseInt(closestHandle.css("marginTop"), 10) || 0)
            };

            if (!this.handles.hasClass("ui-state-hover")) {
                this._slide(event, index, normValue);
            }
            this._animateOff = true;
            return true;
        },

        _mouseStart: function () {
            return true;
        },

        _mouseDrag: function (event) {
            var position = {x: event.pageX, y: event.pageY},
                    normValue = this._normValueFromMouse(position);

            this._slide(event, this._handleIndex, normValue);

            return false;
        },

        _mouseStop: function (event) {
            this._removeClass(this.handles, null, "ui-state-active");
            this._mouseSliding = false;

            this._stop(event, this._handleIndex);
            this._change(event, this._handleIndex);

            this._handleIndex = null;
            this._clickOffset = null;
            this._animateOff = false;

            return false;
        },

        _detectOrientation: function () {
            this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
        },

        _normValueFromMouse: function (position) {
            var pixelTotal,
                    pixelMouse,
                    percentMouse,
                    valueTotal,
                    valueMouse;

            if (this.orientation === "horizontal") {
                pixelTotal = this.elementSize.width;
                pixelMouse = position.x - this.elementOffset.left -
                        (this._clickOffset ? this._clickOffset.left : 0);
            } else {
                pixelTotal = this.elementSize.height;
                pixelMouse = position.y - this.elementOffset.top -
                        (this._clickOffset ? this._clickOffset.top : 0);
            }

            percentMouse = (pixelMouse / pixelTotal);
            if (percentMouse > 1) {
                percentMouse = 1;
            }
            if (percentMouse < 0) {
                percentMouse = 0;
            }
            if (this.orientation === "vertical") {
                percentMouse = 1 - percentMouse;
            }

            valueTotal = this._valueMax() - this._valueMin();
            valueMouse = this._valueMin() + percentMouse * valueTotal;

            return this._trimAlignValue(valueMouse);
        },

        _uiHash: function (index, value, values) {
            var uiHash = {
                handle: this.handles[ index ],
                handleIndex: index,
                value: value !== undefined ? value : this.value()
            };

            if (this._hasMultipleValues()) {
                uiHash.value = value !== undefined ? value : this.values(index);
                uiHash.values = values || this.values();
            }

            return uiHash;
        },

        _hasMultipleValues: function () {
            return this.options.values && this.options.values.length;
        },

        _start: function (event, index) {
            return this._trigger("start", event, this._uiHash(index));
        },

        _slide: function (event, index, newVal) {
            var allowed, otherVal,
                    currentValue = this.value(),
                    newValues = this.values();

            if (this._hasMultipleValues()) {
                otherVal = this.values(index ? 0 : 1);
                currentValue = this.values(index);

                if (this.options.values.length === 2 && this.options.range === true) {
                    newVal = index === 0 ? Math.min(otherVal, newVal) : Math.max(otherVal, newVal);
                }

                newValues[ index ] = newVal;
            }

            if (newVal === currentValue) {
                return;
            }

            allowed = this._trigger("slide", event, this._uiHash(index, newVal, newValues));

            // A slide can be canceled by returning false from the slide callback
            if (allowed === false) {
                return;
            }

            if (this._hasMultipleValues()) {
                this.values(index, newVal);
            } else {
                this.value(newVal);
            }
        },

        _stop: function (event, index) {
            this._trigger("stop", event, this._uiHash(index));
        },

        _change: function (event, index) {
            if (!this._keySliding && !this._mouseSliding) {

                //store the last changed value index for reference when handles overlap
                this._lastChangedValue = index;
                this._trigger("change", event, this._uiHash(index));
            }
        },

        value: function (newValue) {
            if (arguments.length) {
                this.options.value = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, 0);
                return;
            }

            return this._value();
        },

        values: function (index, newValue) {
            var vals,
                    newValues,
                    i;

            if (arguments.length > 1) {
                this.options.values[ index ] = this._trimAlignValue(newValue);
                this._refreshValue();
                this._change(null, index);
                return;
            }

            if (arguments.length) {
                if ($.isArray(arguments[ 0 ])) {
                    vals = this.options.values;
                    newValues = arguments[ 0 ];
                    for (i = 0; i < vals.length; i += 1) {
                        vals[ i ] = this._trimAlignValue(newValues[ i ]);
                        this._change(null, i);
                    }
                    this._refreshValue();
                } else {
                    if (this._hasMultipleValues()) {
                        return this._values(index);
                    } else {
                        return this.value();
                    }
                }
            } else {
                return this._values();
            }
        },

        _setOption: function (key, value) {
            var i,
                    valsLength = 0;

            if (key === "range" && this.options.range === true) {
                if (value === "min") {
                    this.options.value = this._values(0);
                    this.options.values = null;
                } else if (value === "max") {
                    this.options.value = this._values(this.options.values.length - 1);
                    this.options.values = null;
                }
            }

            if ($.isArray(this.options.values)) {
                valsLength = this.options.values.length;
            }

            this._super(key, value);

            switch (key) {
                case "orientation":
                    this._detectOrientation();
                    this._removeClass("ui-slider-horizontal ui-slider-vertical")
                            ._addClass("ui-slider-" + this.orientation);
                    this._refreshValue();
                    if (this.options.range) {
                        this._refreshRange(value);
                    }

                    // Reset positioning from previous orientation
                    this.handles.css(value === "horizontal" ? "bottom" : "left", "");
                    break;
                case "value":
                    this._animateOff = true;
                    this._refreshValue();
                    this._change(null, 0);
                    this._animateOff = false;
                    break;
                case "values":
                    this._animateOff = true;
                    this._refreshValue();

                    // Start from the last handle to prevent unreachable handles (#9046)
                    for (i = valsLength - 1; i >= 0; i--) {
                        this._change(null, i);
                    }
                    this._animateOff = false;
                    break;
                case "step":
                case "min":
                case "max":
                    this._animateOff = true;
                    this._calculateNewMax();
                    this._refreshValue();
                    this._animateOff = false;
                    break;
                case "range":
                    this._animateOff = true;
                    this._refresh();
                    this._animateOff = false;
                    break;
            }
        },

        _setOptionDisabled: function (value) {
            this._super(value);

            this._toggleClass(null, "ui-state-disabled", !!value);
        },

        //internal value getter
        // _value() returns value trimmed by min and max, aligned by step
        _value: function () {
            var val = this.options.value;
            val = this._trimAlignValue(val);

            return val;
        },

        //internal values getter
        // _values() returns array of values trimmed by min and max, aligned by step
        // _values( index ) returns single value trimmed by min and max, aligned by step
        _values: function (index) {
            var val,
                    vals,
                    i;

            if (arguments.length) {
                val = this.options.values[ index ];
                val = this._trimAlignValue(val);

                return val;
            } else if (this._hasMultipleValues()) {

                // .slice() creates a copy of the array
                // this copy gets trimmed by min and max and then returned
                vals = this.options.values.slice();
                for (i = 0; i < vals.length; i += 1) {
                    vals[ i ] = this._trimAlignValue(vals[ i ]);
                }

                return vals;
            } else {
                return [];
            }
        },

        // Returns the step-aligned value that val is closest to, between (inclusive) min and max
        _trimAlignValue: function (val) {
            if (val <= this._valueMin()) {
                return this._valueMin();
            }
            if (val >= this._valueMax()) {
                return this._valueMax();
            }
            var step = (this.options.step > 0) ? this.options.step : 1,
                    valModStep = (val - this._valueMin()) % step,
                    alignValue = val - valModStep;

            if (Math.abs(valModStep) * 2 >= step) {
                alignValue += (valModStep > 0) ? step : (-step);
            }

            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see #4124)
            return parseFloat(alignValue.toFixed(5));
        },

        _calculateNewMax: function () {
            var max = this.options.max,
                    min = this._valueMin(),
                    step = this.options.step,
                    aboveMin = Math.round((max - min) / step) * step;
            max = aboveMin + min;
            if (max > this.options.max) {

                //If max is not divisible by step, rounding off may increase its value
                max -= step;
            }
            this.max = parseFloat(max.toFixed(this._precision()));
        },

        _precision: function () {
            var precision = this._precisionOf(this.options.step);
            if (this.options.min !== null) {
                precision = Math.max(precision, this._precisionOf(this.options.min));
            }
            return precision;
        },

        _precisionOf: function (num) {
            var str = num.toString(),
                    decimal = str.indexOf(".");
            return decimal === -1 ? 0 : str.length - decimal - 1;
        },

        _valueMin: function () {
            return this.options.min;
        },

        _valueMax: function () {
            return this.max;
        },

        _refreshRange: function (orientation) {
            if (orientation === "vertical") {
                this.range.css({"width": "", "left": ""});
            }
            if (orientation === "horizontal") {
                this.range.css({"height": "", "bottom": ""});
            }
        },

        _refreshValue: function () {
            var lastValPercent, valPercent, value, valueMin, valueMax,
                    oRange = this.options.range,
                    o = this.options,
                    that = this,
                    animate = (!this._animateOff) ? o.animate : false,
                    _set = {};

            if (this._hasMultipleValues()) {
                this.handles.each(function (i) {
                    valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() -
                            that._valueMin()) * 100;
                    _set[ that.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                    $(this).stop(1, 1)[ animate ? "animate" : "css" ](_set, o.animate);
                    if (that.options.range === true) {
                        if (that.orientation === "horizontal") {
                            if (i === 0) {
                                that.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                                    left: valPercent + "%"
                                }, o.animate);
                            }
                            if (i === 1) {
                                that.range[ animate ? "animate" : "css" ]({
                                    width: (valPercent - lastValPercent) + "%"
                                }, {
                                    queue: false,
                                    duration: o.animate
                                });
                            }
                        } else {
                            if (i === 0) {
                                that.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                                    bottom: (valPercent) + "%"
                                }, o.animate);
                            }
                            if (i === 1) {
                                that.range[ animate ? "animate" : "css" ]({
                                    height: (valPercent - lastValPercent) + "%"
                                }, {
                                    queue: false,
                                    duration: o.animate
                                });
                            }
                        }
                    }
                    lastValPercent = valPercent;
                });
            } else {
                value = this.value();
                valueMin = this._valueMin();
                valueMax = this._valueMax();
                valPercent = (valueMax !== valueMin) ?
                        (value - valueMin) / (valueMax - valueMin) * 100 :
                        0;
                _set[ this.orientation === "horizontal" ? "left" : "bottom" ] = valPercent + "%";
                this.handle.stop(1, 1)[ animate ? "animate" : "css" ](_set, o.animate);

                if (oRange === "min" && this.orientation === "horizontal") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                        width: valPercent + "%"
                    }, o.animate);
                }
                if (oRange === "max" && this.orientation === "horizontal") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                        width: (100 - valPercent) + "%"
                    }, o.animate);
                }
                if (oRange === "min" && this.orientation === "vertical") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                        height: valPercent + "%"
                    }, o.animate);
                }
                if (oRange === "max" && this.orientation === "vertical") {
                    this.range.stop(1, 1)[ animate ? "animate" : "css" ]({
                        height: (100 - valPercent) + "%"
                    }, o.animate);
                }
            }
        },

        _handleEvents: {
            keydown: function (event) {
                var allowed, curVal, newVal, step,
                        index = $(event.target).data("ui-slider-handle-index");

                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                    case $.ui.keyCode.END:
                    case $.ui.keyCode.PAGE_UP:
                    case $.ui.keyCode.PAGE_DOWN:
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        event.preventDefault();
                        if (!this._keySliding) {
                            this._keySliding = true;
                            this._addClass($(event.target), null, "ui-state-active");
                            allowed = this._start(event, index);
                            if (allowed === false) {
                                return;
                            }
                        }
                        break;
                }

                step = this.options.step;
                if (this._hasMultipleValues()) {
                    curVal = newVal = this.values(index);
                } else {
                    curVal = newVal = this.value();
                }

                switch (event.keyCode) {
                    case $.ui.keyCode.HOME:
                        newVal = this._valueMin();
                        break;
                    case $.ui.keyCode.END:
                        newVal = this._valueMax();
                        break;
                    case $.ui.keyCode.PAGE_UP:
                        newVal = this._trimAlignValue(
                                curVal + ((this._valueMax() - this._valueMin()) / this.numPages)
                                );
                        break;
                    case $.ui.keyCode.PAGE_DOWN:
                        newVal = this._trimAlignValue(
                                curVal - ((this._valueMax() - this._valueMin()) / this.numPages));
                        break;
                    case $.ui.keyCode.UP:
                    case $.ui.keyCode.RIGHT:
                        if (curVal === this._valueMax()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal + step);
                        break;
                    case $.ui.keyCode.DOWN:
                    case $.ui.keyCode.LEFT:
                        if (curVal === this._valueMin()) {
                            return;
                        }
                        newVal = this._trimAlignValue(curVal - step);
                        break;
                }

                this._slide(event, index, newVal);
            },
            keyup: function (event) {
                var index = $(event.target).data("ui-slider-handle-index");

                if (this._keySliding) {
                    this._keySliding = false;
                    this._stop(event, index);
                    this._change(event, index);
                    this._removeClass($(event.target), null, "ui-state-active");
                }
            }
        }
    });




}));
// ==================================================
// fancyBox v3.0.47
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
;
(function (window, document, $, undefined) {
    'use strict';

    // If there's no jQuery, fancyBox can't work
    // =========================================

    if (!$) {
        return undefined;
    }

    // Private default settings
    // ========================

    var defaults = {

        // Animation duration in ms
        speed: 330,

        // Enable infinite gallery navigation
        loop: true,

        // Should zoom animation change opacity, too
        // If opacity is 'auto', then fade-out if image and thumbnail have different aspect ratios
        opacity: 'auto',

        // Space around image, ignored if zoomed-in or viewport smaller than 800px
        margin: [44, 0],

        // Horizontal space between slides
        gutter: 30,

        // Should display toolbars
        infobar: true,
        buttons: true,

        // What buttons should appear in the toolbar
        slideShow: true,
        fullScreen: true,
        thumbs: true,
        closeBtn: true,

        // Should apply small close button at top right corner of the content
        // If 'auto' - will be set for content having type 'html', 'inline' or 'ajax'
        smallBtn: 'auto',

        image: {

            // Wait for images to load before displaying
            // Requires predefined image dimensions
            // If 'auto' - will zoom in thumbnail if 'width' and 'height' attributes are found
            preload: "auto",

            // Protect an image from downloading by right-click
            protect: false

        },

        ajax: {

            // Object containing settings for ajax request
            settings: {

                // This helps to indicate that request comes from the modal
                // Feel free to change naming
                data: {
                    fancybox: true
                }
            }

        },

        iframe: {

            // Iframe template
            tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',

            // Preload iframe before displaying it
            // This allows to calculate iframe content width and height
            // (note: Due to "Same Origin Policy", you can't get cross domain data).
            preload: true,

            // Scrolling attribute for iframe tag
            scrolling: 'no',

            // Custom CSS styling for iframe wrapping element
            css: {}

        },

        // Custom CSS class for layout
        baseClass: '',

        // Custom CSS class for slide element
        slideClass: '',

        // Base template for layout
        baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' +
                '<div class="fancybox-bg"></div>' +
                '<div class="fancybox-controls">' +
                '<div class="fancybox-infobar">' +
                '<button data-fancybox-previous class="fancybox-button fancybox-button--left" title="Previous"></button>' +
                '<div class="fancybox-infobar__body">' +
                '<span class="js-fancybox-index"></span>&nbsp;/&nbsp;<span class="js-fancybox-count"></span>' +
                '</div>' +
                '<button data-fancybox-next class="fancybox-button fancybox-button--right" title="Next"></button>' +
                '</div>' +
                '<div class="fancybox-buttons">' +
                '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="Close (Esc)"></button>' +
                '</div>' +
                '</div>' +
                '<div class="fancybox-slider-wrap">' +
                '<div class="fancybox-slider"></div>' +
                '</div>' +
                '<div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div>' +
                '</div>',

        // Loading indicator template
        spinnerTpl: '<div class="fancybox-loading"></div>',

        // Error message template
        errorTpl: '<div class="fancybox-error"><p>The requested content cannot be loaded. <br /> Please try again later.<p></div>',

        // This will be appended to html content, if "smallBtn" option is not set to false
        closeTpl: '<button data-fancybox-close class="fancybox-close-small"></button>',

        // Container is injected into this element
        parentEl: 'body',

        // Enable gestures (tap, zoom, pan and pinch)
        touch: true,

        // Enable keyboard navigation
        keyboard: true,

        // Try to focus on first focusable element after opening
        focus: true,

        // Close when clicked outside of the content
        closeClickOutside: true,

        // Callbacks
        beforeLoad: $.noop,
        afterLoad: $.noop,
        beforeMove: $.noop,
        afterMove: $.noop,
        onComplete: $.noop,

        onInit: $.noop,
        beforeClose: $.noop,
        afterClose: $.noop,
        onActivate: $.noop,
        onDeactivate: $.noop

    };

    var $W = $(window);
    var $D = $(document);

    var called = 0;

    // Check if an object is a jQuery object and not a native JavaScript object
    // ========================================================================

    var isQuery = function (obj) {
        return obj && obj.hasOwnProperty && obj instanceof $;
    };

    // Handle multiple browsers for requestAnimationFrame()
    // ====================================================

    var requestAFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    // Check if element is inside the viewport by at least 1 pixel
    // ===========================================================

    var isElementInViewport = function (el) {
        var rect;

        if (typeof $ === "function" && el instanceof $) {
            el = el[0];
        }

        rect = el.getBoundingClientRect();

        return rect.bottom > 0 && rect.right > 0 &&
                rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
                rect.top < (window.innerHeight || document.documentElement.clientHeight);
    };


    // Class definition
    // ================

    var FancyBox = function (content, opts, index) {
        var self = this;

        self.opts = $.extend(true, {index: index}, defaults, opts || {});
        self.id = self.opts.id || ++called;
        self.group = [];

        self.currIndex = parseInt(self.opts.index, 10) || 0;
        self.prevIndex = null;

        self.prevPos = null;
        self.currPos = 0;

        self.firstRun = null;

        // Create group elements from original item collection
        self.createGroup(content);

        if (!self.group.length) {
            return;
        }

        // Save last active element and current scroll position
        self.$lastFocus = $(document.activeElement).blur();

        // Collection of gallery objects
        self.slides = {};

        self.init(content);

    };

    $.extend(FancyBox.prototype, {

        // Create DOM structure
        // ====================

        init: function () {
            var self = this;

            var galleryHasHtml = false;

            var testWidth;
            var $container;

            self.scrollTop = $D.scrollTop();
            self.scrollLeft = $D.scrollLeft();

            if (!$.fancybox.getInstance()) {
                testWidth = $('body').width();

                $('html').addClass('fancybox-enabled');

                if ($.fancybox.isTouch) {

                    // Ugly workaround for iOS page shifting issue (when inputs get focus)
                    // Do not apply for images, otherwise top/bottom bars will appear
                    $.each(self.group, function (key, item) {
                        if (item.type !== 'image' && item.type !== 'iframe') {
                            galleryHasHtml = true;
                            return false;
                        }
                    });

                    if (galleryHasHtml) {
                        $('body').css({
                            position: 'fixed',
                            width: testWidth,
                            top: self.scrollTop * -1
                        });
                    }

                } else {

                    // Compare page width after adding "overflow:hidden"
                    testWidth = $('body').width() - testWidth;

                    // Width has changed - compensate missing scrollbars
                    if (testWidth > 1) {
                        $('<style id="fancybox-noscroll" type="text/css">').html('.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + testWidth + 'px; }').appendTo('head');
                    }

                }
            }

            $container = $(self.opts.baseTpl)
                    .attr('id', 'fancybox-container-' + self.id)
                    .data('FancyBox', self)
                    .addClass(self.opts.baseClass)
                    .hide()
                    .prependTo(self.opts.parentEl);

            // Create object holding references to jQuery wrapped nodes
            self.$refs = {
                container: $container,
                bg: $container.find('.fancybox-bg'),
                controls: $container.find('.fancybox-controls'),
                buttons: $container.find('.fancybox-buttons'),
                slider_wrap: $container.find('.fancybox-slider-wrap'),
                slider: $container.find('.fancybox-slider'),
                caption: $container.find('.fancybox-caption')
            };

            self.trigger('onInit');

            // Bring to front and enable events
            self.activate();

            // Try to avoid running multiple times
            if (self.current) {
                return;
            }

            self.jumpTo(self.currIndex);

        },

        // Create array of gally item objects
        // Check if each object has valid type and content
        // ===============================================

        createGroup: function (content) {
            var self = this;
            var items = $.makeArray(content);

            $.each(items, function (i, item) {
                var obj = {},
                        opts = {},
                        data = [],
                        $item,
                        type,
                        src,
                        srcParts;

                // Step 1 - Make sure we have an object

                if ($.isPlainObject(item)) {

                    obj = item;
                    opts = item.opts || {};

                } else if ($.type(item) === 'object' && $(item).length) {

                    $item = $(item);
                    data = $item.data();

                    opts = 'options' in data ? data.options : {};

                    opts = $.type(opts) === 'object' ? opts : {};

                    obj.type = 'type' in data ? data.type : opts.type;
                    obj.src = 'src'  in data ? data.src : (opts.src || $item.attr('href'));

                    opts.width = 'width'   in data ? data.width : opts.width;
                    opts.height = 'height'  in data ? data.height : opts.height;
                    opts.thumb = 'thumb'   in data ? data.thumb : opts.thumb;

                    opts.selector = 'selector'  in data ? data.selector : opts.selector;

                    if ('srcset' in data) {
                        opts.image = {srcset: data.srcset};
                    }

                    opts.$orig = $item;

                } else {

                    obj = {
                        type: 'html',
                        content: item + ''
                    };

                }

                obj.opts = $.extend(true, {}, self.opts, opts);

                // Step 2 - Make sure we have supported content type

                type = obj.type;
                src = obj.src || '';

                if (!type) {

                    if (obj.content) {
                        type = 'html';

                    } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
                        type = 'image';

                    } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
                        type = 'pdf';

                    } else if (src.charAt(0) === '#') {
                        type = 'inline';

                    }

                    obj.type = type;

                }

                // Step 3 - Some adjustments

                obj.index = self.group.length;

                // Check if $orig and $thumb objects exist
                if (obj.opts.$orig && !obj.opts.$orig.length) {
                    delete obj.opts.$orig;
                }

                if (!obj.opts.$thumb && obj.opts.$orig) {
                    obj.opts.$thumb = obj.opts.$orig.find('img:first');
                }

                if (obj.opts.$thumb && !obj.opts.$thumb.length) {
                    delete obj.opts.$thumb;
                }

                // Caption is a "special" option, it can be passed as a method
                if ($.type(obj.opts.caption) === 'function') {
                    obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);

                } else if ('caption' in data) {
                    obj.opts.caption = data.caption;

                } else if (opts.$orig) {
                    obj.opts.caption = $item.attr('title');
                }

                // Make sure we have caption as a string
                obj.opts.caption = obj.opts.caption === undefined ? '' : obj.opts.caption + '';

                // Check if url contains selector used to filter the content
                // Example: "ajax.html #something"
                if (type === 'ajax') {
                    srcParts = src.split(/\s+/, 2);

                    if (srcParts.length > 1) {
                        obj.src = srcParts.shift();

                        obj.opts.selector = srcParts.shift();
                    }
                }

                if (obj.opts.smallBtn == 'auto') {

                    if ($.inArray(type, ['html', 'inline', 'ajax']) > -1) {
                        obj.opts.buttons = false;
                        obj.opts.smallBtn = true;

                    } else {
                        obj.opts.smallBtn = false;
                    }

                }

                if (type === 'pdf') {

                    obj.type = 'iframe';

                    obj.opts.closeBtn = true;
                    obj.opts.smallBtn = false;

                    obj.opts.iframe.preload = false;

                }

                if (obj.opts.modal) {

                    $.extend(true, obj.opts, {
                        infobar: 0,
                        buttons: 0,
                        keyboard: 0,
                        slideShow: 0,
                        fullScreen: 0,
                        closeClickOutside: 0
                    });

                }

                self.group.push(obj);

            });

        },

        // Attach an event handler functions for:
        //   - navigation elements
        //   - browser scrolling, resizing;
        //   - focusing
        //   - keyboard
        // =================

        addEvents: function () {
            var self = this;

            self.removeEvents();

            // Make navigation elements clickable

            self.$refs.container.on('click.fb-close', '[data-fancybox-close]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.close(e);

            }).on('click.fb-previous', '[data-fancybox-previous]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.previous();

            }).on('click.fb-next', '[data-fancybox-next]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.next();
            });


            // Handle page scrolling and browser resizing

            $(window).on('orientationchange.fb resize.fb', function (e) {
                requestAFrame(function () {

                    if (e && e.originalEvent && e.originalEvent.type === "resize") {
                        self.update();

                    } else {
                        self.$refs.slider_wrap.hide();

                        requestAFrame(function () {
                            self.$refs.slider_wrap.show();

                            self.update();
                        });

                    }

                });
            });


            // Trap focus

            $D.on('focusin.fb', function (e) {
                var instance = $.fancybox ? $.fancybox.getInstance() : null;

                if (instance && !$(e.target).hasClass('fancybox-container') && !$.contains(instance.$refs.container[0], e.target)) {
                    e.stopPropagation();

                    instance.focus();

                    // Sometimes page gets scrolled, set it back
                    $W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);
                }

            });

            // Enable keyboard navigation

            $D.on('keydown.fb', function (e) {
                var current = self.current,
                        keycode = e.keyCode || e.which;

                if (!current || !current.opts.keyboard) {
                    return;
                }

                if ($(e.target).is('input') || $(e.target).is('textarea')) {
                    return;
                }

                // Backspace and Esc keys
                if (keycode === 8 || keycode === 27) {
                    e.preventDefault();

                    self.close(e);

                    return;
                }

                switch (keycode) {

                    case 37: // Left arrow
                    case 38: // Up arrow

                        e.preventDefault();

                        self.previous();

                        break;

                    case 39: // Right arrow
                    case 40: // Down arrow

                        e.preventDefault();

                        self.next();

                        break;

                    case 80: // "P"
                    case 32: // Spacebar

                        e.preventDefault();

                        if (self.SlideShow) {
                            e.preventDefault();

                            self.SlideShow.toggle();
                        }

                        break;

                    case 70: // "F"

                        if (self.FullScreen) {
                            e.preventDefault();

                            self.FullScreen.toggle();
                        }

                        break;

                    case 71: // "G"

                        if (self.Thumbs) {
                            e.preventDefault();

                            self.Thumbs.toggle();
                        }

                        break;
                }
            });


        },

        // Remove events added by the core
        // ===============================

        removeEvents: function () {

            $W.off('scroll.fb resize.fb orientationchange.fb');
            $D.off('keydown.fb focusin.fb click.fb-close');

            this.$refs.container.off('click.fb-close click.fb-previous click.fb-next');
        },

        // Slide to left
        // ==================

        previous: function (duration) {
            this.jumpTo(this.currIndex - 1, duration);
        },

        // Slide to right
        // ===================

        next: function (duration) {
            this.jumpTo(this.currIndex + 1, duration);
        },

        // Display current gallery item, move slider to current position
        // =============================================================

        jumpTo: function (to, duration) {
            var self = this,
                    firstRun,
                    index,
                    pos,
                    loop;

            firstRun = self.firstRun = (self.firstRun === null);

            index = pos = to = parseInt(to, 10);
            loop = self.current ? self.current.opts.loop : false;

            if (self.isAnimating || (index == self.currIndex && !firstRun)) {
                return;
            }

            if (self.group.length > 1 && loop) {

                index = index % self.group.length;
                index = index < 0 ? self.group.length + index : index;

                // Calculate closest position of upcoming item from the current one
                if (self.group.length == 2) {
                    pos = to - self.currIndex + self.currPos;

                } else {
                    pos = index - self.currIndex + self.currPos;

                    if (Math.abs(self.currPos - (pos + self.group.length)) < Math.abs(self.currPos - pos)) {
                        pos = pos + self.group.length;

                    } else if (Math.abs(self.currPos - (pos - self.group.length)) < Math.abs(self.currPos - pos)) {
                        pos = pos - self.group.length;

                    }
                }

            } else if (!self.group[ index ]) {
                self.update(false, false, duration);

                return;
            }

            if (self.current) {
                self.current.$slide.removeClass('fancybox-slide--current fancybox-slide--complete');

                self.updateSlide(self.current, true);
            }

            self.prevIndex = self.currIndex;
            self.prevPos = self.currPos;

            self.currIndex = index;
            self.currPos = pos;

            // Create slides

            self.current = self.createSlide(pos);

            if (self.group.length > 1) {

                if (self.opts.loop || pos - 1 >= 0) {
                    self.createSlide(pos - 1);
                }

                if (self.opts.loop || pos + 1 < self.group.length) {
                    self.createSlide(pos + 1);
                }
            }

            self.current.isMoved = false;
            self.current.isComplete = false;

            duration = parseInt(duration === undefined ? self.current.opts.speed * 1.5 : duration, 10);

            // Move slider to the next position
            // Note: the content might still be loading
            self.trigger('beforeMove');

            self.updateControls();

            if (firstRun) {
                self.current.$slide.addClass('fancybox-slide--current');

                self.$refs.container.show();

                requestAFrame(function () {
                    self.$refs.bg.css('transition-duration', self.current.opts.speed + 'ms');

                    self.$refs.container.addClass('fancybox-container--ready');
                });
            }

            // Set position immediately on first opening
            self.update(true, false, firstRun ? 0 : duration, function () {
                self.afterMove();
            });

            self.loadSlide(self.current);

            if (!(firstRun && self.current.$ghost)) {
                self.preload();
            }

        },

        // Create new "slide" element
        // These are gallery items  that are actually added to DOM
        // =======================================================

        createSlide: function (pos) {

            var self = this;
            var $slide;
            var index;
            var found;

            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;

            if (!self.slides[ pos ] && self.group[ index ]) {

                // If we are looping and slide with that index already exists, then reuse it
                if (self.opts.loop && self.group.length > 2) {
                    for (var key in self.slides) {
                        if (self.slides[ key ].index === index) {
                            found = self.slides[ key ];
                            found.pos = pos;

                            self.slides[ pos ] = found;

                            delete self.slides[ key ];

                            self.updateSlide(found);

                            return found;
                        }
                    }
                }

                $slide = $('<div class="fancybox-slide"></div>').appendTo(self.$refs.slider);

                self.slides[ pos ] = $.extend(true, {}, self.group[ index ], {
                    pos: pos,
                    $slide: $slide,
                    isMoved: false,
                    isLoaded: false
                });

            }

            return self.slides[ pos ];

        },

        zoomInOut: function (type, duration, callback) {

            var self = this;
            var current = self.current;
            var $what = current.$placeholder;
            var opacity = current.opts.opacity;
            var $thumb = current.opts.$thumb;
            var thumbPos = $thumb ? $thumb.offset() : 0;
            var slidePos = current.$slide.offset();
            var props;
            var start;
            var end;

            if (!$what || !current.isMoved || !thumbPos || !isElementInViewport($thumb)) {
                return false;
            }

            if (type === 'In' && !self.firstRun) {
                return false;
            }

            $.fancybox.stop($what);

            self.isAnimating = true;

            props = {
                top: thumbPos.top - slidePos.top + parseFloat($thumb.css("border-top-width") || 0),
                left: thumbPos.left - slidePos.left + parseFloat($thumb.css("border-left-width") || 0),
                width: $thumb.width(),
                height: $thumb.height(),
                scaleX: 1,
                scaleY: 1
            };

            // Check if we need to animate opacity
            if (opacity == 'auto') {
                opacity = Math.abs(current.width / current.height - props.width / props.height) > 0.1;
            }

            if (type === 'In') {
                start = props;
                end = self.getFitPos(current);

                end.scaleX = end.width / start.width;
                end.scaleY = end.height / start.height;

                if (opacity) {
                    start.opacity = 0.1;
                    end.opacity = 1;
                }

            } else {

                start = $.fancybox.getTranslate($what);
                end = props;

                // Switch to thumbnail image to improve animation performance
                if (current.$ghost) {
                    current.$ghost.show();

                    if (current.$image) {
                        current.$image.remove();
                    }
                }

                start.scaleX = start.width / end.width;
                start.scaleY = start.height / end.height;

                start.width = end.width;
                start.height = end.height;

                if (opacity) {
                    end.opacity = 0;
                }

            }

            self.updateCursor(end.width, end.height);

            // There is no need to animate width/height properties
            delete end.width;
            delete end.height;

            $.fancybox.setTranslate($what, start);

            $what.show();

            self.trigger('beforeZoom' + type);

            $what.css('transition', 'all ' + duration + 'ms');

            $.fancybox.setTranslate($what, end);

            setTimeout(function () {
                var reset;

                $what.css('transition', 'none');

                reset = $.fancybox.getTranslate($what);

                reset.scaleX = 1;
                reset.scaleY = 1;

                // Reset scalex/scaleY values; this helps for perfomance
                $.fancybox.setTranslate($what, reset);

                self.trigger('afterZoom' + type);

                callback.apply(self);

                self.isAnimating = false;

            }, duration);


            return true;

        },

        // Check if image dimensions exceed parent element
        // ===============================================

        canPan: function () {

            var self = this;

            var current = self.current;
            var $what = current.$placeholder;

            var rez = false;

            if ($what) {
                rez = self.getFitPos(current);
                rez = Math.abs($what.width() - rez.width) > 1 || Math.abs($what.height() - rez.height) > 1;

            }

            return rez;

        },

        // Check if current image dimensions are smaller than actual
        // =========================================================

        isScaledDown: function () {

            var self = this;

            var current = self.current;
            var $what = current.$placeholder;

            var rez = false;

            if ($what) {
                rez = $.fancybox.getTranslate($what);
                rez = rez.width < current.width || rez.height < current.height;
            }

            return rez;

        },

        // Scale image to the actual size of the image
        // ===========================================

        scaleToActual: function (x, y, duration) {

            var self = this;

            var current = self.current;
            var $what = current.$placeholder;

            var imgPos, posX, posY, scaleX, scaleY;

            var canvasWidth = parseInt(current.$slide.width(), 10);
            var canvasHeight = parseInt(current.$slide.height(), 10);

            var newImgWidth = current.width;
            var newImgHeight = current.height;

            if (!$what) {
                return;
            }

            self.isAnimating = true;

            x = x === undefined ? canvasWidth * 0.5 : x;
            y = y === undefined ? canvasHeight * 0.5 : y;

            imgPos = $.fancybox.getTranslate($what);

            scaleX = newImgWidth / imgPos.width;
            scaleY = newImgHeight / imgPos.height;

            // Get center position for original image
            posX = (canvasWidth * 0.5 - newImgWidth * 0.5);
            posY = (canvasHeight * 0.5 - newImgHeight * 0.5);

            // Make sure image does not move away from edges

            if (newImgWidth > canvasWidth) {
                posX = imgPos.left * scaleX - ((x * scaleX) - x);

                if (posX > 0) {
                    posX = 0;
                }

                if (posX < canvasWidth - newImgWidth) {
                    posX = canvasWidth - newImgWidth;
                }
            }

            if (newImgHeight > canvasHeight) {
                posY = imgPos.top * scaleY - ((y * scaleY) - y);

                if (posY > 0) {
                    posY = 0;
                }

                if (posY < canvasHeight - newImgHeight) {
                    posY = canvasHeight - newImgHeight;
                }
            }

            self.updateCursor(newImgWidth, newImgHeight);

            $.fancybox.animate($what, null, {
                top: posY,
                left: posX,
                scaleX: scaleX,
                scaleY: scaleY
            }, duration || current.opts.speed, function () {
                self.isAnimating = false;
            });

        },

        // Scale image to fit inside parent element
        // ========================================

        scaleToFit: function (duration) {

            var self = this;

            var current = self.current;
            var $what = current.$placeholder;
            var end;

            if (!$what) {
                return;
            }

            self.isAnimating = true;

            end = self.getFitPos(current);

            self.updateCursor(end.width, end.height);

            $.fancybox.animate($what, null, {
                top: end.top,
                left: end.left,
                scaleX: end.width / $what.width(),
                scaleY: end.height / $what.height()
            }, duration || current.opts.speed, function () {
                self.isAnimating = false;
            });

        },

        // Calculate image size to fit inside viewport
        // ===========================================

        getFitPos: function (slide) {
            var $what = slide.$placeholder || slide.$content;

            var imgWidth = slide.width;
            var imgHeight = slide.height;

            var margin = slide.opts.margin;

            var canvasWidth, canvasHeight, minRatio, top, left, width, height;

            if (!$what || !$what.length || (!imgWidth && !imgHeight)) {
                return false;
            }

            // Convert "margin to CSS style: [ top, right, bottom, left ]
            if ($.type(margin) === "number") {
                margin = [margin, margin];
            }

            if (margin.length == 2) {
                margin = [margin[0], margin[1], margin[0], margin[1]];
            }

            if ($W.width() < 800) {
                margin = [0, 0, 0, 0];
            }

            canvasWidth = parseInt(slide.$slide.width(), 10) - (margin[ 1 ] + margin[ 3 ]);
            canvasHeight = parseInt(slide.$slide.height(), 10) - (margin[ 0 ] + margin[ 2 ]);

            minRatio = Math.min(1, canvasWidth / imgWidth, canvasHeight / imgHeight);

            // Use floor rounding to make sure it really fits

            width = Math.floor(minRatio * imgWidth);
            height = Math.floor(minRatio * imgHeight);

            top = Math.floor((canvasHeight - height) * 0.5) + margin[ 0 ];
            left = Math.floor((canvasWidth - width) * 0.5) + margin[ 3 ];

            return {
                top: top,
                left: left,
                width: width,
                height: height
            };

        },

        // Move slider to current position
        // Update all slides (and their content)
        // =====================================

        update: function (andSlides, andContent, duration, callback) {

            var self = this;
            var leftValue;

            if (self.isAnimating === true || !self.current) {
                return;
            }

            leftValue = (self.current.pos * Math.floor(self.current.$slide.width()) * -1) - (self.current.pos * self.current.opts.gutter);
            duration = parseInt(duration, 10) || 0;

            $.fancybox.stop(self.$refs.slider);

            if (andSlides === false) {
                self.updateSlide(self.current, andContent);

            } else {

                $.each(self.slides, function (key, slide) {
                    self.updateSlide(slide, andContent);
                });

            }

            if (duration) {

                $.fancybox.animate(self.$refs.slider, null, {
                    top: 0,
                    left: leftValue
                }, duration, function () {
                    self.current.isMoved = true;

                    if ($.type(callback) === 'function') {
                        callback.apply(self);
                    }

                });

            } else {

                $.fancybox.setTranslate(self.$refs.slider, {top: 0, left: leftValue});

                self.current.isMoved = true;

                if ($.type(callback) === 'function') {
                    callback.apply(self);
                }

            }

        },

        // Update slide position and scale content to fit
        // ==============================================

        updateSlide: function (slide, andContent) {

            var self = this;
            var $what = slide.$placeholder;
            var leftPos;

            slide = slide || self.current;

            if (!slide || self.isClosing) {
                return;
            }

            leftPos = (slide.pos * Math.floor(slide.$slide.width())) + (slide.pos * slide.opts.gutter);

            if (leftPos !== slide.leftPos) {
                $.fancybox.setTranslate(slide.$slide, {top: 0, left: leftPos});

                slide.leftPos = leftPos;
            }

            if (andContent !== false && $what) {
                $.fancybox.setTranslate($what, self.getFitPos(slide));

                if (slide.pos === self.currPos) {
                    self.updateCursor();
                }
            }

            slide.$slide.trigger('refresh');

            self.trigger('onUpdate', slide);
        },

        // Update cursor style depending if content can be zoomed
        // ======================================================

        updateCursor: function (nextWidth, nextHeight) {

            var self = this;
            var canScale;

            var $container = self.$refs.container.removeClass('fancybox-controls--canzoomIn fancybox-controls--canzoomOut fancybox-controls--canGrab');

            if (self.isClosing || !self.opts.touch) {
                return;
            }

            if (nextWidth !== undefined && nextHeight !== undefined) {
                canScale = nextWidth < self.current.width && nextHeight < self.current.height;

            } else {
                canScale = self.isScaledDown();
            }

            if (canScale) {
                $container.addClass('fancybox-controls--canzoomIn');

            } else if (self.group.length < 2) {
                $container.addClass('fancybox-controls--canzoomOut');

            } else {
                $container.addClass('fancybox-controls--canGrab');
            }

        },

        // Load content into the slide
        // ===========================

        loadSlide: function (slide) {

            var self = this, type, $slide;
            var ajaxLoad;

            if (!slide || slide.isLoaded || slide.isLoading) {
                return;
            }

            slide.isLoading = true;

            self.trigger('beforeLoad', slide);

            type = slide.type;
            $slide = slide.$slide;

            $slide
                    .off('refresh')
                    .trigger('onReset')
                    .addClass('fancybox-slide--' + (type || 'unknown'))
                    .addClass(slide.opts.slideClass);

            // Create content depending on the type

            switch (type) {

                case 'image':

                    self.setImage(slide);

                    break;

                case 'iframe':

                    self.setIframe(slide);

                    break;

                case 'html':

                    self.setContent(slide, slide.content);

                    break;

                case 'inline':

                    if ($(slide.src).length) {
                        self.setContent(slide, $(slide.src));

                    } else {
                        self.setError(slide);
                    }

                    break;

                case 'ajax':

                    self.showLoading(slide);

                    ajaxLoad = $.ajax($.extend({}, slide.opts.ajax.settings, {

                        url: slide.src,

                        success: function (data, textStatus) {

                            if (textStatus === 'success') {
                                self.setContent(slide, data);
                            }

                        },

                        error: function (jqXHR, textStatus) {

                            if (jqXHR && textStatus !== 'abort') {
                                self.setError(slide);
                            }

                        }

                    }));

                    $slide.one('onReset', function () {
                        ajaxLoad.abort();
                    });

                    break;

                default:

                    self.setError(slide);

                    break;

            }

            return true;

        },

        // Use thumbnail image, if possible
        // ================================

        setImage: function (slide) {

            var self = this;
            var srcset = slide.opts.image.srcset;

            var found, temp, pxRatio, windowWidth;

            if (slide.isLoaded && !slide.hasError) {
                self.afterLoad(slide);

                return;
            }

            // If we have "srcset", then we need to find matching "src" value.
            // This is necessary, because when you set an src attribute, the browser will preload the image
            // before any javascript or even CSS is applied.
            if (srcset) {
                pxRatio = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth * pxRatio;

                temp = srcset.split(',').map(function (el) {
                    var ret = {};

                    el.trim().split(/\s+/).forEach(function (el, i) {
                        var value = parseInt(el.substring(0, el.length - 1), 10);

                        if (i === 0) {
                            return (ret.url = el);
                        }

                        if (value) {
                            ret.value = value;
                            ret.postfix = el[el.length - 1];
                        }

                    });

                    return ret;
                });

                // Sort by value
                temp.sort(function (a, b) {
                    return a.value - b.value;
                });

                // Ok, now we have an array of all srcset values
                for (var j = 0; j < temp.length; j++) {
                    var el = temp[ j ];

                    if ((el.postfix === 'w' && el.value >= windowWidth) || (el.postfix === 'x' && el.value >= pxRatio)) {
                        found = el;
                        break;
                    }
                }

                // If not found, take the last one
                if (!found && temp.length) {
                    found = temp[ temp.length - 1 ];
                }

                if (found) {
                    slide.src = found.url;

                    // If we have default width/height values, we can calculate height for matching source
                    if (slide.width && slide.height && found.postfix == 'w') {
                        slide.height = (slide.width / slide.height) * found.value;
                        slide.width = found.value;
                    }
                }
            }

            slide.$placeholder = $('<div class="fancybox-placeholder"></div>')
                    .hide()
                    .appendTo(slide.$slide);

            if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && (slide.opts.thumb || slide.opts.$thumb)) {

                slide.width = slide.opts.width;
                slide.height = slide.opts.height;

                slide.$ghost = $('<img />')
                        .one('load error', function () {

                            if (self.isClosing) {
                                return;
                            }

                            // Start preloading full size image
                            $('<img/>')[0].src = slide.src;

                            // zoomIn or just show
                            self.revealImage(slide, function () {

                                self.setBigImage(slide);

                                if (self.firstRun && slide.index === self.currIndex) {
                                    self.preload();
                                }
                            });

                        })
                        .addClass('fancybox-image')
                        .appendTo(slide.$placeholder)
                        .attr('src', slide.opts.thumb || slide.opts.$thumb.attr('src'));

            } else {

                self.setBigImage(slide);

            }

        },

        // Create full-size image
        // ======================

        setBigImage: function (slide) {
            var self = this;
            var $img = $('<img />');

            slide.$image = $img
                    .one('error', function () {

                        self.setError(slide);

                    })
                    .one('load', function () {

                        // Clear timeout that checks if loading icon needs to be displayed
                        clearTimeout(slide.timouts);

                        slide.timouts = null;

                        if (self.isClosing) {
                            return;
                        }

                        slide.width = this.naturalWidth;
                        slide.height = this.naturalHeight;

                        if (slide.opts.image.srcset) {
                            $img.attr('sizes', '100vw').attr('srcset', slide.opts.image.srcset);
                        }

                        self.afterLoad(slide);

                        if (slide.$ghost) {
                            slide.timouts = setTimeout(function () {
                                slide.$ghost.hide();

                            }, 350);
                        }

                    })
                    .addClass('fancybox-image')
                    .attr('src', slide.src)
                    .appendTo(slide.$placeholder);

            if ($img[0].complete) {
                $img.trigger('load');

            } else if ($img[0].error) {
                $img.trigger('error');

            } else {

                slide.timouts = setTimeout(function () {
                    if (!$img[0].complete && !slide.hasError) {
                        self.showLoading(slide);
                    }

                }, 150);

            }

            if (slide.opts.image.protect) {
                $('<div class="fancybox-spaceball"></div>').appendTo(slide.$placeholder).on('contextmenu.fb', function (e) {
                    if (e.button == 2) {
                        e.preventDefault();
                    }

                    return true;
                });
            }

        },

        // Simply show image holder without animation
        // It has been hidden initially to avoid flickering
        // ================================================

        revealImage: function (slide, callback) {

            var self = this;

            callback = callback || $.noop;

            if (slide.type !== 'image' || slide.hasError || slide.isRevealed === true) {

                callback.apply(self);

                return;
            }

            slide.isRevealed = true;

            if (!(slide.pos === self.currPos && self.zoomInOut('In', slide.opts.speed, callback))) {

                if (slide.$ghost && !slide.isLoaded) {
                    self.updateSlide(slide, true);
                }

                if (slide.pos === self.currPos) {
                    $.fancybox.animate(slide.$placeholder, {opacity: 0}, {opacity: 1}, 300, callback);

                } else {
                    slide.$placeholder.show();
                }

                callback.apply(self);

            }

        },

        // Create iframe wrapper, iframe and bindings
        // ==========================================

        setIframe: function (slide) {
            var self = this,
                    opts = slide.opts.iframe,
                    $slide = slide.$slide,
                    $iframe;

            slide.$content = $('<div class="fancybox-content"></div>')
                    .css(opts.css)
                    .appendTo($slide);

            $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime()))
                    .attr('scrolling', $.fancybox.isTouch ? 'auto' : opts.scrolling)
                    .appendTo(slide.$content);

            if (opts.preload) {
                slide.$content.addClass('fancybox-tmp');

                self.showLoading(slide);

                // Unfortunately, it is not always possible to determine if iframe is successfully loaded
                // (due to browser security policy)

                $iframe.on('load.fb error.fb', function (e) {
                    this.isReady = 1;

                    slide.$slide.trigger('refresh');

                    self.afterLoad(slide);

                });

                // Recalculate iframe content size

                $slide.on('refresh.fb', function () {
                    var $wrap = slide.$content,
                            $contents,
                            $body,
                            scrollWidth,
                            frameWidth,
                            frameHeight;

                    if ($iframe[0].isReady !== 1) {
                        return;
                    }

                    // Check if content is accessible,
                    // it will fail if frame is not with the same origin

                    try {
                        $contents = $iframe.contents();
                        $body = $contents.find('body');

                    } catch (ignore) {
                    }

                    // Calculate dimensions for the wrapper

                    if ($body && $body.length && !(opts.css.width !== undefined && opts.css.height !== undefined)) {

                        scrollWidth = $iframe[0].contentWindow.document.documentElement.scrollWidth;

                        frameWidth = Math.ceil($body.outerWidth(true) + ($wrap.width() - scrollWidth));
                        frameHeight = Math.ceil($body.outerHeight(true));

                        // Resize wrapper to fit iframe content

                        $wrap.css({
                            'width': opts.css.width === undefined ? frameWidth + ($wrap.outerWidth() - $wrap.innerWidth()) : opts.css.width,
                            'height': opts.css.height === undefined ? frameHeight + ($wrap.outerHeight() - $wrap.innerHeight()) : opts.css.height
                        });

                    }

                    $wrap.removeClass('fancybox-tmp');

                });

            } else {

                this.afterLoad(slide);

            }

            $iframe.attr('src', slide.src);

            if (slide.opts.smallBtn) {
                slide.$content.prepend(slide.opts.closeTpl);
            }

            // Remove iframe if closing or changing gallery item

            $slide.one('onReset', function () {

                // This helps IE not to throw errors when closing

                try {

                    $(this).find('iframe').hide().attr('src', '//about:blank');

                } catch (ignore) {
                }

                $(this).empty();

                slide.isLoaded = false;

            });

        },

        // Wrap and append content to the slide
        // ======================================

        setContent: function (slide, content) {

            var self = this;

            if (self.isClosing) {
                return;
            }

            self.hideLoading(slide);

            slide.$slide.empty();

            if (isQuery(content) && content.parent().length) {

                // If it is a jQuery object, then it will be moved to the box.
                // The placeholder is created so we will know where to put it back.
                // If user is navigating gallery fast, then the content might be already moved to the box

                if (content.data('placeholder')) {
                    content.parents('.fancybox-slide').trigger('onReset');
                }

                content.data({'placeholder': $('<div></div>').hide().insertAfter(content)}).css('display', 'inline-block');

            } else {

                if ($.type(content) === 'string') {

                    content = $('<div>').append(content).contents();

                    if (content[0].nodeType === 3) {
                        content = $('<div>').html(content);
                    }

                }

                if (slide.opts.selector) {
                    content = $('<div>').html(content).find(slide.opts.selector);
                }

            }

            slide.$slide.one('onReset', function () {
                var placeholder = isQuery(content) ? content.data('placeholder') : 0;

                if (placeholder) {
                    content.hide().replaceAll(placeholder);

                    content.data('placeholder', null);
                }

                if (!slide.hasError) {
                    $(this).empty();

                    slide.isLoaded = false;
                }

            });

            slide.$content = $(content).appendTo(slide.$slide);

            if (slide.opts.smallBtn === true) {
                slide.$content.find('.fancybox-close-small').remove().end().eq(0).append(slide.opts.closeTpl);
            }

            this.afterLoad(slide);

        },

        // Display error message
        // =====================

        setError: function (slide) {

            slide.hasError = true;

            this.setContent(slide, slide.opts.errorTpl);

        },

        showLoading: function (slide) {
            var self = this;

            slide = slide || self.current;

            if (slide && !slide.$spinner) {
                slide.$spinner = $(self.opts.spinnerTpl).appendTo(slide.$slide);
            }

        },

        hideLoading: function (slide) {

            var self = this;

            slide = slide || self.current;

            if (slide && slide.$spinner) {
                slide.$spinner.remove();

                delete slide.$spinner;
            }

        },

        afterMove: function () {

            var self = this;
            var current = self.current;
            var slides = {};

            if (!current) {
                return;
            }

            current.$slide.siblings().trigger('onReset');

            // Remove unnecessary slides
            $.each(self.slides, function (key, slide) {

                if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
                    slides[ slide.pos ] = slide;

                } else if (slide) {
                    slide.$slide.remove();
                }

            });

            self.slides = slides;

            self.trigger('afterMove');

            if (current.isLoaded) {
                self.complete();
            }

        },

        // Adjustments after slide has been loaded
        // =======================================

        afterLoad: function (slide) {

            var self = this;

            if (self.isClosing) {
                return;
            }

            slide.isLoading = false;
            slide.isLoaded = true;

            self.trigger('afterLoad', slide);

            self.hideLoading(slide);

            // Resize content to fit inside slide
            // Skip if slide has an $ghost element, because then it has been already processed
            if (!slide.$ghost) {
                self.updateSlide(slide, true);
            }

            if (slide.index === self.currIndex && slide.isMoved) {
                self.complete();

            } else if (!slide.$ghost) {
                self.revealImage(slide);
            }

        },

        // Final adjustments after current gallery item is moved to position
        // and it`s content is loaded
        // ==================================================================

        complete: function () {

            var self = this;

            var current = self.current;

            self.revealImage(current, function () {
                current.isComplete = true;

                current.$slide.addClass('fancybox-slide--complete');

                self.updateCursor();

                self.trigger('onComplete');

                // Try to focus on the first focusable element, skip for images and iframes
                if (current.opts.focus && !(current.type === 'image' || current.type === 'iframe')) {
                    self.focus();
                }

            });

        },

        // Preload next and previous slides
        // ================================

        preload: function () {
            var self = this;
            var next, prev;

            if (self.group.length < 2) {
                return;
            }

            next = self.slides[ self.currPos + 1 ];
            prev = self.slides[ self.currPos - 1 ];

            if (next && next.type === 'image') {
                self.loadSlide(next);
            }

            if (prev && prev.type === 'image') {
                self.loadSlide(prev);
            }

        },

        // Try to find and focus on the first focusable element
        // ====================================================

        focus: function () {
            var current = this.current;
            var $el;

            $el = current && current.isComplete ? current.$slide.find('button,:input,[tabindex],a:not(".disabled")').filter(':visible:first') : null;

            if (!$el || !$el.length) {
                $el = this.$refs.container;
            }

            $el.focus();

            // Scroll position of wrapper element sometimes changes after focusing (IE)
            this.$refs.slider_wrap.scrollLeft(0);

            // And the same goes for slide element
            if (current) {
                current.$slide.scrollTop(0);
            }

        },

        // Activates current instance - brings container to the front and enables keyboard,
        // notifies other instances about deactivating
        // =================================================================================

        activate: function () {
            var self = this;

            // Deactivate all instances

            $('.fancybox-container').each(function () {
                var instance = $(this).data('FancyBox');

                // Skip self and closing instances

                if (instance && instance.uid !== self.uid && !instance.isClosing) {
                    instance.trigger('onDeactivate');
                }

            });

            if (self.current) {

                if (self.$refs.container.index() > 0) {
                    self.$refs.container.prependTo(document.body);
                }

                self.updateControls();
            }

            self.trigger('onActivate');

            self.addEvents();

        },

        // Start closing procedure
        // This will start "zoom-out" animation if needed and clean everything up afterwards
        // =================================================================================

        close: function (e) {

            var self = this;
            var current = self.current;
            var duration = current.opts.speed;

            var done = $.proxy(function () {

                self.cleanUp(e);  // Now "this" is again our instance

            }, this);

            if (self.isAnimating || self.isClosing) {
                return false;
            }

            // If beforeClose callback prevents closing, make sure content is centered
            if (self.trigger('beforeClose', e) === false) {
                $.fancybox.stop(self.$refs.slider);

                requestAFrame(function () {
                    self.update(true, true, 150);
                });

                return;
            }

            self.isClosing = true;

            if (current.timouts) {
                clearTimeout(current.timouts);
            }

            if (e !== true) {
                $.fancybox.stop(self.$refs.slider);
            }

            self.$refs.container
                    .removeClass('fancybox-container--active')
                    .addClass('fancybox-container--closing');

            current.$slide
                    .removeClass('fancybox-slide--complete')
                    .siblings()
                    .remove();


            if (!current.isMoved) {
                current.$slide.css('overflow', 'visible');
            }

            // Remove all events
            // If there are multiple instances, they will be set again by "activate" method

            self.removeEvents();

            // Clean up

            self.hideLoading(current);

            self.hideControls();

            self.updateCursor();

            self.$refs.bg.css('transition-duration', duration + 'ms');

            this.$refs.container.removeClass('fancybox-container--ready');

            if (e === true) {
                setTimeout(done, duration);

            } else if (!self.zoomInOut('Out', duration, done)) {
                $.fancybox.animate(self.$refs.container, null, {opacity: 0}, duration, "easeInSine", done);
            }

        },

        // Final adjustments after removing the instance
        // =============================================

        cleanUp: function (e) {
            var self = this,
                    instance;

            self.$refs.slider.children().trigger('onReset');

            self.$refs.container.empty().remove();

            self.trigger('afterClose', e);

            self.current = null;

            // Check if there are other instances
            instance = $.fancybox.getInstance();

            if (instance) {
                instance.activate();

            } else {

                $('html').removeClass('fancybox-enabled');
                $('body').removeAttr('style');

                $W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);

                $('#fancybox-noscroll').remove();

            }

            // Place back focus
            if (self.$lastFocus) {
                self.$lastFocus.focus();
            }

        },

        // Call callback and trigger an event
        // ==================================

        trigger: function (name, slide) {
            var args = Array.prototype.slice.call(arguments, 1),
                    self = this,
                    obj = slide && slide.opts ? slide : self.current,
                    rez;

            if (obj) {
                args.unshift(obj);

            } else {
                obj = self;
            }

            args.unshift(self);

            if ($.isFunction(obj.opts[ name ])) {
                rez = obj.opts[ name ].apply(obj, args);
            }

            if (rez === false) {
                return rez;
            }

            if (name === 'afterClose') {
                $(document).trigger(name + '.fb', args);

            } else {
                self.$refs.container.trigger(name + '.fb', args);
            }

        },

        // Toggle toolbar and caption
        // ==========================

        toggleControls: function (force) {

            if (this.isHiddenControls) {
                this.updateControls(force);

            } else {
                this.hideControls();
            }


        },

        // Hide toolbar and caption
        // ========================

        hideControls: function () {

            this.isHiddenControls = true;

            this.$refs.container.removeClass('fancybox-show-controls');

            this.$refs.container.removeClass('fancybox-show-caption');

        },

        // Update infobar values, navigation button states and reveal caption
        // ==================================================================

        updateControls: function (force) {

            var self = this;

            var $container = self.$refs.container;
            var $caption = self.$refs.caption;

            // Toggle infobar and buttons

            var current = self.current;
            var index = current.index;
            var opts = current.opts;
            var caption = opts.caption;

            if (this.isHiddenControls && force !== true) {
                return;
            }

            this.isHiddenControls = false;

            $container
                    .addClass('fancybox-show-controls')
                    .toggleClass('fancybox-show-infobar', !!opts.infobar && self.group.length > 1)
                    .toggleClass('fancybox-show-buttons', !!opts.buttons)
                    .toggleClass('fancybox-is-modal', !!opts.modal);

            $('.fancybox-button--left', $container).toggleClass('fancybox-button--disabled', (!opts.loop && index <= 0));
            $('.fancybox-button--right', $container).toggleClass('fancybox-button--disabled', (!opts.loop && index >= self.group.length - 1));

            $('.fancybox-button--play', $container).toggle(!!(opts.slideShow && self.group.length > 1));
            $('.fancybox-button--close', $container).toggle(!!opts.closeBtn);

            // Update infobar values

            $('.js-fancybox-count', $container).html(self.group.length);
            $('.js-fancybox-index', $container).html(index + 1);

            // Recalculate content dimensions
            current.$slide.trigger('refresh');

            // Reveal or create new caption
            if ($caption) {
                $caption.empty();
            }

            if (caption && caption.length) {
                $caption.html(caption);

                this.$refs.container.addClass('fancybox-show-caption ');

                self.$caption = $caption;

            } else {
                this.$refs.container.removeClass('fancybox-show-caption');
            }

        }

    });


    $.fancybox = {

        version: "3.0.47",
        defaults: defaults,

        // Get current instance and execute a command.
        //
        // Examples of usage:
        //
        //   $instance = $.fancybox.getInstance();
        //   $.fancybox.getInstance().jumpTo( 1 );
        //   $.fancybox.getInstance( 'jumpTo', 1 );
        //   $.fancybox.getInstance( function() {
        //       console.info( this.currIndex );
        //   });
        // ======================================================

        getInstance: function (command) {
            var instance = $('.fancybox-container:not(".fancybox-container--closing"):first').data('FancyBox');
            var args = Array.prototype.slice.call(arguments, 1);

            if (instance instanceof FancyBox) {

                if ($.type(command) === 'string') {
                    instance[ command ].apply(instance, args);

                } else if ($.type(command) === 'function') {
                    command.apply(instance, args);

                }

                return instance;
            }

            return false;

        },

        // Create new instance
        // ===================

        open: function (items, opts, index) {
            return new FancyBox(items, opts, index);
        },

        // Close current or all instances
        // ==============================

        close: function (all) {
            var instance = this.getInstance();

            if (instance) {
                instance.close();

                // Try to find and close next instance

                if (all === true) {
                    this.close();
                }
            }

        },

        // Test for the existence of touch events in the browser
        // Limit to mobile devices
        // ====================================================

        isTouch: document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),

        // Detect if 'translate3d' support is available
        // ============================================

        use3d: (function () {
            var div = document.createElement('div');

            return window.getComputedStyle(div).getPropertyValue('transform') && !(document.documentMode && document.documentMode <= 11);
        }()),

        // Helper function to get current visual state of an element
        // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
        // =====================================================================

        getTranslate: function ($el) {
            var position, matrix;

            if (!$el || !$el.length) {
                return false;
            }

            position = $el.get(0).getBoundingClientRect();
            matrix = $el.eq(0).css('transform');

            if (matrix && matrix.indexOf('matrix') !== -1) {
                matrix = matrix.split('(')[1];
                matrix = matrix.split(')')[0];
                matrix = matrix.split(',');
            } else {
                matrix = [];
            }

            if (matrix.length) {

                // If IE
                if (matrix.length > 10) {
                    matrix = [matrix[13], matrix[12], matrix[0], matrix[5]];

                } else {
                    matrix = [matrix[5], matrix[4], matrix[0], matrix[3]];
                }

                matrix = matrix.map(parseFloat);

            } else {
                matrix = [0, 0, 1, 1];
            }

            return {
                top: matrix[ 0 ],
                left: matrix[ 1 ],
                scaleX: matrix[ 2 ],
                scaleY: matrix[ 3 ],
                opacity: parseFloat($el.css('opacity')),
                width: position.width,
                height: position.height
            };

        },

        // Shortcut for setting "translate3d" properties for element
        // Can set be used to set opacity, too
        // ========================================================

        setTranslate: function ($el, props) {
            var str = '';
            var css = {};

            if (!$el || !props) {
                return;
            }

            if (props.left !== undefined || props.top !== undefined) {

                str = (props.left === undefined ? $el.position().top : props.left) + 'px, ' + (props.top === undefined ? $el.position().top : props.top) + 'px';

                if (this.use3d) {
                    str = 'translate3d(' + str + ', 0px)';

                } else {
                    str = 'translate(' + str + ')';
                }

            }

            if (props.scaleX !== undefined && props.scaleY !== undefined) {
                str = (str.length ? str + ' ' : '') + 'scale(' + props.scaleX + ', ' + props.scaleY + ')';
            }

            if (str.length) {
                css.transform = str;
            }

            if (props.opacity !== undefined) {
                css.opacity = props.opacity;
            }

            if (props.width !== undefined) {
                css.width = props.width;
            }

            if (props.height !== undefined) {
                css.height = props.height;
            }

            return $el.css(css);

        },

        // Common easings for entrances and exits
        // t: current time, b: begInnIng value, c: change In value, d: duration
        // ====================================================================

        easing: {
            easeOutCubic: function (t, b, c, d) {
                return c * ((t = t / d - 1) * t * t + 1) + b;
            },
            easeInCubic: function (t, b, c, d) {
                return c * (t /= d) * t * t + b;
            },
            easeOutSine: function (t, b, c, d) {
                return c * Math.sin(t / d * (Math.PI / 2)) + b;
            },
            easeInSine: function (t, b, c, d) {
                return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
            }
        },

        // Stop fancyBox animation
        // =======================

        stop: function ($el) {

            $el.removeData('animateID');

        },

        // Animate element using "translate3d"
        // Usage:
        // animate( element, start properties, end properties, duration, easing, callback )
        // or
        // animate( element, start properties, end properties, duration, callback )
        // =================================================================================

        animate: function ($el, from, to, duration, easing, done) {

            var self = this;

            var lastTime = null;
            var animTime = 0;

            var curr;
            var diff;
            var id;

            var finish = function () {
                if (to.scaleX !== undefined && to.scaleY !== undefined && from && from.width !== undefined && from.height !== undefined) {
                    to.width = from.width * to.scaleX;
                    to.height = from.height * to.scaleY;

                    to.scaleX = 1;
                    to.scaleY = 1;
                }

                self.setTranslate($el, to);

                done();
            };

            var frame = function (timestamp) {
                curr = [];
                diff = 0;

                // If "stop" method has been called on this element, then just stop
                if (!$el.length || $el.data('animateID') !== id) {
                    return;
                }

                timestamp = timestamp || Date.now();

                if (lastTime) {
                    diff = timestamp - lastTime;
                }

                lastTime = timestamp;
                animTime += diff;

                // Are we done?
                if (animTime >= duration) {

                    finish();

                    return;
                }

                for (var prop in to) {

                    if (to.hasOwnProperty(prop) && from[ prop ] !== undefined) {

                        if (from[ prop ] == to[ prop ]) {
                            curr[ prop ] = to[ prop ];

                        } else {
                            curr[ prop ] = self.easing[ easing ](animTime, from[ prop ], to[ prop ] - from[ prop ], duration);
                        }

                    }
                }

                self.setTranslate($el, curr);

                requestAFrame(frame);
            };

            self.animateID = id = self.animateID === undefined ? 1 : self.animateID + 1;

            $el.data('animateID', id);

            if (done === undefined && $.type(easing) == 'function') {
                done = easing;
                easing = undefined;
            }

            if (!easing) {
                easing = "easeOutCubic";
            }

            done = done || $.noop;

            if (from) {
                this.setTranslate($el, from);

            } else {

                // We need current values to calculate change in time
                from = this.getTranslate($el);
            }

            if (duration) {
                $el.show();

                requestAFrame(frame);

            } else {
                finish();
            }

        }

    };


    // Event handler for click event to "fancyboxed" links
    // ===================================================

    function _run(e) {
        var target = e.currentTarget,
                opts = e.data ? e.data.options : {},
                items = e.data ? e.data.items : [],
                value = '',
                index = 0;

        e.preventDefault();
        e.stopPropagation();

        // Get all related items and find index for clicked one

        if ($(target).attr('data-fancybox')) {
            value = $(target).data('fancybox');
        }

        if (value) {
            items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox=' + value + ']');
            index = items.index(target);

        } else {
            items = [target];
        }

        $.fancybox.open(items, opts, index);
    }


    // Create a jQuery plugin
    // ======================

    $.fn.fancybox = function (options) {

        this.off('click.fb-start').on('click.fb-start', {
            items: this,
            options: options || {}
        }, _run);

        return this;

    };


    // Self initializing plugin
    // ========================

    $(document).on('click.fb-start', '[data-fancybox]', _run);

}(window, document, window.jQuery));

// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
;
(function ($) {

    'use strict';

    // Formats matching url to final form

    var format = function (url, rez, params) {
        if (!url) {
            return;
        }

        params = params || '';

        if ($.type(params) === "object") {
            params = $.param(params, true);
        }

        $.each(rez, function (key, value) {
            url = url.replace('$' + key, value || '');
        });

        if (params.length) {
            url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }

        return url;
    };

    // Object containing properties for each media type

    var media = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: 'transparent',
                enablejsapi: 1,
                html5: 1
            },
            paramPlace: 8,
            type: 'iframe',
            url: '//www.youtube.com/embed/$4',
            thumb: '//img.youtube.com/vi/$4/hqdefault.jpg'
        },

        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1,
                api: 1
            },
            paramPlace: 3,
            type: 'iframe',
            url: '//player.vimeo.com/video/$2'
        },

        metacafe: {
            matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
            type: 'iframe',
            url: '//www.metacafe.com/embed/$1/?ap=1'
        },

        dailymotion: {
            matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
            params: {
                additionalInfos: 0,
                autoStart: 1
            },
            type: 'iframe',
            url: '//www.dailymotion.com/embed/video/$1'
        },

        vine: {
            matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
            type: 'iframe',
            url: '//vine.co/v/$1/embed/simple'
        },

        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: 'image',
            url: '//$1/p/$2/media/?size=l'
        },

        // Examples:
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // https://www.google.lv/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
        google_maps: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: 'iframe',
            url: function (rez) {
                return '//maps.google.' + rez[2] + '/?ll=' + (rez[9] ? rez[9] + '&z=' + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : '') : rez[12]) + '&output=' + (rez[12] && rez[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed');
            }
        }
    };

    $(document).on('onInit.fb', function (e, instance) {

        $.each(instance.group, function (i, item) {

            var url = item.src || '',
                    type = false,
                    thumb,
                    rez,
                    params,
                    urlParams,
                    o,
                    provider;

            // Skip items that already have content type
            if (item.type) {
                return;
            }

            // Look for any matching media type

            $.each(media, function (n, el) {
                rez = url.match(el.matcher);
                o = {};
                provider = n;

                if (!rez) {
                    return;
                }

                type = el.type;

                if (el.paramPlace && rez[ el.paramPlace ]) {
                    urlParams = rez[ el.paramPlace ];

                    if (urlParams[ 0 ] == '?') {
                        urlParams = urlParams.substring(1);
                    }

                    urlParams = urlParams.split('&');

                    for (var m = 0; m < urlParams.length; ++m) {
                        var p = urlParams[ m ].split('=', 2);

                        if (p.length == 2) {
                            o[ p[0] ] = decodeURIComponent(p[1].replace(/\+/g, " "));
                        }
                    }
                }

                params = $.extend(true, {}, el.params, item.opts[ n ], o);

                url = $.type(el.url) === "function" ? el.url.call(this, rez, params, item) : format(el.url, rez, params);
                thumb = $.type(el.thumb) === "function" ? el.thumb.call(this, rez, params, item) : format(el.thumb, rez);

                if (provider === 'vimeo') {
                    url = url.replace('&%23', '#');
                }

                return false;
            });

            // If it is found, then change content type and update the url

            if (type) {
                item.src = url;
                item.type = type;

                if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
                    item.opts.thumb = thumb;
                }

                if (type === 'iframe') {
                    $.extend(true, item.opts, {
                        iframe: {
                            preload: false,
                            scrolling: "no"
                        },
                        smallBtn: false,
                        closeBtn: true,
                        fullScreen: false,
                        slideShow: false
                    });

                    item.opts.slideClass += ' fancybox-slide--video';
                }

            } else {

                // If no content type is found, then set it to `iframe` as fallback
                item.type = 'iframe';

            }

        });

    });

}(window.jQuery));

// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
;
(function (window, document, $) {
    'use strict';

    var requestAFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
    })();


    var pointers = function (e) {
        var result = [];

        e = e.originalEvent || e || window.e;
        e = e.touches && e.touches.length ? e.touches : (e.changedTouches && e.changedTouches.length ? e.changedTouches : [e]);

        for (var key in e) {

            if (e[ key ].pageX) {
                result.push({x: e[ key ].pageX, y: e[ key ].pageY});

            } else if (e[ key ].clientX) {
                result.push({x: e[ key ].clientX, y: e[ key ].clientY});
            }
        }

        return result;
    };

    var distance = function (point2, point1, what) {

        if (!point1 || !point2) {
            return 0;
        }

        if (what === 'x') {
            return point2.x - point1.x;

        } else if (what === 'y') {
            return point2.y - point1.y;
        }

        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));

    };

    var isClickable = function ($el) {

        return $el.is('a') || $el.is('button') || $el.is('input') || $el.is('select') || $el.is('textarea') || $.isFunction($el.get(0).onclick);

    };

    var hasScrollbars = function (el) {
        var overflowY = window.getComputedStyle(el)['overflow-y'];
        var overflowX = window.getComputedStyle(el)['overflow-x'];

        var vertical = (overflowY === 'scroll' || overflowY === 'auto') && el.scrollHeight > el.clientHeight;
        var horizontal = (overflowX === 'scroll' || overflowX === 'auto') && el.scrollWidth > el.clientWidth;

        return vertical || horizontal;
    };

    var isScrollable = function ($el) {

        var rez = false;

        while (true) {
            rez = hasScrollbars($el.get(0));

            if (rez) {
                break;
            }

            $el = $el.parent();

            if (!$el.length || $el.hasClass('fancybox-slider') || $el.is('body')) {
                break;
            }

        }

        return rez;

    };


    var Guestures = function (instance) {

        var self = this;

        self.instance = instance;

        self.$wrap = instance.$refs.slider_wrap;
        self.$slider = instance.$refs.slider;
        self.$container = instance.$refs.container;

        self.destroy();

        self.$wrap.on('touchstart.fb mousedown.fb', $.proxy(self, "ontouchstart"));

    };

    Guestures.prototype.destroy = function () {

        this.$wrap.off('touchstart.fb mousedown.fb touchmove.fb mousemove.fb touchend.fb touchcancel.fb mouseup.fb mouseleave.fb');

    };

    Guestures.prototype.ontouchstart = function (e) {

        var self = this;

        var $target = $(e.target);
        var instance = self.instance;
        var current = instance.current;
        var $content = current.$content || current.$placeholder;

        self.startPoints = pointers(e);

        self.$target = $target;
        self.$content = $content;

        self.canvasWidth = Math.round(current.$slide[0].clientWidth);
        self.canvasHeight = Math.round(current.$slide[0].clientHeight);

        self.startEvent = e;

        // Skip if clicked on the scrollbar
        if (e.originalEvent.clientX > self.canvasWidth + current.$slide.offset().left) {
            return true;
        }

        // Ignore taping on links, buttons and scrollable items
        if (isClickable($target) || isClickable($target.parent()) || (isScrollable($target))) {
            return;
        }

        // If "touch" is disabled, then handle click event
        if (!current.opts.touch) {
            self.endPoints = self.startPoints;

            return self.ontap();
        }

        // Ignore right click
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        if (!current || self.instance.isAnimating || self.instance.isClosing) {
            return;
        }

        // Prevent zooming if already swiping
        if (!self.startPoints || (self.startPoints.length > 1 && !current.isMoved)) {
            return;
        }

        self.$wrap.off('touchmove.fb mousemove.fb', $.proxy(self, "ontouchmove"));
        self.$wrap.off('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb', $.proxy(self, "ontouchend"));

        self.$wrap.on('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb', $.proxy(self, "ontouchend"));
        self.$wrap.on('touchmove.fb mousemove.fb', $.proxy(self, "ontouchmove"));

        self.startTime = new Date().getTime();
        self.distanceX = self.distanceY = self.distance = 0;

        self.canTap = false;
        self.isPanning = false;
        self.isSwiping = false;
        self.isZooming = false;

        self.sliderStartPos = $.fancybox.getTranslate(self.$slider);

        self.contentStartPos = $.fancybox.getTranslate(self.$content);
        self.contentLastPos = null;

        if (self.startPoints.length === 1 && !self.isZooming) {
            self.canTap = current.isMoved;

            if (current.type === 'image' && (self.contentStartPos.width > self.canvasWidth + 1 || self.contentStartPos.height > self.canvasHeight + 1)) {

                $.fancybox.stop(self.$content);

                self.isPanning = true;

            } else {

                $.fancybox.stop(self.$slider);

                self.isSwiping = true;
            }

            self.$container.addClass('fancybox-controls--isGrabbing');

        }

        if (self.startPoints.length === 2 && current.isMoved && !current.hasError && current.type === 'image' && (current.isLoaded || current.$ghost)) {

            self.isZooming = true;

            self.isSwiping = false;
            self.isPanning = false;

            $.fancybox.stop(self.$content);

            self.centerPointStartX = ((self.startPoints[0].x + self.startPoints[1].x) * 0.5) - $(window).scrollLeft();
            self.centerPointStartY = ((self.startPoints[0].y + self.startPoints[1].y) * 0.5) - $(window).scrollTop();

            self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
            self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;

            self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
        }

    };

    Guestures.prototype.ontouchmove = function (e) {

        var self = this;

        e.preventDefault();

        self.newPoints = pointers(e);

        if (!self.newPoints || !self.newPoints.length) {
            return;
        }

        self.distanceX = distance(self.newPoints[0], self.startPoints[0], 'x');
        self.distanceY = distance(self.newPoints[0], self.startPoints[0], 'y');

        self.distance = distance(self.newPoints[0], self.startPoints[0]);

        // Skip false ontouchmove events (Chrome)
        if (self.distance > 0) {

            if (self.isSwiping) {
                self.onSwipe();

            } else if (self.isPanning) {
                self.onPan();

            } else if (self.isZooming) {
                self.onZoom();
            }

        }

    };

    Guestures.prototype.onSwipe = function () {

        var self = this;

        var swiping = self.isSwiping;
        var left = self.sliderStartPos.left;
        var angle;

        if (swiping === true) {

            if (Math.abs(self.distance) > 10) {

                if (self.instance.group.length < 2) {
                    self.isSwiping = 'y';

                } else if (!self.instance.current.isMoved || self.instance.opts.touch.vertical === false || (self.instance.opts.touch.vertical === 'auto' && $(window).width() > 800)) {
                    self.isSwiping = 'x';

                } else {
                    angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);

                    self.isSwiping = (angle > 45 && angle < 135) ? 'y' : 'x';
                }

                self.canTap = false;

                self.instance.current.isMoved = false;

                // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
                self.startPoints = self.newPoints;
            }

        } else {

            if (swiping == 'x') {

                // Sticky edges
                if (!self.instance.current.opts.loop && self.instance.current.index === 0 && self.distanceX > 0) {
                    left = left + Math.pow(self.distanceX, 0.8);

                } else if (!self.instance.current.opts.loop && self.instance.current.index === self.instance.group.length - 1 && self.distanceX < 0) {
                    left = left - Math.pow(-self.distanceX, 0.8);

                } else {
                    left = left + self.distanceX;
                }

            }

            self.sliderLastPos = {
                top: swiping == 'x' ? 0 : self.sliderStartPos.top + self.distanceY,
                left: left
            };

            requestAFrame(function () {
                $.fancybox.setTranslate(self.$slider, self.sliderLastPos);
            });
        }

    };

    Guestures.prototype.onPan = function () {

        var self = this;

        var newOffsetX, newOffsetY, newPos;

        self.canTap = false;

        if (self.contentStartPos.width > self.canvasWidth) {
            newOffsetX = self.contentStartPos.left + self.distanceX;

        } else {
            newOffsetX = self.contentStartPos.left;
        }

        newOffsetY = self.contentStartPos.top + self.distanceY;

        newPos = self.limitMovement(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

        newPos.scaleX = self.contentStartPos.scaleX;
        newPos.scaleY = self.contentStartPos.scaleY;

        self.contentLastPos = newPos;

        requestAFrame(function () {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });
    };

    // Make panning sticky to the edges
    Guestures.prototype.limitMovement = function (newOffsetX, newOffsetY, newWidth, newHeight) {

        var self = this;

        var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;

        var distanceX = self.distanceX;
        var distanceY = self.distanceY;

        // Slow down proportionally to traveled distance

        minTranslateX = Math.max(0, canvasWidth * 0.5 - newWidth * 0.5);
        minTranslateY = Math.max(0, canvasHeight * 0.5 - newHeight * 0.5);

        maxTranslateX = Math.min(canvasWidth - newWidth, canvasWidth * 0.5 - newWidth * 0.5);
        maxTranslateY = Math.min(canvasHeight - newHeight, canvasHeight * 0.5 - newHeight * 0.5);

        if (newWidth > canvasWidth) {

            //   ->
            if (distanceX > 0 && newOffsetX > minTranslateX) {
                newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
            }

            //    <-
            if (distanceX < 0 && newOffsetX < maxTranslateX) {
                newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
            }

        }

        if (newHeight > canvasHeight) {

            //   \/
            if (distanceY > 0 && newOffsetY > minTranslateY) {
                newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
            }

            //   /\
            if (distanceY < 0 && newOffsetY < maxTranslateY) {
                newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
            }

        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };

    };


    Guestures.prototype.limitPosition = function (newOffsetX, newOffsetY, newWidth, newHeight) {

        var self = this;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        if (newWidth > canvasWidth) {
            newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
            newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;

        } else {

            // Center horizontally
            newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);

        }

        if (newHeight > canvasHeight) {
            newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
            newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;

        } else {

            // Center vertically
            newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);

        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };

    };

    Guestures.prototype.onZoom = function () {

        var self = this;

        // Calculate current distance between points to get pinch ratio and new width and height

        var currentWidth = self.contentStartPos.width;
        var currentHeight = self.contentStartPos.height;

        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;

        var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);

        var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;

        var newWidth = Math.floor(currentWidth * pinchRatio);
        var newHeight = Math.floor(currentHeight * pinchRatio);

        // This is the translation due to pinch-zooming
        var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
        var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;

        //Point between the two touches

        var centerPointEndX = ((self.newPoints[0].x + self.newPoints[1].x) / 2) - $(window).scrollLeft();
        var centerPointEndY = ((self.newPoints[0].y + self.newPoints[1].y) / 2) - $(window).scrollTop();

        // And this is the translation due to translation of the centerpoint
        // between the two fingers

        var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
        var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;

        // The new offset is the old/current one plus the total translation

        var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
        var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);

        var newPos = {
            top: newOffsetY,
            left: newOffsetX,
            scaleX: self.contentStartPos.scaleX * pinchRatio,
            scaleY: self.contentStartPos.scaleY * pinchRatio
        };

        self.canTap = false;

        self.newWidth = newWidth;
        self.newHeight = newHeight;

        self.contentLastPos = newPos;

        requestAFrame(function () {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });

    };

    Guestures.prototype.ontouchend = function (e) {

        var self = this;

        var current = self.instance.current;

        var dMs = Math.max((new Date().getTime()) - self.startTime, 1);

        var swiping = self.isSwiping;
        var panning = self.isPanning;
        var zooming = self.isZooming;

        self.endPoints = pointers(e);

        self.$container.removeClass('fancybox-controls--isGrabbing');

        self.$wrap.off('touchmove.fb mousemove.fb', $.proxy(this, "ontouchmove"));
        self.$wrap.off('touchend.fb touchcancel.fb mouseup.fb mouseleave.fb', $.proxy(this, "ontouchend"));

        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = false;

        if (self.canTap) {
            return self.ontap();
        }

        // Speed in px/ms
        self.velocityX = self.distanceX / dMs * 0.5;
        self.velocityY = self.distanceY / dMs * 0.5;

        self.speed = current.opts.speed || 330;

        self.speedX = Math.max(self.speed * 0.75, Math.min(self.speed * 1.5, (1 / Math.abs(self.velocityX)) * self.speed));
        self.speedY = Math.max(self.speed * 0.75, Math.min(self.speed * 1.5, (1 / Math.abs(self.velocityY)) * self.speed));

        if (panning) {
            self.endPanning();

        } else if (zooming) {
            self.endZooming();

        } else {
            self.endSwiping(swiping);
        }

        return;
    };

    Guestures.prototype.endSwiping = function (swiping) {

        var self = this;

        // Close if swiped vertically / navigate if horizontally

        if (swiping == 'y' && Math.abs(self.distanceY) > 50) {

            // Continue vertical movement

            $.fancybox.animate(self.$slider, null, {
                top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
                left: self.sliderStartPos.left,
                opacity: 0
            }, self.speedY);

            self.instance.close(true);

        } else if (swiping == 'x' && self.distanceX > 50) {
            self.instance.previous(self.speedX);

        } else if (swiping == 'x' && self.distanceX < -50) {
            self.instance.next(self.speedX);

        } else {

            // Move back to center
            self.instance.update(false, true, 150);

        }

    };

    Guestures.prototype.endPanning = function () {

        var self = this;
        var newOffsetX, newOffsetY, newPos;

        if (!self.contentLastPos) {
            return;
        }

        newOffsetX = self.contentLastPos.left + (self.velocityX * self.speed * 2);
        newOffsetY = self.contentLastPos.top + (self.velocityY * self.speed * 2);

        newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

        newPos.width = self.contentStartPos.width;
        newPos.height = self.contentStartPos.height;

        $.fancybox.animate(self.$content, null, newPos, self.speed, "easeOutSine");

    };


    Guestures.prototype.endZooming = function () {

        var self = this;

        var current = self.instance.current;

        var newOffsetX, newOffsetY, newPos, reset;

        var newWidth = self.newWidth;
        var newHeight = self.newHeight;

        if (!self.contentLastPos) {
            return;
        }

        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;

        reset = {
            top: newOffsetY,
            left: newOffsetX,
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1
        };

        // Reset scalex/scaleY values; this helps for perfomance and does not break animation
        $.fancybox.setTranslate(self.$content, reset);

        if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
            self.instance.scaleToFit(150);

        } else if (newWidth > current.width || newHeight > current.height) {
            self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);

        } else {

            newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);

            $.fancybox.animate(self.$content, null, newPos, self.speed, "easeOutSine");

        }

    };

    Guestures.prototype.ontap = function () {

        var self = this;

        var instance = self.instance;
        var current = instance.current;

        var x = self.endPoints[0].x;
        var y = self.endPoints[0].y;

        x = x - self.$wrap.offset().left;
        y = y - self.$wrap.offset().top;

        // Stop slideshow
        if (instance.SlideShow && instance.SlideShow.isActive) {
            instance.SlideShow.stop();
        }

        if (!$.fancybox.isTouch) {

            if (current.opts.closeClickOutside && self.$target.is('.fancybox-slide')) {
                instance.close(self.startEvent);

                return;
            }

            if (current.type == 'image' && current.isMoved) {

                if (instance.canPan()) {
                    instance.scaleToFit();

                } else if (instance.isScaledDown()) {
                    instance.scaleToActual(x, y);

                } else if (instance.group.length < 2) {
                    instance.close(self.startEvent);
                }

            }

            return;
        }


        // Double tap
        if (self.tapped) {

            clearTimeout(self.tapped);

            self.tapped = null;

            if (Math.abs(x - self.x) > 50 || Math.abs(y - self.y) > 50 || !current.isMoved) {
                return this;
            }

            if (current.type == 'image' && (current.isLoaded || current.$ghost)) {

                if (instance.canPan()) {
                    instance.scaleToFit();

                } else if (instance.isScaledDown()) {
                    instance.scaleToActual(x, y);

                }

            }

        } else {

            // Single tap

            self.x = x;
            self.y = y;

            self.tapped = setTimeout(function () {
                self.tapped = null;

                instance.toggleControls(true);

            }, 300);
        }

        return this;
    };

    $(document).on('onActivate.fb', function (e, instance) {

        if (instance && !instance.Guestures) {
            instance.Guestures = new Guestures(instance);
        }

    });

    $(document).on('beforeClose.fb', function (e, instance) {

        if (instance && instance.Guestures) {
            instance.Guestures.destroy();
        }

    });


}(window, document, window.jQuery));

// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// $.fancybox.getInstance().slideShow.start()
//
// ==========================================================================
;
(function (document, $) {
    'use strict';

    var SlideShow = function (instance) {

        this.instance = instance;

        this.init();

    };

    $.extend(SlideShow.prototype, {
        timer: null,
        isActive: false,
        $button: null,
        speed: 3000,

        init: function () {
            var self = this;

            self.$button = $('<button data-fancybox-play class="fancybox-button fancybox-button--play" title="Slideshow (P)"></button>')
                    .appendTo(self.instance.$refs.buttons);

            self.instance.$refs.container.on('click', '[data-fancybox-play]', function () {
                self.toggle();
            });

        },

        set: function () {
            var self = this;

            // Check if reached last element
            if (self.instance && self.instance.current && (self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)) {

                self.timer = setTimeout(function () {
                    self.instance.next();

                }, self.instance.current.opts.slideShow.speed || self.speed);

            } else {
                self.stop();
            }
        },

        clear: function () {
            var self = this;

            clearTimeout(self.timer);

            self.timer = null;
        },

        start: function () {
            var self = this;

            self.stop();

            if (self.instance && self.instance.current && (self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)) {

                self.instance.$refs.container.on({
                    'beforeLoad.fb.player': $.proxy(self, "clear"),
                    'onComplete.fb.player': $.proxy(self, "set"),
                });

                self.isActive = true;

                if (self.instance.current.isComplete) {
                    self.set();
                }

                self.instance.$refs.container.trigger('onPlayStart');

                self.$button.addClass('fancybox-button--pause');
            }

        },

        stop: function () {
            var self = this;

            self.clear();

            self.instance.$refs.container
                    .trigger('onPlayEnd')
                    .off('.player');

            self.$button.removeClass('fancybox-button--pause');

            self.isActive = false;
        },

        toggle: function () {
            var self = this;

            if (self.isActive) {
                self.stop();

            } else {
                self.start();
            }
        }

    });

    $(document).on('onInit.fb', function (e, instance) {

        if (instance && instance.group.length > 1 && !!instance.opts.slideShow && !instance.SlideShow) {
            instance.SlideShow = new SlideShow(instance);
        }

    });

    $(document).on('beforeClose.fb onDeactivate.fb', function (e, instance) {

        if (instance && instance.SlideShow) {
            instance.SlideShow.stop();
        }

    });

}(document, window.jQuery));

// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
;
(function (document, $) {
    'use strict';

    // Collection of methods supported by user browser
    var fn = (function () {

        var fnMap = [
            [
                'requestFullscreen',
                'exitFullscreen',
                'fullscreenElement',
                'fullscreenEnabled',
                'fullscreenchange',
                'fullscreenerror'
            ],
            // new WebKit
            [
                'webkitRequestFullscreen',
                'webkitExitFullscreen',
                'webkitFullscreenElement',
                'webkitFullscreenEnabled',
                'webkitfullscreenchange',
                'webkitfullscreenerror'

            ],
            // old WebKit (Safari 5.1)
            [
                'webkitRequestFullScreen',
                'webkitCancelFullScreen',
                'webkitCurrentFullScreenElement',
                'webkitCancelFullScreen',
                'webkitfullscreenchange',
                'webkitfullscreenerror'

            ],
            [
                'mozRequestFullScreen',
                'mozCancelFullScreen',
                'mozFullScreenElement',
                'mozFullScreenEnabled',
                'mozfullscreenchange',
                'mozfullscreenerror'
            ],
            [
                'msRequestFullscreen',
                'msExitFullscreen',
                'msFullscreenElement',
                'msFullscreenEnabled',
                'MSFullscreenChange',
                'MSFullscreenError'
            ]
        ];

        var val;
        var ret = {};
        var i, j;

        for (i = 0; i < fnMap.length; i++) {
            val = fnMap[ i ];

            if (val && val[ 1 ] in document) {
                for (j = 0; j < val.length; j++) {
                    ret[ fnMap[ 0 ][ j ] ] = val[ j ];
                }

                return ret;
            }
        }

        return false;
    })();

    if (!fn) {
        return;
    }

    var FullScreen = {
        request: function (elem) {

            elem = elem || document.documentElement;

            elem[ fn.requestFullscreen ](elem.ALLOW_KEYBOARD_INPUT);

        },
        exit: function () {
            document[ fn.exitFullscreen ]();
        },
        toggle: function (elem) {

            if (this.isFullscreen()) {
                this.exit();
            } else {
                this.request(elem);
            }

        },
        isFullscreen: function () {
            return Boolean(document[ fn.fullscreenElement ]);
        },
        enabled: function () {
            return Boolean(document[ fn.fullscreenEnabled ]);
        }
    };

    $(document).on({
        'onInit.fb': function (e, instance) {
            var $container;

            if (instance && !!instance.opts.fullScreen && !instance.FullScreen) {
                $container = instance.$refs.container;

                instance.$refs.button_fs = $('<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="Full screen (F)"></button>')
                        .appendTo(instance.$refs.buttons);

                $container.on('click.fb-fullscreen', '[data-fancybox-fullscreen]', function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    FullScreen.toggle($container[ 0 ]);

                });

                if (instance.opts.fullScreen.requestOnStart === true) {
                    FullScreen.request($container[ 0 ]);
                }

            }

        }, 'beforeMove.fb': function (e, instance) {

            if (instance && instance.$refs.button_fs) {
                instance.$refs.button_fs.toggle(!!instance.current.opts.fullScreen);
            }

        }, 'beforeClose.fb': function () {
            FullScreen.exit();
        }
    });

    $(document).on(fn.fullscreenchange, function () {
        var instance = $.fancybox.getInstance();
        var $what = instance ? instance.current.$placeholder : null;

        if ($what) {

            // If image is zooming, then this will force it to stop and reposition properly
            $what.css('transition', 'none');

            instance.isAnimating = false;

            instance.update(true, true, 0);
        }

    });

}(document, window.jQuery));

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
;
(function (document, $) {
    'use strict';

    var FancyThumbs = function (instance) {

        this.instance = instance;

        this.init();

    };

    $.extend(FancyThumbs.prototype, {

        $button: null,
        $grid: null,
        $list: null,
        isVisible: false,

        init: function () {
            var self = this;

            self.$button = $('<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="Thumbnails (G)"></button>')
                    .appendTo(this.instance.$refs.buttons)
                    .on('touchend click', function (e) {
                        e.stopPropagation();
                        e.preventDefault();

                        self.toggle();
                    });

        },

        create: function () {
            var instance = this.instance,
                    list,
                    src;

            this.$grid = $('<div class="fancybox-thumbs"></div>').appendTo(instance.$refs.container);

            list = '<ul>';

            $.each(instance.group, function (i, item) {

                src = item.opts.thumb || (item.opts.$thumb ? item.opts.$thumb.attr('src') : null);

                if (!src && item.type === 'image') {
                    src = item.src;
                }

                if (src && src.length) {
                    list += '<li data-index="' + i + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + src + '" /></li>';
                }

            });

            list += '</ul>';

            this.$list = $(list).appendTo(this.$grid).on('click touchstart', 'li', function () {

                instance.jumpTo($(this).data('index'));

            });

            this.$list.find('img').hide().one('load', function () {

                var $parent = $(this).parent().removeClass('fancybox-thumbs-loading'),
                        thumbWidth = $parent.outerWidth(),
                        thumbHeight = $parent.outerHeight(),
                        width,
                        height,
                        widthRatio,
                        heightRatio;

                width = this.naturalWidth || this.width;
                height = this.naturalHeight || this.height;

                //Calculate thumbnail width/height and center it

                widthRatio = width / thumbWidth;
                heightRatio = height / thumbHeight;

                if (widthRatio >= 1 && heightRatio >= 1) {
                    if (widthRatio > heightRatio) {
                        width = width / heightRatio;
                        height = thumbHeight;

                    } else {
                        width = thumbWidth;
                        height = height / widthRatio;
                    }
                }

                $(this).css({
                    width: Math.floor(width),
                    height: Math.floor(height),
                    'margin-top': Math.min(0, Math.floor(thumbHeight * 0.3 - height * 0.3)),
                    'margin-left': Math.min(0, Math.floor(thumbWidth * 0.5 - width * 0.5))
                }).show();

            })
                    .each(function () {
                        this.src = $(this).data('src');
                    });

        },

        focus: function () {

            if (this.instance.current) {
                this.$list
                        .children()
                        .removeClass('fancybox-thumbs-active')
                        .filter('[data-index="' + this.instance.current.index + '"]')
                        .addClass('fancybox-thumbs-active')
                        .focus();
            }

        },

        close: function () {

            this.$grid.hide();

        },

        update: function () {

            this.instance.$refs.container.toggleClass('fancybox-container--thumbs', this.isVisible);

            if (this.isVisible) {

                if (!this.$grid) {
                    this.create();
                }

                this.$grid.show();

                this.focus();

            } else if (this.$grid) {
                this.$grid.hide();
            }

            this.instance.update();

        },

        hide: function () {

            this.isVisible = false;

            this.update();

        },

        show: function () {

            this.isVisible = true;

            this.update();

        },

        toggle: function () {

            if (this.isVisible) {
                this.hide();

            } else {
                this.show();
            }
        }

    });

    $(document).on('onInit.fb', function (e, instance) {
        var first = instance.group[0],
                second = instance.group[1];

        if (!!instance.opts.thumbs && !instance.Thumbs && instance.group.length > 1 && (
                (first.type == 'image' || first.opts.thumb || first.opts.$thumb) &&
                (second.type == 'image' || second.opts.thumb || second.opts.$thumb)
                )
                ) {

            instance.Thumbs = new FancyThumbs(instance);
        }

    });

    $(document).on('beforeMove.fb', function (e, instance, item) {
        var self = instance && instance.Thumbs;

        if (!self) {
            return;
        }

        if (item.modal) {

            self.$button.hide();

            self.hide();

        } else {

            if (instance.opts.thumbs.showOnStart === true && instance.firstRun) {
                self.show();

            }

            self.$button.show();

            if (self.isVisible) {
                self.focus();
            }

        }

    });

    $(document).on('beforeClose.fb', function (e, instance) {

        if (instance && instance.Thumbs) {
            if (instance.Thumbs.isVisible && instance.opts.thumbs.hideOnClosing !== false) {
                instance.Thumbs.close();
            }

            instance.Thumbs = null;
        }

    });

}(document, window.jQuery));

// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
;
(function (document, window, $) {
    'use strict';

    // Simple $.escapeSelector polyfill (for jQuery prior v3)
    if (!$.escapeSelector) {
        $.escapeSelector = function (sel) {
            var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
            var fcssescape = function (ch, asCodePoint) {
                if (asCodePoint) {
                    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                    if (ch === "\0") {
                        return "\uFFFD";
                    }

                    // Control characters and (dependent upon position) numbers get escaped as code points
                    return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
                }

                // Other potentially-special ASCII characters get backslash-escaped
                return "\\" + ch;
            };

            return (sel + "").replace(rcssescape, fcssescape);
        };
    }

    // Variable containing last hash value set by fancyBox
    // It will be used to determine if fancyBox needs to close after hash change is detected
    var currentHash = null;

    // Get info about gallery name and current index from url
    function parseUrl() {
        var hash = window.location.hash.substr(1);
        var rez = hash.split('-');
        var index = rez.length > 1 && /^\+?\d+$/.test(rez[ rez.length - 1 ]) ? parseInt(rez.pop(-1), 10) || 1 : 1;
        var gallery = rez.join('-');

        // Index is starting from 1
        if (index < 1) {
            index = 1;
        }

        return {
            hash: hash,
            index: index,
            gallery: gallery
        };
    }

    // Trigger click evnt on links to open new fancyBox instance
    function triggerFromUrl(url) {
        var $el;

        if (url.gallery !== '') {

            // If we can find element matching 'data-fancybox' atribute, then trigger click event for that ..
            $el = $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1);

            if ($el.length) {
                $el.trigger('click');

            } else {

                // .. if not, try finding element by ID
                $("#" + $.escapeSelector(url.gallery) + "").trigger('click');

            }

        }
    }

    // Get gallery name from current instance
    function getGallery(instance) {
        var opts;

        if (!instance) {
            return false;
        }

        opts = instance.current ? instance.current.opts : instance.opts;

        return opts.$orig ? opts.$orig.data('fancybox') : (opts.hash || '');
    }

    // Star when DOM becomes ready
    $(function () {

        // Small delay is used to allow other scripts to process "dom ready" event
        setTimeout(function () {

            // Check if this module is not disabled
            if ($.fancybox.defaults.hash === false) {
                return;
            }

            // Check if need to close after url has changed
            $(window).on('hashchange.fb', function () {
                var url = parseUrl();

                if ($.fancybox.getInstance()) {
                    if (currentHash && currentHash !== url.gallery + '-' + url.index) {
                        currentHash = null;

                        $.fancybox.close();
                    }

                } else if (url.gallery !== '') {
                    triggerFromUrl(url);
                }

            });

            // Update hash when opening/closing fancyBox
            $(document).on({
                'onInit.fb': function (e, instance) {
                    var url = parseUrl();
                    var gallery = getGallery(instance);

                    // Make sure gallery start index matches index from hash
                    if (gallery && url.gallery && gallery == url.gallery) {
                        instance.currIndex = url.index - 1;
                    }

                }, 'beforeMove.fb': function (e, instance, current) {
                    var gallery = getGallery(instance);

                    // Update window hash
                    if (gallery && gallery !== '') {

                        if (window.location.hash.indexOf(gallery) < 0) {
                            instance.opts.origHash = window.location.hash;
                        }

                        currentHash = gallery + (instance.group.length > 1 ? '-' + (current.index + 1) : '');

                        if ("pushState" in history) {
                            history.pushState('', document.title, window.location.pathname + window.location.search + '#' + currentHash);

                        } else {
                            window.location.hash = currentHash;
                        }

                    }

                }, 'beforeClose.fb': function (e, instance, current) {
                    var gallery = getGallery(instance);
                    var origHash = instance && instance.opts.origHash ? instance.opts.origHash : '';

                    // Remove hash from location bar
                    if (gallery && gallery !== '') {
                        if ("pushState" in history) {
                            history.pushState('', document.title, window.location.pathname + window.location.search + origHash);

                        } else {
                            window.location.hash = origHash;
                        }
                    }

                    currentHash = null;
                }
            });

            // Check current hash and trigger click event on matching element to start fancyBox, if needed
            triggerFromUrl(parseUrl());

        }, 50);
    });


}(document, window, window.jQuery));

/*END JQUERY PLUGINS*/
(function ($) {

    /*==========FOR SVG ==============*/
    svg4everybody();

    /*========== TRANSITION SCROLL ==============*/

    $('.scroll').on("click", function (e) {
        e.preventDefault();
        var anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $(anchor.attr('href')).offset().top
        }, 1000);
    });


    /*----------------------------------------
     MENU
     ----------------------------------------*/
    var menu = $(".menu"),
            body = $("body"),
            panelSwipe = $(".swipe-panel"),
            openMenu = $("#button-menu"),
            closeMenu = $("#close-menu");

    openMenu.on('click', function (event) {
        event.preventDefault();
        body.addClass('lock-position');
        menu.addClass('open');
    });

    closeMenu.on('click', function (event) {
        event.preventDefault();
        body.removeClass('lock-position');
        menu.removeClass('open');
    });

    menu.swipe({
        swipeLeft: function () {
            $(this).removeClass('open');
            body.removeClass('lock-position');
        }
    });
    panelSwipe.swipe({
        swipeRight: function () {
            menu.addClass('open');
            body.addClass('lock-position');
        }
    });

    /*----------------------------------------
     COLLAPSE
     ----------------------------------------*/
    var collapseBtn = $('.collapse-header'),
            collapsePanel = $('.collapse-panel');

    collapseBtn.on('click', function (event) {
        event.preventDefault();
        $(this).toggleClass('clicked').next().slideToggle().toggleClass('active');
    });

    /*----------------------------------------
     SLIDER
     ----------------------------------------*/
    $('.slider').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: true
    });

    /* TABS */

    $('.tabs li').click(function () {
        var tab_id = $(this).attr('data-tab');

        $('.tab-link').removeClass('tab-link_active');
        $('.tab-pane').removeClass('tab-pane_active');

        $(this).addClass('tab-link_active');
        $("#" + tab_id).addClass('tab-pane_active');
    });

})(jQuery);



/*----------------------------------------
 POPUPS / MODALS
 ----------------------------------------*/
(function ($) {

    var popup = $("[data-popup-name='gp-popup']"),
            popupOpen = $("[data-popup='open']"),
            popupClose = $("[data-popup='close']"),
            popupOverlay = $(".popup-overlay");

    /* POPUP METHODS */
    var methods = {
        show: function (options) {
                $('body').removeClass('lock-position');
                $('.menu').removeClass('open');
            return this.each(function () {
                $(this).addClass('popup_open');
            });
        },
        hide: function ( ) {
            return this.each(function () {
                if (popup.hasClass('popup_open')) {
                    $(this).removeClass('popup_open');
                    $(this).addClass('popup_close');
                    setTimeout(function () {
                        popup.removeClass('popup_close');
                    }, 400);
                }
            })
        }
    };

    /* POPUP FUNCTIONS */
    $.fn.gpPopup = function (method) {

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.show.apply(this, arguments);
        } else {
            $.error('Метод с именем ' + method + ' не существует');
        }

    };

    /* CLICK FOR OPEN */
    popupOpen.on('click', function (link) {
        link.preventDefault();
        var popupId = $(this).attr('data-popup-id');
        $(popupId).gpPopup();
    });

    /* CLICK FOR CLOSE */
    popupClose.on('click', function (link) {
        link.preventDefault();
        popup.gpPopup('hide');
    });

    popupOverlay.on('click', function (link) {
        link.preventDefault();
        popup.gpPopup('hide');
    });

    $(this).keydown(function (eventObject) {
        if (eventObject.which == 27)
            popup.gpPopup('hide');
    });
})(jQuery);
