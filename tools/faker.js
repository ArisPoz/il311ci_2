const faker = require('faker');
let mongoose = require('mongoose');
let Incident = require('../models/incidentModel');
const { promisify } = require('util');
const sleep = promisify(setTimeout)

mongoose.connect('mongodb://localhost/il311ci', 
{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

async function createUser() {
    let name = faker.name.firstName();
    let phone = faker.phone.phoneNumber('###-####-###');
    let address = faker.address.streetAddress();

    return upvoter = {
        name: name,
        phone: phone,
        address: address
    };
}

async function getIncident() {
    let incident = Incident.aggregate([{$sample: {size:1}}]);
    return incident;
}

function getRand(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let counter = 0;
async function addUpvotes(id, upvoter) {
    Incident.findOneAndUpdate({_id: id}, {$push: {upvotes: upvoter}}, 
        function (err, incident) {
            incident.save(() => {
                if(counter === 1500) {
                    console.log('Inserted 1500 upvotes');
                    counter = 0;
                } else {
                    counter = counter + 1;
                }
            });
        }
    );
}

async function generate() {
    let rand = getRand(rand_limit);
    let upvoter = await createUser();
    for(let i=0; i<rand; i++) {
        let incident = await getIncident();
        addUpvotes(incident, upvoter);
    }
}

async function exec() {
    for (let i=0; i<user_limit; i++) {
        await generate();
        if(i%10 == 0) {
            await sleep(100);
        }
    }
}

let user_limit = 100000;
let rand_limit = 1000;
exec();