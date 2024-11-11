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

        container.innerHTML = `
        <tr class="headerRow">
            <th>Starttid</th>
            <th>Navn</th>
            <th>Fag</th>
            <th>Rom</th>
            <th>Status<th>
        </tr>
        `;

        activities.forEach(activity => {
            const activityElement = document.createElement('tr');
            activityElement.innerHTML = `
                <td>${activity.startTime}</td>
                <td>${activity.firstName} ${activity.lastName}</td>
                <td>${activity.subject}</td>
                <td>${activity.room}</td> 
                
            `;

            const button = document.createElement('button');
            button.value = activity.activity_id;
            if (activity.idStatus === 1)
            {
                button.textContent = 'Pending';
                denyButton.addEventListener('click', approveActivity);
            } 
            else if (activity.idStatus === 2)
            {
                button.textContent = 'Approved';
                button.addEventListener('click', denyActivity);
            }
            else
            {
                button.textContent = 'Denied';
                button.addEventListener('click', approveActivity);
            }
            const td = document.createElement('td');
            td.appendChild(button);
            activityElement.appendChild(td);
            container.appendChild(activityElement);
        });
    });
};

activitiesSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);