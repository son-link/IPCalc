var ipregex = /^[\d]{2,3}[.][\d]{1,3}[.][\d]{1,3}[.][\d]{1,3}$/;
var ipbinregex = /^[0-1]{8}[.][0-1]{8}[.][0-1]{8}[.][0-1]{8}$/;
var submaskregex = /^255[.][0-9]{1,3}[.][0-9]{1,3}[.][0-9]{1,3}$/
var ipbin;
var submaskbin;

function dec2bin (dec) {
	return Number(dec).toString(2);
}
function bin2dec(bin) {
	return String(parseInt(bin, 2));
}
function check_ip(){
	ipbin = ''
	if ($('#ip').val().match(ipregex)){
		$('#ip').css('border-color', '');
		ips = $('#ip').val().split('.')
		$.each(ips, function(indice, valor){
			bin = dec2bin(valor);
			if (bin.toString().length < 8){
				ceros = 8 - bin.toString().length;
				for (i = 0; i < ceros; i++){
					bin = '0' + bin;
				}
			}
			ipbin += '.'+bin;
		});
		ipbin = ipbin.substr(1);
	}else if($('#ip').val().match(ipbinregex)){
		$('#ip').css('border-color', '');
		ipbin = $('#ip').val();
	}else{
		$('#ip').css('border-color', 'red');
		return false;
	}
}
function check_submask(){
	submaskbin = ''
	if ($('#snmask-decimal').val().match(submaskregex)){
		$('#snmask-decimal').css('border-color', '');
		masks = $('#snmask-decimal').val().split('.')
		$.each(masks, function(indice, valor){
			bin = dec2bin(valor);
			if (bin.toString().length < 8){
				ceros = 8 - bin.toString().length;
				for (i = 0; i < ceros; i++){
					bin = '0' + bin;
				}
			}
			submaskbin += '.'+bin;
		});
		submaskbin = submaskbin.substr(1);
		n = 0;
		sn = submaskbin.replace(/[.]/g, '');
		for (i=0; i<= sn.length; i++){
			if (sn[i] == '1'){
				n++;
			}else{
				break;
			}
		}
		$('#snmask-bits').val(n);
	}else{
		$('#snmask-decimal').css('border-color', 'red');
	}
}
$(document).ready(function(){
	$("form").submit(function(e){
		e.preventDefault();
	});
	$('#ip').keyup(function(){
		check_ip();
	});
	$('#snmask-decimal').keyup(function(){
		check_submask();
	});
	$('#snmask-bits').change(function(){
		bites = Number($(this).val());
		bits = '';
		for (i=0; i<32; i++){
			if (i < bites){
				bits += '1';
			}else{
				bits += '0';
			}
		}
		console.log(bits.substr(0,8));
		snmask = bin2dec(bits.substr(0,8))+'.'+bin2dec(bits.substr(8,8))+'.'+bin2dec(bits.substr(16,8))+'.'+bin2dec(bits.substr(24,8));
		$('#snmask-decimal').val(snmask);
	});
	$('#calcular').click(function(){
		check_ip();
		check_submask();
		if (ipbin){
			ip = ipbin.replace(/[.]/g, '');
			sn = submaskbin.replace(/[.]/g, '');
			netip = '';
			broadcast = '';
			for (i=0; i<32; i++){
				if (ip[i] == '1' && sn[i] == '1'){
					netip += '1';
				}else{
					netip += '0';
				}
			}
			netipdec = bin2dec(netip.substr(0,8))+'.'+bin2dec(netip.substr(8,8))+'.'+bin2dec(netip.substr(16,8))+'.'+bin2dec(netip.substr(24,8));
			rangefrom = bin2dec(netip.substr(0,8))+'.'+bin2dec(netip.substr(8,8))+'.'+bin2dec(netip.substr(16,8))+'.'+bin2dec(Number(netip.substr(24,8))+1);
			$('#net').text(netipdec)
			bites = Number($('#snmask-bits').val());
			bin2='';
			for (i=0; i <32; i++){
				if (i<=bites-1){
					broadcast += netip[i];
				}else{
					broadcast += '1';
				}
			}
			console.log(bin2.length);
			console.log(netip+' => '+broadcast);
			broadcastdec = bin2dec(broadcast.substr(0,8))+'.'+bin2dec(broadcast.substr(8,8))+'.'+bin2dec(broadcast.substr(16,8))+'.'+bin2dec(broadcast.substr(24,8));
			console.log(broadcastdec);
			rangeto = bin2dec(broadcast.substr(0,8))+'.'+bin2dec(broadcast.substr(8,8))+'.'+bin2dec(broadcast.substr(16,8))+'.'+bin2dec(Number(broadcast.substr(24,8))-1);
			$('#range').text(rangefrom+' / '+rangeto);
			$('#broadcast').text(broadcastdec);
			$('#hosts').text(Math.pow(2,32-bites)-2);
			if ($('#ip').val().match(ipregex)){
				$('#ip-conv').text(ipbin);
			}else{
				$('#ip-conv').text(bin2dec(ipbin.substr(0,8))+'.'+bin2dec(ipbin.substr(9,8))+'.'+bin2dec(ipbin.substr(18,8))+'.'+bin2dec(ipbin.substr(27,8)))
			}
		}
	});
	for (i=1; i<=32; i++){
		if (i == 8){
			$('#snmask-bits').append('<option selected>'+i+'</option>');
		}else{
			$('#snmask-bits').append('<option>'+i+'</option>');
		}
	}
	$("label[for='ip']").text(_("IP (decimal or binary)"));
	$("label[for='snmask-decimal']").text(_("Subnet mask (or use select for bytes)"));
	$("#calcular").text(_("Calculate"));
	$('#net-txt').text(_("Net IP"));
	$('#host-range').text(_("Host range"));
	$('#hosts-txt').text(_("Number of host for subnet"));
})
