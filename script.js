// Array of memories for the flowers
const memories = [
    "Our first conversation about your favorite books—it felt like we had known each other forever.",
    "That rainy day we spent laughing about silly jokes, making the world feel brighter.",
    "The way you smiled when I surprised you with your favorite treat—pure magic."
];

// Function to show memory popup
function showMemory(id) {
    const memoryText = document.getElementById('memory-text');
    memoryText.textContent = memories[id - 1] || "A special memory just for you!";
    document.getElementById('memory-popup').style.display = 'block';
}

// Function to close popup
function closePopup() {
    document.getElementById('memory-popup').style.display = 'none';
}

// Function to reveal personalized message
function revealMessage() {
    const message = document.getElementById('love-message');
    const button = document.querySelector('#message .reveal-btn');
    if (message.classList.contains('hidden')) {
        message.classList.remove('hidden');
        message.style.animation = 'fadeIn 0.5s ease-in-out';
        button.textContent = 'Hide';
    } else {
        message.classList.add('hidden');
        message.style.animation = '';
        button.textContent = 'Click to Reveal';
    }
}

// Function to show future text
function showFuture() {
    const futureText = document.getElementById('future-text');
    const button = document.querySelector('#future .future-btn');
    if (futureText.classList.contains('hidden')) {
        futureText.classList.remove('hidden');
        futureText.style.animation = 'fadeIn 0.5s ease-in-out';
        button.textContent = 'Hide';
    } else {
        futureText.classList.add('hidden');
        futureText.style.animation = '';
        button.textContent = 'Click to See What the Future Holds…';
    }
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.classList.toggle('hidden');
    if (!section.classList.contains('hidden')) {
        displayMemories();
        displayNotes();
    }
}

function addMemory() {
    const date = document.getElementById('memory-date').value;
    const topic = document.getElementById('memory-topic').value;
    const file = document.getElementById('memory-file').files[0];
    if (!date || !topic || !file) {
        alert('Please fill all fields and select a file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const mediaData = e.target.result;
        const memories = JSON.parse(localStorage.getItem('memories') || '[]');
        memories.push({ date, topic, mediaData, type: file.type.startsWith('image/') ? 'image' : 'video' });
        localStorage.setItem('memories', JSON.stringify(memories));
        displayMemories();
        // Clear inputs
        document.getElementById('memory-date').value = '';
        document.getElementById('memory-topic').value = '';
        document.getElementById('memory-file').value = '';
    };
    reader.readAsDataURL(file);
}

function displayMemories() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;
    const memories = JSON.parse(localStorage.getItem('memories') || '[]');
    const dateFilter = document.getElementById('memory-date-filter')?.value || '';
    const topicFilter = document.getElementById('memory-topic-filter')?.value.toLowerCase() || '';
    grid.innerHTML = '';
    memories.filter(m => (!dateFilter || m.date === dateFilter) && (!topicFilter || m.topic.toLowerCase().includes(topicFilter))).forEach((m, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        if (m.type === 'image') {
            item.innerHTML = `<img src="${m.mediaData}" alt="${m.topic}" class="gallery-img" onclick="openModal('${m.mediaData}', 'image')"><div class="gallery-caption">${m.topic} - ${m.date}</div>`;
        } else {
            item.innerHTML = `<video class="gallery-video" onclick="openModal('${m.mediaData}', 'video', '${m.type}')"><source src="${m.mediaData}" type="${m.type}"></video><div class="gallery-caption">${m.topic} - ${m.date}</div>`;
        }
        if (currentEditMode === 'media') {
            item.innerHTML += `<button class="delete-btn" onclick="deleteMemory(${index})">Delete</button>`;
        }
        grid.appendChild(item);
    });
}

function filterMemories() {
    displayMemories();
}

function addNote() {
    const date = document.getElementById('note-date').value;
    const text = document.getElementById('note-text').value;
    if (!date || !text) {
        alert('Please select a date and write a note.');
        return;
    }
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.push({ date, text });
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
    // Clear inputs
    document.getElementById('note-date').value = '';
    document.getElementById('note-text').value = '';
}

function displayNotes() {
    const display = document.getElementById('notes-display');
    if (!display) return;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const dateFilter = document.getElementById('note-date-filter')?.value || '';
    display.innerHTML = '';
    notes.filter(n => !dateFilter || n.date === dateFilter).sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((n, index) => {
        const item = document.createElement('div');
        item.className = 'note-item';
        item.innerHTML = `<div class="note-date">${n.date}</div><div class="note-text">${n.text}</div>`;
        if (currentEditMode === 'notes') {
            item.innerHTML += `<button class="delete-btn" onclick="deleteNote(${index})">Delete</button>`;
        }
        display.appendChild(item);
    });
}

function filterNotes() {
    displayNotes();
}

function openModal(src, type, mimeType) {
    const modal = document.getElementById('media-modal');
    const img = document.getElementById('modal-img');
    const video = document.getElementById('modal-video');
    if (type === 'image') {
        img.src = src;
        img.style.display = 'block';
        video.style.display = 'none';
    } else {
        video.src = src;
        video.style.display = 'block';
        img.style.display = 'none';
    }
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('media-modal').style.display = 'none';
}

function deleteMemory(index) {
    if (currentEditMode !== 'media') return;
    const memories = JSON.parse(localStorage.getItem('memories') || '[]');
    memories.splice(index, 1);
    localStorage.setItem('memories', JSON.stringify(memories));
    displayMemories();
}

function deleteNote(index) {
    if (currentEditMode !== 'notes') return;
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

let currentEditMode = null; // 'texts', 'media', 'notes', or null

function toggleHamburgerMenu() {
    const dropdown = document.getElementById('hamburger-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function enableTextsEdit() {
    const password = prompt('Enter password to edit texts:');
    if (password === 'saymyname') {
        disableCurrentMode();
        currentEditMode = 'texts';
        makeTextsEditable();
        showEditIndicator('Editing Texts');
        document.getElementById('hamburger-dropdown').style.display = 'none';
    } else {
        alert('Incorrect password');
    }
}

function enableMediaEdit() {
    const password = prompt('Enter password to edit media:');
    if (password === 'saymyname') {
        disableCurrentMode();
        currentEditMode = 'media';
        showMediaEditControls();
        showEditIndicator('Editing Media');
        document.getElementById('hamburger-dropdown').style.display = 'none';
    } else {
        alert('Incorrect password');
    }
}

function enableNotesEdit() {
    const password = prompt('Enter password to edit notes:');
    if (password === 'saymyname') {
        disableCurrentMode();
        currentEditMode = 'notes';
        showNotesEditControls();
        showEditIndicator('Editing Notes');
        document.getElementById('hamburger-dropdown').style.display = 'none';
    } else {
        alert('Incorrect password');
    }
}

function enableImagesEdit() {
    const password = prompt('Enter password to edit images:');
    if (password === 'saymyname') {
        disableCurrentMode();
        currentEditMode = 'images';
        makeImagesEditable();
        showEditIndicator('Editing Images');
        document.getElementById('hamburger-dropdown').style.display = 'none';
    } else {
        alert('Incorrect password');
    }
}

function disableCurrentMode() {
    if (currentEditMode === 'texts') {
        makeTextsNonEditable();
    } else if (currentEditMode === 'media') {
        hideMediaEditControls();
    } else if (currentEditMode === 'notes') {
        hideNotesEditControls();
    } else if (currentEditMode === 'images') {
        makeImagesNonEditable();
    }
    currentEditMode = null;
    hideEditIndicator();
}

function makeTextsEditable() {
    const textElements = document.querySelectorAll('h1, h2, p, .quote');
    textElements.forEach(el => {
        el.contentEditable = 'true';
        el.addEventListener('input', saveTextContent);
        el.style.border = '1px dashed #ff69b4';
        el.style.padding = '5px';
    });
}

function makeTextsNonEditable() {
    const textElements = document.querySelectorAll('h1, h2, p, .quote');
    textElements.forEach(el => {
        el.contentEditable = 'false';
        el.removeEventListener('input', saveTextContent);
        el.style.border = '';
        el.style.padding = '';
    });
}

function saveTextContent(event) {
    const el = event.target;
    const key = `text-${el.id || el.className || el.textContent.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
    localStorage.setItem(key, el.innerHTML);
}

function loadSavedTexts() {
    const textElements = document.querySelectorAll('h1, h2, p, .quote');
    textElements.forEach(el => {
        const key = `text-${el.id || el.className || el.textContent.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
        const saved = localStorage.getItem(key);
        if (saved) {
            el.innerHTML = saved;
        }
    });
}

function showMediaEditControls() {
    document.querySelector('.upload-controls').style.display = 'flex';
    displayMemories(); // This will show delete buttons
}

function hideMediaEditControls() {
    document.querySelector('.upload-controls').style.display = 'none';
    displayMemories(); // This will hide delete buttons
}

function showNotesEditControls() {
    document.querySelector('.notes-form').style.display = 'flex';
    displayNotes(); // This will show delete buttons
}

function hideNotesEditControls() {
    document.querySelector('.notes-form').style.display = 'none';
    displayNotes(); // This will hide delete buttons
}

function makeImagesEditable() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.border = '2px dashed #ff69b4';
        img.style.cursor = 'pointer';
        img.addEventListener('click', imageClickHandler);
        addResizeHandles(img);
    });
}

function makeImagesNonEditable() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.border = '';
        img.style.cursor = '';
        img.removeEventListener('click', imageClickHandler);
        removeResizeHandles(img);
    });
}

function imageClickHandler(event) {
    if (currentEditMode !== 'images') return;
    const img = event.target;
    const newSrc = prompt('Enter new image URL or path:', img.src);
    if (newSrc && newSrc !== img.src) {
        img.src = newSrc;
        const data = { src: newSrc, width: img.style.width, height: img.style.height };
        saveImageData(img.id || img.className || img.alt, data);
    }
}

function addResizeHandles(img) {
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    handle.style.position = 'absolute';
    handle.style.width = '10px';
    handle.style.height = '10px';
    handle.style.background = '#ff69b4';
    handle.style.cursor = 'nw-resize';
    handle.style.bottom = '0';
    handle.style.right = '0';
    handle.style.border = '1px solid #fff';
    handle.style.zIndex = '10';
    img.parentElement.style.position = 'relative';
    img.parentElement.appendChild(handle);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    handle.addEventListener('mousedown', function(e) {
        if (currentEditMode !== 'images') return;
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = img.offsetWidth;
        startHeight = img.offsetHeight;
        e.preventDefault();
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        const newWidth = Math.max(10, startWidth + (e.clientX - startX));
        const newHeight = Math.max(10, startHeight + (e.clientY - startY));
        img.style.width = newWidth + 'px';
        img.style.height = newHeight + 'px';
    });

    document.addEventListener('mouseup', function() {
        if (isResizing) {
            isResizing = false;
            const data = { src: img.src, width: img.style.width, height: img.style.height };
            saveImageData(img.id || img.className || img.alt, data);
        }
    });
}

function removeResizeHandles(img) {
    const handle = img.parentElement.querySelector('.resize-handle');
    if (handle) {
        handle.remove();
    }
}

function saveImageData(identifier, data) {
    const key = `image-${identifier}`;
    localStorage.setItem(key, JSON.stringify(data));
}

function loadSavedImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const key = `image-${img.id || img.className || img.alt}`;
        const savedData = localStorage.getItem(key);
        if (savedData) {
            const data = JSON.parse(savedData);
            img.src = data.src;
            if (data.width) img.style.width = data.width;
            if (data.height) img.style.height = data.height;
        }
    });
}

function showEditIndicator(text) {
    let indicator = document.querySelector('.edit-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'edit-indicator';
        document.body.appendChild(indicator);
    }
    indicator.innerHTML = `${text} <button onclick="disableCurrentMode()">Stop</button>`;
}

function hideEditIndicator() {
    const indicator = document.querySelector('.edit-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function isEditMode() {
    return currentEditMode !== null;
}

// Sakura petal animation
document.addEventListener('DOMContentLoaded', function() {
    const petals = document.querySelectorAll('.petal');
    petals.forEach((petal, index) => {
        petal.style.animationDelay = `${index * 0.5}s`;
    });
    // Load initial data
    loadSavedTexts();
    loadSavedImages();
    displayMemories();
    displayNotes();
});
