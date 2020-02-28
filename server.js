import express from 'express';
import bodyParser from 'body-parser';
import db from './dummy_db/db';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// GET - get all Data
app.get('/api/v1/data', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'data retrieved successfully',
    data: db
  })
});

// POST - create Data
app.post('/api/v1/data', (req, res) => {
    if(!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required'
      });
    } else if(!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required'
      });
    }
   const data = {
     id: db.length + 1,
     title: req.body.title,
     description: req.body.description
   }
   db.push(data);
   return res.status(201).send({
     success: 'true',
     message: 'data added successfully',
     data
   })
  });

// GET by id - Get specific data by id
app.get('/api/v1/data/:id', (req, res) => {  
    const id = parseInt(req.params.id, 10);  
    db.map((data) => {    
        if (data.id === id) {      
            return res.status(200).send({        
                success: 'true',        
                message: 'data retrieved successfully',        
                data,      
            });    
        } 
    });
 return res.status(404).send({   
     success: 'false',   
     message: 'data does not exist',  
    });
});

// DELETE - delete data
app.delete('/api/v1/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
  
    db.map((data, index) => {
      if (data.id === id) {
         db.splice(index, 1);
         return res.status(200).send({
           success: 'true',
           message: 'data deleted successfuly',
         });    
        }
    });
  
      return res.status(404).send({
        success: 'false',
        message: 'data not found',
      });
  });

// UPDATE - update data
app.put('/api/v1/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    let dataFound;
    let itemIndex;
    db.map((data, index) => {
      if (data.id === id) {
        dataFound = data;
        itemIndex = index;
      }
    });
  
    if (!dataound) {
      return res.status(404).send({
        success: 'false',
        message: 'data not found',
      });
    }
  
    if (!req.body.title) {
      return res.status(400).send({
        success: 'false',
        message: 'title is required',
      });
    } else if (!req.body.description) {
      return res.status(400).send({
        success: 'false',
        message: 'description is required',
      });
    }
  
    const updatedData = {
      id: dataFound.id,
      title: req.body.title || dataFound.title,
      description: req.body.description || dataFound.description,
    };
  
    db.splice(itemIndex, 1, updatedData);
  
    return res.status(201).send({
      success: 'true',
      message: 'data added successfully',
      updatedData,
    });
  });

// Expose API Server on Port 5000
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`API Server running on port: ${PORT}`)
});