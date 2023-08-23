//const { values } = require("lodash");
//change CSS positioning

const searchBtn = document.querySelector('#search_btn');

var data_response = null;

var index_input = document.querySelector('#user_input').value;

var main_page_number = 1;

searchBtn.onclick = function() {
  var respDiv = document.getElementById("resp");
  while (respDiv.firstChild) {
    respDiv.removeChild(respDiv.firstChild);
 }

 // not displaying the top 3 entities from search results 

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

  console.log("main index page search button click");
  const indexInput = document.querySelector('#user_input');
  const index_input = indexInput.value;
  indexInput.value = "";

  var page_num = null;
  var pag_div = document.getElementById("pag");
  if(pag_div.hidden  == true) {
    page_num = 1;
  }

  var data_len = null;
  fetch('http://localhost:3001/index.html', {
    headers: {
      'Content-type': 'application/json'
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: JSON.stringify({ display_name : index_input, page_number: page_num})
  })
  .then(response => response.json())
  .then(data => {data_response = data})
  .then(() => printData(data_response["data"].slice(0, 5), index_input, data_response["data"][1], 1, data_response["data"][0].length))



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

    if (endIndex < data_response["data"].length) {
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
        printData(data_response["data"].slice(startIndex, endIndex), index_input, data_response["data"][1], page_number_value)
        reorder_div(page_number_value);


      }

      
    }
    
  }
  

});


function reorder_div(p_num) {
  var respDiv = document.getElementById("resp" + p_num.toString());
  var ps = respDiv.querySelectorAll("div:not(.WA)");

  //SINCE I AM NOT DISPLAYING THE TOP ENTITIES -> MAYBE CHANGE THE TOP_POS VALUE TO A SMALLER VALUE
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


function printData(data, inputValue, index_array, p_num, data_len) {
  console.log(data)
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
  //chnage top value 
  c_top = 350;
  c_left = 310;



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

  var pag_div = document.getElementById('pag');
  pag_div.style.position = "absolute";
  pag_div.style.top = (top_pos + 20).toString() + "px";
  pag_div.style.left = (left_pos + 140).toString() + "px";






};


// searchBtn.onclick = function() {
//     console.log("Here");
//     const userInput = document.querySelector('#user_input');
//     const input = userInput.value;
//     console.log(input);
//     userInput.value = "";

//     console.log("all drop");
//         var c_len = 0;
//         var i_len = 0;
//         var s_len = 0;
//         var p_len = 0;
//         var test = 0;
//         // document.getElementById("concepts_header").innerHTML = "Concepts";
//         // document.getElementById("institutions_header").innerHTML = "Institutions";
//         // document.getElementById("sources_header").innerHTML = "Sources";
//         // document.getElementById("publishers_header").innerHTML = "Publishers";

        

//         Promise.all([
//             fetch("http://localhost:3001/concepts", {
//               headers: {
//                 'Content-type': 'application/json'
//               },
//               method: 'POST',
//               body: JSON.stringify({ display_name : input})
//             }).then(response => response.json())
//             ,
//             fetch("http://localhost:3001/institutions", {
//               headers: {
//                 'Content-type': 'application/json'
//               },
//               method: 'POST',
//               body: JSON.stringify({ display_name : input})
//             }).then(response => response.json()),
//             fetch("http://localhost:3001/sources", {
//               headers: {
//                 'Content-type': 'application/json'
//               },
//               method: 'POST',
//               body: JSON.stringify({ display_name : input})
//             }).then(response => response.json()),
//             fetch("http://localhost:3001/publishers", {
//               headers: {
//                 'Content-type': 'application/json'
//               },
//               method: 'POST',
//               body: JSON.stringify({ display_name : input})
//             }).then(response => response.json())
//           ])
//           .then((response) => {
//             c_len = response[0]['data'].length;
//             i_len = response[1]['data'].length;
//             s_len = response[2]['data'].length;
//             p_len = response[3]['data'].length;
//             test = c_len;
//             loadconceptsHTMLTable(response[0]['data'])
//             loadInstitutionsHTMLTable(response[1]['data'])
//             loadSourcesHTMLTable(response[2]['data'])
//             loadPublishersHTMLTable(response[3]['data'])
//             console.log(response[0]['data'])
//             console.log(response[0]['data'].length);
//             console.log((120 + 20 + response[0]['data'].length*10).toString());


//             document.getElementById("concepts_header").style.top = "120px";
//             document.getElementById("concepts_table").style.top = "120px";
            
//             var i_header_top = 120 + 80 + response[0]['data'].length*58;
//             document.getElementById("institutions_header").style.top= (i_header_top).toString() + "px";
//             document.getElementById("institutions_table").style.top = (i_header_top + 30).toString() + "px";

//             var s_header_top = i_header_top + 50 + 100 + response[1]['data'].length*58;
//             document.getElementById("sources_header").style.top= (s_header_top).toString() + "px";
//             document.getElementById("sources_table").style.top = (s_header_top + 30).toString() + "px";

//             var p_header_top = s_header_top + 80 + 120 + response[2]['data'].length*58;
//             document.getElementById("publishers_header").style.top= (p_header_top).toString() + "px";
//             document.getElementById("publishers_table").style.top = (p_header_top + 30).toString() + "px";
//            //json response

//             document.getElementById("concepts_header").innerHTML = "Concepts";
//             document.getElementById("institutions_header").innerHTML = "Institutions";
//             document.getElementById("sources_header").innerHTML = "Sources";
//             document.getElementById("publishers_header").innerHTML = "Publishers";

//             document.getElementById("institutions_table").hidden = false;
//             document.getElementById("concepts_table").hidden = false;
//             document.getElementById("sources_table").hidden = false;
//             document.getElementById("publishers_table").hidden = false;
//             document.getElementById("works_table").hidden = true;
//             document.getElementById("authors_table").hidden = true;
//          })
//          .catch((err) => {
//              console.log(err);
//          });






    // console.log(dropBox_value);
    // if (dropBox_value == "all") {

    //     console.log("all drop");
    //     var c_len = 0;
    //     var i_len = 0;
    //     var s_len = 0;
    //     var p_len = 0;
    //     var test = 0;

    //     Promise.all([
    //         fetch("http://localhost:3001/concepts", {
    //           headers: {
    //             'Content-type': 'application/json'
    //           },
    //           method: 'POST',
    //           body: JSON.stringify({ display_name : input})
    //         }).then(response => response.json())
    //         ,
    //         fetch("http://localhost:3001/institutions", {
    //           headers: {
    //             'Content-type': 'application/json'
    //           },
    //           method: 'POST',
    //           body: JSON.stringify({ display_name : input})
    //         }).then(response => response.json()),
    //         fetch("http://localhost:3001/sources", {
    //           headers: {
    //             'Content-type': 'application/json'
    //           },
    //           method: 'POST',
    //           body: JSON.stringify({ display_name : input})
    //         }).then(response => response.json()),
    //         fetch("http://localhost:3001/publishers", {
    //           headers: {
    //             'Content-type': 'application/json'
    //           },
    //           method: 'POST',
    //           body: JSON.stringify({ display_name : input})
    //         }).then(response => response.json())
    //       ])
    //       .then((response) => {
    //         c_len = response[0]['data'].length;
    //         i_len = response[1]['data'].length;
    //         s_len = response[2]['data'].length;
    //         p_len = response[3]['data'].length;
    //         test = c_len;
    //         loadconceptsHTMLTable(response[0]['data'])
    //         loadInstitutionsHTMLTable(response[1]['data'])
    //         loadSourcesHTMLTable(response[2]['data'])
    //         loadPublishersHTMLTable(response[3]['data'])
    //         console.log(response[0]['data'])
    //         console.log(response[0]['data'].length);
    //         console.log((120 + 20 + response[0]['data'].length*10).toString());


    //         document.getElementById("concepts_header").style.top = "120px";
    //         document.getElementById("concepts_table").style.top = "120px";
            
    //         var i_header_top = 120 + 80 + response[0]['data'].length*58;
    //         document.getElementById("institutions_header").style.top= (i_header_top).toString() + "px";
    //         document.getElementById("institutions_table").style.top = (i_header_top + 30).toString() + "px";

    //         var s_header_top = i_header_top + 50 + 100 + response[1]['data'].length*58;
    //         document.getElementById("sources_header").style.top= (s_header_top).toString() + "px";
    //         document.getElementById("sources_table").style.top = (s_header_top + 30).toString() + "px";

    //         var p_header_top = s_header_top + 80 + 120 + response[2]['data'].length*58;
    //         document.getElementById("publishers_header").style.top= (p_header_top).toString() + "px";
    //         document.getElementById("publishers_table").style.top = (p_header_top + 30).toString() + "px";
    //        //json response

    //         document.getElementById("concepts_header").innerHTML = "Concepts";
    //         document.getElementById("institutions_header").innerHTML = "Institutions";
    //         document.getElementById("sources_header").innerHTML = "Sources";
    //         document.getElementById("publishers_header").innerHTML = "Publishers";

    //         document.getElementById("institutions_table").hidden = false;
    //         document.getElementById("concepts_table").hidden = false;
    //         document.getElementById("sources_table").hidden = false;
    //         document.getElementById("publishers_table").hidden = false;
    //         document.getElementById("works_table").hidden = true;
    //         document.getElementById("authors_table").hidden = true;
    //      })
    //      .catch((err) => {
    //          console.log(err);
    //      });
         

        


        

        
        

    // } else if (dropBox_value == "concepts") {
    //     console.log("c drop");
    //     document.getElementById("concepts_header").innerHTML = "Concepts";
    //     document.getElementById("institutions_header").innerHTML = "";
    //     document.getElementById("sources_header").innerHTML = "";
    //     document.getElementById("publishers_header").innerHTML = "";
    //     fetch('http://localhost:3001/concepts', {
    //         headers: {
    //       'Content-type': 'application/json'
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({ display_name : input})
    //     })
    //     .then(response => response.json())
    //     .then(data => loadconceptsHTMLTable(data['data']));

    //     document.getElementById("institutions_table").hidden = true;
    //     document.getElementById("concepts_table").hidden = false;
    //     document.getElementById("sources_table").hidden = true;
    //     document.getElementById("publishers_table").hidden = true;
    //     document.getElementById("works_table").hidden = true;
    //     document.getElementById("authors_table").hidden = true;

    // } else if (dropBox_value == "institutions") {
    //     console.log("i drop");
    //     document.getElementById("institutions_header").innerHTML = "Institutions";
    //     document.getElementById("concepts_header").innerHTML = "";
    //     document.getElementById("sources_header").innerHTML = "";
    //     document.getElementById("publishers_header").innerHTML = "";
    //     fetch('http://localhost:3001/institutions', {
    //         headers: {
    //       'Content-type': 'application/json'
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({ display_name : input})
    //     })
    //     .then(response => response.json())
    //     .then(data => loadInstitutionsHTMLTable(data['data']));

    //     document.getElementById("institutions_table").hidden = false;
    //     document.getElementById("concepts_table").hidden = true;
    //     document.getElementById("sources_table").hidden = true;
    //     document.getElementById("publishers_table").hidden = true;
    //     document.getElementById("works_table").hidden = true;
    //     document.getElementById("authors_table").hidden = true;

    //     document.getElementById("institutions_header").style.top= "100px";
    //     document.getElementById("institutions_table").style.top = "120px";

    // } else if (dropBox_value == "sources") {
    //     console.log("s drop");
    //     document.getElementById("institutions_header").innerHTML = "";
    //     document.getElementById("concepts_header").innerHTML = "";
    //     document.getElementById("sources_header").innerHTML = "Sources";
    //     document.getElementById("publishers_header").innerHTML = "";
    //     fetch('http://localhost:3001/sources', {
    //         headers: {
    //       'Content-type': 'application/json'
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({ display_name : input})
    //     })
    //     .then(response => response.json())
    //     .then(data => loadSourcesHTMLTable(data['data']));

    //     document.getElementById("institutions_table").hidden = true;
    //     document.getElementById("concepts_table").hidden = true;
    //     document.getElementById("sources_table").hidden = false;
    //     document.getElementById("publishers_table").hidden = true;
    //     document.getElementById("works_table").hidden = true;
    //     document.getElementById("authors_table").hidden = true;

    //     document.getElementById("sources_header").style.top= "100px";
    //     document.getElementById("sources_table").style.top = "120px";

    // } else if (dropBox_value == "publishers") {
    //     console.log("p drop");

    //     document.getElementById("institutions_header").innerHTML = "";
    //     document.getElementById("concepts_header").innerHTML = "";
    //     document.getElementById("sources_header").innerHTML = "";
    //     document.getElementById("publishers_header").innerHTML = "Publishers";
    //     fetch('http://localhost:3001/publishers', {
    //         headers: {
    //       'Content-type': 'application/json'
    //     },
    //     method: 'POST',
    //     body: JSON.stringify({ display_name : input})
    //     })
    //     .then(response => response.json())
    //     .then(data => loadPublishersHTMLTable(data['data']));

    //     document.getElementById("institutions_table").hidden = true;
    //     document.getElementById("concepts_table").hidden = true;
    //     document.getElementById("sources_table").hidden = true;
    //     document.getElementById("publishers_table").hidden = false;
    //     document.getElementById("works_table").hidden = true;
    //     document.getElementById("authors_table").hidden = true;

    //     document.getElementById("publishers_header").style.top= "100px";
    //     document.getElementById("publishers_table").style.top = "120px";

    // }




//}



function loadconceptsHTMLTable(data){
    console.log("cocnepts table");
    // const table = document.querySelector('concepts_table tbody');
    // document.getElementById("institutions_table").hidden = true;
    // document.getElementById("concepts_table").hidden = false;
    // document.getElementById("sources_table").hidden = true;
    // document.getElementById("publishers_table").hidden = true;
    // document.getElementById("works_table").hidden = true;
    // document.getElementById("authors_table").hidden = true;
    const table = document.getElementById("concepts_table");

    // table += "<th>ID</th>";
    // table += "<th>Display Name</th>";
    // table += "<th>Works Count</th>";
    // const tbody = table.getElementsByTagName("tbody");
    if (data.length === 0) {
        table.innerHTML = "<tr><td class = 'no-data' colspan = '3'>No data</td></tr>";
      return;
  
    }
  
    let tableHtml = "";

    tableHtml += "<th>ID</th>";
    tableHtml += "<th>Display Name</th>";
    tableHtml += "<th>Works Count</th>";
  
    data.forEach(function ({id, display_name, works_count}) {
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${display_name}</td>`;
      tableHtml += `<td>${works_count}</td>`;
      //tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
      //tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
      tableHtml += "</tr>";
      });
  
      table.innerHTML = tableHtml;
  
  
  }


  function loadInstitutionsHTMLTable(data){
    // document.getElementById("institutions_table").hidden = false;
    // document.getElementById("concepts_table").hidden = true;
    // document.getElementById("sources_table").hidden = true;
    // document.getElementById("publishers_table").hidden = true;
    // document.getElementById("works_table").hidden = true;
    // document.getElementById("authors_table").hidden = true;
    const table = document.getElementById("institutions_table");
    if (data.length === 0) {
      table.innerHTML = "<tr><td class = 'no-data' colspan = '7'>No data</td></tr>";
      return;
  
    }
  
    let tableHtml = "";

    tableHtml += "<th>ID</th>";
    tableHtml += "<th>Display Name</th>";
    tableHtml += "<th>Country Code</th>";
    tableHtml += "<th>Type</th>";
    tableHtml += "<th>HomePage URL</th>";
    tableHtml += "<th>Works Count</th>";
    tableHtml += "<th>Cited By Count</th>";
  
    data.forEach(function ({id, display_name, country_code, type, homepage_url, works_count, cited_by_count}) {
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${display_name}</td>`;
      tableHtml += `<td>${country_code}</td>`;
      tableHtml += `<td>${type}</td>`;
      tableHtml += `<td>${homepage_url}</td>`;
      tableHtml += `<td>${works_count}</td>`;
      tableHtml += `<td>${cited_by_count}</td>`;
      //tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
      //tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
      tableHtml += "</tr>";
      });
  
      table.innerHTML = tableHtml;
  
  
  }

  function loadSourcesHTMLTable(data){
    // document.getElementById("institutions_table").hidden = true;
    // document.getElementById("concepts_table").hidden = true;
    // document.getElementById("sources_table").hidden = false;
    // document.getElementById("publishers_table").hidden = true;
    // document.getElementById("works_table").hidden = true;
    // document.getElementById("authors_table").hidden = true;
    const table = document.getElementById("sources_table");
    if (data.length === 0) {
      table.innerHTML = "<tr><td class = 'no-data' colspan = '7'>No data</td></tr>";
      return;
  
    }
  
    let tableHtml = "";

    tableHtml += "<th>ID</th>";
    tableHtml += "<th>Display Name</th>";
    tableHtml += "<th>Publisher</th>";
    tableHtml += "<th>HomePage URL</th>";
    tableHtml += "<th>Works Count</th>";
    tableHtml += "<th>Cited By Count</th>";
  
    data.forEach(function ({id, display_name, publisher, homepage_url, works_count, cited_by_count}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${display_name}</td>`;
        tableHtml += `<td>${publisher}</td>`;
        tableHtml += `<td>${homepage_url}</td>`;
        tableHtml += `<td>${works_count}</td>`;
        tableHtml += `<td>${cited_by_count}</td>`;
        //tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        //tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
        });
      table.innerHTML = tableHtml;
  
  
  }


  function loadPublishersHTMLTable(data){
    // document.getElementById("institutions_table").hidden = true;
    // document.getElementById("concepts_table").hidden = true;
    // document.getElementById("sources_table").hidden = true;
    // document.getElementById("publishers_table").hidden = false;
    // document.getElementById("works_table").hidden = true;
    // document.getElementById("authors_table").hidden = true;
    const table = document.getElementById("publishers_table");
    if (data.length === 0) {
      table.innerHTML = "<tr><td class = 'no-data' colspan = '7'>No data</td></tr>";
      return;
  
    }
  
    let tableHtml = "";

    tableHtml += "<th>ID</th>";
    tableHtml += "<th>Display Name</th>";
    tableHtml += "<th>Works Count</th>";
    tableHtml += "<th>Cited By Count</th>";
  
    data.forEach(function ({id, display_name, works_count, cited_by_count}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${display_name}</td>`;
        tableHtml += `<td>${works_count}</td>`;
        tableHtml += `<td>${cited_by_count}</td>`;
        //tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</td>`;
        //tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
        tableHtml += "</tr>";
        });

      table.innerHTML = tableHtml;
  
  
  }



