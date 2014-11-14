Tracker.autorun(function(){
	Meteor.subscribe('candidates', Session.get('querystring'));
});

Template.search.helpers({
	'candidates':function(){
		return candidates.find()
	},
	'settings':function(){
		return {
            rowsPerPage: 50,
            showFilter: true,
            fields: [
			    { key: 'profile.login', label: 'Username', fn:function(value, object){ return new Spacebars.SafeString('<a href="'+object.profile.html_url+'" target="_blank">'+value+'</a>')}},
			    { key: 'profile.name', label: 'Name' },
			    { key: 'profile.company', label: 'Company' },
			    { key: 'profile.email', label:'Email', fn:function(val){return new Spacebars.SafeString('<a href="mailto:'+value+'">'+value+'</a>')}},
			    { key: 'profile.location', label: 'Location' },
			    { key: 'profile.bio', label: 'Bio' },
			    { 
			    	key: 'profile.public_repos', 
			    	label: 'Repos',
			    	sort: 'descending'
			    },
			    { 
			    	key: 'profile.followers', 
			    	label: 'Followers'
			    }
			]
        };
	}
});