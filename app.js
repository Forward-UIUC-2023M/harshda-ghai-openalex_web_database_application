// var mysql = require('mysql2');

// var connection = mysql.createConnection({
//                 host: 'Hawk5.csl.illinois.edu',
//                 user: 'dba',
//                 password: 'Dba@1234$',
//                 database: 'openalex_db',
                
// });


// connection.connect((err)=>{
//         if(err){
//             console.log("error connecting" + err.stack);
    
//         }else{
//             console.log("connected as " + connection.threadId);
//         }
        
//     });
//CONNECTION TO DATABASE HAS BEEN ESTABLISHED --------
const databaseServer = require('./database');

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { result } = require('lodash');
    
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/frontend'))); 

app.use(bodyParser.urlencoded({extended:true}));

app.get('/index.html', (req, res)=>{
    //res.send("hello world from express");
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    console.log("get");
});


//STAGE 3 START BELOW

app.post('/concepts.html', (request, response)=>{
    console.log("concept post");
    console.log(request.body.display_name);
    console.log(request.body.page_number);
    const db = databaseServer.getServerInstance();
    const result = db.searchConceptsWorksPy(request.body.display_name);
    
    

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});

app.post('/institutions.html', (request, response)=>{
    console.log("institution post");
    const db = databaseServer.getServerInstance();
    const result = db.searchInstitutionsWorksPy(request.body.display_name);
    
    

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});


app.post('/authors.html', (request, response)=>{
    console.log("author post");
    const db = databaseServer.getServerInstance();
    const result = db.searchAuthorsWorksPy(request.body.display_name);
    
    

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});

app.post('/works.html', (request, response)=>{
    console.log("work post");
    const db = databaseServer.getServerInstance();
    const result = db.searchWorksPy(request.body.display_name);
    
    

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});

app.post('/index.html', (request, response)=>{
    console.log("index main post");
    console.log(request.body.display_name);
    console.log(request.body.page_number);
    const db = databaseServer.getServerInstance();
    const result = db.searchAllWorksPy(request.body.display_name);
    
    

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));

});



//STAGE 2 START BELOW
// app.post('/concepts.html', (request, response)=>{
//     console.log("concept post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchConcepts(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));

// });

// app.post('/conceptsfilter', (request, response)=>{
//     console.log("concept level post");
//     console.log(request.body);
//     const db = databaseServer.getServerInstance();
    
//     const result = db.searchConceptsFilter(request.body.display_name, request.body.level_type, request.body.works_count, request.body.cited_by_count);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));

// });

// app.post('/institutions.html', (request, response)=>{
//     console.log("institution post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchInstitutions(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));

// });


// app.post('/institutionsfilter', (request, response)=>{
//     console.log("institution level post");
//     console.log(request.body);
//     const db = databaseServer.getServerInstance();
    
//     const result = db.searchInstitutionsFilter(request.body.display_name, request.body.type, request.body.works_count, request.body.cited_by_count);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));

// });

// app.post('/concepts-ancestors', (request, response)=>{
//     console.log("concepts ancestors post");
//     console.log(request.body);
//     const db = databaseServer.getServerInstance();

//     const result = db.searchConceptsAncestors(request.body.display_name);
//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
    
// });

// app.post('/index.html', (request, response)=>{
    
//         console.log("all post");
// });
    


//REPLICATE BOOKMYTRIP - STAGE 1 -> BELOW

// app.post('/all', (request, response)=>{
    
//     console.log("all post");
// });

// app.post('/concepts', (request, response)=>{
    
//     console.log("concept post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchConcepts(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
// });

// app.post('/institutions', (request, response)=>{
    
//     console.log("institution post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchInstitutions(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
// });

// app.post('/sources', (request, response)=>{
    
//     console.log("source post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchSources(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
// });

// app.post('/publishers', (request, response)=>{
    
//     console.log("publisher post");
//     const db = databaseServer.getServerInstance();
//     const result = db.searchPublishers(request.body.display_name);
    

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
// });

//OLD BELOW 


// app.post("/concepts.html", (request, response) => {
//     console.log("post");
//     console.log(request.body);

//     const db = databaseServer.getServerInstance();

//     const result = db.searchConcepts(request.body.display_name);

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
    
// });

// app.post("/publishers.html", (request, response) => {
//     console.log("publisher post");
//     console.log(request.body);

//     const db = databaseServer.getServerInstance();

//     const result = db.searchPublishers(request.body.display_name);

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
    
// });

// app.post("/sources.html", (request, response) => {
//     console.log("source post");
//     console.log(request.body);

//     const db = databaseServer.getServerInstance();

//     const result = db.searchSources(request.body.display_name);

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
    
// });

// app.post("/institutions.html", (request, response) => {
//     console.log("institution post");
//     console.log(request.body);

//     const db = databaseServer.getServerInstance();

//     const result = db.searchInstitutions(request.body.display_name);

//     result
//     .then(data => response.json({ data: data}))
//     .catch(err => console.log(err));
    
// });
  
    
    


// connection.query(`SELECT display_name FROM concepts LIMIT 30;`, (err, res)=>{
//     if(err){
//         console.log(err.message);
//     }else{
//         console.log(res);
//     }
    
// });

app.listen(3001);






// var mysql = require('mysql2');
// var connection = mysql.createConnection({
//                 host: '34.135.215.56',
//                 user: 'root',
//                 password: 'openalex@1234',
//                 database: 'openalex',
                
// });


// connection.connect((err)=>{
//         if(err){
//             console.log("error connecting" + err.stack);
    
//         }else{
//             console.log("connected as " + connection.threadId);
//         }
        
//     });
    
    


// connection.query(`SELECT display_name FROM authors LIMIT 10;`, (err, res)=>{
//     if(err){
//         console.log(err.message);
//     }else{
//         console.log(res);
//     }
    
// });




