/*----------------------------------------

Example generator

------------------------------------------*/

//Form serialization
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$( document ).ready(function() {

	$(window).resize(function() {
		if ($('.sidebar-wrapper').height() > $(window).height()){
			var formHeight = $(window).height()-$('.sidebar-wrapper .intro').outerHeight()-$('.sidebar-wrapper .buttons-wrap').outerHeight()-30;
			$('.generator-form-wrap').css('height', formHeight+'px');
		}
	});

	$(window).resize();

	//Init waterpipe
	var smokyBG = $('#wavybg-wrapper').waterpipe();

	//Init nicescroll
	var niceScroll = $('.generator-form-wrap').niceScroll();

	//Params for samples
	var sampleParams = [
		{
			bgColorInner: "#2b2b2b",
			bgColorOuter: "#000000",
			gradientEnd: "#f5883b",
			gradientStart: "#ff5500",
			lineWidth: 1,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#ffffff",
			bgColorOuter: "#cccccc",
			gradientEnd: "#7a7a7a",
			gradientStart: "#000000",
			lineWidth: 2,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 10
		},
		{
			bgColorInner: "#2b2b2b",
			bgColorOuter: "#000000",
			gradientEnd: "#6b71e3",
			gradientStart: "#fa05fa",
			lineWidth: 1.5,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#2b2b2b",
			bgColorOuter: "#000000",
			gradientEnd: "#7d7d7d",
			gradientStart: "#e0e0e0",
			lineWidth: 1.2,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#ffffff",
			bgColorOuter: "#ffffff",
			gradientEnd: "#404040",
			gradientStart: "#000000",
			lineWidth: 3,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#292929",
			bgColorOuter: "#000000",
			gradientEnd: "#001eff",
			gradientStart: "#51ff00",
			lineWidth: 1.5,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#400000",
			bgColorOuter: "#000000",
			gradientEnd: "#400000",
			gradientStart: "#ff0000",
			lineWidth: 1.5,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 10
		},
		{
			bgColorInner: "#ffffff",
			bgColorOuter: "#000000",
			gradientEnd: "#000000",
			gradientStart: "#000000",
			lineWidth: 2.2,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 10
		},
		{
			bgColorInner: "#ffffff",
			bgColorOuter: "#ffffff",
			gradientEnd: "#696969",
			gradientStart: "#636363",
			lineWidth: 1,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#3b003b",
			bgColorOuter: "#630063",
			gradientEnd: "#cccc00",
			gradientStart: "#ffff00",
			lineWidth: 1,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		},
		{
			bgColorInner: "#ffffff",
			bgColorOuter: "#ebebeb",
			gradientEnd: "#012e82",
			gradientStart: "#2600ff",
			lineWidth: 1.5,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 10
		},
		{
			bgColorInner: "#4d4d4d",
			bgColorOuter: "#000000",
			gradientEnd: "#00c48d",
			gradientStart: "#03ffea",
			lineWidth: 1,
			numCircles: 1,
			radiusSize: 100,
			smokeOpacity: 5
		}
	];

	//Set download size
	$('#downloadWidth').val($(window).width());
	$('#downloadHeight').val($(window).height());

	//Go to samples
    $('.sidebar-wrapper').on('click', '.btn-samples', function(){
    	niceScroll.doScrollTop($('.generator-form-wrap').scrollTop() + $('#samples-section').position().top - 89);
    	console.log($('.generator-form-wrap').scrollTop);
    	return false;
	});

	//Generate
    $('.sidebar-wrapper').on('click', '.btn-generate', function(){
    	setNewParams();
    	smokyBG.data('waterpipe').generate();
    	return false;
	});

    //Download
    $('.sidebar-wrapper').on('click', '.btn-download', function(){
    	var width = $('#downloadWidth').val(),
    		height = $('#downloadHeight').val();
    	smokyBG.data('waterpipe').download(width, height);
    	return false;
	});

	//Generate sample
    $('.sidebar-wrapper').on('click', '.sample-smoke', function(){
    	var sampleID = $(this).attr('data-id');
    	loadParams(sampleParams[sampleID]);
    	$('.btn-generate').click();
    	return false;
	});

    //Init color pickers
	var gradientStartObj = $('#gradientStart').colpick({
		layout:'hex',
		submit:0,
		colorScheme:'dark',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('border-color','#'+hex);
			$(el).val('#'+hex);
		}
	}).keyup(function(){
		$(this).colpickSetColor(this.value);
	});

	var gradientEndObj = $('#gradientEnd').colpick({
		layout:'hex',
		submit:0,
		colorScheme:'dark',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('border-color','#'+hex);
			$(el).val('#'+hex);
		}
	}).keyup(function(){
		$(this).colpickSetColor(this.value);
	});

	var bgColorOuterObj = $('#bgColorOuter').colpick({
		layout:'hex',
		submit:0,
		colorScheme:'dark',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('border-color','#'+hex);
			$(el).val('#'+hex);
		}
	}).keyup(function(){
		$(this).colpickSetColor(this.value);
	});

	var bgColorInnerObj = $('#bgColorInner').colpick({
		layout:'hex',
		submit:0,
		colorScheme:'dark',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			$(el).css('border-color','#'+hex);
			$(el).val('#'+hex);
		}
	}).keyup(function(){
		$(this).colpickSetColor(this.value);
	});

	//Smoke Opacity slider
	var smokeOpacitySlider = $('.smokeOpacity-slider').noUiSlider({
		start: [ 10 ],
		range: {
			'min': [ 0 ],
			'max': [ 100 ]
		},
		step: 5,
		serialization: {
			lower: [
			  $.Link({
				target: $('#smokeOpacity')
			  })
			],
			format: {
				decimals: 0,
				mark: '.'
			}
		}
	});
	smokeOpacitySlider.on({
		slide: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'%');
		},
		change: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'%');
		}
	});

	//Number of Smokes slider
	var numCirclesSlider = $('.numCircles-slider').noUiSlider({
		start: [ 1 ],
		range: {
			'min': [ 1 ],
			'max': [ 5 ]
		},
		step: 1,
		serialization: {
			lower: [
			  $.Link({
				target: $('#numCircles')
			  })
			],
			format: {
				decimals: 0,
				mark: '.'
			}
		}
	});
	numCirclesSlider.on({
		slide: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue);
		},
		change: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue);
		}
	});

	//Smoke Size slider
	var radiusSizeSlider = $('.radiusSize-slider').noUiSlider({
		start: [ 100 ],
		range: {
			'min': [ 10 ],
			'max': [ 300 ]
		},
		step: 1,
		serialization: {
			lower: [
			  $.Link({
				target: $('#radiusSize')
			  })
			],
			format: {
				decimals: 0,
				mark: '.'
			}
		}
	});
	radiusSizeSlider.on({
		slide: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'%');
		},
		change: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'%');
		}
	});

	//Smoke Size slider
	var lineWidthSlider = $('.lineWidth-slider').noUiSlider({
		start: [ 2 ],
		range: {
			'min': [ 0.1 ],
			'max': [ 10 ]
		},
		step: 0.1,
		serialization: {
			lower: [
			  $.Link({
				target: $('#lineWidth')
			  })
			],
			format: {
				decimals: 1,
				mark: '.'
			}
		}
	});
	lineWidthSlider.on({
		slide: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'px');
		},
		change: function(){
			var sliderValue = $(this).val();
			$(this).parents('.input-group').find('.value').html(sliderValue+'px');
		}
	});


	//Set new params
	function setNewParams(){
		var params = $('.generator-params').serializeObject();
    	console.log(params);

    	//Set new values
    	smokyBG.data('waterpipe').setOption('gradientStart', params.gradientStart);
    	smokyBG.data('waterpipe').setOption('gradientEnd', params.gradientEnd);
    	smokyBG.data('waterpipe').setOption('smokeOpacity', params.smokeOpacity/100);
    	smokyBG.data('waterpipe').setOption('numCircles', params.numCircles);

    	var radius = $(window).height()*0.8/2*(params.radiusSize/100);
        smokyBG.data('waterpipe').setOption('maxMaxRad', radius);
        smokyBG.data('waterpipe').setOption('minMaxRad', radius);

    	smokyBG.data('waterpipe').setOption('lineWidth', params.lineWidth);

    	smokyBG.data('waterpipe').setOption('bgColorOuter', params.bgColorOuter);
    	smokyBG.data('waterpipe').setOption('bgColorInner', params.bgColorInner);
	}

	//Load params (samples)
	function loadParams(params){
		gradientStartObj.colpickSetColor(params.gradientStart.replace('#', ''));
		gradientEndObj.colpickSetColor(params.gradientEnd.replace('#', ''));
		smokeOpacitySlider.val(params.smokeOpacity).change();
		numCirclesSlider.val(params.numCircles).change();
		radiusSizeSlider.val(params.radiusSize).change();
		lineWidthSlider.val(params.lineWidth).change();
		bgColorOuterObj.colpickSetColor(params.bgColorOuter.replace('#', ''));
		bgColorInnerObj.colpickSetColor(params.bgColorInner.replace('#', ''));
	}

});










