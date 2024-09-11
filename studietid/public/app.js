let persons = [];   

fetchUsers();

const form = document.getElementById('register');
form.addEventListener('submit', addUser);

async function fetchUsers() {
    try 
    {
        let response = await fetch('/getUsers');
        let data = await response.json();
        persons = data;

        displayPersons();

    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

// Funksjon for å vise listen med personer på nettsiden
function displayPersons() {
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

async function addUser(event) {
    event.preventDefault();
    
    const user = {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value
    };

    try
    {
        let response = await fetch('/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        console.log(response);
        fetchUsers();
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}