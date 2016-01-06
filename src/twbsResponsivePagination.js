(function( $ ) {

    var settings = {};

    function checkWidth( el ) {
        if( $(el).width() >= $(el).parent().width() ) {
            return false;
        }
        return true;
    }

    var methods = {

        init: function( options ) {
            // If options exist, lets merge them
            var opts = {};
            if( options )
                opts = options;
            settings = $.extend( true, {}, $.fn.twbsResponsivePagination.defaults, opts );

            var $lis = $(this).find(' > li');
            settings.$overflowBefore = $("<li><span></span></li>").insertAfter( $lis.filter(':nth-child('+settings.endcapCount+')') );
            settings.$overflowAfter = $("<li><span></span></li>").insertBefore( $lis.filter(':nth-last-child('+settings.endcapCount+')') );

            settings.$overflowBefore.add( settings.$overflowAfter ).addClass(
                "disabled removable"
            ).addClass(
                settings.overflowClass
            ).attr( 'aria-hidden', true );

            $(this).data('twbsResponsivePagination', settings);

            var context = this;

            $(window).bind('resize.twbsResponsivePagination', function() {
                $(context).twbsResponsivePagination('update');
            });

            $(context).twbsResponsivePagination('update');
        },

        update: function() {
            var cls = settings.overflowClass;
            var $lis = $(this).find(' > li');
            $lis.filter('.' + cls + ' ~ li').hide().filter('.' + cls + ' ~ .' + cls + ' ~ li').show();
            $lis.filter('.' + cls).show();
            $lis.filter('.active').show();

            var activeIndex = $lis.filter('.active').index();
            var beforeIndex = settings.$overflowBefore.show().index();
            var afterIndex = settings.$overflowAfter.show().index();

            for( var i = activeIndex-1, j = activeIndex+1; i > beforeIndex || j < afterIndex; i--, j++ ) {

                if( i <= beforeIndex+1 ) {
                    settings.$overflowBefore.hide().next().show();
                    if( ! checkWidth(this) ) {
                        settings.$overflowBefore.show().next().hide();
                        break;
                    }
                } else {
                    $lis.eq( i ).show();
                    if( ! checkWidth(this) ) {
                        $lis.eq( i ).hide();
                        break;
                    }
                }

                if( j >= afterIndex-1 ) {
                    settings.$overflowAfter.hide().prev().show();
                    if( ! checkWidth(this) ) {
                        settings.$overflowAfter.show().prev().hide();
                        break;
                    }
                } else {
                    $lis.eq( j ).show();
                    if( ! checkWidth(this) ) {
                        $lis.eq( j ).hide();
                        break;
                    }
                }

            }
        }

    };

    // define the plugin //
    $.fn.twbsResponsivePagination = function( method ) {
        var args = arguments;
        return this.each(function() {
            var result;
            // Method calling logic
            if( methods[method] ) {
                // read in saved settings //
                settings = $(this).data('twbsResponsivePagination');
                result = methods[ method ].apply( this, Array.prototype.slice.call( args, 1 ));
            } else if( typeof method === 'object' || ! method ) {
                result = methods.init.apply( this, args );
            } else {
                $.error( 'Method ' +  method + ' does not exist on jQuery.twbsResponsivePagination' );
            }
            if( typeof result !== undefined ) {
                // save settings
                $(this).data('twbsResponsivePagination', settings);
                return result;
            }
        });
    };

    $.fn.twbsResponsivePagination.defaults = {
        endcapCount: 2,
        overflowClass: 'overflow'
    };

})( jQuery );
