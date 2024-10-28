import { fetchUsers, fetchSubjects, fetchRooms } from '../api.js';

const usersSet = () => {
    fetchUsers().then(users => {
        let selector = document.getElementById('usersTable');
        users.forEach(user => {
            selector.innerHTML += `
            <th>${user.firstName} ${user.lastName}</th>
            <th>${user.email}</th>
            <th>${user.role}</th>
            <button value="${user.userID}" onclick="editUser">Edit</button>
            `;
        });
    });
}

usersSet();