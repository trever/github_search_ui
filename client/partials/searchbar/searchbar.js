Template.searchbar.events({
	'click .tag':function(){
		$('#searcharea').toggleClass('closed');
	},
	'click [rm-action="search"]':function(){
		var q = [{
				val: $("#query").val(),
				param: "q=",
				required:true
			},{
				param: 'type:',
				val: $("#type").val()
			},{
				param: 'in:',
				val: $("#in").val()
			},{
				param:'location:',
				val: $('#location').val()
			},{
				param:'language:',
				val:$('#language').val()
			},{
				param:'repos:',
				val: ($('#repos_operator').val() && $("#repos_count").val()) ? $('#repos_operator').val() + $("#repos_count").val() : null
			},{
				param: 'followers:',
				val: ($('#followers_operator').val() && $('#followers_count').val()) ? $('#followers_operator').val() + $('#followers_count').val() : null
			}
		];
		var querystring = "";
		q.map(function(a){
			if (a.required){
				querystring = querystring + a.param + (a.val ? a.val : " ");
			} else {
				if (a.val){
					querystring += "+" + a.param + a.val;
				}
			};
		});
		$('#searcharea').toggleClass('closed');
		$('#loading').fadeIn();
		Session.set('querystring', querystring.replace(/\"/g, ""));
		Meteor.call('github.search.user', querystring, function(e,r){
			if (!e){
				if(!r.message){
					$("#loading").fadeOut();
				} else {
					alert(r.message);
					console.log("R", r);
				};
			} else {
				console.log("E", e);
				alert(e.message);
			};
		})
	}
});

Template.searchbar.rendered = function(){
	$('.select2').select2();
}