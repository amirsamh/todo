document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#list').style.display = 'none';
    try {
        document.querySelector('#unimportant').addEventListener('click', () => {
            important();
        });
    } catch {}
    try {
        document.querySelector('#important').addEventListener('click', () => {
            unimportant();
        });
    } catch {}

    document.querySelector('#edit').addEventListener('click', () => {
        document.querySelector('#list').style.display = 'block';
        document.querySelector('#title').innerHTML = 'Edit Task';
        document.querySelector('#buttons').style.display = 'none';
        try {
            document.querySelector('#empty-description').style.display = 'none'
        } catch {}
        let text = document.querySelector('#text').dataset.value;
        document.querySelector('#text').innerHTML = `
            <label for="basic-url" class="form-label">Title</label>
            <input autocomplete="off" type="text" class="form-control rounded-4 shadow-sm" id="text-input" name="text" value="${text}">
        `;

        let description = document.querySelector('#description').dataset.value;
        document.querySelector('#description').innerHTML = `
        <label for="basic-url" class="form-label">Description</label>
        <textarea class="form-control rounded-4 shadow-sm" rows="4" id="description-input" name="description">${description}</textarea>`;
        document.querySelector('#additionals').innerHTML = `
            <button class="btn btn-light rounded-5" id="done">
                <span class="material-symbols-outlined text-success fill">
                    check_circle
                </span>
                Done
            </button>
        `;

        document.querySelector('#done').addEventListener('click', () => {
            edit(document.querySelector('#text-input').value, document.querySelector('#description-input').value, document.querySelector('#list-name').value);
        });
    });
});

function important() {
    fetch('', {
        method: 'PUT',
        body: JSON.stringify({
            important: true
        })
    })
    .then(response => response.json())
    .then(result => {
        location.reload();
    });
}

function unimportant() {
    fetch('', {
        method: 'PUT',
        body: JSON.stringify({
            important: false
        })
    })
    .then(response => response.json())
    .then(result => {
        location.reload();
    });
}

function edit(text, description, list) {
    fetch('', {
        method: 'PUT',
        body: JSON.stringify({
            text: text,
            description: description,
            list: list
        })
    })
    .then(response => response.json())
    .then(result => {
        location.reload();
    });
}