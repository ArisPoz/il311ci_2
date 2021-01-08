const { name } = require('faker');

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

exports.vote = function (req, res) {
    let upvoter = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    }

    Incident.findOneAndUpdate({_id: req.params.id}, {$addToSet: {upvotes: upvoter}}, 
        function (err, incident) {
            incident.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'Contact Info updated',
                data: incident
            });
        });
        }
    );
};

exports.query1 = function (req, res) {
    Incident.aggregate([
        {
            $match: {
                creation_date: {
                    $gte: new Date(req.body.date_from),
                    $lte: new Date(req.body.date_to)
                }
            }
        },
        {
            $group: 
            {
                _id: {type: "$type"}, 
                count:{$sum:1}
            }
        }, 
        {
            $sort:{"count": -1}
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query2 = function (req, res) {
    Incident.aggregate([
        {
            $match: {
                type: req.body.type,
                creation_date: {
                    $gte: new Date(req.body.date_from),
                    $lt: new Date(req.body.date_to)
                }
            }
        },
        {
            $group: 
            {
                _id: {creation_date: "$creation_date"}, 
                count:{$sum:1}
            }
        }, 
        {
            $sort:{"_id": 1}
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query3 = function (req, res) {
    var day = new Date(req.body.date);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    Incident.aggregate([
        {
            $match: {
                creation_date: {
                    $gte: day,
                    $lt: nextDay
                }
            }
        },
        {
            $group: 
            {
                _id: {"zip_code": "$location.zip_code"}, 
                count:{$sum:1}
            }
        }, 
        {
            $sort:{"_id": -1}
        },
        {
            $limit: 3
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query4 = function (req, res) {
    Incident.aggregate([
        {
            $match: {
                type: req.body.type
            }
        },
        {
            $group: 
            {
                _id: {"ward": "$authority.ward"}, 
                count:{$sum:1}
            }
        }, 
        {
            $sort:{count: -1}
        },
        {
            $limit: 3
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query5 = function (req, res) {
    Incident.aggregate([
        {
            $match: {
                creation_date: {
                    $gte: new Date(req.body.date_from),
                    $lte: new Date(req.body.date_to)
                }
            }
        },
        {
            $group: 
            {
                _id: {"type": "$type"}, 
                average: {$avg: { $subtract: [{$ifNull:["$completion_date",0]}, 
                {$ifNull:["$creation_date",0]}]}}
            }
        }, 
        {
            $sort:{"_id": -1}
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query6 = function (req, res) {
    var day = new Date(req.body.date);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    Incident.aggregate([
        {
            $match: {
                creation_date: {
                    $gte: day,
                    $lt: nextDay
                },
                "location.position.latitude": {
                    $gte: parseFloat(req.body.lat_from),
                    $lte: parseFloat(req.body.lat_to)
                },
                "location.position.longitude": {
                    $gte: parseFloat(req.body.long_from),
                    $lte: parseFloat(req.body.long_to)
                }
            }
        },
        {
            $group: 
            {
                _id: {"type": "$type"}, 
                count: {$sum:1}
            }
        }, 
        {
            $sort:{"count": -1}
        },
        {
            $limit: 1
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query7 = function (req, res) {
    var day = new Date(req.body.date);
    var nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    Incident.aggregate([
        {
            $addFields: {
                upvotes_size: {
                    $size: "$upvotes"
                }
            }
        },
        {
            $match: {
                creation_date: {
                    $gte: day,
                    $lt: nextDay
                }
            }
        },
        {
            $sort:{upvotes_size: -1}
        },
        {
            $limit: 50
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query8 = function (req, res) {
    Incident.aggregate([
        {
            $unwind: "$upvotes"
        },
        {
            $group: 
            {
                _id: {
                    name: "$upvotes.name",
                    phone: "$upvotes.phone",
                    address: "$upvotes.address"
                },
                count: {$sum:1}
            }
        },
        {
            $sort:{count: -1}
        },
        {
            $limit: 50
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query9 = function (req, res) {
    Incident.aggregate([
        {
            $unwind: "$upvotes"
        },
        {
            $group: 
            {
                _id: {
                    ward: "$authority.ward", 
                    name: "$upvotes.name",
                    phone: "$upvotes.phone",
                    address: "$upvotes.address"

                },
                count: {$sum:1}
            }
        },
        {
            $sort:{count: -1}
        },
        {
            $limit: 50
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query10 = function (req, res) {
    Incident.aggregate([
        {
            $unwind: "$upvotes"
        }, 
        {
            $group: 
            {
                _id: {phone: "$upvotes.phone"},
                name_arr: {$addToSet: "$upvotes.name"},
                id_arr: {$addToSet: "$upvotes._id"}
            }
        },
        {
            $project: {
                id_arr: {
                    $cond: {
                        if: {
                            $gt: [{$size: "$name_arr"}, 1]
                        }, then: "$id_arr", else: null
                    }
                },
                name_arr: {
                    $cond: {
                        if: {
                            $gt: [{$size: "$name_arr"}, 1]
                        }, then: "$name_arr", else: null
                    }
                }
            }
        },
        {
            $redact: {
                $cond: {
                    if: { $eq: [ "$name_arr", null ] },
                    then: '$$PRUNE',
                    else: '$$DESCEND'
                }
            }
        },
        {
            $sort: {
                name_arr: -1
            }
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            incidents: incidents
        });
    });
};

exports.query11 = function (req, res) {
    Incident.aggregate([
        {
            $unwind: "$upvotes"
        },
        {
            $match: {
                "upvotes.name" : req.body.name
            }
        }, 
        {
            $project: {
                "authority.ward": 1,
                _id: 0
            }
        }
    ], function (err, incidents) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: "Retrieved data",
            name: req.body.name,
            incidents: incidents
        });
    });
};