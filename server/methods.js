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
		console.log(url);
		console.log(token);
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
						candidates.insert(ooo);
					};
				});
			});
			var zzy ={}; 
			if (xy && xy.headers && xy.headers.link){
				xy.headers.link.split(',').map(function(a){return a.split(";").map(function(b){b = b.replace('<','').replace('>','').replace('rel=','').replace(/"/g,''); return b.trim()})}).map(function(a){zzy[a[1]]=a[0]});	
			};
			if(zzy["next"] && zzy["next"] != ""){
				Meteor.call('callGithub', zzy["next"]);
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