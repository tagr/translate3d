/**
 * @preserve jquery.translate3d.js
 * Author: Andy Merhaut
 * Free to modify and use under the MIT license
 * https://github.com/tagr/translate3d
 */
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "translate3d",
    defaults = {
        count: 0,
        cssClass: 'translate3d_' + (Math.random().toString(36).substr(2, 12)),
        direction: 'alternate',
        duration: 7,
        endX: 0,
        endY: 0,
        endZ: 0,
        startX: 0,
        startY: 0,
        startZ: 0,
        timing: 'linear',
        vendorPrefixes: ['ms','moz','webkit'],
        useVendorPrefixes: true
    };

    // The actual plugin constructor
    function translate3d ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    translate3d.prototype = {
        init: function () {

            //Get settings
            var config = this.settings;
            var count = config.count === 0 ? 'infinite' : config.count;

            // Animation CSS
            var inlineStyles, styles = 
                '.' + config.cssClass +' {\n    animation: ' + config.cssClass + ' ' + 
                config.duration + 's ' + config.timing + ' ' + count + ' ' + config.direction + ';\n';
            
            if (config.useVendorPrefixes && config.vendorPrefixes !== null) {
                var c = config.vendorPrefixes.length;
                while (c--) {
                    styles += '    -' + config.vendorPrefixes[c] + '-animation: ' + config.cssClass + ' ' + 
                        config.duration + 's ' + config.timing + ' ' + count + ' ' + config.direction + ';\n'
                }
            }
            styles += ' }\n';
        
            // Keyframes CSS
            styles += '@keyframes ' + config.cssClass + 
             ' {\n    0% { transform: translate3d(' + config.startX + 'px,' + config.startY + 'px,' + config.startZ + 'px); }\n}';
            inlineStyles = '; transform: translate3d(' + config.endX + 'px,' + config.endY + 'px,' + config.endZ + 'px); ';

            if (config.useVendorPrefixes && config.vendorPrefixes !== null) {
                var c = config.vendorPrefixes.length;
                while (c--) {
                    styles += '\n@-' + config.vendorPrefixes[c] + '-keyframes ' + config.cssClass + 
                      ' {\n    0% { -' + config.vendorPrefixes[c] + 
                      '-transform: translate3d(' + config.startX + 'px,' + config.startY + 'px,' + config.startZ + 'px); }\n}';
                    inlineStyles += '-' + config.vendorPrefixes[c] + 
                      '-transform: translate3d(' + config.endX + 'px,' + config.endY + 'px,' + config.endZ + 'px); ';
                }
            }

            var currentCss = this.element.getAttribute('style') === null ? '' : this.element.getAttribute('style') ;
            this.element.setAttribute('style', currentCss + inlineStyles);
  
            // Append the dynamic CSS to the document (if it does not yet exist).
            if (jQuery('style[title="' + config.cssClass + '"]').length === 0) {
                var css = document.createElement('style');
                css.type = 'text/css';
                css.title = config.cssClass;
                if (css.styleSheet) css.styleSheet.cssText = styles;
                  else css.appendChild(document.createTextNode(styles));

                document.querySelector("body").appendChild(css);
            }

            //Append the dynamic CSS class name to the current element.
            this.element.classList.add(config.cssClass);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new translate3d( this, options ) );
            }
        });
    };

})( jQuery, window, document );
