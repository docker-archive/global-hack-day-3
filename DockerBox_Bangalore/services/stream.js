
var collection = {};

module.exports = {
	create : function (argument) {
		var id = 'stream_' + Date.now();
		collection[id] = {
			id : id,
			data : ''
		};
		return collection[id];
	},
	remove : function (streamObj) {
		delete collection[streamObj.id];
	},
	get : function (id) {
		return collection[id];
	}
}