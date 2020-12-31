var mongoose = require('mongoose');

//Schema
var incidentSchema = mongoose.Schema({
    creation_date: Date,
    completion_date: Date,
    status: String,
    service_request_number: String,
    type: String,
    location: {
        street_address: String,
        zip_code: String,
        coordinates: {
            x: String,
            y: String
        },
        position: {
            latitude: Number,
            longitude: Number,
            pos_location: String
        }
    },
    authority: {
        ward: String,
        police_district: String,
        community_area: String,
        ssa: Number,
        historical_wards: String,
        zip_codes: String,
        community_areas: String,
        census_tracts: String,
        wards: String
    },
    details: {
        black_carts_delivered: Number,
        current_activity: String,
        most_recent_action: String,
        pot_holes_filled_on_block: Number,
        debris_location: String,
        trees_location: String,
        premises_baited: Number,
        premises_with_garbage: Number,
        premises_with_rats: Number,
        license_plate: String,
        vehicle_make_model: String,
        vehicle_color: String,
        days_parked: Number,
        type_of_surface: String,
        graffiti_location: String,
        nature_of_code_violation: String
    },
    upvotes: [{
        name: String,
        telephone: String,
        address: String
    }]
});

// Export Incident model
var Incident = module.exports = mongoose.model('incident', incidentSchema);

module.exports.get = function (callback, limit) {
    Incident.find(callback).limit(limit);
}