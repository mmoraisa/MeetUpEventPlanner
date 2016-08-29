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
});