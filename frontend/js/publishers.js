// function myFunction() {
//     console.log("here")
//       document.getElementById("demo").innerHTML = "Paragraph changed.";
// }

document.addEventListener('DOMContentLoaded', function(){
    console.log("here");
    // fetch('http://localhost:3001/frontend/concepts.html')
    // .then(response => response.json())
    // .then(data => loadHTMLTable(data['data']));
    loadHTMLTable([]);
  
  
  
  });
  
  const searchBtn = document.querySelector('#search_btn');
  
  
  searchBtn.onclick = function() {
    const publishertInput = document.querySelector('#publisher_input');
    const publisher = publishertInput.value;
    console.log(publisher);
    publishertInput.value = "";
  
    fetch('http://localhost:3001/publishers.html', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ display_name : publisher})
    })
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
  }
  
  function loadHTMLTable(data){
    const table = document.querySelector('table tbody');
    if (data.length === 0) {
      table.innerHTML = "<tr><td class = 'no-data' colspan = '4'>No data</td></tr>";
      return;
  
    }
  
    let tableHtml = "";
  
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