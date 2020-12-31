// Import incident model
Incident = require('../models/incidentModel');

// Handle index actions
exports.index = function (req, res) {
    Incident.get(function (err, incidents) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Incidents retrieved successfully",
            data: incidents
        });
    });
};

// Handle create incident actions
exports.new = function (req, res) {
    var incident = new Incident();
    incident.creation_date = req.body.creation_date;
    incident.completion_date = req.body.completion_date;
    incident.status = req.body.status;
    incident.service_request_number = req.body.service_request_number;
    incident.type = req.body.type;
    incident.location.street_address = req.body.street_address;
    incident.location.zip_code = req.body.zip_code;
    incident.location.coordinates.x = req.body.x;
    incident.location.coordinates.y = req.body.y;
    incident.location.position.latitude = req.body.latitude;
    incident.location.position.longitude = req.body.longitude;
    incident.location.position.pos_location = req.body.pos_location;
    incident.authority.ward = req.body.ward;
    incident.authority.police_district = req.body.police_district;
    incident.authority.community_area = req.body.community_area;
    incident.authority.ssa = req.body.ssa;
    incident.authority.historical_wards = req.body.historical_wards;
    incident.authority.zip_codes = req.body.zip_codes;
    incident.authority.community_areas = req.body.community_areas;
    incident.authority.census_tracts = req.body.census_tracts;
    incident.authority.wards = req.body.wards;
    incident.details.black_carts_delivered = req.body.black_carts_delivered;
    incident.details.current_activity = req.body.current_activity;
    incident.details.most_recent_action = req.body.most_recent_action;
    incident.details.pot_holes_filled_on_block = req.body.pot_holes_filled_on_block;
    incident.details.debris_location = req.body.debris_location;
    incident.details.trees_location = req.body.trees_location;
    incident.details.premises_baited = req.body.premises_baited;
    incident.details.premises_with_garbage = req.body.premises_with_garbage;
    incident.details.premises_with_rats = req.body.premises_with_rats;
    incident.details.license_plate = req.body.license_plate;
    incident.details.vehicle_make_model = req.body.vehicle_make_model;
    incident.details.vehicle_color = req.body.vehicle_color;
    incident.details.days_parked = req.body.days_parked;
    incident.details.type_of_surface =  req.body.type_of_surface;
    incident.details.graffiti_location = req.body.graffiti_location;
    incident.details.nature_of_code_violation = req.body.nature_of_code_violation;
    
    // save the incident and check for errors
    incident.save(function (err) {
        if (err)
            res.json(err);
        else
            res.json({
                message: 'New incident created!',
                data: incident
            });
    });
};

// Handle view incident info
exports.view = function (req, res) {
    Incident.findById(req.params.id, function (err, incident) {
        if (err)
            res.send(err);
        res.json({
            message: 'Incident details loading..',
            data: incident
        });
    });
};

// Handle update Incident info
exports.update = function (req, res) {
    Incident.findOneAndUpdate(req.params.id, req.body, function (err, incident) {
        if (err)
            res.send(err);

        incident.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Contact Info updated',
                data: incident
            });
        });
    });
};

// Handle delete Incident
exports.delete = function (req, res) {
    Incident.deleteOne({
        _id: req.params.id
    }, function (err, incident) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Incident deleted'
        });
    });
};