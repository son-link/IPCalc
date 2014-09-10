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
function create_node(tag, text){
	node=document.createElement(tag);
	textnode=document.createTextNode(text);
	node.appendChild(textnode);
	document.getElementById("myList").appendChild(node);
}
function check_ip(){
	ipbin = ''
	if (document.getElementById('ip').value.match(ipregex)){
		document.getElementById('ip').style.borderColor = '';
		ips = document.getElementById('ip').value.split('.')
		ips.forEach(function(valor) {
			bin = dec2bin(valor);			if (bin.toString().length < 8){
				ceros = 8 - bin.toString().length;
				for (i = 0; i < ceros; i++){
					bin = '0' + bin;
				}
			}
			ipbin += '.'+bin;
		});
		ipbin = ipbin.substr(1);
	}else if(document.getElementById('ip').value.match(ipbinregex)){
		document.getElementById('ip').style.borderColor = ''
		ipbin = document.getElementById('ip').value;
	}else{
		document.getElementById('ip').style.borderColor = 'red';
		return false;
	}
}
function check_submask(){
	submaskbin = ''
	if (document.getElementById('snmask-decimal').value.match(submaskregex)){
		document.getElementById('snmask-decimal').style.borderColor = '';
		masks = document.getElementById('snmask-decimal').value.split('.')
		masks.forEach(function(valor){
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
		document.getElementById('snmask-bits').value = n;
	}else{
		document.getElementById('snmask-decimal').style.borderColor = 'red';
	}
}
document.addEventListener('DOMContentLoaded', function(){
	document.getElementById('form').addEventListener('submit', function(e){
		e.preventDefault();
	});
	document.getElementById('ip').addEventListener('keyup', function(){
		check_ip();
	});
	document.getElementById("snmask-decimal").addEventListener("keyup", function(){
		check_submask();
	});
	document.getElementById("snmask-bits").addEventListener("change", function(){
		bites = Number($(this).val());
		bits = '';
		for (i=0; i<32; i++){
			if (i < bites){
				bits += '1';
			}else{
				bits += '0';
			}
		}
		snmask = bin2dec(bits.substr(0,8))+'.'+bin2dec(bits.substr(8,8))+'.'+bin2dec(bits.substr(16,8))+'.'+bin2dec(bits.substr(24,8));
		document.getElementById('snmask-decimal').value = snmask;
	});
	document.getElementById("calcular").addEventListener("click", function(){
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
			document.getElementById('net').innerHTML = netipdec;
			bites = Number(document.getElementById('snmask-bits').value);
			bin2='';
			for (i=0; i <32; i++){
				if (i<=bites-1){
					broadcast += netip[i];
				}else{
					broadcast += '1';
				}
			}
			broadcastdec = bin2dec(broadcast.substr(0,8))+'.'+bin2dec(broadcast.substr(8,8))+'.'+bin2dec(broadcast.substr(16,8))+'.'+bin2dec(broadcast.substr(24,8));
			rangeto = bin2dec(broadcast.substr(0,8))+'.'+bin2dec(broadcast.substr(8,8))+'.'+bin2dec(broadcast.substr(16,8))+'.'+bin2dec(Number(broadcast.substr(24,8))-1);
			document.getElementById('range').innerHTML = rangefrom+' / '+rangeto;
			document.getElementById('broadcast').innerHTML = broadcastdec;
			document.getElementById('hosts').innerHTML = Math.pow(2,32-bites)-2;
			if (document.getElementById('ip').value.match(ipregex)){
				document.getElementById('ip-conv').innerHTML = ipbin;
			}else{
				document.getElementById('ip-conv').innerHTML = bin2dec(ipbin.substr(0,8))+'.'+bin2dec(ipbin.substr(9,8))+'.'+bin2dec(ipbin.substr(18,8))+'.'+bin2dec(ipbin.substr(27,8));
			}
		}
	});
	for (i=1; i<=32; i++){
		node=document.createElement('option');
		textnode=document.createTextNode(i);
		node.appendChild(textnode);
		document.getElementById('snmask-bits').appendChild(node);
		if ( i == 8) document.getElementById('snmask-bits').value = i;
	}
	document.querySelectorAll("label[for='ip']").innerHTML = _("IP (decimal or binary)");
	document.querySelector("label[for='snmask-decimal']").innerHTML = _("Subnet mask (or use select for bytes)");
	document.getElementById("calcular").innerHTML = _("Calculate");
	document.getElementById('net-txt').innerHTML = _("Net IP");
	document.getElementById('host-range').innerHTML = _("Host range");
	document.getElementById('hosts-txt').innerHTML = _("Number of host for subnet");
})
