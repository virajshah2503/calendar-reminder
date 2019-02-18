let express = require('express');
let router = express.Router();

let reminder_controller = require('../controllers/controller_reminder');

router.post('/add', reminder_controller.reminder_add);

router.put('/edit/:id', reminder_controller.reminder_edit);

router.delete('/delete/:id', reminder_controller.reminder_delete);

router.get('/fetch/:startDate/:endDate',reminder_controller.reminder_fetch);

module.exports = router;