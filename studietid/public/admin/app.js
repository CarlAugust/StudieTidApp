import { fetchUsers, fetchSubjects, fetchRooms, fetchActivity } from '../api.js';

fetchUsers();
fetchSubjects();
fetchRooms();
fetchActivity();

const params = new URLSearchParams(window.location.search);

const error = params.get('error'); 
console.log(error);