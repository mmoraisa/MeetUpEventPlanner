$(document).ready(function(){

	var saved_events = getSavedEvents();

	$('input').each(function(){
		this.onblur = function(){
			if (this.checkValidity() == false){
				if($('.input_error[for="' + $(this).prop('id') + '"]').length == 0){
					$(this).parent().addClass('has-feedback').removeClass('has-success').addClass('has-error');
					$(this).parent().find('.notify').remove();
					$(this).parent().append('<span class="notify glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
					$(this).parent().after('<div class="input_error" for="' + $(this).prop('id') + '">' + $(this)[0].validationMessage + '</div>');
				}
			}
			else{
				if($(this).val().length > 0){
					$(this).parent().addClass('has-feedback').removeClass('has-error').addClass('has-success');
					$(this).parent().find('.notify').remove();
					$(this).parent().append('<span class="notify glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
				}$('.input_error[for="' + $(this).prop('id') + '"]').remove();
			}

			refreshProgress();
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