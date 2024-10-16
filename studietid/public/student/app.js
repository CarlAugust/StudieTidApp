fetchUsers();
fetchSubjects();
fetchRooms();

console.log('fetchActivity()')
fetchActivity();
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

        let selector = document.getElementById('subjectSelector')
        subjects.forEach(subject => {
            selector.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
        });
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

        let selector = document.getElementById('roomSelector')
        rooms.forEach(room => {
            selector.innerHTML += `<option value="${room.id}">${room.name}</option>`;
        });
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

async function fetchActivity()
{
    let activities = [];
    try 
    {
        let response = await fetch('/getActivity');
        let data = await response.json();
        activities = data;

        console.log(activities);
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}