#!/usr/bin/env node
const epics = {
	'EMW-240'	: { initiative : '001. DataCollection MVP' },
	'EMW-477' : { initiative : '001. DataCollection MVP' },
	'EMW-476' : { initiative : '001. DataCollection MVP' },
	'EMW-142' : { initiative : '001. DataCollection MVP' },
	'EMW-150' : { initiative : '001. DataCollection MVP' },
	'EMW-69' 	: { initiative : '001. DataCollection MVP' },
	'EMW-270' : { initiative : '001. DataCollection MVP' },

	//UAT 2
	'EMW-497' : { initiative : '003. Analytics MVP' },
	'EMW-495' : { initiative : '003. Analytics MVP' },
	'EMW-220' : { initiative : '003. Analytics MVP' },
	'EMW-66' 	: { initiative : '003. Analytics MVP' },
	'EMW-245' : { initiative : '003. Analytics MVP' },
	'EMW-530' : { initiative : '003. Analytics MVP' },
	'EMW-389' : { initiative : '003. Analytics MVP' },
	'EMW-623' : { initiative : '003. Analytics MVP' },
	'EMW-595' : { initiative : '003. Analytics MVP' },
	
	//UAT 3
	'EMW-243' : { initiative : '003. Analytics MVP' },
	'EMW-585' : { initiative : '003. Analytics MVP' },
	
	//UAT 4
	'EMW-552' : { initiative : '003. Analytics MVP' },
	'EMW-578' : { initiative : '003. Analytics MVP' },
	'EMW-516' : { initiative : '003. Analytics MVP' },
	'EMW-218' : { initiative : '003. Analytics MVP' },
	'EMW-586' : { initiative : '003. Analytics MVP' },
	
	'EMW-489' : { initiative : 'Matterport' },

	'EMW-604' : { initiative : 'Clearstream' },
	'EMW-434' : { initiative : 'Production Readiness' },

	'EMW-693' : { initiative : '001. DataCollection MVP' },

}

const search = require('jira-search')
const _ = require('lodash')
const csv = require('fast-csv')
const path = require('path')

const auth = process.env.REAMS_JIRA_AUTH ? process.env.REAMS_JIRA_AUTH.split(':') : null;

// console.log('includes', _.includes([1, 2, 3], 1))
// process.exit()
const opts = {
  serverRoot: 'https://reams-elias.atlassian.net', // the base URL for the JIRA server
  jql: 'project=EMW AND issuetype != Epic', // the JQL
  // jql : 'key IN (EMW-859)', //,EMW-843,EMW-200,EMW-260
  fields: '*all', // the fields parameter for the JIRA search
  // expand: 'changelog', // the expand parameter for the JIRA search
  maxResults: 50, // the maximum number of results for each request to JIRA, multiple requests will be made till all the matching issues have been collected
  onTotal (total) {
  	console.log('onTotal', total)
    // optionally initialise a progress bar or something
  },
  mapCallback (issue) {
  	console.log('mapCallback', issue.key)
  	// console.log('mapCallback', issue)
  	// console.log('mapCallback', issue.fields['customfield_10115'])
  	// console.log('mapCallback', issue.fields['customfield_10115'].length)
  	// console.log('mapCallback', issue.fields['customfield_10115'][0])

  	var sprintPattern = /,name=(.*?),.*sequence=(.*)]/;
  	var sprint

  	if (issue.fields['customfield_10115'] && issue.fields['customfield_10115'].length > 0) {

  		var sprints = _.map(issue.fields['customfield_10115'], sprintText => {
	  		// console.log(sprintText)
	  		var res = sprintText.match(sprintPattern)
	  		if (!res) return;
	  		return { sprint : res[1], sequence : res[2] }
	  	})

	  	// console.log('sprints', sprints)

	  	sprints = _.sortBy(sprints, 'sequence')

	  	sprint = _.last(sprints)

	  	// console.log('sprint', sprint)
  	}

  	// console.log('mapCallback', issue.fields.description)
  	// console.log('mapCallback', issue.fields.summary)
    // This will be called for each issue matching the search.
    // Update a progress bar or something if you want here.
    // The return value from this function will be added
    // to the array returned by the promise.
    // If omitted the default behaviour is to add the whole issue

    // description : issue.fields.description, 
    return { key : issue.key, summary : issue.fields.summary, points : issue.fields.customfield_10203, parent : issue.fields.parent ? issue.fields.parent.key : null, status : issue.fields.status.name, labels : issue.fields.labels.join(':'), created: issue.fields.created, issueType: issue.fields.issuetype.name,
    	resolved : issue.fields.resolutiondate, assignee : issue.fields.assignee ? issue.fields.assignee.displayName : null,
    	sprint : sprint ? sprint.sprint : null };
  }
}

if (auth) {
	opts.user = auth[0] // the user name
  opts.pass = auth[1] // the password
}

// console.log(opts)

search(opts).then((issues) => {
  // consume the collected issues array here
  // r
  console.log('Done', _.size(issues))

  const filtered = _.filter(issues, issue => epics[issue.parent]).map(issue => _.extend(issue, epics[issue.parent]))

  console.log('Filtered', _.size(filtered))

	csv.writeToPath(path.resolve(__dirname, 'jira-issues.csv'), filtered, { headers: true})
	    .on('error', err => console.error(err))
	    .on('finish', () => console.log('Done writing.'));

}).done();

