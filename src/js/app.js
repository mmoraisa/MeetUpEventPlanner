var api_key = 'AIzaSyCRIjczrUkwiSOddTAWzP958pVJm8yybCU';

$(document).ready(function(){

	if(navigator.geolocation && window.location.pathname.indexOf('event.html') != -1){
		navigator.geolocation.getCurrentPosition(findLocation, error, options);
	}

	var saved_events = getSavedEvents();

	$('input').each(function(){
		this.onblur = function(){
			refreshInput(this);
		};
	});

	$('input[type="password"]').each(function(){
		this.onkeyup = function(){
			refreshInput(this);
		};
		for(var i = 0; i < password_control.rules.length; i++){
			$(this).parent().append('<p class="rule" rule="' + password_control.rules[i].id + '"><span class="notify glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;&nbsp;' + password_control.rules[i].message + '</p>');
		}
	});

	$('form[name="createAccount"]').find('input[type="submit"]').unbind().on('click',function(){
		if($(this).parents('form').find('.form-group.has-error').length == 0)
			$(this).parents('form').submit();
	});

	$('form[name="createEvent"]').unbind('submit').on('submit',function(){
		var data = $(this).serialize().split("&");
		var obj = {};
		for(var key in data) {
			obj[data[key].split("=")[0]] = data[key].split("=")[1];
		}

		saved_events.push(obj);
		var events = JSON.stringify(saved_events);

		localStorage.setItem('events',events);

		return false;
	});

	for(var i = 0; i < saved_events.length; i++){

		var event =   '<div class="col-xs-12 col-md-3" style="margin-bottom:20px;">'
					+ '	<div class="col-xs-12" style="background-color:#ddd;height:230px;">'
					+ '		<h4 style="margin-top:20px;">' + decodeURI(saved_events[i].name) + '</h4>'
					+ '		<hr>'
					+ '		<p style="text-align:left"><strong>Event Type:</strong> ' + decodeURI(saved_events[i].eventType) + '</p>'
					+ '		<p style="text-align:left"><strong>Host:</strong> ' + decodeURI(saved_events[i].host) + '</p>'
					+ '		<p style="text-align:left"><strong>Start:</strong> ' + saved_events[i].start.substr(0,10) + '</p>'
					+ '		<p style="text-align:left"><strong>End:</strong> ' + saved_events[i].end.substr(0,10) + '</p>'
					+ '	</div>'
					+ '</div>'
		$('#eventsList').append(event);

	}

	refreshProgress();

});

var password_control = {
	validatePassword: function(password_input){
		var valid = true;

		for(var i = 0; i < password_control.rules.length; i++){
			if (!password_control.rules[i].validate(password_input))
				valid = false;
		}

		return valid;
	},
	rules: [
				{
					id: 1,
					message: 'The password have a uppercase letter',
					validate: function(password_input){
						var password = $(password_input).val();
						var isValid = password.match(/[A-Z]/g);
						password_control.controlRules(password_input,1,isValid);
						return isValid;
					}
				},
				{
					id: 2,
					message: 'The password have a special character',
					validate: function(password_input){
						var password = $(password_input).val();
						var isValid = !(/^[a-zA-Z0-9- ]*$/.test(password));
						password_control.controlRules(password_input,2,isValid);
						return isValid;
					}
				},
				{
					id: 3,
					message: 'The password have 8 or more characters',
					validate: function(password_input){
						var password = $(password_input).val();
						var isValid = password.length >= 8;
						password_control.controlRules(password_input,3,isValid);
						return isValid;
					}
				}
	],
	controlRules: function(password_input,rule,valid){
		if(valid)
			$(password_input).parent().find('p[rule=' + rule + ']').hide();
		else
			$(password_input).parent().find('p[rule=' + rule + ']').show();
	}
}

function refreshInput(input){

	if($(input).prop('name') == "start"){
		if($(input).val() != ''){
			var dt_input = new Date($(input).val());
			var dt_atual = new Date();

			if (dt_atual > dt_input){
				input.setCustomValidity("Start date must be higher than now");
			} else {
				input.setCustomValidity("");
			}
		}
	}

	if($(input).prop('name') == "end"){
		if($(input).val() != ''){
			if ($('input[name="start"]').val() != ''){
				var dt_end = new Date($(input).val());
				var dt_start = new Date($('input[name="start"]').val());

				if (dt_start > dt_end){
					input.setCustomValidity("End date must be higher than start date");
				} else {
					input.setCustomValidity("");
				}
			} else{
				input.setCustomValidity("Fill start date before the end date");
			}
		}
	}

	if ($(input).prop('type') == 'password'){
			$(input).parent().addClass('has-feedback').removeClass('has-success').addClass('has-error');
		if (password_control.validatePassword(input)){
			$(input).parent().addClass('has-feedback').removeClass('has-error').addClass('has-success');
		}
	}
	else if (input.checkValidity() == false){
		if($('.input_error[for="' + $(input).prop('id') + '"]').length == 0){
			$(input).parent().addClass('has-feedback').removeClass('has-success').addClass('has-error');
			$(input).parent().find('.notify').remove();
			$(input).parent().append('<span class="notify glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			$(input).parent().after('<div class="input_error" for="' + $(input).prop('id') + '">' + $(input)[0].validationMessage + '</div>');
		}
	}
	else {
		if($(input).val().length > 0){
			$(input).parent().addClass('has-feedback').removeClass('has-error').addClass('has-success');
			$(input).parent().find('.notify').remove();
			$(input).parent().append('<span class="notify glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
		} $('.input_error[for="' + $(input).prop('id') + '"]').remove();
	}


	refreshProgress();
}

function getSavedEvents(){
	var saved_events = JSON.parse(localStorage.getItem('events'));

	if (saved_events === null || (Array.isArray(saved_events) && saved_events.length == 3))
		saved_events = [
							{
								name: 'Jonas Bday!',
								eventType: 'Birthday',
								host: 'Jonas Apartment',
								guestlist: 'Adrian, Maila, Carla..',
								start: '2016-08-18T20:00',
								end: '2016-08-18T23:00',
								additionalinfo: ''
							},
							{
								name: 'Mobile Conference',
								eventType: 'Conference',
								host: 'Hilton Hotel',
								guestlist: 'Mr. Carlos, Mr Pepper, Domenico..',
								start: '2016-08-18T23:00',
								end: '2016-08-19T01:00',
								additionalinfo: 'Bring your invite for access'
							},
							{
								name: 'Juliana and Marc Marriage!',
								eventType: 'Wedding',
								host: 'Angels Church',
								guestlist: 'Julien, Alberto, Peter..',
								start: '2016-08-18T16:00',
								end: '2016-08-18T20:00',
								additionalinfo: ''
							}
						];

	return saved_events;
}

function refreshProgress(){
	var step = 100 / $('input:not([type="submit"])').length;
	var now = ( $('.form-group.has-success').length ) * step;
	var perc_now = now + '%';

	$('[role="progressbar"]').css('width',perc_now);
	$('[role="progressbar"]').html(perc_now);

	if (now == 100)
		$('input[type="submit"]').removeAttr('disabled');
}

function findLocation(pos){
	var crd = pos.coords;

	$.get({
		url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + crd.latitude + ',' + crd.longitude + '&key=' + api_key,
		crossDomain: true,
		dataType: 'json',
		headers: {
	        'Access-Control-Allow-Origin': '*'
	    },
		success: function(data){
			var location = data.results[0].name;
			$('input[name="location"]').val(location);
			refreshInput($('input[name="location"]')[0]);
		}
	});
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};
