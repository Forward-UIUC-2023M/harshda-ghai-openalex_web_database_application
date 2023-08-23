const { result } = require('lodash');
const spawner = require('child_process').spawn;
var mysql = require('mysql2');
let instance = null;


var connection = mysql.createConnection({
    host: 'Hawk5.csl.illinois.edu',
    user: 'dba',
    password: 'Dba@1234$',
    database: 'openalex_db',
    multipleStatements: true
    
});

//connection for the gcp mysql server
// var connection = mysql.createConnection({
//     host: '34.135.215.56',
//     user: 'root',
//     password: 'openalex@1234',
//     database: 'openalex',
    
// });

connection.connect((err)=>{
    if(err){
        console.log("error connecting" + err.stack);

    }else{
        console.log("connected as " + connection.threadId);
    }
    
});

class DatabaseServerClass {

    static getServerInstance() {
        if (instance == null) {
            instance = new DatabaseServerClass();


        }
        return instance;

    }

    async searchConcepts(name) {
        console.log("search concepts function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${name}%' LIMIT 10;`;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsWorks(name) {
        console.log("search concepts works function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT distinct wc.work_id, wc.concept_id, c.display_name , wi.pmcid, wi.pmid, w.title, w.type, w.publication_year
                                    FROM (((openalex_db.works_concepts2 wc INNER JOIN openalex_db.concepts c ON wc.concept_id = c.id) LEFT JOIN openalex_db.works_ids2 wi ON wc.work_id = wi.work_id) left join openalex_db.works2 w on wi.work_id = w.id)
                                    WHERE (c.display_name like '${name}%' or c.display_name like '%${name}' or c.display_name like '%${name}%') AND (wi.pmcid != "" or wi.pmid != "") limit 20;
                                    select c.display_name, c.works_count, c.cited_by_count
                                      from openalex_db.concepts c
                                      where  (c.display_name like '${name}%' or c.display_name like '%${name}' or c.display_name like '%${name}%') 
                                      order by c.works_count desc, c.cited_by_count desc
                                      limit 3;`;
                connection.query(input_query, [1,2], (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(typeof results[0])
                    // console.log(results[1])
                    resolve(results);
                })
            });
            // console.log("after 2 resp")
            // console.log(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsWorksPy(name) {
        console.log("search concepts works function PY");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                const python_process = spawner('python3', ['./concepts.py', name]);
                var test = '["test1", "test2"]'
                var json_test = JSON.parse(test);
                // console.log(json_test);
                var final_input = '';
                python_process.stdout.on('data', (data) =>{
                    //var test = JSON.parse(data.toString())
                    //resolve(test);
                    final_input += data;
                    
                
                
                
                });
                python_process.stdout.on('end',function(){
                    var test = JSON.parse(final_input.toString());
                    //console.log(test);
                    resolve(test);
                });
                python_process.stderr.on('data', (data) => {
                    reject(new Error(err.message));
                  });
                
                
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchInstitutionsWorksPy(name) {
        console.log("search inst works function PY");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                const python_process = spawner('python3', ['./institutions.py', name]);
                var test = '["test1", "test2"]'
                var json_test = JSON.parse(test);
                // console.log(json_test);
                var final_input = '';
                python_process.stdout.on('data', (data) =>{
                    final_input += data;
                });
                python_process.stdout.on('end',function(){
                    var test = JSON.parse(final_input.toString());
                    resolve(test);
                });
                python_process.stderr.on('data', (data) => {
                    reject(new Error(err.message));
                  });
                
                
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchAuthorsWorksPy(name) {
        console.log("search authors works function PY");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                const python_process = spawner('python3', ['./authors.py', name]);
                var test = '["test1", "test2"]'
                var json_test = JSON.parse(test);
                // console.log(json_test);
                var final_input = '';
                python_process.stdout.on('data', (data) =>{
                    final_input += data;
                });
                python_process.stdout.on('end',function(){
                    var test = JSON.parse(final_input.toString());
                    resolve(test);
                });
                python_process.stderr.on('data', (data) => {
                    reject(new Error(err.message));
                  });
                
                
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchWorksPy(name) {
        console.log("search works function PY");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                const python_process = spawner('python3', ['./works.py', name]);
                var test = '["test1", "test2"]'
                var json_test = JSON.parse(test);
                // console.log(json_test);
                var final_input = '';
                python_process.stdout.on('data', (data) =>{
                    final_input += data;
                });
                python_process.stdout.on('end',function(){
                    var test = JSON.parse(final_input.toString());
                    resolve(test);
                });
                python_process.stderr.on('data', (data) => {
                    reject(new Error(err.message));
                  });
                
                
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchAllWorksPy(name) {
        console.log("search main INDEX function PY");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                const python_process = spawner('python3', ['./index.py', name]);
                var test = '["test1", "test2"]'
                var json_test = JSON.parse(test);
                // console.log(json_test);
                var final_input = '';
                python_process.stdout.on('data', (data) =>{
                    final_input += data;
                });
                python_process.stdout.on('end',function(){
                    var test = JSON.parse(final_input.toString());
                    resolve(test);
                });
                python_process.stderr.on('data', (data) => {
                    reject(new Error(err.message));
                  });
                
                
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsWorks2(name) {
        console.log("search concepts works function p2");
        console.log(name);
        var test = {};
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `select c.display_name from openalex_db.concepts c where (c.display_name like '${name}%' or c.display_name like '%${name}' or c.display_name like '%${name}%') limit 10;`;
                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results[0])
                    test = results
                    console.log(test)
                
                    resolve(results);
                })
            });
            // console.log("after 2 resp")
            // console.log(response)
        
            return response;
        } catch (error) {
            console.log(error);
        }
        
    }

    async searchAuthorsWorks(name) {
        console.log("search authors works function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT wa.work_id, wa.author_id, a.display_name , wi.pmcid, wi.pmid, w.display_name as w_display_name, w.type, w.publication_year
                FROM (((openalex_db.works_authorships2 wa INNER JOIN openalex_db.authors2 a ON wa.author_id = a.id) LEFT JOIN openalex_db.works_ids2 wi ON wa.work_id = wi.work_id) left join openalex_db.works2 w on wi.work_id = w.id)
                WHERE (a.display_name like '${name}%' or a.display_name like '%${name}' or a.display_name like '%${name}%') AND (wi.pmcid != "" or wi.pmid != "")
                                    ;select a.display_name, a.works_count, a.cited_by_count
                                    from openalex_db.authors2 a
                                    where  (a.display_name like '${name}%' or a.display_name like '%${name}' or a.display_name like '%${name}%') 
                                    order by a.works_count desc, a.cited_by_count desc
                                    limit 3;`;
                connection.query(input_query, [1,2], (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    // console.log(results[0])
                    // console.log(results[1])
                    resolve(results);
                })
            });
            // console.log("after 2 resp")
            // console.log(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchInstitutionsWorks(name) {
        console.log("search institutions works function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;"; wa.institution_id, i.display_name 
                const input_query = `SELECT distinct wa.work_id, wi.pmcid, wi.pmid,  w.title, w.type, w.publication_year, w.publication_date
                FROM (((openalex_db.works_authorships2 wa INNER JOIN openalex_db.institutions i ON wa.institution_id = i.id) LEFT JOIN openalex_db.works_ids2 wi ON wa.work_id = wi.work_id) left join openalex_db.works2 w on wi.work_id = w.id)
                WHERE (i.display_name like '${name}%' or i.display_name like '%${name}' or i.display_name like '%${name}%') AND (wi.pmcid != "" or wi.pmid != "") limit 20
                                    ;select i.display_name, i.works_count, i.cited_by_count
                                    from openalex_db.institutions i
                                    where  (i.display_name like '${name}%' or i.display_name like '%${name}' or i.display_name like '%${name}') 
                                    order by i.works_count desc, i.cited_by_count desc
                                    limit 3;`;
                connection.query(input_query, [1,2], (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results[0])
                    // console.log(results[1])
                    resolve(results);
                })
            });
            // console.log("after 2 resp")
            // console.log(response)
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsAncestors(name) {
        console.log("search concepts ancestors function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `select c.id, c.display_name, ca.ancestor_id, (select c2.display_name from openalex_db.concepts c2 where c2.id = ca.ancestor_id) as ancestor_display_name from openalex_db.concepts_ancestors ca INNER JOIN openalex_db.concepts c ON ca.concept_id = c.id where c.display_name like '${name}%' LIMIT 10;`;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsLevel(display_name, levelType) {
        console.log("search concepts level 0 function");
        try {
            const response = await new Promise((resolve, reject) => {
                var input_query = "";
                if (levelType == "0"){
                    console.log("this is level 0");
                    input_query = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND level <= 3 LIMIT 10;`;

                }
                else if (levelType == "1") {
                    input_query = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (level <= 8 AND level >= 4) LIMIT 10;`;


                } else if (levelType == "2") {
                    input_query = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (level >= 9) LIMIT 10;`;


                }
                

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    //console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchConceptsFilter(display_name, levelType, works_count, cited_by_count) {
        console.log("search concepts filters function");
        var input_query1 = "";
                var input_query2 = "";
                var input_query3 = "";
                if (levelType != "") {
                    if (levelType == "0-3"){
                        console.log("0-3");
                        console.log("this is level 0");
                        input_query1 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND level <= 3`;

                    }
                    else if (levelType == "4-8") {
                        input_query1 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (level <= 8 AND level >= 4)`;


                    } else if (levelType == "9-12") {
                        input_query1 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (level >= 9)`;


                    }
                }
                console.log("done");
                console.log(input_query1);

                if (works_count != "") {
                    if (works_count == "0-5000"){
                        input_query2 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND works_count < 5000`;

                    } else if (works_count == "5000-10,000") {
                        input_query2 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (works_count >= 5000 AND works_count <10000)`;
                    } else if (works_count == "10,000-15,000") {
                        input_query2 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (works_count >= 10000 AND works_count <15000)`;
                    } else if (works_count == "15,000+") {
                        input_query2 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (works_count >= 15000)`;
                    }

                }

                if (cited_by_count != "") {
                    if (cited_by_count == "0-5000"){
                        input_query3 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND cited_by_count < 5000`;

                    } else if (cited_by_count == "5000-10,000") {
                        input_query3 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 5000 AND cited_by_count <10000)`;
                    } else if (cited_by_count == "10,000-15,000") {
                        input_query3 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 10000 AND cited_by_count <15000)`;
                    } else if (cited_by_count == "15,000+") {
                        input_query3 = `SELECT id, display_name, level, works_count, cited_by_count FROM openalex_db.concepts WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 15000)`;
                    }

                }
                var input_query = "";
                if (input_query1 == "" ){
                    //input_query = "`${input_query2}` UNION '${input_query3}';";
                    if (input_query2 == "") {
                        input_query = input_query3+ " limit 10;";

                    } else {
                        if (input_query3 == "") {
                            input_query = input_query2+ " limit 10;";

                        }else {
                            input_query = "(" + input_query2 + ") " + " INTERSECT " + " (" + input_query3 + " ) limit 10;";
                        }

                    }

                } else {
                    console.log("here");
                    if (input_query2 == "") {
                        if (input_query3 == "") {
                            input_query = input_query1 + " limit 10;";
                        }else {
                            input_query = "(" + input_query1 + ") " + " INTERSECT " + " (" + input_query3 + " ) limit 10;";
                        }
                    } else {
                        if (input_query3 == "") {
                            input_query = "(" + input_query1 + ") " + " INTERSECT " + " (" + input_query2 + " ) limit 10;";
                        } else {
                            input_query = "(" + input_query1 + ")" + " INTERSECT " + "(" + input_query2 + ")" + " INTERSECT " + "(" + input_query3 + " ) limit 10;";

                        }
                    }
                }
                console.log("THIS " + input_query);
                
                
        try {
            const response = await new Promise((resolve, reject) => {
                
                

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchInstitutionsFilter(display_name, type, works_count, cited_by_count) {
        console.log("search institutions filters function");
        var input_query1 = "";
                var input_query2 = "";
                var input_query3 = "";
                if (type != "") {
                    if (type == "edu"){
                        console.log("0-3");
                        console.log("this is level 0");
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Education'`;

                    }
                    else if (type == "health") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Healthcare'`;


                    } else if (type == "comp") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Company'`;


                    }else if (type == "arch") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Archive'`;


                    }else if (type == "non-prof") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Nonprofit'`;


                    }else if (type == "govt") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Government'`;


                    }else if (type == "fac") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Facility'`;


                    }else if (type == "other") {
                        input_query1 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND type = 'Other'`;


                    }
                }
                console.log("done");
                console.log(input_query1);

                if (works_count != "") {
                    if (works_count == "0-5000"){
                        input_query2 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND works_count < 5000`;

                    } else if (works_count == "5000-10,000") {
                        input_query2 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (works_count >= 5000 AND works_count <10000)`;
                    } else if (works_count == "10,000-15,000") {
                        input_query2 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (works_count >= 10000 AND works_count <15000)`;
                    } else if (works_count == "15,000+") {
                        input_query2 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (works_count >= 15000)`;
                    }

                }

                if (cited_by_count != "") {
                    if (cited_by_count == "0-5000"){
                        input_query3 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND cited_by_count < 5000`;

                    } else if (cited_by_count == "5000-10,000") {
                        input_query3 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 5000 AND cited_by_count <10000)`;
                    } else if (cited_by_count == "10,000-15,000") {
                        input_query3 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 10000 AND cited_by_count <15000)`;
                    } else if (cited_by_count == "15,000+") {
                        input_query3 = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${display_name}%' AND (cited_by_count >= 15000)`;
                    }

                }
                var input_query = "";
                if (input_query1 == "" ){
                    //input_query = "`${input_query2}` UNION '${input_query3}';";
                    if (input_query2 == "") {
                        input_query = input_query3+ " limit 10;";

                    } else {
                        if (input_query3 == "") {
                            input_query = input_query2+ " limit 10;";

                        }else {
                            input_query = "(" + input_query2 + ") " + " INTERSECT " + " (" + input_query3 + " ) limit 10;";
                        }

                    }

                } else {
                    console.log("here");
                    if (input_query2 == "") {
                        if (input_query3 == "") {
                            input_query = input_query1 + " limit 10;";
                        }else {
                            input_query = "(" + input_query1 + ") " + " INTERSECT " + " (" + input_query3 + " ) limit 10;";
                        }
                    } else {
                        if (input_query3 == "") {
                            input_query = "(" + input_query1 + ") " + " INTERSECT " + " (" + input_query2 + " ) limit 10;";
                        } else {
                            input_query = "(" + input_query1 + ")" + " INTERSECT " + "(" + input_query2 + ")" + " INTERSECT " + "(" + input_query3 + " ) limit 10;";

                        }
                    }
                }
                console.log("THIS " + input_query);
                
                
        try {
            const response = await new Promise((resolve, reject) => {
                
                

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async searchPublishers(name) {
        console.log("search publisher function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT id, display_name, works_count,cited_by_count FROM openalex_db.publishers WHERE display_name LIKE '${name}%' LIMIT 25;`;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    console.log(results);
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }


    async searchSources(name) {
        console.log("search source function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT id, display_name, publisher, homepage_url, works_count,cited_by_count FROM openalex_db.sources WHERE display_name LIKE '${name}%' LIMIT 40;`;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    console.log(results);
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchInstitutions(name) {
        console.log("search institution function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `SELECT id, display_name, country_code, type,homepage_url, works_count,cited_by_count FROM openalex_db.institutions WHERE display_name LIKE '${name}%' LIMIT 20;`;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    console.log(results);
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async searchAll(name) {
        console.log("search all function");
        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                //const query = "SELECT * FROM names WHERE name = ?;";
                const input_query = `
                SELECT id, display_name, works_count FROM openalex_db.concepts WHERE display_name LIKE '${name}%' LIMIT 15;
                UNION
                SELECT id, display_name, works_count,cited_by_count FROM openalex_db.publishers WHERE display_name LIKE '${name}%' LIMIT 15;
                `;

                connection.query(input_query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    
                    console.log(results)
                    resolve(results);
                })
            });
            
            return response;
        } catch (error) {
            console.log(error);
        }
    }




}

module.exports = DatabaseServerClass;