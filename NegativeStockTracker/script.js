// script.js


// Map to store stock name to ID mapping
const stockIdMap = {};

$(document).ready(function() {
    // Fetch data from API
    $.get("http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/getDwh", function(data) {
      displayData(data);
    });
  });
  
  function displayData(data) {
    const tableContainer = $("#tableContainer");
    const table = $("<table>");
    const thead = $("<thead>").appendTo(table);
    const tbody = $("<tbody>").appendTo(table);
    
    // Create table header
    const headerRow = $("<tr>").appendTo(thead);
    $("<th>").text("Stock Name").appendTo(headerRow);
    $("<th>").text("To Buy").appendTo(headerRow);
    $("<th>").text("Budget").appendTo(headerRow);
    $("<th>").text("Is Removed").appendTo(headerRow);
    $("<th>").text("Net Lifetime Earnings").appendTo(headerRow);
    $("<th>").text("Updated At").appendTo(headerRow);
    $("<th>").text("Update").appendTo(headerRow);
    
    // Populate stockIdMap and table rows with data
    data.forEach(item => {
    // Populate stockIdMap
    stockIdMap[item.stockName] = item.stockId;

    const row = $("<tr>").appendTo(tbody);
    $("<td>").text(item.stockName).appendTo(row);
    $("<td>").text(item.toBuy ? "Yes" : "No").appendTo(row);
    const budgetCell = $("<td>").addClass("editable").text(item.budget).appendTo(row);
    const isRemovedCell = $("<td>").addClass("editable").text(item.isRemoved ? "Yes" : "No").appendTo(row);
    $("<td>").text(item.netLifetimeEarnings).appendTo(row);
    $("<td>").text(item.updatedAt).appendTo(row);

   

    // Add update button
    const updateButton = $("<button>").addClass("updateButton").text("Update").appendTo($("<td>").appendTo(row));
    updateButton.click(function() {
      updateRow(item.stockName, row);
    });

    // Style row based on requirements
    if (item.isRemoved) {
      row.addClass("removed");
    } else if (item.toBuy) {
      row.addClass("toBeRemoved");
    }

  });


      // Append table to container
      tableContainer.append(table);
}

  
function updateRow(stockName, row) {
    // Extract stockId from stockIdMap
    const stockId = stockIdMap[stockName];
    
    // Extract updated values from row
    const toBuy = row.find("td:nth-child(2)").text().toLowerCase() === "yes";
    const budget = parseInt(row.find("td:nth-child(3)").text());
    const isRemoved = row.find("td:nth-child(4)").text().toLowerCase() === "yes";
    
     // Make API call to update data
  $.ajax({
    url: "http://stockalgoapp-env.eba-4sqye4mb.ap-south-1.elasticbeanstalk.com/Dwh",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ stockId, budget, isRemoved }),
    success: function(response) {
      console.log("Data updated successfully:", response);
      row.removeClass("edited");
      row.addClass("success");
    },
    error: function(xhr, status, error) {
      console.error("Error updating data:", error);
    }
     });
}

function enableStrategy() {
    // Enable strategy logic
    console.log("Strategy enabled.");
  }
  
  function disableStrategy() {
    // Disable strategy logic
    console.log("Strategy disabled.");
  }
  

   $(document).ready(function() {
    fetchAndDisplayStockData();

     // Bind strategy buttons
  $("#enableStrategyBtn").click(enableStrategy);
  $("#disableStrategyBtn").click(disableStrategy);
  });    
    


  
