function cidrtoipv4(cidrValues){
	var finalIPList = [["cidr", "starting ip", "ending ip"]];
	for(var p=0;p<cidrValues.length;p++){
		var cidr = cidrValues[p];
		var iprange = cidr.split('/')[0];
		var subnetbits = cidr.split('/')[1];
		if(validateCIDR(iprange, subnetbits)){
			var numHostBits = 32 - parseInt(subnetbits);
			var ipParts = iprange.split('.');
			var ipPartsBinary = ipParts.map(function(x){
				var r = parseInt(x,10).toString(2);
				var l = r.length;
				for(var i=0;i<(8-l);i++){
					r = "0"+r;
				}
				return r;
			});
			var fullBinaryIp = ipPartsBinary.join('');
			var networkIdBinary = "";
			var broadcastIdBinary = "";
			for(var i=0;i<32;i++){
				if(i<subnetbits){
					networkIdBinary += fullBinaryIp.charAt(i);
					broadcastIdBinary += fullBinaryIp.charAt(i);
				}else{
					networkIdBinary += "0";
					broadcastIdBinary += "1"
				}
			}
			networkIdParts = networkIdBinary.match(/.{1,8}/g);
			broadcastIdParts = broadcastIdBinary.match(/.{1,8}/g);
			var networkId = networkIdParts.map(function(x){
				return parseInt(x,2);
			});
			networkId = networkId.join('.');
			var broadcastId = broadcastIdParts.map(function(x){
				return parseInt(x,2);
			});
			broadcastId = broadcastId.join('.');
			finalIPList.push([cidr,networkId, broadcastId]);
		}else{
			finalIPList.push([cidr,"Invalid CIDR"]);
		}	
	}	
	var csvContent = "data:text/csv;charset=utf-8," + finalIPList.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	link.setAttribute("style", "display:none;")
	document.body.appendChild(link); // Required for FF

	link.click();
	link.remove();
}

function validateCIDR(iprange, subnetbits){
	if(typeof subnetbits == "undefined" || subnetbits<0 || subnetbits>32){
		return false;
	}
	var splitIpRange = iprange.split('.');
	for(var z=0;z<splitIpRange.length;z++){
		if(parseInt(splitIpRange[z])<0 || parseInt(splitIpRange[z])>255){
			return false;
			break;
		}
	}
	return true;
}