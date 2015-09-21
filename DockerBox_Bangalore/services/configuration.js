
module.exports = {
	config : require('../secrets.json'),
	GLOBAL : {
		db : 'http://db:5984',
		registry : 'registry:5000',
		elbAdmin : 'http://elb:9090'
	}
}