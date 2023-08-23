const searchBtn = document.getElementById("search_btn")

var data_response = null;

var work = document.querySelector('#user_input').value;

var main_page_number = 1;

searchBtn.onclick = function() {
  var respDiv = document.getElementById("resp");
  while (respDiv.firstChild) {
    respDiv.removeChild(respDiv.firstChild);
 }

 var work1Div = document.getElementById("work1");
  while (work1Div.firstChild) {
    work1Div.removeChild(work1Div.firstChild);
 }

 var work2Div = document.getElementById("work2");
  while (work2Div.firstChild) {
    work2Div.removeChild(work2Div.firstChild);
 }

 var work3Div = document.getElementById("work3");
  while (work3Div.firstChild) {
    work3Div.removeChild(work3Div.firstChild);
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

  console.log("work search button click");
  const workInput = document.querySelector('#user_input');
  const work = workInput .value;
  workInput.value = "";

  var page_num = null;
  var pag_div = document.getElementById("pag");
  if(pag_div.hidden  == true) {
    page_num = 1;
  }

  var data_len = null;
  fetch('http://localhost:3001/works.html', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ display_name : work, page_number: page_num})
  })
  .then(response => response.json())
  .then(data => {data_response = data})
  .then(() => printData(data_response["data"][0].slice(0, 5), work, data_response["data"][1], 1, data_response["data"][0].length))

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
    console.log("reached here")
    console.log(data_response["data"][0].length)

    if (endIndex < data_response["data"][0].length) {
      console.log("test")
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
        printData(data_response["data"][0].slice(startIndex, endIndex), work, data_response["data"][1], page_number_value)
        reorder_div(page_number_value);


      }

      
    }
    
  }
  

});

function reorder_div(p_num) {
    var respDiv = document.getElementById("resp");
    var ps = respDiv.querySelectorAll("div:not(.WA):not(.rel_heading)")
    //console.log(ps.length);
  
    var top_pos = 350;
    var left_pos = 540;
    var start_flag = 0
  
    for (let i = 0; i < 10; i++) {
      start_flag = 1;
      var inner_val = document.getElementById("R" + p_num.toString() + "W" + i.toString());
      if (inner_val.hidden == false) {
        inner_val.style.position = "absolute";
        inner_val.style.left = left_pos + 'px';
        inner_val.style.top = top_pos + 'px';
        top_pos += 200;
      }
    }
    if (start_flag == 0) {
      top_pos += 100;

    }
    if (p_num == 8) {
    var heading = document.getElementById("rel_heading");
    heading.style.position = "absolute";
    heading.style.left = left_pos + 'px';
    heading.style.top = top_pos + 'px';
    top_pos += 200;

    for (let i = 10; i < ps.length; i++) {
      var inner_val = document.getElementById("R" + p_num.toString() + "W" + i.toString());
      if (inner_val.hidden == false) {
        inner_val.style.position = "absolute";
        inner_val.style.left = left_pos + 'px';
        inner_val.style.top = top_pos + 'px';
        top_pos += 200;
      }
    }}

    var pag_div = document.getElementById('pag');
  pag_div.style.position = "absolute";
  pag_div.style.top = (top_pos + 20).toString() + "px";
  pag_div.style.left = (left_pos + 140).toString() + "px";

  };


function combined_filter() {
    var respDiv = document.getElementById("resp");
    var ps = respDiv.querySelectorAll("div:not(.WA):not(.rel_heading)")
  
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
  //console.log(ps.length);
    for (let i = 0; i < ps.length; i++) {
      var y_flag = 0
      var c_flag = 0
      var t_flag = 0
  
  
      var inner_val = document.getElementById("W" + i.toString());
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
        inner_val.hidden = false;
      } else {
        inner_val.hidden = true;
      }
    }
};
  

function printData(data, inputValue, work_array, p_num, data_len) {
  console.log(data)
  console.log(work_array)
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
    var resp_div = document.getElementById("resp");
    top_pos = 350;
    left_pos = 310;
    resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
    top_pos += 80;

    var page_resp_div = document.createElement("div");
    page_resp_div.setAttribute('id', "resp" + p_num.toString());
    page_resp_div.setAttribute('class', "resp" + p_num.toString());

    var left_pos = 350;
    var top_pos = 460;
    //resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
    top_pos += 80;

    var i = 0;

    for (; i < data.length; i++) {
        var workDiv = document.createElement("div");
        workDiv.setAttribute('id',"R" + p_num.toString()+ "W" + i.toString());
        workDiv.setAttribute('class',"R" + p_num.toString()+ "W" + i.toString());
        workDiv.style.position = "absolute";
        workDiv.style.top = top_pos.toString() + "px";
        workDiv.style.left= left_pos.toString() + "px";
        workDiv.style.textAlign= "left";

        //console.log(workDiv.id);

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

        var l = left_pos;
        var au_end = author_list.length;
        if (au_end > 4){
        au_end = 4
        }
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

        top_pos += 200;

        //document.getElementById('resp').appendChild(workDiv);

        page_resp_div.appendChild(workDiv);
        document.getElementById('resp').appendChild(page_resp_div);



    }

    if (p_num == 8) {

    //resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Related Works For "${inputValue}"</strong></p>`;
    var heading_div = document.createElement("div");
    heading_div.setAttribute('id',"rel_heading"); // + i.toString()
    heading_div.setAttribute('class',"rel_heading"); // + i.toString()
    heading_div.style.position = "absolute";
    heading_div.style.top = top_pos.toString() + "px";
    heading_div.style.left= left_pos.toString() + "px";
    heading_div.style.textAlign= "left";

    var p = document.createElement('STRONG');
    p.innerHTML = "Showing Related Works For " + `"${inputValue}"`;
    p.style.fontSize = "30px";
    heading_div.appendChild(p);
    document.getElementById('resp').appendChild(heading_div);
    top_pos += 80;

    for (let j = 0; j < work_array.length; j++) {
        var workDiv = document.createElement("div");
        workDiv.setAttribute('id', "W" + i.toString()); // + i.toString()
        workDiv.setAttribute('class', "W" + i.toString()); // + i.toString()
        workDiv.style.position = "absolute";
        workDiv.style.top = top_pos.toString() + "px";
        workDiv.style.left= left_pos.toString() + "px";
        workDiv.style.textAlign= "left";
        //console.log(workDiv.id);

        work = work_array[j]
        title = work[0]
        type = work[1]
        publication_year = work[2]
        final_url = work[3]
        author_list = work[4]
        cite = work[5]

        var a = document.createElement('a');
        a.setAttribute('href',final_url); //final_url
        a.innerHTML = title;
        workDiv.appendChild(a)

        var l = left_pos;
        var au_end = author_list.length;
        if (au_end > 4){
        au_end = 4
        }
        var new_inner_div = document.createElement("div");
        new_inner_div.setAttribute('id', "WA");
        new_inner_div.setAttribute('class', "WA");

        for(let j = 0; j < au_end; j++) {
        var p = document.createElement('p');
        p.innerHTML = author_list[j];
        new_inner_div.appendChild(p);

        l += 120
        }
    
        new_inner_div.style.display = "flex";
        workDiv.appendChild(new_inner_div)


        var p = document.createElement('p');
        p.innerHTML = type + " | " + "Cited by " + cite.toString() + " | " + "Published in " + publication_year.toString();
        workDiv.appendChild(p)

        top_pos += 200;

        document.getElementById('resp').appendChild(workDiv);

        i += 1



    }
  
  }

  var pag_div = document.getElementById('pag');
  pag_div.style.position = "absolute";
  pag_div.style.top = (top_pos + 20).toString() + "px";
  pag_div.style.left = (left_pos + 140).toString() + "px";




















};


// const searchBtn = document.getElementById("search_btn")

// searchBtn.onclick = function() {
//   var respDiv = document.getElementById("resp");
//   while (respDiv.firstChild) {
//     respDiv.removeChild(respDiv.firstChild);
//  }

//  var work1Div = document.getElementById("work1");
//   while (work1Div.firstChild) {
//     work1Div.removeChild(work1Div.firstChild);
//  }

//  var work2Div = document.getElementById("work2");
//   while (work2Div.firstChild) {
//     work2Div.removeChild(work2Div.firstChild);
//  }

//  var work3Div = document.getElementById("work3");
//   while (work3Div.firstChild) {
//     work3Div.removeChild(work3Div.firstChild);
//  }

//   document.getElementById("1900 - 1950").checked = false;
//   document.getElementById("1950 - 2000").checked = false;
//   document.getElementById("2000+").checked = false;

//   document.getElementById("0-5000").checked = false;
//   document.getElementById("5000-10,000").checked = false;
//   document.getElementById("10,000-15,000").checked = false;
//   document.getElementById("15,000+").checked = false;

//   console.log("work search button click");
//   const workInput = document.querySelector('#user_input');
//   const work = workInput .value;
//   console.log(work);
//   workInput.value = "";

//   fetch('http://localhost:3001/works.html', {
//     headers: {
//       'Content-type': 'application/json'
//     },
//     method: 'POST',
//     body: JSON.stringify({ display_name : work})
//   })
//   .then(response => response.json())
//   .then(data => printData(data['data'][0], work, data['data'][1]));

//   document.getElementById("filters_div").hidden = false;

//   document.getElementById("year_filter").addEventListener("click", function(e) {
//     if(e.target && e.target.nodeName == "INPUT") {
//       combined_filter();
//       reorder_div();
//     }
//   });

//   document.getElementById("citation_count_filter").addEventListener("click", function(e) {
//     if(e.target && e.target.nodeName == "INPUT") {
//       combined_filter();
//       reorder_div();
//     }
//   });

//   document.getElementById("type_filter").addEventListener("click", function(e) {
//     if(e.target && e.target.nodeName == "INPUT") {
//       combined_filter();
//       reorder_div();
//     }
//   });

// };

// function reorder_div() {
//     var respDiv = document.getElementById("resp");
//     var ps = respDiv.querySelectorAll("div:not(.WA):not(.rel_heading)")
//     //console.log(ps.length);
  
//     var top_pos = 420;
//     var left_pos = 310;
//     var start_flag = 0
  
//     for (let i = 0; i < 10; i++) {
//       start_flag = 1;
//       var inner_val = document.getElementById("W" + i.toString());
//       if (inner_val.hidden == false) {
//         inner_val.style.position = "absolute";
//         inner_val.style.left = left_pos + 'px';
//         inner_val.style.top = top_pos + 'px';
//         top_pos += 200;
//       }
//     }
//     if (start_flag == 0) {
//       top_pos += 100;

//     }
//     var heading = document.getElementById("rel_heading");
//     heading.style.position = "absolute";
//     heading.style.left = left_pos + 'px';
//     heading.style.top = top_pos + 'px';
//     top_pos += 200;

//     for (let i = 10; i < ps.length; i++) {
//       var inner_val = document.getElementById("W" + i.toString());
//       if (inner_val.hidden == false) {
//         inner_val.style.position = "absolute";
//         inner_val.style.left = left_pos + 'px';
//         inner_val.style.top = top_pos + 'px';
//         top_pos += 200;
//       }
//     }

//   };


// function combined_filter() {
//     var respDiv = document.getElementById("resp");
//     var ps = respDiv.querySelectorAll("div:not(.WA):not(.rel_heading)")
  
//     var y_consider = 0;
//     var c_consider = 0;
//     var t_consider = 0;
  
  
//     t_value = ""
//     var check_type = document.querySelector('input[name="type"]:checked');
//     if(check_type != null) {
//       t_consider = 1
  
//       if (check_type.id == "journal") {
//         t_value = "journal"
//       } else if (check_type.id == "article") {
//         t_value = "article"
  
//       }
  
//     }
  
//     c_start = -1
//     c_end = -1
//     var check_cite = document.querySelector('input[name="cite"]:checked');
//     if (check_cite != null) {
//       c_consider = 1
  
//       if (check_cite.id == "0-5000") {
//         c_start = 0
//         c_end = 5000
  
//       } else if (check_cite.id == "5000-10,000") {
//         c_start = 5000
//         c_end = 10000
  
//       } else if (check_cite.id == "10,000-15,000") {
//         c_start = 10000
//         c_end = 15000
  
//       } else if (check_cite.id == "15,000+") {
//         c_start = 15000
//         c_end = Infinity
//       }
//   }
  
//     y_start = -1
//     y_end = -1
//     var check_year = document.querySelector('input[name="l"]:checked');
//     if (check_year != null) {
//       y_consider = 1
      
//       if (check_year.id == "1900 - 1950") {
//         y_start = 1900
//         y_end = 1950
  
//       } else if (check_year.id == "1950 - 2000") {
//         y_start = 1950
//         y_end = 2000
  
//       } else if (check_year.id == "2000+") {
//         y_start = 2000
//         y_end = Infinity
  
//       } 
//   }
//   //console.log(ps.length);
//     for (let i = 0; i < ps.length; i++) {
//       var y_flag = 0
//       var c_flag = 0
//       var t_flag = 0
  
  
//       var inner_val = document.getElementById("W" + i.toString());
//       var x = inner_val.getElementsByTagName('p');
//       var year_text = x[(x.length - 1)].innerHTML;
//       const text_array = year_text.split("|");
  
//       var input_type = text_array[0];
//       let type_result = input_type.trim();
  
//       let matches_year = text_array[2].match(/(\d+)/);
//       let matches_cite = text_array[1].match(/(\d+)/);
  
//       let cite_num = Number(matches_cite[0])
//       let year_num = Number(matches_year[0])
  
//       if (y_start != -1 && y_end != -1) {
//         if (year_num < y_start) { //dont include
//           y_flag = 1;
//         }
//         if (y_end != Infinity) {
//           if (year_num > y_end) { //dont include
//             y_flag = 1;
//           }
  
//         }
  
  
//       }
//       if (c_start != -1 && c_end != -1) {
//         if (cite_num < c_start) { //dont include
//           c_flag = 1;
//         }
//         if (c_end != Infinity) {
//           if (cite_num > c_end) { //dont include
//             c_flag = 1;
//           }
  
//         }
  
//       }
//       if (t_value != "") {
//         if (type_result != t_value) { //dont include
//           t_flag = 1;
  
//         }
  
//       }
  
//       if (y_consider == 0) {
//         y_flag = 0;
//       } 
//       if(c_consider == 0) {
//         c_flag = 0;
//       }
//       if (t_consider == 0) {
//         t_flag = 0;
//       }
//       if (y_flag == 0 && c_flag == 0 && t_flag == 0) {
//         inner_val.hidden = false;
//       } else {
//         inner_val.hidden = true;
//       }
//     }
// };
  

// function printData(data, inputValue, work_array) {
//     if (data.length == 0) {
//         var workDiv = document.createElement("div");
//         workDiv.style.position = "absolute";
//         workDiv.style.top = "540px";
//         workDiv.style.left= "350px";
//         workDiv.style.textAlign= "left";
    
//         var p = document.createElement('p');
//         p.innerHTML = "No Data";
//         workDiv.appendChild(p)
//         document.getElementById('resp').appendChild(workDiv);
    
    
//         return;
        
//     }
//     var resp_div = document.getElementById("resp");
//     top_pos = 350;
//     left_pos = 310;
//     resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Results for "${inputValue}"</strong></p>`;
//     top_pos += 80;

//     var i = 0;

//     for (; i < data.length; i++) {
//         var workDiv = document.createElement("div");
//         workDiv.setAttribute('id', "W" + i.toString());
//         workDiv.setAttribute('class', "W" + i.toString());
//         workDiv.style.position = "absolute";
//         workDiv.style.top = top_pos.toString() + "px";
//         workDiv.style.left= left_pos.toString() + "px";
//         workDiv.style.textAlign= "left";

//         //console.log(workDiv.id);

//         work = data[i]
//         title = work[0]
//         type = work[1]
//         publication_year = work[2]
//         final_url = work[3]
//         author_list = work[4]
//         cite = work[5]

//         var a = document.createElement('a');
//         a.setAttribute('href',final_url);
//         a.innerHTML = title;
//         workDiv.appendChild(a)

//         var l = left_pos;
//         var au_end = author_list.length;
//         if (au_end > 4){
//         au_end = 4
//         }
//         var new_inner_div = document.createElement("div");
//         new_inner_div.setAttribute('id', "WA");
//         new_inner_div.setAttribute('class', "WA");

//         for(let j = 0; j < au_end; j++) {
//         var p = document.createElement('p');
//         p.innerHTML = author_list[j];
//         new_inner_div.appendChild(p);

//         l += 120
//         }
    
//         new_inner_div.style.display = "flex";
//         workDiv.appendChild(new_inner_div)


//         var p = document.createElement('p');
//         p.innerHTML = type + " | " + "Cited by " + cite.toString() + " | " + "Published in " + publication_year.toString();
//         workDiv.appendChild(p)

//         top_pos += 200;

//         document.getElementById('resp').appendChild(workDiv);



//     }

//     //resp_div.innerHTML += `<p style = "position:absolute; top:${top_pos}px;left:${left_pos}px;font-size: 30px;"><strong>Showing Related Works For "${inputValue}"</strong></p>`;
//     var heading_div = document.createElement("div");
//     heading_div.setAttribute('id',"rel_heading"); // + i.toString()
//     heading_div.setAttribute('class',"rel_heading"); // + i.toString()
//     heading_div.style.position = "absolute";
//     heading_div.style.top = top_pos.toString() + "px";
//     heading_div.style.left= left_pos.toString() + "px";
//     heading_div.style.textAlign= "left";

//     var p = document.createElement('STRONG');
//     p.innerHTML = "Showing Related Works For " + `"${inputValue}"`;
//     p.style.fontSize = "30px";
//     heading_div.appendChild(p);
//     document.getElementById('resp').appendChild(heading_div);
//     top_pos += 80;

//     for (let j = 0; j < work_array.length; j++) {
//         var workDiv = document.createElement("div");
//         workDiv.setAttribute('id', "W" + i.toString()); // + i.toString()
//         workDiv.setAttribute('class', "W" + i.toString()); // + i.toString()
//         workDiv.style.position = "absolute";
//         workDiv.style.top = top_pos.toString() + "px";
//         workDiv.style.left= left_pos.toString() + "px";
//         workDiv.style.textAlign= "left";
//         //console.log(workDiv.id);

//         work = work_array[j]
//         title = work[0]
//         type = work[1]
//         publication_year = work[2]
//         final_url = work[3]
//         author_list = work[4]
//         cite = work[5]

//         var a = document.createElement('a');
//         a.setAttribute('href',final_url); //final_url
//         a.innerHTML = title;
//         workDiv.appendChild(a)

//         var l = left_pos;
//         var au_end = author_list.length;
//         if (au_end > 4){
//         au_end = 4
//         }
//         var new_inner_div = document.createElement("div");
//         new_inner_div.setAttribute('id', "WA");
//         new_inner_div.setAttribute('class', "WA");

//         for(let j = 0; j < au_end; j++) {
//         var p = document.createElement('p');
//         p.innerHTML = author_list[j];
//         new_inner_div.appendChild(p);

//         l += 120
//         }
    
//         new_inner_div.style.display = "flex";
//         workDiv.appendChild(new_inner_div)


//         var p = document.createElement('p');
//         p.innerHTML = type + " | " + "Cited by " + cite.toString() + " | " + "Published in " + publication_year.toString();
//         workDiv.appendChild(p)

//         top_pos += 200;

//         document.getElementById('resp').appendChild(workDiv);

//         i += 1



//     }




















// };