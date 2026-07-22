require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// Put your actual Pet custom object ID here
const CUSTOM_OBJECT_ID = '2-66262779';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};


// ROUTE 1: Homepage
app.get('/', async (req, res) => {
    const customObjectsUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=pet_name,pet_type,pet_age`;
    
    try {
        const response = await axios.get(customObjectsUrl, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'Pets | HubSpot Practicum', data });
    } catch (error) {
        console.error('HubSpot API Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving custom object records.');
    }
});

// ROUTE 2: Render Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

// ROUTE 3: Process Form
app.post('/update-cobj', async (req, res) => {
    const createObjectUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;
    
    const newRecord = {
        properties: {
            "pet_name": req.body.pet_name,
            "pet_type": req.body.pet_type,
            "pet_age": req.body.pet_age
        }
    };

    try {
        await axios.post(createObjectUrl, newRecord, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));