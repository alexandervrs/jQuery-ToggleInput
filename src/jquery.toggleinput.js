
/**
 * Enables the styling of checkbox and radio elements
 *
 * @author  Alexander Vourtsis
 * @version	1.0.1
 * @updated	13 March 2013, 13:30 UTC+02:00
 * @license	The Unlicense
 */
 
(function($)
{
	var pluginName = 'toggleInput';
	
	var methods = {

        create: function(options) {
		
			var defaults = {
				normalClass: 'checkbox', //CSS class for the checkbox/radio
				hoverClass: 'checkbox-focused', //CSS class when the checkbox/radio is focused or hover
				checkedClass: 'checkbox-checked', //CSS class when the checkbox/radio is checked
				disabledClass: 'checkbox-disabled', //CSS class when the checkbox/radio is disabled
				create: function(){}, //on create callback
				destroy: function(){}, //on destroy callback
				disable: function(){}, //on disable callback
				enable: function(){}, //on enable callback
				check: function(){}, //on check callback
				uncheck: function(){}, //on uncheck callback
				debugMode: false //whether to show the actual checkbox/radio, for debug purposes
			};

			var options = $.extend(defaults, options);
			
			return $(this).each(function(i, elements) {
			
				/* browser specific: deactivate styling for IE7 and lower */
				if (navigator.appVersion.indexOf("MSIE") != -1) {
					if (parseFloat(navigator.appVersion.split("MSIE")[1]) < 8){
						return false;
					}
				}
			
				var base = $(this);
				
				$(elements).data('plugin-options', options);
				
				var actualInputElement = $(this);
				var actualInputElementID = actualInputElement.attr('id');
				var tabindex = '';
				
				/* get ID from either id or data-id attribute */
				if (!(actualInputElementID)) {
					actualInputElement.attr('id', 'toggleinputdata_'+actualInputElement.attr('data-id'));
					actualInputElementID = actualInputElement.attr('id');
				}
				
				if (!(actualInputElementID)) {
					$.error(pluginName+' expects an ID attribute for the checkbox/radio or a data-id attribute');
					return false;
				}
				
				/* if input is a radio button then we also need a name */
				if (actualInputElement.attr('type') == 'radio') {
					var actualInputElementName = actualInputElement.attr('name');
					
					if (!(actualInputElementName)) {
						$.error(pluginName+' expects a name attribute for the radio button');
					}
				}
				
				/* get and set tabindex of input */
				if (actualInputElement.prop('disabled') == false) {
					if (actualInputElement.attr('tabindex')) {
						tabindex = 'tabindex="'+actualInputElement.attr('tabindex')+'" ';
					} else {
						tabindex = 'tabindex="0" ';
					}
				}
				
				/* hide actual input if debugMode is false */
				if (!(options.debugMode)) {
					actualInputElement.css({ 'display': 'none' });
				}
				
				/* wrap hidden input with a span that actually gets styled */
				actualInputElement.wrap('<span id="'+actualInputElementID+'_toggleinput_parent" '+tabindex+' class="'+options.normalClass+'"></span>');
				var toggleElement = $('#'+actualInputElementID).closest('#'+actualInputElementID+'_toggleinput_parent');
				
				/* apply checked class to span if input is checked */
				if (actualInputElement.prop('checked') == true) {
					toggleElement.addClass(options.checkedClass);
				}
				
				/* apply disabled class to span if input is disabled */
				if (actualInputElement.prop('disabled') == true) {
					toggleElement.addClass(options.disabledClass);
				}
				
				/* handle clicks */
				toggleElement.on('mousedown', function(event){
						
					if (actualInputElement.prop('disabled') == false) {
						methods.toggle.call(base);
					}
					
				});
					
				/* handle 'enter' keyboard shortcut */
				toggleElement.on('keydown', function(event){
				
					if (actualInputElement.prop('disabled') == false) {
						if (event.keyCode == 13) {
							methods.toggle.call(base);
						}
					}
					
				});
				
				/* check if there's a label with a for attribute */
				$('label[for='+actualInputElementID+']').on('click', function(event){
					
					event.preventDefault();
					
					if (actualInputElement.prop('disabled') == false) {
						methods.toggle.call(base);
					}
					
				});
				
				/* remove any parent labels as this doesn't work well */
				if (toggleElement.parent().is('label')) {
		
					toggleElement.unwrap('label');

				}

				/* handle mouseover and focus */
				toggleElement.on('focus mouseover', function(){
					toggleElement.addClass(options.hoverClass);
				});
				
				toggleElement.on('blur mouseout', function(){
					toggleElement.removeClass(options.hoverClass);
				});
				
				options.create();
				
			});
		
		},
		
		toggle: function() {
			
			return $(this).each(function(i, elements) {
			
				var options = $(elements).data('plugin-options');
				
				if (!options) {
					return false;
				}
				
				var actualInputElement = $(this);
				var actualInputElementName = actualInputElement.attr('name');
				var toggleElement = $(this).closest('#'+$(this).attr('id')+'_toggleinput_parent');
				
				
				if ($(toggleElement).hasClass(options.checkedClass)) {
					
					if (actualInputElement.attr('type') == 'checkbox') {
						$(toggleElement).removeClass(options.checkedClass);
						actualInputElement.prop('checked', false);
						options.uncheck();
					}
					
				} else {
					$(toggleElement).addClass(options.checkedClass);
					
					if (actualInputElement.attr('type') == 'radio') {
						$('[name="'+actualInputElementName+'"]').not($(this)).parent('span').removeClass(options.checkedClass);
					}
					
					actualInputElement.prop('checked', true);
					options.check();
				}
				
			});

		},
		
		check: function() {
			
			return $(this).each(function(i, elements) {
			
				var options = $(elements).data('plugin-options');
				
				if (!options) {
					return false;
				}
				
				var actualInputElement = $(this);
				var actualInputElementName = actualInputElement.attr('name');
				var toggleElement = $(this).closest('#'+$(this).attr('id')+'_toggleinput_parent');
				
				
				if (!($(toggleElement).hasClass(options.checkedClass))) {

					$(toggleElement).addClass(options.checkedClass);
					
					if (actualInputElement.attr('type') == 'radio') {
						$('[name="'+actualInputElementName+'"]').not($(this)).parent('span').removeClass(options.checkedClass);
					}
					
					actualInputElement.prop('checked', true);
					options.check();
				}
				
			});

		},
		
		uncheck: function() {
			
			return $(this).each(function(i, elements) {
			
				var options = $(elements).data('plugin-options');
				
				if (!options) {
					return false;
				}
				
				var actualInputElement = $(this);
				var actualInputElementName = actualInputElement.attr('name');
				var toggleElement = $(this).closest('#'+$(this).attr('id')+'_toggleinput_parent');
				
				
				if ($(toggleElement).hasClass(options.checkedClass)) {
					
					if (actualInputElement.attr('type') == 'checkbox') {
						$(toggleElement).removeClass(options.checkedClass);
						actualInputElement.prop('checked', false);
						options.uncheck();
					}
					
				}
				
			});

		},
		
		
		disable: function() {
			
			return $(this).each(function(i, elements) {
			
				var options = $(elements).data('plugin-options');
				
				if (!options) {
					return false;
				}
				
				var actualInputElement = $(this);
				var toggleElement = $(this).closest('#'+$(this).attr('id')+'_toggleinput_parent');
				
				if (!($(toggleElement).hasClass(options.disabledClass))) {
					$(toggleElement).addClass(options.disabledClass);

					if (actualInputElement.attr('tabindex')) {
						toggleElement.removeAttr('tabindex');
					}
					
					actualInputElement.prop('disabled', true);
					options.disable();
				}
				
			});

		},
		
		
		enable: function() {
			
			return $(this).each(function(i, elements) {
			
				var options = $(elements).data('plugin-options');
				
				if (!options) {
					return false;
				}
				
				var actualInputElement = $(this);
				var toggleElement = $(this).closest('#'+$(this).attr('id')+'_toggleinput_parent');
				
				if ($(toggleElement).hasClass(options.disabledClass)) {
					$(toggleElement).removeClass(options.disabledClass);

					actualInputElement.prop('disabled', false);
					
					if (actualInputElement.attr('tabindex')) {
						$(toggleElement).attr('tabindex', actualInputElement.attr('tabindex'));
					} else {
						$(toggleElement).attr('tabindex', '0');
					}
					
					options.enable();
				}
				
			});

		},
		
		
		destroy: function() {
		
			return $(this).each(function(i, elements) {
		
				var options = $(elements).data('plugin-options');

				if (!options) {
					return false;
				}
				
				$(this).unwrap('<span></span>');
				$(this).show();

				options.destroy();
				
			});
		}
		
    };

    $.fn.toggleInput = function(option) {
		
		if (methods[option]) {
            return methods[option].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof option === 'object' || ! option) {
			return methods.create.apply(this, arguments);
        } else {
            $.error('Method ' +  option + ' does not exist in '+pluginName);
        }    
    };
	
})(jQuery);