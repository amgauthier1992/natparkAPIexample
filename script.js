'use strict'

// look into document.querySelector();

const apiKey = "KFwuzmQlFFSDXKHJJPZNEj1rHD4YKRBlD9OOhqrh"
const baseUrl = "https://developer.nps.gov/api/v1/parks"

function getParks(stateValues, maxResults) {
    const params = {
        api_key: apiKey,
        // q: query, only applying filter criteria in the qString not search criteria in this case. Q isn't necessary (?)
        stateCode: stateValues.join(","),
        limit: maxResults
    };

    //accomplishes the same as the formatParams function in youtube api example
    const queryString = $.param(params);
    // const url = baseUrl + "?" + queryString;
    const url = `${baseUrl}?${queryString}`;

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayParks(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

//**address is undefined**
function displayParks(responseJson) {
    $('#results-list').empty();
    for (let i = 0; i < responseJson.data.length; i++){
        let physicalAddress = responseJson.data[i].addresses.find(addresses => addresses.type === "Physical");
        let physicalAddressHtml = "No address";

        if (physicalAddress) {
           physicalAddressHtml = `${physicalAddress.line1} ${physicalAddress.line2} ${physicalAddress.line3}, ${physicalAddress.city}, ${physicalAddress.stateCode} ${physicalAddress.postalCode}`; 
        }

        $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3></li>
         <p>${physicalAddressHtml}</p>
         <p>${responseJson.data[i].description}</p>
         <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
        `
        )};
    $('#results').removeClass('hidden');
};

function watchForm() {
$('form').submit(function(event){
    event.preventDefault();
    console.log(`watchForm ran!`);
    const stateValues = $('#js-search-states').val();
    const maxResults = $('#js-max-results').val();
    console.log(stateValues);
    console.log(maxResults);
    getParks(stateValues, maxResults)
    });
}

watchForm();


