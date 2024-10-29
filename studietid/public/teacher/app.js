import { fetchUsers, fetchSubjects, fetchRooms, fetchActivities } from '../api.js';

const activitiesSet = () => {
    fetchActivities().then(activities => {
        activities.forEach(activity => {
            if (activity.idStatus == 1) {
                let selector = document.getElementById('pending');
                selector.innerHTML += 
                `
                <div class="activity">
                    <h2>${activity.startTime}</h2>
                    <h3>${activity.firstName} ${activity.lastName}</h3>
                    <h3>${activity.idSubject}</h3>
                    <h3>${activity.idRoom}</h3>
                    <button value="${activity.id}" onclick="approveActivity">Approve</button>
                    <button value="${activity.id}" onclick="denyActivity">Deny</button>
                </div>
                `;
            }
            else if (activity.idStatus == 2)
            {
                let selector = document.getElementById('accepted');
                selector.innerHTML += 
                `
                <div class="activity">
                    <h2>${activity.startTime}</h2>
                    <h3>${activity.firstName} ${activity.lastName}</h3>
                    <h3>${activity.idSubject}</h3>
                    <h3>${activity.idRoom}</h3>
                    <button value="${activity.id}" onclick="denyActivity">Deny</button>
                </div>
                `;
            }
            else
            {
                let selector = document.getElementById('denied');
                selector.innerHTML += 
                `
                <div class="activity">
                    <h2>${activity.startTime}</h2>
                    <h3>${activity.firstName} ${activity.lastName}</h3>
                    <h3>${activity.idSubject}</h3>
                    <h3>${activity.idRoom}</h3>
                    <button value="${activity.id}" onclick="approveActivity">Approve</button>
                </div>
                `;
            }
        });
    });
}

activitiesSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);