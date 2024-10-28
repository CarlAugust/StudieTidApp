export async function fetchUsers() {
    let persons = [];   

    try 
    {
        let response = await fetch('/getUsers');
        let data = await response.json();
        persons = data;

        return persons;

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

        return subjects;
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

        return rooms;
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

export async function fetchActivities()
{
    let activities = [];
    try 
    {
        let response = await fetch('/getActivities');
        let data = await response.json();
        activities = data;

        console.log(activities);
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

export async function fetchActivity()
{
    let activity = [];
    try 
    {
        let response = await fetch('/getActivity');
        let data = await response.json();
        activity = data;

        return activity;
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}
