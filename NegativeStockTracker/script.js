document.addEventListener('DOMContentLoaded', function() {
    let strategyEnabled = false;
    const buySellLogTextarea = document.getElementById('buySellLog');  
    
  });
  

    // Function to fetch data from API and populate the table
    async function fetchData() {
        const response = await fetch('http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/getDwh');
        const data = await response.json();
        // const tableBody = document.querySelector('#stockTable tbody');


          // Sort data based on 'Net Lifetime Earnings' in descending order
          data.sort((a, b) => b.netLifetimeEarnings - a.netLifetimeEarnings);

          // Display only the top 20 most negative stocks
          const tableBody = document.querySelector('#tableBody');
          data.slice(0, 20).forEach(item => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${item.stockName}</td>
                  <td>${item.toBuy}</td>
                  <td>${item.budget}</td>
                  <td>${item.isRemoved}</td>
                  <td>${item.netLifetimeEarnings}</td>
                  <td>${item.updatedAt}</td>
              `;
              tableBody.appendChild(row);
          });
  }

    // Function to toggle strategy (enable/disable)
    async function toggleStrategy() {
      strategyEnabled = !strategyEnabled;
      const action = strategyEnabled ? 'enable' : 'disable';
      document.getElementById('toggleStrategyBtn').textContent = strategyEnabled ? 'Disable Strategy' : 'Enable Strategy';

      // Send request to server to toggle strategy
      const response = await fetch(`http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/${action}Strategy`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              strategy: strategyEnabled
          })
      });
      const result = await response.json();
      console.log(result); // Handle response accordingly
  }
        // data.forEach(item => {
        //     const row = document.createElement('tr');
        //     row.innerHTML = `
        //         <td>${item.stockName}</td>
        //         <td>${item.toBuy}</td>
        //         <td class="editable-cell" data-id="${item.id}" data-column="budget">${item.budget}</td>
        //         <td class="editable-cell" data-id="${item.id}" data-column="isRemoved">${item.isRemoved}</td>
        //         <td>${item.netLifetimeEarnings}</td>
        //         <td>${item.updatedAt}</td>
        //     `;
        //     tableBody.appendChild(row);
        // });

        // Add event listeners for editing
        const editableCells = document.querySelectorAll('.editable-cell');
        editableCells.forEach(cell => {
            cell.addEventListener('click', () => {
                const input = document.createElement('input');
                input.value = cell.textContent.trim();
                cell.classList.add('active');
                cell.innerHTML = '';
                cell.appendChild(input);
                input.focus();

                input.addEventListener('blur', () => {
                    const newValue = input.value.trim();
                    cell.classList.remove('active');
                    cell.innerHTML = newValue;
                    const id = cell.dataset.id;
                    const column = cell.dataset.column;
                    // Send the updated value to the server for persistence
                    sendData(id, column, newValue);
                });
            });
        });
    // }

    // Function to send updated data to the server
    async function sendData(id, column, value) {
        const response = await fetch(`http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/updateData/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                [column]: value
            })
        });
        const result = await response.json();
        console.log(result); // You can handle the response accordingly
    }

    
   // Function to handle form submission and POST request
   document.getElementById('postDataForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const postData = {};
    formData.forEach((value, key) => {
        postData[key] = value;
    });

    const response = await fetch('http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/Dwh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    });
    const result = await response.json();
    console.log(result); // Handle response accordingly
});

  // Call fetchData function to populate the table
  fetchData();