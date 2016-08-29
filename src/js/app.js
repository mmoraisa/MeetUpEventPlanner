$(document).ready(function(){
	console.log('-- jQuery OK --');

	$('input').each(function(){
		this.onblur = function(){
			if (this.checkValidity() == false){
				if($('.input_error[for="' + $(this).prop('id') + '"]').length == 0){
					$(this).parent().after('<div class="input_error" for="' + $(this).prop('id') + '">' + $(this)[0].validationMessage + '</div>');
					$(this).focus();
				}
			}
			else
				$('.input_error[for="' + $(this).prop('id') + '"]').remove();
		};
	});

	$('form[name="createEvent"]').unbind('submit').on('submit',function(){

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
});