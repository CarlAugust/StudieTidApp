fetchUsers();
fetchSubjects();
fetchRooms();
const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error)

async function fetchUsers() {
    let persons = [];   

    try 
    {
        let response = await fetch('/getUsers');
        let data = await response.json();
        persons = data;

        displayPersons(persons);
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

async function fetchSubjects() {
    let subjects = [];   

    try 
    {
        let response = await fetch('/getSubjects');
        let data = await response.json();
        subjects = data;

        console.log(subjects);
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

async function fetchRooms() {
    let rooms = [];   

    try 
    {
        let response = await fetch('/getRooms');
        let data = await response.json();
        rooms = data;

        console.log(rooms);
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

// Funksjon for å vise listen med personer på nettsiden
function displayPersons(persons) {
    const personList = document.getElementById('personList');
    personList.innerHTML = '<tr><th>First name</th><th>Last name</th><th>Email</th><th>Role</th></tr>'; // Tøm listen først
    
    persons.forEach(person => {
        console.log(person);
        let tableRow = document.createElement('tr');
        tableRow.innerHTML += 
        `<td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${person.role}</td>`;

        personList.appendChild(tableRow);

        
    });
}