const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, projectId, assignedTo, dependencies } = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            project: projectId,
            assignedTo,
            dependencies //bonus
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo, dependencies } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'project_manager') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const taskFields = {};
        if (title) taskFields.title = title;
        if (description) taskFields.description = description;
        if (dueDate) taskFields.dueDate = dueDate;
        if (priority) taskFields.priority = priority;
        if (assignedTo) taskFields.assignedTo = assignedTo;
        if (dependencies) taskFields.dependencies = dependencies;  //bonus

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ msg: 'Task not found' });
        }

        if (task.assignedTo.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'project_manager') {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
