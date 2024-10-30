import { fetchUsers, fetchSubjects, fetchRooms, fetchActivities } from '../api.js';

async function approveActivity()
{
    let id = this.value;
    try {
        await fetch(`/approveActivity?id=${id}`);
        activitiesSet();
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

async function denyActivity()
{
    let id = this.value;
    try {
        await fetch(`/denyActivity?id=${id}`);
        activitiesSet();
    }
    catch (error)
    {
        console.log('Error:', error);
    }
}

const activitiesSet = () => {
    fetchActivities().then(activities => {
        const container = document.getElementById('activityScreen');

        container.innerHTML = "<h1>Aktiviteter</h1>";

        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('activity');
            activityElement.innerHTML = `
                <h3>${activity.startTime}</h3>
                <h3>${activity.firstName} ${activity.lastName}</h3>
                <h3>${activity.idSubject}</h3>
                <h3>${activity.idRoom}</h3>
            `;

            const button = document.createElement('button');
            button.value = activity.activity_id;
            if (activity.idStatus === 1)
            {
                button.textContent = 'Pending';
                denyButton.addEventListener('click', approveActivity);
                activityElement.appendChild(button);
                container.appendChild(activityElement);
            } 
            else if (activity.idStatus === 2)
            {
                button.textContent = 'Approved';
                button.addEventListener('click', denyActivity);
                activityElement.appendChild(button);
                container.appendChild(activityElement);
            }
            else
            {
                button.textContent = 'Denied';
                button.addEventListener('click', approveActivity);
                activityElement.appendChild(button);
                container.appendChild(activityElement);
            }
        });
    });
};

activitiesSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);