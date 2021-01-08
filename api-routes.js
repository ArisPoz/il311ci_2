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
router.get('/incidents/:id', incidnetController.view);
router.patch('/incidents/:id', incidnetController.update);
router.put('/incidents/:id', incidnetController.update);
router.delete('/incidents/:id', incidnetController.delete);
router.post('/incidents/vote/:id', incidnetController.vote);

//queries
router.post('/query1', incidnetController.query1);
router.post('/query2', incidnetController.query2);
router.post('/query3', incidnetController.query3);
router.post('/query4', incidnetController.query4);
router.post('/query5', incidnetController.query5);
router.post('/query6', incidnetController.query6);
router.post('/query7', incidnetController.query7);
router.get('/query8', incidnetController.query8);
router.get('/query9', incidnetController.query9);
router.get('/query10', incidnetController.query10);
router.post('/query11', incidnetController.query11);

module.exports = router;