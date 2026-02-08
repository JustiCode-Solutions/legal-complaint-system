// citizen-portal.js - Citizen/Complainant Portal

document.addEventListener('DOMContentLoaded', function() {
    // ====== INITIALIZATION ======
    initUserProfile();
    initQuickActions();
    initComplaintForm();
    initCaseDetails();
    initAIAssistant();
    initFileUpload();
    
    // ====== USER PROFILE DROPDOWN ======
    function initUserProfile() {
        const userInfo = document.querySelector('.user-info');
        const userDropdown = document.querySelector('.user-dropdown');
        const chevron = userInfo.querySelector('.fa-chevron-down');
        
        if (userInfo && userDropdown) {
            userInfo.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
                chevron.style.transform = userDropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userInfo.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                    chevron.style.transform = 'rotate(0deg)';
                }
            });
        }
        
        // Logout functionality
        const logoutBtn = document.querySelector('.logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showNotification('Logging out...', 'info');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            });
        }
    }
    
    // ====== QUICK ACTIONS ======
    function initQuickActions() {
        const newComplaintBtn = document.getElementById('newComplaintBtn');
        const trackCaseBtn = document.getElementById('trackCaseBtn');
        const aiAssistantBtn = document.getElementById('aiAssistantBtn');
        const documentsBtn = document.getElementById('documentsBtn');
        
        if (newComplaintBtn) {
            newComplaintBtn.addEventListener('click', () => {
                document.getElementById('complaintForm').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the form
                const formCard = document.querySelector('.complaint-card');
                formCard.style.animation = 'pulse 2s';
                setTimeout(() => {
                    formCard.style.animation = '';
                }, 2000);
            });
        }
        
        if (trackCaseBtn) {
            trackCaseBtn.addEventListener('click', () => {
                showNotification('Track Case feature coming soon!', 'info');
            });
        }
        
        if (aiAssistantBtn) {
            aiAssistantBtn.addEventListener('click', () => {
                openAIModal();
            });
        }
        
        if (documentsBtn) {
            documentsBtn.addEventListener('click', () => {
                showNotification('My Documents feature coming soon!', 'info');
            });
        }
    }
    
    // ====== COMPLAINT FORM ======
    function initComplaintForm() {
        const complaintForm = document.getElementById('complaintForm');
        const descriptionTextarea = document.getElementById('complaintDescription');
        const charCount = document.querySelector('.char-count');
        
        if (descriptionTextarea && charCount) {
            // Character counter for description
            descriptionTextarea.addEventListener('input', function() {
                const count = this.value.length;
                charCount.textContent = `${count}/2000 characters`;
                
                if (count > 2000) {
                    charCount.style.color = '#f44336';
                } else if (count > 1500) {
                    charCount.style.color = '#ff9800';
                } else {
                    charCount.style.color = '#777777';
                }
            });
        }
        
        if (complaintForm) {
            complaintForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show loading
                showLoading();
                
                // Get form data
                const formData = new FormData(this);
                const complaintData = {
                    type: document.getElementById('complaintType').value,
                    title: document.getElementById('complaintTitle').value,
                    description: descriptionTextarea.value,
                    urgency: document.querySelector('input[name="urgency"]:checked').value,
                    files: document.querySelectorAll('.file-item').length
                };
                
                // Simulate API call
                setTimeout(() => {
                    hideLoading();
                    
                    if (complaintData.title && complaintData.description) {
                        // Generate case ID
                        const caseId = 'C-' + new Date().getFullYear() + '-' + 
                                     String(Math.floor(Math.random() * 1000)).padStart(3, '0');
                        
                        // Add to cases list
                        addNewCase(caseId, complaintData);
                        
                        // Show success message
                        showNotification(`Complaint ${caseId} filed successfully!`, 'success');
                        
                        // Reset form
                        complaintForm.reset();
                        clearFileList();
                        descriptionTextarea.dispatchEvent(new Event('input'));
                    } else {
                        showNotification('Please fill in all required fields', 'error');
                    }
                }, 2000);
            });
        }
    }
    
    function addNewCase(caseId, complaintData) {
        const casesList = document.querySelector('.cases-list');
        const activitiesList = document.querySelector('.activities-list');
        
        if (casesList) {
            const caseItem = document.createElement('div');
            caseItem.className = 'case-item';
            caseItem.innerHTML = `
                <div class="case-info">
                    <div class="case-id">${caseId}</div>
                    <h4>${complaintData.title}</h4>
                    <div class="case-meta">
                        <span class="case-status pending">Under Review</span>
                        <span class="case-date"><i class="far fa-calendar"></i> Filed: ${new Date().toLocaleDateString()}</span>
                        <span class="case-officer"><i class="fas fa-user-shield"></i> Officer: Assigning...</span>
                    </div>
                </div>
                <div class="case-actions">
                    <button class="btn-sm view-case"><i class="fas fa-eye"></i> View</button>
                    <button class="btn-sm upload-doc"><i class="fas fa-upload"></i> Upload</button>
                </div>
            `;
            
            // Insert at the beginning
            casesList.insertBefore(caseItem, casesList.firstChild);
            
            // Add event listeners to new buttons
            initCaseItemButtons(caseItem);
        }
        
        if (activitiesList) {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-icon primary">
                    <i class="fas fa-file-upload"></i>
                </div>
                <div class="activity-content">
                    <p>New complaint <strong>${caseId}</strong> filed successfully</p>
                    <span class="activity-time">Just now</span>
                </div>
            `;
            
            // Insert at the beginning
            activitiesList.insertBefore(activityItem, activitiesList.firstChild);
        }
    }
    
    // ====== CASE DETAILS ======
    function initCaseDetails() {
        const viewCaseButtons = document.querySelectorAll('.view-case');
        const caseModal = document.getElementById('caseModal');
        const modalClose = caseModal.querySelector('.modal-close');
        
        // Initialize existing buttons
        viewCaseButtons.forEach(button => {
            button.addEventListener('click', function() {
                const caseItem = this.closest('.case-item');
                openCaseModal(caseItem);
            });
        });
        
        // Initialize upload buttons
        const uploadButtons = document.querySelectorAll('.upload-doc');
        uploadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const caseId = this.closest('.case-item').querySelector('.case-id').textContent;
                showNotification(`Upload documents for ${caseId}`, 'info');
            });
        });
        
        // Initialize download buttons
        const downloadButtons = document.querySelectorAll('.download-cert');
        downloadButtons.forEach(button => {
            button.addEventListener('click', function() {
                const caseId = this.closest('.case-item').querySelector('.case-id').textContent;
                showNotification(`Downloading certificate for ${caseId}...`, 'success');
            });
        });
        
        // Modal close button
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                caseModal.classList.remove('active');
            });
        }
        
        // Close modal when clicking outside
        caseModal.addEventListener('click', (e) => {
            if (e.target === caseModal) {
                caseModal.classList.remove('active');
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && caseModal.classList.contains('active')) {
                caseModal.classList.remove('active');
            }
        });
    }
    
    function initCaseItemButtons(caseItem) {
        const viewButton = caseItem.querySelector('.view-case');
        const uploadButton = caseItem.querySelector('.upload-doc');
        const downloadButton = caseItem.querySelector('.download-cert');
        
        if (viewButton) {
            viewButton.addEventListener('click', function() {
                openCaseModal(caseItem);
            });
        }
        
        if (uploadButton) {
            uploadButton.addEventListener('click', function() {
                const caseId = caseItem.querySelector('.case-id').textContent;
                showNotification(`Upload documents for ${caseId}`, 'info');
            });
        }
        
        if (downloadButton) {
            downloadButton.addEventListener('click', function() {
                const caseId = caseItem.querySelector('.case-id').textContent;
                showNotification(`Downloading certificate for ${caseId}...`, 'success');
            });
        }
    }
    
    function openCaseModal(caseItem) {
        const caseModal = document.getElementById('caseModal');
        const modalContent = document.getElementById('caseModalContent');
        
        const caseId = caseItem.querySelector('.case-id').textContent;
        const caseTitle = caseItem.querySelector('h4').textContent;
        const caseStatus = caseItem.querySelector('.case-status').textContent;
        const caseDate = caseItem.querySelector('.case-date').textContent.replace('Filed: ', '');
        const caseOfficer = caseItem.querySelector('.case-officer').textContent.replace('Officer: ', '');
        
        modalContent.innerHTML = `
            <div class="case-details">
                <div class="detail-header">
                    <h4>${caseTitle}</h4>
                    <span class="case-id-large">${caseId}</span>
                </div>
                
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>Status:</label>
                        <span class="case-status ${getStatusClass(caseStatus)}">${caseStatus}</span>
                    </div>
                    <div class="detail-item">
                        <label>Filed Date:</label>
                        <span>${caseDate}</span>
                    </div>
                    <div class="detail-item">
                        <label>Assigned Officer:</label>
                        <span>${caseOfficer}</span>
                    </div>
                    <div class="detail-item">
                        <label>Category:</label>
                        <span>${getCategoryFromTitle(caseTitle)}</span>
                    </div>
                </div>
                
                <div class="case-timeline">
                    <h5><i class="fas fa-history"></i> Case Timeline</h5>
                    <div class="timeline">
                        <div class="timeline-item active">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h6>Complaint Filed</h6>
                                <p>Initial complaint submitted</p>
                                <span class="timeline-date">${caseDate}</span>
                            </div>
                        </div>
                        <div class="timeline-item ${caseStatus === 'Under Review' || caseStatus === 'In Progress' || caseStatus === 'Resolved' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h6>Under Review</h6>
                                <p>Case assigned to legal officer</p>
                                <span class="timeline-date">${getNextDate(caseDate, 2)}</span>
                            </div>
                        </div>
                        <div class="timeline-item ${caseStatus === 'In Progress' || caseStatus === 'Resolved' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h6>Investigation</h6>
                                <p>Evidence collection and analysis</p>
                                <span class="timeline-date">${getNextDate(caseDate, 5)}</span>
                            </div>
                        </div>
                        <div class="timeline-item ${caseStatus === 'Resolved' ? 'active' : ''}">
                            <div class="timeline-dot"></div>
                            <div class="timeline-content">
                                <h6>Resolved</h6>
                                <p>Case closed with resolution</p>
                                <span class="timeline-date">${caseStatus === 'Resolved' ? getNextDate(caseDate, 14) : 'Pending'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="case-actions-modal">
                    <button class="btn btn-primary"><i class="fas fa-download"></i> Download Case File</button>
                    <button class="btn btn-secondary"><i class="fas fa-upload"></i> Upload Evidence</button>
                    <button class="btn btn-outline"><i class="fas fa-print"></i> Print Details</button>
                </div>
            </div>
        `;
        
        // Add CSS for modal content
        const style = document.createElement('style');
        style.textContent = `
            .case-details {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }
            
            .detail-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }
            
            .detail-header h4 {
                font-size: 1.5rem;
                color: var(--text-primary);
            }
            
            .case-id-large {
                background: var(--primary-color);
                color: white;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: 600;
            }
            
            .detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 10px;
            }
            
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .detail-item label {
                font-weight: 600;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .case-timeline {
                background: rgba(255, 255, 255, 0.05);
                padding: 1.5rem;
                border-radius: 10px;
            }
            
            .case-timeline h5 {
                font-size: 1.2rem;
                margin-bottom: 1.5rem;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .case-timeline h5 i {
                color: var(--primary-color);
            }
            
            .timeline {
                position: relative;
                padding-left: 30px;
            }
            
            .timeline::before {
                content: '';
                position: absolute;
                left: 10px;
                top: 0;
                bottom: 0;
                width: 2px;
                background: var(--card-border);
            }
            
            .timeline-item {
                position: relative;
                margin-bottom: 2rem;
            }
            
            .timeline-item:last-child {
                margin-bottom: 0;
            }
            
            .timeline-dot {
                position: absolute;
                left: -26px;
                top: 5px;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--card-border);
                border: 3px solid var(--card-bg);
            }
            
            .timeline-item.active .timeline-dot {
                background: var(--primary-color);
            }
            
            .timeline-content h6 {
                font-size: 1rem;
                color: var(--text-primary);
                margin-bottom: 5px;
            }
            
            .timeline-content p {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin-bottom: 5px;
            }
            
            .timeline-date {
                font-size: 0.8rem;
                color: var(--text-muted);
            }
            
            .case-actions-modal {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .btn {
                padding: 10px 20px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-primary {
                background: var(--primary-color);
                color: white;
            }
            
            .btn-primary:hover {
                background: var(--primary-dark);
            }
            
            .btn-secondary {
                background: rgba(33, 150, 243, 0.2);
                color: #2196f3;
                border: 1px solid #2196f3;
            }
            
            .btn-secondary:hover {
                background: rgba(33, 150, 243, 0.3);
            }
            
            .btn-outline {
                background: transparent;
                color: var(--text-primary);
                border: 1px solid var(--card-border);
            }
            
            .btn-outline:hover {
                background: rgba(255, 255, 255, 0.05);
            }
        `;
        document.head.appendChild(style);
        
        caseModal.classList.add('active');
    }
    
    function getStatusClass(status) {
        switch(status) {
            case 'In Progress': return 'in-progress';
            case 'Under Review': return 'pending';
            case 'Resolved': return 'resolved';
            default: return 'pending';
        }
    }
    
    function getCategoryFromTitle(title) {
        if (title.includes('Property')) return 'Property Dispute';
        if (title.includes('Consumer')) return 'Consumer Rights';
        if (title.includes('Employment')) return 'Employment Issue';
        if (title.includes('Civil')) return 'Civil Rights';
        return 'General Complaint';
    }
    
    function getNextDate(startDate, daysToAdd) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + daysToAdd);
        return date.toLocaleDateString();
    }
    
    // ====== AI ASSISTANT ======
    function initAIAssistant() {
        const chatInput = document.getElementById('chatInput');
        const sendChat = document.getElementById('sendChat');
        const quickQuestions = document.querySelectorAll('.quick-question');
        
        if (chatInput && sendChat) {
            // Send message on Enter key
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Send message on button click
            sendChat.addEventListener('click', sendMessage);
        }
        
        // Quick questions
        quickQuestions.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.textContent;
                chatInput.value = question;
                sendMessage();
            });
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;
            
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Simulate AI response
            setTimeout(() => {
                const response = getAIResponse(message);
                addMessage(response, 'ai');
            }, 1000);
        }
        
        function addMessage(text, sender) {
            const chatMessages = document.querySelector('.chat-messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender}`;
            
            const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            messageDiv.innerHTML = `
                <div class="message-avatar">${sender === 'ai' ? 'AI' : 'You'}</div>
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${time}</span>
                </div>
            `;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        function getAIResponse(question) {
            const responses = {
                'How to file a complaint?': 'To file a complaint: 1) Click "File New Complaint", 2) Fill in the details, 3) Upload documents if needed, 4) Submit. Our legal team will review it within 24-48 hours.',
                'What documents are needed?': 'Common documents needed: ID proof, relevant contracts, photos/videos, witness statements, correspondence records. Specific requirements vary by case type.',
                'Check case status': 'You can check your case status in the "My Active Cases" section. Each case shows current status, assigned officer, and next steps.',
                'default': 'I understand you\'re asking about "' + question + '". For specific legal advice, I recommend consulting with your assigned legal officer. For general questions about our services, please refer to our FAQ section.'
            };
            
            return responses[question] || responses['default'];
        }
    }
    
    function openAIModal() {
        const aiModal = document.getElementById('aiModal');
        const modalClose = aiModal.querySelector('.modal-close');
        
        aiModal.classList.add('active');
        
        modalClose.addEventListener('click', () => {
            aiModal.classList.remove('active');
        });
        
        aiModal.addEventListener('click', (e) => {
            if (e.target === aiModal) {
                aiModal.classList.remove('active');
            }
        });
    }
    
    // ====== FILE UPLOAD ======
    function initFileUpload() {
        const fileInput = document.getElementById('fileInput');
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileList = document.getElementById('fileList');
        
        if (fileInput && fileUploadArea) {
            // Click on upload area to trigger file input
            fileUploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            // Handle file selection
            fileInput.addEventListener('change', handleFileSelect);
            
            // Drag and drop functionality
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                fileUploadArea.style.borderColor = 'var(--primary-color)';
                fileUploadArea.style.background = 'rgba(255, 87, 34, 0.1)';
            }
            
            function unhighlight() {
                fileUploadArea.style.borderColor = '';
                fileUploadArea.style.background = '';
            }
            
            fileUploadArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                handleFiles(files);
            }
        }
        
        function handleFileSelect(e) {
            const files = e.target.files;
            handleFiles(files);
        }
        
        function handleFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (validateFile(file)) {
                    addFileToList(file);
                }
            }
        }
        
        function validateFile(file) {
            const validTypes = ['application/pdf', 'application/msword', 
                              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              'image/jpeg', 'image/jpg', 'image/png'];
            
            if (!validTypes.includes(file.type)) {
                showNotification('Invalid file type. Please upload PDF, Word, or image files.', 'error');
                return false;
            }
            
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                showNotification('File size exceeds 10MB limit.', 'error');
                return false;
            }
            
            return true;
        }
        
        function addFileToList(file) {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileTypeIcon = getFileIcon(file.type);
            const fileSize = formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-name">
                    <i class="${fileTypeIcon}"></i>
                    <span>${file.name}</span>
                </div>
                <div class="file-info">
                    <span class="file-size">${fileSize}</span>
                    <button class="remove-file"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            fileList.appendChild(fileItem);
            
            // Add remove functionality
            const removeBtn = fileItem.querySelector('.remove-file');
            removeBtn.addEventListener('click', () => {
                fileItem.remove();
            });
        }
        
        function getFileIcon(fileType) {
            if (fileType.includes('pdf')) return 'fas fa-file-pdf';
            if (fileType.includes('word')) return 'fas fa-file-word';
            if (fileType.includes('image')) return 'fas fa-file-image';
            return 'fas fa-file';
        }
        
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
        
        function clearFileList() {
            fileList.innerHTML = '';
        }
    }
    
    // ====== NOTIFICATION SYSTEM ======
    function showNotification(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 4000;
        `;
        document.body.appendChild(container);
        return container;
    }
    
    // ====== LOADING OVERLAY ======
    function showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }
    
    function hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }
    
    // ====== ANIMATIONS ======
    // Add pulse animation for highlighting
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 87, 34, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 87, 34, 0); }
        }
    `;
    document.head.appendChild(style);
});