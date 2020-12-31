let router = require('express').Router();
var incidnetController = require('./controllers/incidentController');

router.get('/', function (req, res) {
    res.json({
        status: 'API is up and running...',
        message: 'Welcome to 311 Chicago IL indicents.',
        endpoints:  {
            RETRIEVE_ALL: 'http://localhost:8080/api/incidents',
            RETRIEVE_BY_ID: 'http://localhost:8080/api/incidents/:id',
            CREATE: 'http://localhost:8080/api/incidents',
            UPDATE: 'http://localhost:8080/api/incidents/:id',
            DELETE: 'http://localhost:8080/api/incidents/:id'
        }
    });
});

// Incident routes
router.get('/incidents', incidnetController.index);
router.post('/incidents', incidnetController.new);
router.get('/incident/:id', incidnetController.view);
router.patch('/incident/:id', incidnetController.update);
router.put('/incident/:id', incidnetController.update);
router.delete('/incident/:id', incidnetController.delete);

module.exports = router;