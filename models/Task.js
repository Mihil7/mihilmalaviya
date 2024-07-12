const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    //bonus add
    dependencies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
});

module.exports = mongoose.model('Task', TaskSchema);
