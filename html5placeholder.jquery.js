// HTML5 placeholder plugin version 1.01
// Copyright (c) 2010-The End of Time, Mike Taylor, http://miketaylr.com
// MIT Licensed: http://www.opensource.org/licenses/mit-license.php
//
// Enables cross-browser HTML5 placeholder for inputs, by first testing
// for a native implementation before building one.
//
//
// USAGE:
//$('input[placeholder]').placeholder();

// <input type="text" placeholder="username">
(function ($) {
    //feature detection
    var hasPlaceholder = 'placeholder' in document.createElement('input'),

    //sniffy sniff sniff -- just to give extra left padding for the older
    //graphics for type=email and type=url
        isOldOpera = $.browser.opera && $.browser.version < 10.5;

    $.fn.placeholder = function (options) {
        var padding = {}, o_left;
        //-- Set the padding to the larger of the specified padding or the Input's Padding
        function setPaddingMax(name, shorthand) {
            var placeholderCSSval = parseInt(options.placeholderCSS[name], 10);
            options.placeholderCSS[name] = (placeholderCSSval > padding[shorthand] ? placeholderCSSval : padding[shorthand]);
        }

        //merge in passed in options, if any
        options = $.extend(true, {}, options, $.fn.placeholder.defaults, options);
        //cache the original 'left' value, for use by Opera later
        o_left = options.placeholderCSS.paddingLeft;

        //first test for native placeholder support before continuing
        //feature detection inspired by ye olde jquery 1.4 hawtness, with paul irish
        return (hasPlaceholder) ? this : this.each(function () {

            //local vars
            var $this = $(this),
                $wrapper = $this.parent(),
                inputVal = $.trim($this.val()),
                inputWidth = $this.width(),
                inputOuterWidth = $this.outerWidth(),
                inputOuterHeight = $this.outerHeight(),
                inputFloat = $this.css('float'),
                guessingLineHeight = false,
                inputLineHeight = parseInt($this.css('lineHeight'), 10),
                numberOfLines,
                topOffset = ($this.offset().top - $wrapper.offset().top),

                //grab the inputs id for the <label @for>, or make a new one from the Date
                inputId = (this.id) ? this.id : 'placeholder' + (+new Date()),
                placeholderText = $this.attr('placeholder'),
                placeholder = $('<label for=' + inputId + '>' + placeholderText + '</label>');

            padding = {
                t: parseInt($this.css('paddingTop'), 10) + topOffset,
                r: parseInt($this.css('paddingRight'), 10),
                b: parseInt($this.css('paddingBottom'), 10),
                l: parseInt($this.css('paddingLeft'), 10)
            };

            //-- figure out if we know the actual line height or not (IE has a default value of 'normal')
            if (!inputLineHeight) {
                guessingLineHeight = true;
                inputLineHeight = $this.height();
            }
            numberOfLines = Math.floor(inputOuterHeight / inputLineHeight);

            // adjust position of placeholder
            options.placeholderCSS.paddingLeft = (isOldOpera && (this.type === 'email' || this.type === 'url')) ?
                options.placeholderCSS.paddingLeft + 14 : o_left;

            //stuff in some calculated values into the placeholderCSS object
            setPaddingMax('paddingTop', 't');
            setPaddingMax('paddingRight', 'r');
            setPaddingMax('paddingBottom', 'b');
            setPaddingMax('paddingLeft', 'l');

            options.placeholderCSS.width = inputOuterWidth - options.placeholderCSS.paddingLeft - options.placeholderCSS.paddingRight;
            options.placeholderCSS.height = inputOuterHeight - options.placeholderCSS.paddingTop - options.placeholderCSS.paddingBottom + topOffset;
            if (!(guessingLineHeight && "TEXTAREA" === this.tagName)) {
                //-- if we don't really know the lineHeight, so lets let it inherit
                options.placeholderCSS.lineHeight = (inputOuterHeight / numberOfLines) + 'px';
            }

            placeholder.css(options.placeholderCSS);

            //place the placeholder if the input is empty
            if (!inputVal) {
                $this.wrap(options.inputWrapper).parent().css({'float': inputFloat, width: inputOuterWidth});
                $this.attr('id', inputId).after(placeholder);
            }

            //hide placeholder on focus
            $this.focus(function () {
                if (!$.trim($this.val())) {
                    $this.next().hide();
                }
            });

            //show placeholder if the input is empty
            $this.blur(function () {
                if (!$.trim($this.val())) {
                    $this.next().show();
                }
            });
        });
    };

    //expose defaults
    $.fn.placeholder.defaults = {
        //you can pass in a custom wrapper
        inputWrapper: '<span style="position:relative; display: inline-block;"></span>',

        //more or less just emulating what webkit does here
        //tweak to your hearts content
        placeholderCSS: {
            font: '0.75em sans-serif',
            color: '#bababa',
            position: 'absolute',
            left: '0px',
            top: '0px',
            paddingLeft: '5px',
            textAlign: 'left',
            overflow: 'hidden'
        }
    };
})(jQuery);
