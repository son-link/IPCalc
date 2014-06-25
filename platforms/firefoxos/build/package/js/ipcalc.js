var ipregex = /^[\d]{2,3}[.][\d]{1,3}[.][\d]{1,3}[.][\d]{1,3}$/;
var ipbinregex = /^[0-1]{8}[.][0-1]{8}[.][0-1]{8}[.][0-1]{8}$/
function pad (str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
}
$(document).ready(function(){
	$("form").submit(function(e){
		e.preventDefault();
	});
	$('#ip').keyup(function(){
		ipbin = ''
		if ($(this).val().match(ipregex)){
			$(this).css('border-color', '');
			ips = $(this).val().split('.')
			$.each(ips, function(indice, valor){
				bin = Number(valor).toString(2);
				console.log(bin.toString().length);
				if (bin.toString().length < 8){
					console.log(8 - bin.toString().length);
					ceros = 8 - bin.toString().length;
					for (i = 0; i < ceros; i++){
						bin = '0' + bin;
					}
				}
				ipbin += '.'+bin;
			});
			ipbin = ipbin.substr(1);
		}else if($(this).val().match(ipbinregex)){
			$(this).css('border-color', '');
			ipbin = $(this).val();
			console.log(ipbin);
		}else{
			$(this).css('border-color', 'red');
		}
	});
	$('#calcular').click(function(){
		nmbin = '';
		console.log($('#snmask-bits').val());
		for (i=1; i<32; i++){
			if (i <= Number($('#subnetmask').val())){
				nmbin += '1';
			}else{
				nmbin += '0';
			}
		}
		console.log(nmbin);
	});
	for (i=8; i<=32; i++){
		$('#snmask-bits').append('<option>'+i+'</option>');
	}
})
