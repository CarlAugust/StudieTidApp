import { fetchUsers, fetchSubjects, fetchRooms, fetchActivities } from '../api.js';

const subjectsSet = () => {
    fetchSubjects().then(subjects => {
        let selector = document.getElementById('subjectSelector')
        subjects.forEach(subject => {
            selector.innerHTML += `<option value="${subject.id}">${subject.name}</option>`;
        });
    });
}
const roomsSet = () => {
    fetchRooms().then(rooms => {
        let selector = document.getElementById('roomSelector')
        rooms.forEach(room => {
            selector.innerHTML += `<option value="${room.id}">${room.name}</option>`;
        });
    });
}

subjectsSet();
roomsSet();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);