const spawner = require('child_process').spawn;

const in_data = "david";
console.log("data sent to python script " + in_data);

const python_process = spawner('python3', ['./index.py', in_data]);


var check = '';


python_process.stdout.on('data', (data) =>{
    //var test = JSON.parse(data.toString())
    //process.stdout.write(data);
    check += data;


    //var test = data.toString()
    //console.log(typeof test)
    //check = test
    // if ("\n" in test) {
    //   console.log("BRO YAAR");
    // }
    //data += test;
    

    
    
    //var test2 = JSON.parse(test)
    //console.log(test2);
    //JSON.parse(JSON.stringify(data.toString()))
    //console.log("data received " + JSON.parse(JSON.stringify(data)));



});

python_process.stdout.on('end',
    function(){
      var test = JSON.parse(check.toString());
      console.log(test);
      console.log(test.length)
        
    }
);


python_process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

// const {PythonShell} = require("python-shell");

// let options = {
//     scriptPath : 'Users/parveshghai/Desktop/openalex',
//     args : ["Chemistry"]
// };

// PythonShell.run("concepts.py", options, (err, res)=>{
//     if(err) console.log(err);
//     if(res) console.log(res);


// });