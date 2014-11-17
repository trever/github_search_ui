var Base64 = {
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = Base64._utf8_encode(input);

	    while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	            enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	            enc4 = 64;
	        }

	        output = output +
	        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
	        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

	    }

	    return output;
	},

	// public method for decoding
	decode : function (input) {
	    var output = "";
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0;

	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	    while (i < input.length) {

	        enc1 = this._keyStr.indexOf(input.charAt(i++));
	        enc2 = this._keyStr.indexOf(input.charAt(i++));
	        enc3 = this._keyStr.indexOf(input.charAt(i++));
	        enc4 = this._keyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output = output + String.fromCharCode(chr1);

	        if (enc3 != 64) {
	            output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 != 64) {
	            output = output + String.fromCharCode(chr3);
	        }

	    }

	    output = Base64._utf8_decode(output);

	    return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
	    string = string.replace(/\r\n/g,"\n");
	    var utftext = "";

	    for (var n = 0; n < string.length; n++) {

	        var c = string.charCodeAt(n);

	        if (c < 128) {
	            utftext += String.fromCharCode(c);
	        }
	        else if((c > 127) && (c < 2048)) {
	            utftext += String.fromCharCode((c >> 6) | 192);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }
	        else {
	            utftext += String.fromCharCode((c >> 12) | 224);
	            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	            utftext += String.fromCharCode((c & 63) | 128);
	        }

	    }

	    return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
	    var string = "";
	    var i = 0;
	    var c = c1 = c2 = 0;

	    while ( i < utftext.length ) {

	        c = utftext.charCodeAt(i);

	        if (c < 128) {
	            string += String.fromCharCode(c);
	            i++;
	        }
	        else if((c > 191) && (c < 224)) {
	            c2 = utftext.charCodeAt(i+1);
	            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	            i += 2;
	        }
	        else {
	            c2 = utftext.charCodeAt(i+1);
	            c3 = utftext.charCodeAt(i+2);
	            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	            i += 3;
	        }

	    }

	    return string;
	}

};
Meteor.methods({
	'github.search.user':function(qs){
		if (!Meteor.user()){
			return {message: 'No Authed User'}
		};
		if (!qs){
			return {message: "No Query String"}
		};
		var oooo = qs;
		var user = Meteor.user();
		var token = user.services.github.accessToken;
		qs += "&per_page=100&access_token=" + token;
		
		// console.log("QS", qs);
		Meteor.call('callGithub', 'https://api.github.com/search/users?'+qs, oooo);	
		return {}
	},
	'callGithub':function(url, qs){
		var user = Meteor.user();
		var token = user.services.github.accessToken;
		qs = Base64.encode(qs);
		candidates.remove({'qs':qs});
		// console.log(url);
		// console.log(token);
		try{
			var xy = HTTP.get(url, {
				headers:{
					"User-Agent":"GitHub User Search"
				}
			});
			// console.log("Successful Call", xy);
		} catch(e){
			console.log("Caught Error", e);
			return {message: e.message, error: e}
		};
		if (xy && xy.statusCode === 200){
			xy.data.items.map(function(a){
				var id = a.login;
				HTTP.get('https://api.github.com/users/' + id + "?access_token="+token, {
					headers:{
						"User-Agent":"GitHub User Search"
					}
				},function(e,r){
					if (e){
						console.log("Error in the /user", e);
						throw new Error('Error in the /user');
					};
					if (r && r.data){
						var ooo = {};
						ooo.qs = qs;
						ooo.ids = {
							user: Meteor.userId()
						};
						ooo.profile = r.data;
						console.log("New Candidate", r.data);
						candidates.insert(ooo);
					};
				});
			});
			var zzy ={}; 
			if (xy && xy.headers && xy.headers.link){
				xy.headers.link.split(',').map(function(a){return a.split(";").map(function(b){b = b.replace('<','').replace('>','').replace('rel=','').replace(/"/g,''); return b.trim()})}).map(function(a){zzy[a[1]]=a[0]});	
			};
			if(zzy["next"] && zzy["next"] != ""){
				console.log("Another Page");
				return Meteor.call('callGithub', zzy["next"]);
			} else {
				return {}
			};
		};
	},
	'testcall':function(){
		var token = Meteor.user().services.github.accessToken;
		var j = HTTP.get('https://api.github.com/search/users?q=tom+in%3Ausername%2Cfull_name', {
			auth:token + ":x-oauth-basic",
			headers:{
				"User-Agent":"GitHub User Search"
			}
		});
		return j
	}
})