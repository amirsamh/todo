document.addEventListener('DOMContentLoaded', () => {
    // Load all lists on button click
    document.querySelector('#lists-btn').addEventListener('click', () => {
        load_lists();
    });

    // Disable task submit button untill the input is filled with text
    document.querySelector('#new-submit').setAttribute('disabled', 'true');
    document.addEventListener('keyup', () => {
        if (document.querySelector('#new-task').value === '') {
            document.querySelector('#new-submit').setAttribute('disabled', 'true');
        } else {
            document.querySelector('#new-submit').removeAttribute('disabled');
        }
    });

    // Load list on button click
    document.querySelectorAll('.list-btn').forEach(button => {
        button.onclick = () => {
            load_list(button.dataset.list);
        }
    });

    // show new task form on click
    document.querySelector('#new-task').addEventListener('click', () => {
        document.querySelector('#lists-btn').className = document.querySelector('#lists-btn').className.replace('active', '');
        document.querySelector('#empty-inbox').style.display = 'none';
        document.querySelector('#list-title').innerHTML = 'New Task';
        document.querySelectorAll('.list').forEach(list => {
            list.style.display = 'none';
            list.innerHTML = '';
        });
        document.querySelectorAll('.list-btn').forEach(button => {
            if (button.className.includes('active')) {
                button.className = button.className.replace('active', '');
            }
        });
        document.querySelector('#new-task-description').style.display = 'block';
        document.querySelector('#new-list-select').style.display = 'block';
    });

    document.querySelector('#new-list-form').addEventListener('submit', event => {
        event.preventDefault();
        let formData = new FormData(document.querySelector('#new-list-form'))
        newlist(formData.get('name'));
        document.querySelector('#new-text-submit').value = '';
    });

    // load All tasks list by default
    load_list('All');
});

function load_list(list_name) {

    // hide inappropriate elements and show appropriate ones
    document.querySelector('#new-form').style.display = 'block';
    document.querySelector('#new-list-form').style.display = 'none';
    document.querySelector('#lists-btn').className = document.querySelector('#lists-btn').className.replace('active', '');
    document.querySelector('#new-task-description').style.display = 'none';
    document.querySelector('#new-list-select').style.display = 'none';
    document.querySelectorAll('.list').forEach(list => {
        list.style.display = 'none';
        list.innerHTML = '';
    });

    // Change list title
    document.querySelector('#list-title').innerHTML = list_name;

    //disable other buttons and enable current list's button
    document.querySelectorAll('.list-btn').forEach(button => {
        if (button.className.includes('active')) {
            button.className = button.className.replace('active', '');
        }
    });
    try {
        document.querySelector(`#${list_name}-btn`).className += ' active';
    } catch {}
    
    // fetch list's tasks from API
    fetch(`load_list/${list_name}`)
    .then(response => response.json())
    .then(tasks => {
        console.log(tasks);
        if (tasks.length > 0) {
            document.querySelectorAll('.list').forEach(list => {
                list.style.display = 'none';
                list.innerHTML = '';
            });
            document.querySelector('#empty-inbox').style.display = 'none';
            document.querySelector(`#${list_name}`).style.display = 'block';

            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i].list != 'Tasks') {
                    if (tasks[i].important === false) {
                        if (tasks[i].done === false) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div class="task-item-text">
                                    <input class="form-check-input me-1 rounded-5 unchecked" type="checkbox" data-id="${tasks[i].id}">
                                    ${tasks[i].text}
                                    <span class="badge text-bg-primary rounded-pill">${tasks[i].list}</span>
                                    <div class="task-item-description">${tasks[i].description}</div>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined unimportant" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        } else if (tasks[i].done === true) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div>
                                    <input class="form-check-input me-1 rounded-5 checked" type="checkbox" checked data-id="${tasks[i].id}">
                                    <s>${tasks[i].text}</s>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined unimportant" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        }
                    } else {
                        if (tasks[i].done === false) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div class="task-item-text">
                                    <input class="form-check-input me-1 rounded-5 unchecked" type="checkbox" data-id="${tasks[i].id}">
                                    ${tasks[i].text}
                                    <span class="badge text-bg-primary rounded-pill">${tasks[i].list}</span>
                                    <div class="task-item-description">${tasks[i].description}</div>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined important fill" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        } else if (tasks[i].done === true) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div>
                                    <input class="form-check-input me-1 rounded-5 checked" type="checkbox" checked data-id="${tasks[i].id}">
                                    <s>${tasks[i].text}</s>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined important fill" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        }
                    }
                } else {
                    if (tasks[i].important === false) {
                        if (tasks[i].done === false) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div class="task-item-text">
                                    <input class="form-check-input me-1 rounded-5 unchecked" type="checkbox" data-id="${tasks[i].id}">
                                    ${tasks[i].text}
                                    <div class="task-item-description">${tasks[i].description}</div>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined unimportant" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        } else if (tasks[i].done === true) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div>
                                    <input class="form-check-input me-1 rounded-5 checked" type="checkbox" checked data-id="${tasks[i].id}">
                                    <s>${tasks[i].text}</s>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined unimportant" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        }
                    } else {
                        if (tasks[i].done === false) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div class="task-item-text">
                                    <input class="form-check-input me-1 rounded-5 unchecked" type="checkbox" data-id="${tasks[i].id}">
                                    ${tasks[i].text}
                                    <div class="task-item-description">${tasks[i].description}</div>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined important fill" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        } else if (tasks[i].done === true) {
                            document.querySelector(`#${list_name}`).innerHTML += `
                            <li class="list-group-item">
                                <div>
                                    <input class="form-check-input me-1 rounded-5 checked" type="checkbox" checked data-id="${tasks[i].id}">
                                    <s>${tasks[i].text}</s>
                                </div>
                                <div class="button-list">
                                    <a href="task/${tasks[i].id}" class="task-link" title="Details">
                                        <span class="material-symbols-outlined">
                                            more_horiz
                                        </span>
                                    </a>
                                    <span class="material-symbols-outlined important fill" data-id="${tasks[i].id}">
                                        star
                                    </span>
                                </div>
                            </li>`;
                        }
                    }
                }
            }
        } else {
            document.querySelectorAll('.list').forEach(list => {
                list.style.display = 'none';
                list.innerHTML = '';
            });
            document.querySelector('#empty-inbox').style.display = 'block';
        }

        // Mark task as done or undone on click
        document.querySelectorAll('.unchecked').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                done(checkbox.dataset.id, list_name);
            });
        });
        document.querySelectorAll('.checked').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                undone(checkbox.dataset.id, list_name);
            });
        });

        // Mark task as importatn or unimportant on click
        document.querySelectorAll('.important').forEach(button => {
            button.addEventListener('click', () => {
                unimportant(button.dataset.id, list_name);
            });
        });
        document.querySelectorAll('.unimportant').forEach(button => {
            button.addEventListener('click', () => {
                important(button.dataset.id, list_name);
            });
        });
    });
}

function done(task_id, list_name) {
    fetch(`task/${task_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            done: true
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_list(list_name);
    });
    document.querySelectorAll('.checked').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            done(checkbox.dataset.id, list_name);
        });
    });
}

function undone(task_id, list_name) {
    fetch(`task/${task_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            done: false
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_list(list_name);
    });
    document.querySelectorAll('.unchecked').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            done(checkbox.dataset.id, list_name);
        });
    });
}

function important(task_id, list_name) {
    fetch(`task/${task_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            important: true
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_list(list_name);
    });
}

function unimportant(task_id, list_name) {
    fetch(`task/${task_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            important: false
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_list(list_name);
    });
}

function load_lists() {
    document.querySelector('#new-form').style.display = 'none';
    document.querySelector('#new-list-form').style.display = 'block';
    document.querySelector('#lists-btn').className = document.querySelector('#lists-btn').className.replace('active', '');
    document.querySelector('#empty-inbox').style.display = 'none';
    document.querySelector('#new-task-description').style.display = 'none';
    document.querySelector('#new-list-select').style.display = 'none';
    document.querySelectorAll('.list').forEach(list => {
        list.style.display = 'none';
        list.innerHTML = '';
    });
    document.querySelector('#Lists').style.display = 'block';
    document.querySelector('#list-title').innerHTML = 'My Lists';
    document.querySelectorAll('.list-btn').forEach(button => {
        if (button.className.includes('active')) {
            button.className = button.className.replace('active', '');
        }
    });
    document.querySelector('#lists-btn').className += ' active';

    fetch('lists', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(result => {
        if (result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                document.querySelector('#Lists').innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-start list-name">
                    <div class="ms-2 me-auto">
                        <div>
                            ${result[i].name}
                            <span class="badge bg-primary rounded-pill">${result[i].count} Tasks</span>
                        </div>
                    </div>
                    <span class="material-symbols-outlined more" data-name="${result[i].name}">
                        more_horiz
                    </span>
                    <span class="material-symbols-outlined delete" data-id="${result[i].id}">
                        delete
                    </span>
                </li>`;
            }
        } else {
            document.querySelector('#empty-inbox').style.display = 'block';
        }
        try {
            document.querySelectorAll('.more').forEach(button => {
                button.addEventListener('click', () => {
                    load_list(button.dataset.name);
                });
            }); 
        } catch {}
        try {
            document.querySelectorAll('.delete').forEach(button => {
                button.onclick = () => {
                    delete_list(button.dataset.id);
                }
            });
        } catch {}
    });
}

function newlist(list_name) {
    fetch('lists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: list_name
        })
    })
    .then(response => response.json())
    .then(result => {
        load_lists();
    });
}

function delete_list(list_id) {
    fetch(`list/${list_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            delete: true
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        load_lists();
    });
}