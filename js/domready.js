$(document).ready(function(){
	//CIDR to IPv4 Converter click event
	$('#cidrConvert').click(function(){
		var cidrValues = $('#cidrRange').val();
		cidrValues = cidrValues.split(/\n|\,|\t/g);
		cidrtoipv4(cidrValues);
	})
});