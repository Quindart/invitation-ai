// API Base URL

const API_URL =
  'https://invitation-backend.jollysea-6ff72832.southeastasia.azurecontainerapps.io/api';

// Elements
const codePage = document.getElementById('codePage');
const invitationPage = document.getElementById('invitationPage');
const codeForm = document.getElementById('codeForm');
const invitationCode = document.getElementById('invitationCode');
const errorMessage = document.getElementById('errorMessage');
const backBtn = document.getElementById('backBtn');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');

let currentGraduateId = null;
let currentGuestName = null;

// Event Listeners
codeForm.addEventListener('submit', handleCodeSubmit);
backBtn.addEventListener('click', handleBack);
chatForm.addEventListener('submit', handleChatSubmit);

async function handleCodeSubmit(e) {
    e.preventDefault();
    errorMessage.textContent = '';
    
    const code = invitationCode.value.trim();
    
    if (code.length !== 6 || !/^\d+$/.test(code)) {
        errorMessage.textContent = 'Vui lòng nhập mã 6 số hợp lệ';
        return;
    }
    
    try {
        codeForm.classList.add('loading');
        
        const response = await fetch(`${API_URL}/invitations/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                invitation_code: code
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Mã không hợp lệ');
        }
        
        const data = await response.json();
        currentGraduateId = data.graduate_id;
        currentGuestName = data.guest_name;
        displayInvitation(data.graduate_info, data.guest_name);
        
        // Switch pages
        codePage.classList.add('hidden');
        invitationPage.classList.remove('hidden');
        
        // Clear input
        invitationCode.value = '';
        
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = error.message || 'Đã xảy ra lỗi, vui lòng thử lại';
    } finally {
        codeForm.classList.remove('loading');
    }
}

function displayInvitation(graduateInfo, guestName) {
    // Parse datetime if needed
    const datetime = new Date(graduateInfo.graduation_datetime);
    const timeString = datetime.toLocaleString('vi-VN');
    
    // Update guest greeting
    document.getElementById('guestGreeting').textContent = `Kính gửi ${guestName},`;
    
    document.getElementById('graduateName').textContent = graduateInfo.name;
    document.getElementById('graduationTime').textContent = timeString;
    document.getElementById('venueName').textContent = graduateInfo.venue.name;
    document.getElementById('venueAddress').textContent = graduateInfo.venue.address;
    document.getElementById('venueParking').textContent = 
        graduateInfo.venue.parking || 'Có chỗ đậu xe';
    document.getElementById('graduatePhone').textContent = 
        `${graduateInfo.contact.phone} / ${graduateInfo.contact.email}`;
    
    // Clear chat messages
    chatMessages.innerHTML = '';
}

function handleBack() {
    invitationPage.classList.add('hidden');
    codePage.classList.remove('hidden');
    currentGraduateId = null;
    currentGuestName = null;
    chatMessages.innerHTML = '';
    chatInput.value = '';
}

async function handleChatSubmit(e) {
    e.preventDefault();
    
    const message = chatInput.value.trim();
    if (!message || !currentGraduateId) return;
    
    // Add user message to chat
    addChatMessage(message, 'user');
    chatInput.value = '';
    
    try {
        chatForm.classList.add('loading');
        
        const response = await fetch(`${API_URL}/graduates/${currentGraduateId}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message
            })
        });
        
        if (!response.ok) {
            throw new Error('Lỗi khi gửi tin nhắn');
        }
        
        const data = await response.json();
        addChatMessage(data.response, 'bot');
        
    } catch (error) {
        console.error('Error:', error);
        addChatMessage('Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.', 'bot');
    } finally {
        chatForm.classList.remove('loading');
    }
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = message;
    
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
