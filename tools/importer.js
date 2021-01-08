let mongoose = require('mongoose');
var Incident = require('../models/incidentModel');
const csv = require('csv-parser');
const fs = require('fs');

const vehicles = 'data/311-service-requests-abandoned-vehicles.csv';
const alley_lights_out = 'data/311-service-requests-alley-lights-out.csv';
const garbage = 'data/311-service-requests-garbage-carts.csv';
const graffiti = 'data/311-service-requests-graffiti-removal.csv';
const pot_holes = 'data/311-service-requests-pot-holes-reported.csv';
const rodent = 'data/311-service-requests-rodent-baiting.csv';
const sanitation = 'data/311-service-requests-sanitation-code-complaints.csv';
const all_street_lights = 'data/311-service-requests-street-lights-all-out.csv';
const one_street_light = 'data/311-service-requests-street-lights-one-out.csv';
const debris = 'data/311-service-requests-tree-debris.csv';
const trims = 'data/311-service-requests-tree-trims.csv';

mongoose.connect('mongodb://localhost/il311ci', 
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

var db = mongoose.connection;
var incident;

const persist = function(file) {
    var batch = [];
    console.log('Importing file: %s', file);
    fs.createReadStream(file)
    .on('error', (er) => {
        // handle error
        console.log(er);
    })
    .pipe(csv())
    .on('data', (row) => {
        // create batches from parsed csv
        incident = new Incident();
        incident.creation_date = row["Creation Date"];
        incident.completion_date = row["Completion Date"];
        incident.status = row["Status"];
        incident.service_request_number = row["Service Request Number"];
        incident.type = row["Type of Service Request"];
        incident.location.street_address = row["Street Address"];

        if (row["ZIP Code"]) {
            incident.location.zip_code = row["ZIP Code"];
        } 
        if (row["ZIP"]) {
            incident.location.zip_code = row["ZIP"];
        }

        incident.location.coordinates.x = row["X Coordinate"];
        incident.location.coordinates.y = row["Y Coordinate"];
        incident.location.position.latitude = row["Latitude"];
        incident.location.position.longitude = row["Longitude"];
        incident.location.position.pos_location = row["Location"];
        incident.authority.ward = row["Ward"];
        incident.authority.police_district = row["Police District"];
        incident.authority.community_area = row["Community Area"];
        incident.authority.ssa = row["SSA"];
        incident.authority.historical_wards = row["Historical Wards 2003-2015"];
        incident.authority.zip_codes = row["Zip Codes"];
        incident.authority.community_areas = row["Community Areas"];
        incident.authority.census_tracts = row["Census Tracts"];
        incident.authority.wards = row["Wards"];
        incident.details.black_carts_delivered = row["Number of Black Carts Delivered"];
        incident.details.current_activity = row["Current Activity"];
        incident.details.most_recent_action = row["Most Recent Action"];
        incident.details.pot_holes_filled_on_block = row["NUMBER OF POTHOLES FILLED ON BLOCK"];
        incident.details.debris_location = row["If Yes, where is the debris located?"];
        incident.details.trees_location = row["Location of Trees"];
        incident.details.premises_baited = row["Number of Premises Baited"];
        incident.details.premises_with_garbage = row["Number of Premises with Garbage"];
        incident.details.premises_with_rats = row["Number of Premises with Rats"];
        incident.details.license_plate = row["License Plate"];
        incident.details.vehicle_make_model = row["Vehicle Make/Model"];
        incident.details.vehicle_color = row["Vehicle Color"];
        incident.details.days_parked = row["How Many Days Has the Vehicle Been Reported as Parked?"];
        incident.details.type_of_surface =  row["What Type of Surface is the Graffiti on?"];
        incident.details.graffiti_location = row["Where is the Graffiti located?"];
        incident.details.nature_of_code_violation = row["What is the Nature of this Code Violation?"];
        
        batch.push(incident);

        if(batch.length == 250000) {
            Incident.collection.insertMany(batch);
            console.info('Successfuly inserted %d incidents.', batch.length);
            console.info('proceeds...');
            batch = [];
        }
    })
    .on('end', () => {
        // batch insert to mongodb
        Incident.collection.insertMany(batch, function (err) {
            if (err)
                console.log(err);
            else {
                console.info('Successfuly inserted %d incidents.', batch.length);
                console.info('completed!');
                batch = [];
                db.close();
            }
        });
    })
};

// persist(vehicles)
// persist(alley_lights_out)
// persist(garbage)
// persist(rodent)
// persist(sanitation)
// persist(all_street_lights)
// persist(one_street_light)
// persist(debris)
// persist(trims)
// persist(pot_holes)
persist(graffiti)