let mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let logEntrySchema = new Schema({
    type_error: String,
	date: Date,
    action: String,
    description: String
});

let logEntry= mongoose.model('LogEntry', logEntrySchema);

module.exports = logEntry;