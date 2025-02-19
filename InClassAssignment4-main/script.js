// URL
const url = 'https://raw.githubusercontent.com/RahulMuk/CodingTheNews-2025/refs/heads/main/_datasets/artist_data.csv?token=GHSAT0AAAAAAC5553DASJNSSGVOKDD5WVW2Z5VHXJQ'

// Create a function to parse the CSV into an array
function parseCSV(data) { 
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/; // Sets regex rule in order to split based on commas but not commas inside double-quoted substrings
    //console.log(data)
    const rows = data.trim().split('\n'); // Splits the csv into three rows
    //console.log(rows)
    const headers = rows[0].split(','); // Splits the first rows into header names
    //console.log(headers)

    const res = rows.slice(1).map(row => {  // Skip the headers and extract the rest of the row

        //return row.split(regex).map(cell => {
            // Remove quotes around fields that are quoted
           // return cell.replace(/^"(.+)"$/, '$1');

        const vals = row.split(regex).map(r => {
            //console.log(r)
            return r.replace(/^"(.+)"$/, '$1');
        }); // Split up all the info
        //console.log(vals)
        const obj = {}; // Init the container to be created containing the relevant info for each of the artists
        headers.forEach((header, i) => {
            //console.log(vals[i])
            obj[header.trim()] = vals[i]?.trim(); // ? in case no value is there so as not to break the code, filling the artist with the proper info
        });
        if(obj.name === "Dua Lipa"){
            obj.path = "img/dua.webp"
        } else if(obj.name === "Kacey Musgraves"){ // Adding the img paths
            obj.path = "img/kacey.webp"
        } else if(obj.name === "Kendrick Lamar"){
            obj.path = "img/kungfukenny.webp"
        }
        obj.totalWeeks = Number(obj.song_1_weeks_on_top_100) + Number(obj.song_2_weeks_on_top_100) + Number(obj.song_3_weeks_on_top_100) + Number(obj.song_4_weeks_on_top_100) + Number(obj.song_5_weeks_on_top_100)
        //console.log(obj)
        return obj; // Fill the results container with the artist 
    });
    //console.log(res)
    return res; // Contains the three artists and their info
}

function fetchData(){
    return fetch(url)
        .then(response => response.text()) // Convert what was fetched into plain text
        .then(data => {
            const parsedData = parseCSV(data); 
            return parsedData
        })
        .catch(err => console.error('Error: ', err));
}

function populateHTML(data){
    const container = document.getElementById('artist-container'); // Grab the artist-container div
    container.innerHTML = ''; // Clear the div

    // Go through each artist and make a card
    data.forEach((artist, i) => { // put , i and wrap in a ()
        const artDiv = document.createElement('div');
        artDiv.classList.add('artist');

        // Populate div for each artist
        artDiv.innerHTML = `
            <div class="img-container">
                <img src="${artist['path']}" alt="${artist['name']}" />
            </div>
            <div class="info">
                <h1>${artist['name']}</h1>
                <h2>Hometown: ${artist['hometown']}</h2>
                <h3>Genre: ${artist['primary_genre']}</h3>
                <h3>Albums: ${artist['albums_released']}</h3>
                <h3>Total Weeks on Top 100: ${artist['totalWeeks']}</h3>
                <h3>Highest Peaks: ${artist['song_1_highest_peak']}, ${artist['song_2_highest_peak']}, ${artist['song_3_highest_peak']}, ${artist['song_4_highest_peak']}, ${artist['song_5_highest_peak']}</h3>
            </div>
            
        `;
        container.appendChild(artDiv) // Append the artist div to the container
    })
}

// Using .then() to handle the resolved Promise
fetchData().then(artist_data => {
    populateHTML(artist_data); // Now you can access the parsed data
});

//const artist_data = fetchData()
//console.log(artist_data)