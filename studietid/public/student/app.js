import { fetchSubjects, fetchRooms, fetchActivity, fetchUsers } from '../api.js';

const subjectsSet = () => {
    fetchSubjects().then(subjects => {
        let selector = document.getElementById('subjectSelector');
        subjects.forEach(subject => {
            selector.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
            console.log(subject);
        });
    });
}
const roomsSet = () => {
    fetchRooms().then(rooms => {
        let selector = document.getElementById('roomSelector');
        rooms.forEach(room => {
            selector.innerHTML += `<option value="${room.id}">${room.name}</option>`;
        });
    });
}

const activitySet = () => {
    fetchActivity().then(activity => {
        let selector = document.getElementById("yourPendingActivities");

        console.log(selector);
        activity.forEach(activity => {
            console.log(activity);
            if(activity.idStatus === 1) {
                selector.innerHTML += `<p>${activity.idSubject}  ${activity.startTime}</p>`;
            }
        });
    });
}

subjectsSet();
roomsSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);