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
        const pendingContainer = document.getElementById('pending');
        const acceptedContainer = document.getElementById('accepted');
        const deniedContainer = document.getElementById('denied');

        pendingContainer.innerHTML = "<h2>Pending</h2>";
        acceptedContainer.innerHTML = "<h2>Accepted</h2>";
        deniedContainer.innerHTML = "<h2>Denied</h2>";

        activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.classList.add('activity');
            activityElement.innerHTML = `
                <h2>${activity.startTime}</h2>
                <h3>${activity.firstName} ${activity.lastName}</h3>
                <h3>${activity.idSubject}</h3>
                <h3>${activity.idRoom}</h3>
            `;

            const approveButton = document.createElement('button');
            approveButton.textContent = 'Approve';
            approveButton.value = activity.activity_id;
            approveButton.addEventListener('click', approveActivity);

            const denyButton = document.createElement('button');
            denyButton.textContent = 'Deny';
            denyButton.value = activity.activity_id;
            denyButton.addEventListener('click', denyActivity);

            if (activity.idStatus === 1)
            {
                activityElement.appendChild(approveButton);
                activityElement.appendChild(denyButton);
                pendingContainer.appendChild(activityElement);
            } 
            else if (activity.idStatus === 2)
            {
                activityElement.appendChild(denyButton);
                acceptedContainer.appendChild(activityElement);
            }
            else
            {
                activityElement.appendChild(approveButton);
                deniedContainer.appendChild(activityElement);
            }
        });
    });
};

activitiesSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);