const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const projectController = require('../controllers/projectController');

// Create a project
router.post(
    '/',
    [
        authMiddleware,
        roleMiddleware(['admin', 'project_manager']),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('startDate', 'Start date is required').isDate(),
            check('endDate', 'End date is required').isDate(),
        ],
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        projectController.createProject(req, res);
    }
);


// Get all projects
router.get('/', authMiddleware, projectController.getProjects);

// Update a project
router.put(
    '/:id',
    [
        authMiddleware,
        roleMiddleware(['admin', 'project_manager']),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('startDate', 'Start date is required').isDate(),
            check('endDate', 'End date is required').isDate(),
        ],
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        projectController.updateProject(req, res);
    }
);


// Delete a project
router.delete('/:id', [authMiddleware, roleMiddleware(['admin', 'project_manager'])], projectController.deleteProject);

module.exports = router;
