//deal with no results data - i think i did that 
//make the links look better
//improve python that gets code  

//const { parseInt } = require("lodash");

const searchBtn = document.getElementById("search_btn")

var data_response = null;

var concept = document.querySelector('#user_input').value;

var main_page_number = 1;

searchBtn.onclick = function() {
  var respDiv = document.getElementById("resp");
  while (respDiv.firstChild) {
    respDiv.removeChild(respDiv.firstChild);
 }

 var c1Div = document.getElementById("c1");
  while (c1Div.firstChild) {
    c1Div.removeChild(c1Div.firstChild);
 }

 var c2Div = document.getElementById("c2");
  while (c2Div.firstChild) {
    c2Div.removeChild(c2Div.firstChild);
 }

 var c3Div = document.getElementById("c3");
  while (c3Div.firstChild) {
    c3Div.removeChild(c3Div.firstChild);
 }
 var pagDiv = document.getElementById("pag");
  while (pagDiv.firstChild) {
    pagDiv.removeChild(pagDiv.firstChild);
 }


  document.getElementById("1900 - 1950").checked = false;
  document.getElementById("1950 - 2000").checked = false;
  document.getElementById("2000+").checked = false;

  document.getElementById("0-5000").checked = false;
  document.getElementById("5000-10,000").checked = false;
  document.getElementById("10,000-15,000").checked = false;
  document.getElementById("15,000+").checked = false;

  document.getElementById("article").checked = false;
  document.getElementById("journal").checked = false;

  console.log("concept search button click");
  const conceptInput = document.querySelector('#user_input');
  const concept = conceptInput.value;
  conceptInput.value = "";

  var page_num = null;
  var pag_div = document.getElementById("pag");
  if(pag_div.hidden  == true) {
    page_num = 1;
  }


  var data_len = null;
  fetch('http://localhost:3001/concepts.html', {
    headers: {
      'Content-type': 'application/json'
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: JSON.stringify({ display_name : concept, page_number: page_num})
  })
  .then(response => response.json())
  .then(data => {data_response = data})
  .then(() => printData(data_response["data"][0].slice(0, 5), concept, data_response["data"][1], 1, data_response["data"][0].length))

  var data_len = 60
  var page_limit = 8;
  var number_of_pages = Math.ceil(data_len / page_limit);
  var a = document.createElement('a');
  a.setAttribute('href',"#");
  a.innerHTML = "&laquo";
  document.getElementById('pag').appendChild(a);
  for (let i = 1; i <= number_of_pages; i++) {
    var a = document.createElement('a');
    a.setAttribute('href',"#");
    a.innerHTML = i.toString()
    a.setAttribute("id", i.toString())
    document.getElementById('pag').appendChild(a);
  }
  var a = document.createElement('a');
  a.setAttribute('href',"#");
  a.innerHTML = "&raquo";
  document.getElementById('pag').appendChild(a);

  document.getElementById("filters_div").hidden = false;


  pag_div.hidden = false;


};

document.getElementById("year_filter").addEventListener("click", function(e) {
  if(e.target && e.target.nodeName == "INPUT") {
    console.log("year filter entered")
    combined_filters(main_page_number);
    reorder_div(main_page_number);
  }
});

document.getElementById("citation_count_filter").addEventListener("click", function(e) {
  if(e.target && e.target.nodeName == "INPUT") {
    combined_filters(main_page_number);
    reorder_div(main_page_number);
  }
});

document.getElementById("type_filter").addEventListener("click", function(e) {
  if(e.target && e.target.nodeName == "INPUT") {
    combined_filters(main_page_number);
    reorder_div(main_page_number);
  }
});

document.getElementById("pag").addEventListener("click", function(e) {
    if(e.target && e.target.nodeName == "A") {
      
      console.log("clicked the page button")
      document.getElementById("1900 - 1950").checked = false;
      document.getElementById("1950 - 2000").checked = false;
      document.getElementById("2000+").checked = false;
    
      document.getElementById("0-5000").checked = false;
      document.getElementById("5000-10,000").checked = false;
      document.getElementById("10,000-15,000").checked = false;
      document.getElementById("15,000+").checked = false;
    
      document.getElementById("article").checked = false;
      document.getElementById("journal").checked = false;

      var page_number_value = parseInt(e.target.id)


      // change the pagination to reflect which page has been selected 
      var pagDiv = document.getElementById("pag");
      var t = pagDiv.querySelectorAll("a");
      for (let i = 1; i < t.length - 1; i++) {
        var num_div = document.getElementById(i.toString());
        num_div.innerHTML =i.toString();
      }
      var num_div = document.getElementById(page_number_value.toString());
      num_div.innerHTML = "<strong>" + page_number_value.toString() + "</strong>";



      main_page_number = page_number_value
      var startIndex = (page_number_value - 1) * 5;
      var endIndex = page_number_value * 5
      for (let i = 1; i <=8; i++) {
        var x = document.getElementById("resp" + i.toString());
        if (x !== null) {
         
          x.hidden = true;
          var ps = x.querySelectorAll("div:not(.WA)")
        for (let j = 0; j < ps.length; j++) {
          var inner_val = document.getElementById("R" + i.toString() + "W" + j.toString());
          inner_val.hidden = true;
        }

        }
        

      }

      if (endIndex < data_response["data"][0].length) {
        var inner_respDiv = document.getElementById("resp" + page_number_value.toString());
        if (inner_respDiv != null) {
          //console.log("NOT NULL")
          inner_respDiv.hidden = false;
          var respDiv = document.getElementById("resp" + page_number_value.toString());
          var ps = respDiv.querySelectorAll("div:not(.WA)")
          for (let i = 0; i < ps.length; i++) {
            var inner_val = document.getElementById("R" + page_number_value.toString() + "W" + i.toString());
            inner_val.hidden = false;
            
        
          }
          
          reorder_div(page_number_value);
        } else {
          //console.log("NULL")
          printData(data_response["data"][0].slice(startIndex, endIndex), concept, data_response["data"][1], page_number_value)
          reorder_div(page_number_value);


        }

        
      }
      
    }
    

  });

function reorder_div(p_num) {
  var respDiv = document.getElementById("resp" + p_num.toString());
  var ps = respDiv.querySelectorAll("div:not(.WA)");

  var left_pos = 350;
  var top_pos = 540;
  //top_pos += 80;

  for (let i = 0; i < ps.length; i++) {
    var inner_val = document.getElementById("R" + p_num.toString() + "W" + i.toString());
    if (inner_val.hidden == false) {
      inner_val.style.position = "absolute";
      inner_val.style.left = left_pos + 'px';
      inner_val.style.top = top_pos + 'px';
      top_pos += 200;

    }
    

  }

  var pag_div = document.getElementById('pag');
  pag_div.style.position = "absolute";
  pag_div.style.top = (top_pos + 20).toString() + "px";
  pag_div.style.left = (left_pos + 140).toString() + "px";

};

function combined_filters(p_num) {
  
  var respDiv = document.getElementById("resp" + p_num.toString());
  //respDiv.removeAttribute("hidden"); 
  var ps = respDiv.querySelectorAll("div:not(.WA)")
  //console.log(ps);

  var y_consider = 0;
  var c_consider = 0;
  var t_consider = 0;


  t_value = ""
  var check_type = document.querySelector('input[name="type"]:checked');
  if(check_type != null) {
    t_consider = 1

    if (check_type.id == "journal") {
      t_value = "journal"
    } else if (check_type.id == "article") {
      t_value = "article"

    }

  }

  c_start = -1
  c_end = -1
  var check_cite = document.querySelector('input[name="cite"]:checked');
  if (check_cite != null) {
    c_consider = 1

    if (check_cite.id == "0-5000") {
      c_start = 0
      c_end = 5000

    } else if (check_cite.id == "5000-10,000") {
      c_start = 5000
      c_end = 10000

    } else if (check_cite.id == "10,000-15,000") {
      c_start = 10000
      c_end = 15000

    } else if (check_cite.id == "15,000+") {
      c_start = 15000
      c_end = Infinity
    }
}

  y_start = -1
  y_end = -1
  var check_year = document.querySelector('input[name="l"]:checked');
  if (check_year != null) {
    y_consider = 1
    
    if (check_year.id == "1900 - 1950") {
      y_start = 1900
      y_end = 1950

    } else if (check_year.id == "1950 - 2000") {
      y_start = 1950
      y_end = 2000

    } else if (check_year.id == "2000+") {
      y_start = 2000
      y_end = Infinity

    } 
}

  for (let i = 0; i < ps.length; i++) {
    var y_flag = 0
    var c_flag = 0
    var t_flag = 0


    var inner_val = document.getElementById("R" + p_num.toString()+ "W" + i.toString());
    var x = inner_val.getElementsByTagName('p');
    var year_text = x[(x.length - 1)].innerHTML;
    const text_array = year_text.split("|");

    var input_type = text_array[0];
    let type_result = input_type.trim();

    let matches_year = text_array[2].match(/(\d+)/);
    let matches_cite = text_array[1].match(/(\d+)/);

    let cite_num = Number(matches_cite[0])
    let year_num = Number(matches_year[0])

    if (y_start != -1 && y_end != -1) {
      if (year_num < y_start) { //dont include
        y_flag = 1;
      }
      if (y_end != Infinity) {
        if (year_num > y_end) { //dont include
          y_flag = 1;
        }

      }


    }
    if (c_start != -1 && c_end != -1) {
      if (cite_num < c_start) { //dont include
        c_flag = 1;
      }
      if (c_end != Infinity) {
        if (cite_num > c_end) { //dont include
          c_flag = 1;
        }

      }

    }
    if (t_value != "") {
      if (type_result != t_value) { //dont include
        t_flag = 1;

      }

    }

    if (y_consider == 0) {
      y_flag = 0;
    } 
    if(c_consider == 0) {
      c_flag = 0;
    }
    if (t_consider == 0) {
      t_flag = 0;
    }
    

    if (y_flag == 0 && c_flag == 0 && t_flag == 0) {
      //console.log("do not hide")
      inner_val.hidden = false;
    } else {
      //console.log("hide")
      inner_val.hidden = true;
    }

    
           
  }
  

};


function printData(data, inputValue, concept_array, p_num, data_len) {
  if (data.length == 0) {
    var workDiv = document.createElement("div");
    workDiv.style.position = "absolute";
    workDiv.style.top = "540px";
    workDiv.style.left= "350px";
    workDiv.style.textAlign= "left";

    var p = document.createElement('p');
    p.innerHTML = "No Data";
    workDiv.appendChild(p)
    document.getElementById('resp').appendChild(workDiv);


    return;
    
  }
  
  num = 1;
  c_top = 350;
  c_left = 310;

  best_concept = concept_array.length;
  if (concept_array.length > 3) {
    best_concept = 3;
  }

  for (let i = 0; i <best_concept; i++) {
    var pre = "c" + num;
    var concept_div = document.getElementById(pre);
    concept_div.hidden = false;

    display_name = concept_array[i][0]
    works_count = concept_array[i][1]
    cited_by_count = concept_array[i][2]
  
    concept_div.innerHTML += `<p style = "position: absolute; left:15px; top:0.5px;"><strong>${display_name}</strong></p>`;
    concept_div.innerHTML += `<p style="position: absolute; left:15px; top:30px;">${works_count} Works</p>`;
    concept_div.innerHTML += `<p style="position: absolute; left:15px; top:60px;">${cited_by_count} Citations</p>`;
    num += 1;
    



  }

 
  var resp_div = document.getElementById("resp");

  var left_pos = 350;
  var top_pos = 460;
  resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
  top_pos += 80;

  var page_resp_div = document.createElement("div");
  page_resp_div.setAttribute('id', "resp" + p_num.toString());
  page_resp_div.setAttribute('class', "resp" + p_num.toString());

  var left_pos = 350;
  var top_pos = 460;
  //resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
  top_pos += 80;

  

  for (let i = 0; i < data.length; i++) {

    var workDiv = document.createElement("div");
    workDiv.setAttribute('id', "R" + p_num.toString()+ "W" + i.toString());
    workDiv.setAttribute('class', "R" + p_num.toString()+ "W" + i.toString());
    workDiv.style.position = "absolute";
    workDiv.style.top = top_pos.toString() + "px";
    workDiv.style.left= left_pos.toString() + "px";
    workDiv.style.textAlign= "left";
    

    work = data[i]
    title = work[0]
    type = work[1]
    publication_year = work[2]
    final_url = work[3]
    author_list = work[4]
    cite = work[5]

    
    var a = document.createElement('a');
    a.setAttribute('href',final_url);
    a.innerHTML = title;
    workDiv.appendChild(a)
    //new end

    var l = left_pos;
    var au_end = author_list.length;
    if (au_end > 4){
      au_end = 4
    }
    //var new_div_name = "A" + i.toString()
    var new_inner_div = document.createElement("div");
    new_inner_div.setAttribute('id', "WA");
    new_inner_div.setAttribute('class', "WA");
    

    for(let j = 0; j < au_end; j++) {
     
      var p = document.createElement('p');
      p.style.display = "inline-block";
      p.style.float = "left";
      p.style.marginLeft = "5px";
      if (j != (au_end - 1)) {
        p.innerHTML = " " + author_list[j] + " , ";

      } else {
        p.innerHTML = " " + author_list[j];

      }
      
      new_inner_div.appendChild(p);
      //new end
      l += 120
    }
    
    new_inner_div.style.display = "flex";
    workDiv.appendChild(new_inner_div)


    
    var p = document.createElement('p');
    p.innerHTML = type + " | " + "Cited by " + cite.toString() + " | " + "Published in " + publication_year.toString();
    workDiv.appendChild(p)
    //new end
    top_pos += 200;

    page_resp_div.appendChild(workDiv);
    document.getElementById('resp').appendChild(page_resp_div);
    
  }

  //var data_len = data.length;
  var pag_div = document.getElementById('pag');
  pag_div.style.position = "absolute";
  pag_div.style.top = (top_pos + 20).toString() + "px";
  pag_div.style.left = (left_pos + 140).toString() + "px";
  


};


//NEW STAGE 2 STARTS BELOW
// const searchBtn = document.getElementById("search_btn")
// searchBtn.onclick = function() {
//   var respDiv = document.getElementById("resp");
//   while (respDiv.firstChild) {
//     respDiv.removeChild(respDiv.firstChild);
//  }

//  var c1Div = document.getElementById("c1");
//   while (c1Div.firstChild) {
//     c1Div.removeChild(c1Div.firstChild);
//  }

//  var c2Div = document.getElementById("c2");
//   while (c2Div.firstChild) {
//     c2Div.removeChild(c2Div.firstChild);
//  }

//  var c3Div = document.getElementById("c3");
//   while (c3Div.firstChild) {
//     c3Div.removeChild(c3Div.firstChild);
//  }
//   console.log("concept search button click");
//   const conceptInput = document.querySelector('#user_input');
//   const concept = conceptInput.value;
//   console.log(concept);
//   conceptInput.value = "";

//   fetch('http://localhost:3001/concepts.html', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept})
//   })
//   .then(response => response.json())
//   //.then(data => console.log(data['data'][0]));
//   .then(data => printData(data['data'][0], concept, data['data'][1]));

//   document.getElementById("filters_div").hidden = false;

  
  




// };


// function printData(data, inputValue, concept_array){
// var resp_div = document.getElementById("resp");

//   num = 1;
//   c_top = 350;
//   c_left = 310;
//   concept_array.forEach(function ({display_name, works_count, cited_by_count}) {
//     var pre = "c" + num;
//     var concept_div = document.getElementById(pre);
//     concept_div.hidden = false;
  
//     concept_div.innerHTML += `<p style = "position: absolute; left:15px; top:0.5px;"><strong>${display_name}</strong></p>`;
//     concept_div.innerHTML += `<p style="position: absolute; left:15px; top:30px;">${works_count} Works</p>`;
//     concept_div.innerHTML += `<p style="position: absolute; left:15px; top:60px;">${cited_by_count} Citations</p>`;
    
    

//     num += 1;



//   });
//   var left_pos = 350;
//   var top_pos = 460;
//   resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
//   top_pos += 80;
//   data.forEach(function ({work_id, concept_id, display_name , pmcid, pmid, title, type, publication_year}) {
//     console.log(top_pos);
//     if (pmcid == ""){
//       resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;"><a href='${pmid}'>${title}</a></p>`;
//       //resp_div.innerHTML += `<p style = "position:absolute; top:20px;left:250px;"></p>`
//       resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos + 30}px;left:${left_pos}px;">${type} | Published in ${publication_year}</p>`;

//     } else {
//       resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;"><a href='${pmcid}'>${title}</a></p>`;
//       resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos + 30}px;left:${left_pos}px;">${type} | Published in ${publication_year}</p>`;
    
//     }
//     top_pos += 100;
    
    
//     });

 


// };

//STAGE 2 - BEFORE THE MOCKUP WAS MADE

// searchBtn.onclick = function() {
//   console.log("concept search button click");
//   const conceptInput = document.querySelector('#user_input');
//   const concept = conceptInput.value;
//   console.log(concept);
//   conceptInput.value = "";
//   document.getElementById("0-3").checked = false;
//   document.getElementById("4-8").checked = false;
//   document.getElementById("9-12").checked = false;

//   document.getElementById("0-5000").checked = false;
//   document.getElementById("5000-10,000").checked = false;
//   document.getElementById("10,000-15,000").checked = false;
//   document.getElementById("15,000+").checked = false;

//   document.getElementById("0-5000cc").checked = false;
//   document.getElementById("5000-10,000cc").checked = false;
//   document.getElementById("10,000-15,000cc").checked = false;
//   document.getElementById("15,000+cc").checked = false;

//   document.getElementById("table_header").innerHTML = "Showing Concepts in OpenAlex";
//   document.getElementById("table_header2").innerHTML = "Showing Concepts Ancestors in OpenAlex";

//   var c_len = 0;

//   Promise.all([
//     fetch("http://localhost:3001/concepts.html", {
//       headers: {
//         'Content-type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify({ display_name : concept})
//     }).then(response => response.json()) , 


//     fetch("http://localhost:3001/concepts-ancestors", {
//       headers: {
//         'Content-type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify({ display_name : concept})
//     }).then(response => response.json())



//   ])
//   .then((response) => {
//     c_len = response[0]['data'].length;
//     loadHTMLTable(response[0]['data']);
//     loadAncestorsHTMLTable(response[1]['data']);

//     document.getElementById("table").hidden = false;
//     document.getElementById("table2").hidden = false;
//     document.getElementById("filters_div").hidden = false;

//     var c_header_top = 310 + 70 + response[0]['data'].length*58;
//     document.getElementById("table_header2").style.top= (c_header_top).toString() + "px";
//     document.getElementById("table2").style.top = (c_header_top + 30).toString() + "px";




//   })
//   .catch((err) => {
//     console.log(err);
// });
  
  
  
  
//   // fetch('http://localhost:3001/concepts.html', {
//   //   headers: {
//   //     'Content-type': 'application/json'
//   //   },
//   //   method: 'POST',
//   //   body: JSON.stringify({ display_name : concept})
//   //   })
//   //   .then(response => response.json())
//   //   .then(data => loadHTMLTable(data['data']));
//   //   // document.getElementById("table_header").hidden = false;
//   //   document.getElementById("table").hidden = false;
//   //   document.getElementById("filters_div").hidden = false;

//     var display_name = concept;
//     var level_type = "";
//     var works_count = "";
//     var cited_by_count = "";

    

    
    




//   const levelFilterBtn0 = document.getElementById('0-3');
//   levelFilterBtn0.onclick = function() {
//   console.log("new here");
//   console.log(levelFilterBtn0.value);
//   level_type = levelFilterBtn0.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type : levelFilterBtn0.value, works_count:works_count, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const levelFilterBtn1 = document.getElementById('4-8');
//   levelFilterBtn1.onclick = function() {
//   console.log("new here 1");
//   console.log(levelFilterBtn1.value);
//   level_type = levelFilterBtn1.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type : levelFilterBtn1.value, works_count:works_count, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const levelFilterBtn2 = document.getElementById('9-12');
//   levelFilterBtn2.onclick = function() {
//   console.log("new here 2");
//   console.log(levelFilterBtn2.value);
//   level_type = levelFilterBtn2.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type : levelFilterBtn2.value, works_count:works_count, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const wcFilterBtn0 = document.getElementById('0-5000');
//   wcFilterBtn0.onclick = function() {
//   console.log(wcFilterBtn0.value);
//   works_count = wcFilterBtn0.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:wcFilterBtn0.value, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const wcFilterBtn1 = document.getElementById('5000-10,000');
//   wcFilterBtn1.onclick = function() {
//   console.log(wcFilterBtn1.value);
//   works_count = wcFilterBtn1.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:wcFilterBtn1.value, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const wcFilterBtn2 = document.getElementById('10,000-15,000');
//   wcFilterBtn2.onclick = function() {
//   console.log(wcFilterBtn2.value);
//   works_count = wcFilterBtn2.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:wcFilterBtn2.value, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const wcFilterBtn3 = document.getElementById('15,000+');
//   wcFilterBtn3.onclick = function() {
//   console.log(wcFilterBtn3.value);
//   works_count = wcFilterBtn3.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:wcFilterBtn3.value, cited_by_count:cited_by_count})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const ccFilterBtn0 = document.getElementById('0-5000cc');
//   ccFilterBtn0.onclick = function() {
//   console.log(ccFilterBtn0.value);
//   cited_by_count = ccFilterBtn0.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:works_count, cited_by_count:ccFilterBtn0.value})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const ccFilterBtn1 = document.getElementById('5000-10,000cc');
//   ccFilterBtn1.onclick = function() {
//   console.log(ccFilterBtn1.value);
//   cited_by_count = ccFilterBtn1.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:works_count, cited_by_count:ccFilterBtn1.value})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

// };

//   const ccFilterBtn2 = document.getElementById('10,000-15,000cc');
//   ccFilterBtn2.onclick = function() {
//   console.log(ccFilterBtn2.value);
//   cited_by_count = ccFilterBtn2.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:works_count, cited_by_count:ccFilterBtn2.value})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;



// };

//   const ccFilterBtn3 = document.getElementById('15,000+cc');
//   ccFilterBtn3.onclick = function() {
//   console.log(ccFilterBtn3.value);
//   cited_by_count = ccFilterBtn3.value;

//   fetch('http://localhost:3001/conceptsfilter', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : concept, level_type :level_type, works_count:works_count, cited_by_count:ccFilterBtn3.value})
//     })
//     .then(response => response.json())
//     .then(data => loadHTMLTable(data['data']));
//     document.getElementById("table").hidden = false;
//     document.getElementById("filters_div").hidden = false;

//   };


// };









function loadHTMLTable(data){
  const table = document.querySelector('table tbody');
  if (data.length === 0) {
    table.innerHTML = "<tr><td class = 'no-data' colspan = '5'>No data</td></tr>";
    return;

  }

  let tableHtml = "";

  data.forEach(function ({id, display_name, level, works_count, cited_by_count}) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${display_name}</td>`;
    tableHtml += `<td>${level}</td>`;
    tableHtml += `<td>${works_count}</td>`;
    tableHtml += `<td>${cited_by_count}</td>`;
    
    tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;


};


function loadAncestorsHTMLTable(data){
  //const table = document.querySelector('table2 tbody');
  const table = document.getElementById("table2");
  if (data.length === 0) {
    table.innerHTML = "<tr><td class = 'no-data' colspan = '3'>No data</td></tr>";
    return;

  }

  let tableHtml = "";
  tableHtml += `<th>ID</th>`;
  tableHtml += `<th>Display Name</th>`;
  tableHtml += `<th>Ancestor ID</th>`;
  tableHtml += `<th>Ancestor Display Name</th>`;

  data.forEach(function ({id, display_name, ancestor_id, ancestor_display_name}) {
    tableHtml += "<tr>";
    tableHtml += `<td>${id}</td>`;
    tableHtml += `<td>${display_name}</td>`;
    tableHtml += `<td>${ancestor_id}</td>`;
    tableHtml += `<td>${ancestor_display_name}</td>`;
    
    tableHtml += "</tr>";
    });

    table.innerHTML = tableHtml;


};






//OLD BELOW 


// document.addEventListener('DOMContentLoaded', function(){
//   console.log("here");
  
//   loadHTMLTable([]);



// });

// const searchBtn = document.querySelector('#search_btn');


// searchBtn.onclick = function() {
//   const conceptInput = document.querySelector('#concept_input');
//   const concept = conceptInput.value;
//   console.log(concept);
//   conceptInput.value = "";

//   fetch('http://localhost:3001/concepts.html', {
//       headers: {
//           'Content-type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify({ display_name : concept})
//   })
//   .then(response => response.json())
//   .then(data => loadHTMLTable(data['data']));
// }

// function loadHTMLTable(data){
//   const table = document.querySelector('table tbody');
//   if (data.length === 0) {
//     table.innerHTML = "<tr><td class = 'no-data' colspan = '3'>No data</td></tr>";
//     return;

//   }

//   let tableHtml = "";

//   data.forEach(function ({id, display_name, works_count}) {
//     tableHtml += "<tr>";
//     tableHtml += `<td>${id}</td>`;
//     tableHtml += `<td>${display_name}</td>`;
//     tableHtml += `<td>${works_count}</td>`;
    
//     tableHtml += "</tr>";
//     });

//     table.innerHTML = tableHtml;


// }