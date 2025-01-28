const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const userList = document.getElementById('userList');
const userForm = document.getElementById('userForm');
const form = document.getElementById('form');
const errorMessage = document.getElementById('errorMessage');
const addUser_Btn = document.getElementById('addUser Btn');
const cancelBtn = document.getElementById('cancelBtn');

let users = [];


async function fetchUsers() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        users = await response.json();
        displayUsers();
    } catch (error) {
        showError(error.message);
    }
}


function displayUsers() {
    userList.innerHTML = '';
    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <p>ID: ${user.id}</p>
            <p>First Name: ${user.name.split(' ')[0]}</p>
            <p>Last Name: ${user.name.split(' ')[1]}</p>
            <p>Email: ${user.email}</p>
            <p>Department: ${user.department || 'N/A'}</p>
            <button onclick="editUser (${user.id})">Edit</button>
            <button onclick="deleteUser (${user.id})">Delete</button>
            <hr>
        `;
        userList.appendChild(userDiv);
    });
}


function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}


addUser_Btn.addEventListener('click', () => {
    userForm.classList.remove('hidden');
    form.reset();
    document.getElementById('formTitle').textContent = 'Add User';
});


cancelBtn.addEventListener('click', () => {
    userForm.classList.add('hidden');
    errorMessage.classList.add('hidden');
});


function editUser(id) {
    const user = users.find(user => user.id === id);
    if (user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('firstName').value = user.name.split(' ')[0];
        document.getElementById('lastName').value = user.name.split(' ')[1];
        document.getElementById('email').value = user.email;
        document.getElementById('department').value = user.department || '';
        userForm.classList.remove('hidden');
        document.getElementById('formTitle').textContent = 'Edit User';
    }
}


async function deleteUser(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete user');
        users = users.filter(user => user.id !== id);
        displayUsers();
    } catch (error) {
        showError(error.message);
    }
}


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const userId = document.getElementById('userId').value;
    const userData = {
        name: `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`,
        email: document.getElementById('email').value,
        department: document.getElementById('department').value
    };

    try {
        if (userId) {
            // Edit user
            const response = await fetch(`${apiUrl}/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Failed to update user');
            const updatedUser = await response.json();
            users = users.map(user => (user.id === updatedUser.id ? updatedUser : user));
        } else {
            // Add user
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) throw new Error('Failed to add user');
            const newUser = await response.json();
            users.push(newUser);
        }
        displayUsers();
        userForm.classList.add('hidden');
    } catch (error) {
        showError(error.message);
    }
});


fetchUsers();