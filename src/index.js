//Load Server
//div with the id dog-bar, when page loads, fetch all pup data from server
//Add Span with the dog's name 

//Next, When a user clicks on the span, that pup's info should show up
//in the div with dog-info
//First add an event listener for clicking on the span
//Next, get the e.target.value of the span clicked on (ie the Name)
//Use that to grab the ID of the dog 
//Using the ID of the dog, fetch for the info using the URL and ID
//http://localhost:3000/pups/id
//Grab the Name, Image, and GoodDog


//Variables
const divSpan = document.querySelector("#dog-bar");
const divInfo = document.querySelector('#dog-info');
const filter = document.querySelector('#good-dog-filter')
const url = "http://localhost:3000/pups";
let alignData = {
    isGoodDog: true
};

//Event Listeners
divSpan.addEventListener("click", spanClick)
divInfo.addEventListener("click", handleAlign)
filter.addEventListener("click", filterDogs)

//functions
function fetchDogs() {
    fetch(url)
        .then((resp) => resp.json())
        .then((data) => handleDogs(data))
        .catch(function () {
            alert("Error with grabbing data")
        });
}

function handleDogs(dogs) {
    divSpan.innerHTML = "";
    let dogNames = dogSpan(dogs);
    return dogNames.forEach(insertDogs)
}

function dogSpan(dogs) {
    return dogs.map(function (dog) {
        let i = `
        <span id="${dog.id}">${dog.name}</span>
        `
        return i
    })
}

function insertDogs(dogNames) {
    return divSpan.innerHTML += dogNames
}

//Function for clicking span

function spanClick(e) {
    e.preventDefault()
    console.log(e.target.id)
    console.log(url + "/" + e.target.id)

    if (e.target.id === 'dog-bar') {
        return
    }

    fetch(url + "/" + e.target.id)
        .then((resp) => resp.json())
        .then((data) => handleInfo(data))
        .catch(function () {
            alert("Error with grabbing data")
        });
}

function handleInfo(data) {
    divInfo.innerHTML = ""
    let i = ""
    if (data.isGoodDog === true) {
        i = `
            <img src="${data.image}" />
            <h2>${data.name}</h2>
            <button id="${data.id}" class="good">Good Dog!</button>
            `
    } else {
        i = `
            <img src="${data.image}" />
            <h2>${data.name}</h2>
            <button id="${data.id}" class="bad">Bad Dog!</button>
            `
    }

    return divInfo.innerHTML = i;
}

//Function for handling alignment

function handleAlign(e) {

    if (e.target.className === 'good') {
        //Send Patch Request here
        alignData = {
            isGoodDog: false
        }

        return patchAlign(e.target.id)
    } if (e.target.className === 'bad') {
        //Send Patch Request here
        alignData = {
            isGoodDog: true
        }

        return patchAlign(e.target.id)
    } else {
        return
    }

}

function patchAlign(id) {
    let configurationObject = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(alignData)
    }

    fetch(url + "/" + id, configurationObject)
        .then((resp) => resp.json())
        .then((data) => handleInfo(data))
        .catch(function () {
            alert("Error")
        })
}

//Function for filtering dogs

function filterDogs() {

    if (filter.innerHTML === `Filter good dogs: OFF`) {
        console.log("Filter: ON!")
        filter.innerHTML = `Filter good dogs: ON`;
        fetch(url)
            .then((resp) => resp.json())
            .then((data) => handleFilter(data))
            .catch(function () {
                alert("Error with grabbing data")
            });

    } else {
        console.log("Filter: OFF!")
        filter.innerHTML = `Filter good dogs: OFF`;
        fetchDogs()
    }

}

function handleFilter(dogs) {
    console.log(dogs)
    let newDogs = dogs.filter((dog) => dog.isGoodDog === true)
    return handleDogs(newDogs)
}


//Start DOM 
fetchDogs()