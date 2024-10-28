export async function fetchUsers() {
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

export async function fetchSubjects() {
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

export async function fetchRooms() {
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
