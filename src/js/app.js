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
					+ '		<h4 style="margin-top:20px;">' + decodeURI(saved_events[i].name) + '</h3>'
					+ '		<hr>'
					+ '		<p style="text-align:left"><strong>Event Type:</strong> ' + decodeURI(saved_events[i].eventType) + '</p>'
					+ '		<p style="text-align:left"><strong>Host:</strong> ' + decodeURI(saved_events[i].host) + '</p>'
					+ '		<p style="text-align:left"><strong>Start:</strong> ' + saved_events[i].start.substr(0,10) + '</p>'
					+ '		<p style="text-align:left"><strong>End:</strong> ' + saved_events[i].end.substr(0,10) + '</p>'
					+ '	</div>'
					+ '</div>'
		$('#eventsList').append(event);

	}

});

function refreshInput(input){
	if (input.checkValidity() == false){
		if($('.input_error[for="' + $(input).prop('id') + '"]').length == 0){
			$(input).parent().addClass('has-feedback').removeClass('has-success').addClass('has-error');
			$(input).parent().find('.notify').remove();
			$(input).parent().append('<span class="notify glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
			$(input).parent().after('<div class="input_error" for="' + $(input).prop('id') + '">' + $(input)[0].validationMessage + '</div>');
		}
	}
	else{
		if($(input).val().length > 0){
			$(input).parent().addClass('has-feedback').removeClass('has-error').addClass('has-success');
			$(input).parent().find('.notify').remove();
			$(input).parent().append('<span class="notify glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
		}$('.input_error[for="' + $(input).prop('id') + '"]').remove();
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
	var step = 100 / $('.form-group').length;
	var now = ( $('.form-group.has-success').length ) * step;
	var perc_now = now + '%';

	$('[role="progressbar"]').css('width',perc_now);
	$('[role="progressbar"]').html(perc_now);
}

function findLocation(pos){
	var crd = pos.coords;

	var api_key = 'AIzaSyCt6if5rk77ZOAvCksNwcVjZtAIaUlQ9EM';

	$.get({
		url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + crd.latitude + ',' + crd.longitude + '&key=' + api_key,
		crossDomain: true,
		dataType: 'json',
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