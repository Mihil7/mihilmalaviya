const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const taskController = require('../controllers/taskController');

// Create a task
router.post(
    '/',
    [
        authMiddleware,
        roleMiddleware(['admin', 'project_manager']),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('dueDate', 'Due date is required').isDate(),
            check('priority', 'Priority is required').not().isEmpty(),
        ],
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        taskController.createTask(req, res);
    }
);

// Get all tasks for a project
router.get('/:projectId', authMiddleware, taskController.getTasks);

// Update a task
router.put(
    '/:id',
    [
        authMiddleware,
        roleMiddleware(['admin', 'project_manager']),
        [
            check('title', 'Title is required').not().isEmpty(),
            check('dueDate', 'Due date is required').isDate(),
            check('priority', 'Priority is required').not().isEmpty(),
        ],
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        taskController.updateTask(req, res);
    }
);

// Delete a task
router.delete('/:id', [authMiddleware, roleMiddleware(['admin', 'project_manager'])], taskController.deleteTask);

module.exports = router;
