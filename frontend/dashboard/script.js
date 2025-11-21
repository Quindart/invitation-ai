// API Configuration
const API_URL = 'http://localhost:8000/api';

// ==================== Login ====================
const ADMIN_CODE = '2011202525';  // 10-character code
const LOGIN_SESSION_KEY = 'admin_dashboard_login';

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem(LOGIN_SESSION_KEY);
    
    if (!isLoggedIn) {
        showLoginScreen();
    } else {
        showDashboard();
    }
});

function showLoginScreen() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    loginScreen.style.display = 'flex';
    dashboardContainer.style.display = 'none';
    
    const loginForm = document.getElementById('loginForm');
    const adminCode = document.getElementById('adminCode');
    const loginError = document.getElementById('loginError');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const code = adminCode.value.trim();
        
        if (code === ADMIN_CODE) {
            sessionStorage.setItem(LOGIN_SESSION_KEY, 'true');
            loginError.textContent = '';
            showDashboard();
        } else {
            loginError.textContent = '❌ Mã bảo mật không đúng';
            adminCode.value = '';
            adminCode.focus();
        }
    });
    
    adminCode.focus();
}

function showDashboard() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    loginScreen.style.display = 'none';
    dashboardContainer.style.display = 'flex';
    
    // Initialize dashboard
    initDashboard();
}

function logout() {
    sessionStorage.removeItem(LOGIN_SESSION_KEY);
    location.reload();
}

function initDashboard() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const graduateForm = document.getElementById('graduateForm');
    const invitationForm = document.getElementById('invitationForm');
    const graduatesList = document.getElementById('graduatesList');
    const invitationsList = document.getElementById('invitationsList');
    const graduateIdSelect = document.getElementById('graduate_id');
    const photoContainer = document.getElementById('photoContainer');
    const guestContainer = document.getElementById('guestContainer');

    // Make these global for other functions
    window.navLinks = navLinks;
    window.sections = sections;
    window.graduateForm = graduateForm;
    window.invitationForm = invitationForm;
    window.graduatesList = graduatesList;
    window.invitationsList = invitationsList;
    window.graduateIdSelect = graduateIdSelect;
    window.photoContainer = photoContainer;
    window.guestContainer = guestContainer;

    // Event Listeners
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(e.target.dataset.section);
        });
    });

    graduateForm.addEventListener('submit', handleCreateGraduate);
    invitationForm.addEventListener('submit', handleCreateInvitation);
    
    // Load invitations when graduate is selected
    window.graduateIdSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            loadInvitationsByGraduate(e.target.value);
        } else {
            window.invitationsList.innerHTML = `<div class="empty-message">Vui lòng chọn người tốt nghiệp</div>`;
        }
    });

    // Load initial data
    loadGraduates();
}

// ==================== Original Code ====================

// State
let graduates = [];
let currentInvitations = [];


// ==================== Navigation ====================
function switchSection(sectionId) {
    // Hide all sections
    window.sections.forEach(section => section.classList.remove('active'));
    window.navLinks.forEach(link => link.classList.remove('active'));

    // Show selected section
    document.getElementById(`${sectionId}-section`).classList.add('active');
    document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

    // Load data
    if (sectionId === 'graduates') {
        loadGraduates();
    } else if (sectionId === 'invitations') {
        loadGraduateSelect();
    }
}

// ==================== Photo Management ====================
function addPhotoInput() {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'photo-input-group';
    const index = window.photoContainer.children.length + 1;
    
    photoDiv.innerHTML = `
        <label>Tải Lên Ảnh ${index}</label>
        <div style="display: flex; gap: 10px;">
            <input type="file" class="photo-file" accept="image/*" style="flex: 1;">
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Xóa</button>
        </div>
    `;
    
    window.photoContainer.appendChild(photoDiv);
}

// Upload photos to Azure Storage
async function uploadPhotos(graduateId) {
    const photoUrls = [];
    const photoFiles = Array.from(document.querySelectorAll('.photo-file'));
    
    for (const fileInput of photoFiles) {
        if (!fileInput.files || fileInput.files.length === 0) {
            continue;
        }
        
        const file = fileInput.files[0];
        
        try {
            // Show progress
            document.getElementById('uploadProgress').style.display = 'block';
            document.getElementById('uploadStatus').textContent = `Đang tải lên: ${file.name}`;
            
            // Create FormData
            const formData = new FormData();
            formData.append('file', file);
            
            // Upload to backend
            const response = await fetch(`${API_URL}/graduates/${graduateId}/photos`, {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Lỗi tải lên ảnh');
            }
            
            const result = await response.json();
            photoUrls.push(result.photo_url);
            
        } catch (error) {
            console.error('Upload error:', error);
            alert(`❌ Lỗi tải lên ${file.name}: ${error.message}`);
        }
    }
    
    document.getElementById('uploadProgress').style.display = 'none';
    return photoUrls;
}

// ==================== Guest Management ====================
function addGuestInput() {
    const guestDiv = document.createElement('div');
    guestDiv.className = 'guest-input-group';
    const index = window.guestContainer.children.length + 1;
    
    guestDiv.innerHTML = `
        <label>Tên Người Được Mời ${index}</label>
        <div style="display: flex; gap: 10px;">
            <input type="text" class="guest-name" placeholder="Nhập tên..." style="flex: 1;" required>
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="background: #f44336; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer;">Xóa</button>
        </div>
    `;
    
    window.guestContainer.appendChild(guestDiv);
}

// ==================== Graduates ====================
async function handleCreateGraduate(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('graduateMessage');
    messageDiv.classList.remove('success', 'error');

    try {
        // Prepare graduate data (without photos first)
        const graduateData = {
            name: document.getElementById('name').value,
            degree: document.getElementById('degree').value,
            department: document.getElementById('department').value,
            graduation_datetime: (() => {
                const dateStr = document.getElementById('graduation_date').value;
                const timeStr = document.getElementById('graduation_time').value || '00:00';
                return new Date(`${dateStr}T${timeStr}`).toISOString();
            })(),
            venue: {
                name: document.getElementById('venue_name').value,
                address: document.getElementById('venue_address').value,
                parking: document.getElementById('venue_parking').value || null
            },
            contact: {
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value
            },
            invitation_template: document.getElementById('template').value || null,
            photo_urls: []
        };

        // Make request to create graduate first
        const response = await fetch(`${API_URL}/graduates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graduateData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Lỗi tạo graduate');
        }

        const result = await response.json();
        const graduateId = result.graduate_id;
        
        // Upload photos if any
        messageDiv.textContent = `⏳ Đang tải lên ảnh...`;
        messageDiv.classList.add('success');
        
        const photoUrls = await uploadPhotos(graduateId);
        
        // Update graduate with photo URLs if any
        if (photoUrls.length > 0) {
            await fetch(`${API_URL}/graduates/${graduateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ photo_urls: photoUrls })
            });
        }
        
        messageDiv.textContent = `✅ Tạo thành công! ID: ${graduateId}`;
        messageDiv.classList.add('success');
        
        window.graduateForm.reset();
        window.photoContainer.innerHTML = `
            <div class="photo-input-group">
                <label>Tải Lên Ảnh 1</label>
                <input type="file" class="photo-file" accept="image/*">
            </div>
        `;
        
        loadGraduates();
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = `❌ Lỗi: ${error.message}`;
        messageDiv.classList.add('error');
    }
}

async function loadGraduates() {
    try {
        const response = await fetch(`${API_URL}/graduates`);
        if (!response.ok) throw new Error('Lỗi tải danh sách');

        graduates = await response.json();
        displayGraduates();
    } catch (error) {
        console.error('Error:', error);
        window.graduatesList.innerHTML = `<div class="empty-message">Lỗi tải dữ liệu</div>`;
    }
}

function displayGraduates() {
    if (graduates.length === 0) {
        window.graduatesList.innerHTML = `<div class="empty-message">Chưa có người tốt nghiệp nào</div>`;
        return;
    }

    window.graduatesList.innerHTML = graduates.map(grad => `
        <div class="graduate-card">
            <h4>${grad.name}</h4>
            <p><strong>Bằng cấp:</strong> ${grad.degree}</p>
            <p><strong>Ngành:</strong> ${grad.department}</p>
            <p><strong>Email:</strong> ${grad.contact.email}</p>
            <p><strong>Điện thoại:</strong> ${grad.contact.phone}</p>
            <p><strong>ID:</strong> <span class="graduate-id">${grad._id}</span></p>
            ${grad.photo_urls && grad.photo_urls.length > 0 ? `
                <div class="photos">
                    ${grad.photo_urls.slice(0, 3).map(url => `
                        <img src="${url}" class="photo-thumb" alt="Photo" onclick="previewPhoto('${url}')">
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ==================== Invitations ====================
async function loadGraduateSelect() {
    try {
        const response = await fetch(`${API_URL}/graduates`);
        if (!response.ok) throw new Error('Lỗi tải danh sách');

        graduates = await response.json();
        
        window.graduateIdSelect.innerHTML = `<option value="">-- Chọn --</option>` +
            graduates.map(grad => `
                <option value="${grad._id}">${grad.name} (${grad.department})</option>
            `).join('');
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleCreateInvitation(e) {
    e.preventDefault();
    const messageDiv = document.getElementById('invitationMessage');
    messageDiv.classList.remove('success', 'error');

    try {
        const graduateId = document.getElementById('graduate_id').value;
        if (!graduateId) {
            throw new Error('Vui lòng chọn người tốt nghiệp');
        }

        // Collect guest names
        const guestNames = Array.from(document.querySelectorAll('.guest-name'))
            .map(input => input.value.trim())
            .filter(name => name.length > 0);

        if (guestNames.length === 0) {
            throw new Error('Vui lòng nhập tên ít nhất 1 người được mời');
        }

        // Prepare data
        const invitationData = {
            graduate_id: graduateId,
            guest_names: guestNames
        };

        // Make request
        const response = await fetch(`${API_URL}/invitations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invitationData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Lỗi tạo thiệp');
        }

        const result = await response.json();
        
        messageDiv.textContent = `✅ Tạo ${result.invitations.length} thiệp thành công!`;
        messageDiv.classList.add('success');
        
        currentInvitations = result.invitations;
        displayInvitations();
        
        // Load all invitations for this graduate
        loadInvitationsByGraduate(graduateId);
        
        window.invitationForm.reset();
        window.guestContainer.innerHTML = `
            <div class="guest-input-group">
                <label>Tên Người Được Mời 1</label>
                <input type="text" class="guest-name" placeholder="VD: Nguyễn Văn A" required>
            </div>
        `;
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = `❌ Lỗi: ${error.message}`;
        messageDiv.classList.add('error');
    }
}

function displayInvitations() {
    if (currentInvitations.length === 0) {
        window.invitationsList.innerHTML = `<div class="empty-message">Chưa có thiệp nào</div>`;
        return;
    }

    window.invitationsList.innerHTML = currentInvitations.map(inv => `
        <div class="invitation-card">
            <h4>${inv.guest_name}</h4>
            <div class="invitation-code">${inv.invitation_code}</div>
            <p style="margin-top: 10px; font-size: 0.9em; color: #999;">
                Graduate ID: <span class="graduate-id">${inv.graduate_id.substring(0, 8)}...</span>
            </p>
        </div>
    `).join('');
}

// Load invitations for selected graduate
async function loadInvitationsByGraduate(graduateId) {
    try {
        const response = await fetch(`${API_URL}/invitations?graduate_id=${graduateId}`);
        if (!response.ok) throw new Error('Lỗi tải danh sách thiệp');

        currentInvitations = await response.json();
        displayInvitations();
    } catch (error) {
        console.error('Error:', error);
        window.invitationsList.innerHTML = `<div class="empty-message">Lỗi tải dữ liệu</div>`;
    }
}

// ==================== Photo Preview ====================
function previewPhoto(url) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()" style="position: relative; right: auto; top: auto; display: inline-block; margin-bottom: 10px;">&times;</span>
            <img src="${url}" alt="Preview">
        </div>
    `;
    document.body.appendChild(modal);
}

// ==================== Init ====================
window.addEventListener('DOMContentLoaded', () => {
    loadGraduates();
});
