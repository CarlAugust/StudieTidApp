import { fetchUsers, fetchSubjects, fetchRooms, fetchActivities } from '../api.js';

fetchUsers();
fetchSubjects();
fetchRooms();
fetchActivities();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);