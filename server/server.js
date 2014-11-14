Meteor.startup(function(){
	// ServiceConfiguration.configurations.remove({
	//   service: "github"
	// });
	if (ServiceConfiguration.configurations.find().count() === 0){
		ServiceConfiguration.configurations.insert({
		  service: "github",
		  clientId: "815c4123a7e67eab67d2",
		  loginStyle: "popup",
		  secret: "11f730ceda719ca6b65e9b12c7bcf71d2c95e07f"
		});
	};
});

Router.route('/test', function(){
	 // NodeJS request object
	  var request = this.request;

	  // NodeJS  response object
	  var response = this.response;

	var j = Meteor.call('testcall');
	console.log(j);
	return response.end(j);
}, {where:'server'});