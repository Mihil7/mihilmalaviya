const Project = require('../models/Project');

exports.createProject = async (req, res) => {
    const { title, description, startDate, endDate } = req.body;

    try {
        const newProject = new Project({
            title,
            description,
            startDate,
            endDate,
            user: req.user.id,
        });

        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateProject = async (req, res) => {
    const { title, description, startDate, endDate } = req.body;

    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        project = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, startDate, endDate } },
            { new: true }
        );

        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteProject = async (req, res) => {
    try {
        let project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        if (project.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
