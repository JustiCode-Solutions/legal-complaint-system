// Global State
const appState = {
    user: {
        name: "Officer Admin",
        role: "Senior Legal Officer",
        id: "OFF-001"
    },
    complaints: [],
    officers: [],
    cases: [],
    aiServices: {
        categorization: true,
        sentiment: true,
        urgency: true
    },
    systemStats: {
        totalComplaints: 156,
        pending: 48,
        assigned: 12,
        resolved: 89,
        activeOfficers: 8
    }
};

// Initialize on DOM ready
$(document).ready(function() {
    initNavigation();
    initDashboard();
    initTables();
    initEventListeners();
    loadSampleData();
    updateStatsDisplay();
});

// Navigation
function initNavigation() {
    // Navigation between sections
    $('.nav-link').click(function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        $('.nav-link').removeClass('active');
        // Add active class to clicked link
        $(this).addClass('active');
        
        // Get target section
        const target = $(this).data('section');
        // Hide all sections
        $('.content-section').removeClass('active');
        // Show target section
        $(`#${target}`).addClass('active');
        
        // Update page title
        document.title = `${$(this).find('span').text()} - LegalJustice Officer Portal`;
        
        // Call section-specific initialization
        switch(target) {
            case 'dashboard':
                initDashboard();
                break;
            case 'all-complaints':
                initComplaintsTable();
                break;
            case 'assigned-cases':
                initAssignedTable();
                break;
        }
    });
    
    // User profile dropdown
    $('#userProfile').click(function() {
        $(this).toggleClass('active');
        const chevron = $(this).find('.fa-chevron-down');
        chevron.css('transform', $(this).hasClass('active') ? 'rotate(180deg)' : 'rotate(0deg)');
        
        // In a real app, this would show a dropdown menu
        if ($(this).hasClass('active')) {
            showNotification('User menu would open here', 'info');
        }
    });
}

// Dashboard
function initDashboard() {
    loadPriorityCases();
    loadRecentActivity();
    
    // Refresh dashboard
    $('#refreshDashboard').click(function() {
        showLoading();
        setTimeout(() => {
            loadPriorityCases();
            loadRecentActivity();
            updateStatsDisplay();
            hideLoading();
            showNotification('Dashboard refreshed successfully', 'success');
        }, 1000);
    });
}

function loadPriorityCases() {
    const priorityCases = [
        {
            id: 'C-2024-001',
            title: 'Property boundary dispute with neighbor encroachment',
            priority: 'High',
            deadline: 'Tomorrow',
            assignedTo: 'Officer Smith',
            daysOpen: 5
        },
        {
            id: 'C-2024-002',
            title: 'Consumer fraud - defective electronics retailer',
            priority: 'High',
            deadline: '2 days',
            assignedTo: 'Officer Johnson',
            daysOpen: 3
        },
        {
            id: 'C-2024-003',
            title: 'Employment discrimination case',
            priority: 'Medium',
            deadline: '1 week',
            assignedTo: 'Unassigned',
            daysOpen: 7
        }
    ];
    
    let html = '';
    priorityCases.forEach(caseItem => {
        html += `
            <div class="priority-case-item">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                    <strong style="color: var(--text-primary);">${caseItem.id}</strong>
                    <span class="priority-${caseItem.priority.toLowerCase()}">${caseItem.priority}</span>
                </div>
                <p style="margin-bottom: 0.75rem; color: var(--text-secondary); line-height: 1.4;">${caseItem.title}</p>
                <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                    <span><i class="far fa-clock"></i> ${caseItem.deadline}</span>
                    <span><i class="fas fa-user-shield"></i> ${caseItem.assignedTo}</span>
                    <span><i class="far fa-calendar"></i> ${caseItem.daysOpen} days</span>
                </div>
            </div>
        `;
    });
    
    $('#priorityCases').html(html);
    
    // Add click handlers
    $('.priority-case-item').click(function() {
        const caseId = $(this).find('strong').text();
        openCaseDetails(caseId);
    });
}

function loadRecentActivity() {
    const activities = [
        {
            icon: 'fa-user-plus',
            text: 'Case C-2024-025 assigned to Officer Rodriguez',
            time: '10 minutes ago'
        },
        {
            icon: 'fa-file-signature',
            text: 'Status updated for C-2024-018 to "Under Investigation"',
            time: '2 hours ago'
        },
        {
            icon: 'fa-comment-medical',
            text: 'Notes added to C-2024-012 regarding evidence',
            time: '4 hours ago'
        },
        {
            icon: 'fa-calendar-check',
            text: 'Hearing scheduled for C-2024-008 on Feb 15',
            time: '1 day ago'
        },
        {
            icon: 'fa-check-circle',
            text: 'Case C-2024-005 marked as resolved',
            time: '2 days ago'
        }
    ];
    
    let html = '';
    activities.forEach(activity => {
        html += `
            <div style="display: flex; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--card-border);">
                <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255, 152, 0, 0.1); 
                    display: flex; align-items: center; justify-content: center; color: var(--primary-color);">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div style="flex: 1;">
                    <p style="margin: 0 0 4px 0; color: var(--text-primary);">${activity.text}</p>
                    <small style="color: var(--text-muted);">${activity.time}</small>
                </div>
            </div>
        `;
    });
    
    $('#recentActivity').html(html);
}

function updateStatsDisplay() {
    $('#pendingCount').text(appState.systemStats.pending);
    $('#assignedCount').text(appState.systemStats.assigned);
    $('#resolvedCount').text(appState.systemStats.resolved);
}

// Tables
function initTables() {
    initComplaintsTable();
    initAssignedTable();
}

function initComplaintsTable() {
    if ($.fn.DataTable.isDataTable('#complaintsTable')) {
        $('#complaintsTable').DataTable().destroy();
    }
    
    const table = $('#complaintsTable').DataTable({
        data: appState.complaints,
        columns: [
            { data: 'id' },
            { data: 'type' },
            { data: 'citizen' },
            { data: 'date' },
            { 
                data: 'priority',
                render: function(data) {
                    return `<span class="priority-${data.toLowerCase()}">${data}</span>`;
                }
            },
            { 
                data: 'status',
                render: function(data) {
                    const statusClass = data.toLowerCase().replace(' ', '-');
                    return `<span class="status-badge status-${statusClass}">${data}</span>`;
                }
            },
            { data: 'aiCategory' },
            {
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <div class="action-buttons">
                            <button class="action-btn view-case-btn" title="View Details" data-id="${row.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit-case-btn" title="Edit" data-id="${row.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn assign-case-btn" title="Assign" data-id="${row.id}">
                                <i class="fas fa-user-plus"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        pageLength: 10,
        responsive: true,
        language: {
            search: "Search complaints:",
            lengthMenu: "Show _MENU_ complaints",
            info: "Showing _START_ to _END_ of _TOTAL_ complaints"
        }
    });
    
    // Add event handlers for action buttons
    $('#complaintsTable').on('click', '.view-case-btn', function() {
        const caseId = $(this).data('id');
        openCaseDetails(caseId);
    });
    
    $('#complaintsTable').on('click', '.edit-case-btn', function() {
        const caseId = $(this).data('id');
        showNotification(`Editing case ${caseId}...`, 'info');
    });
    
    $('#complaintsTable').on('click', '.assign-case-btn', function() {
        const caseId = $(this).data('id');
        openAssignCaseModal(caseId);
    });
}

function initAssignedTable() {
    if ($.fn.DataTable.isDataTable('#assignedTable')) {
        $('#assignedTable').DataTable().destroy();
    }
    
    const assignedCases = [
        { id: 'C-2024-001', description: 'Property boundary dispute', date: '2024-01-15', deadline: '2024-02-15', progress: '60%' },
        { id: 'C-2024-002', description: 'Consumer fraud investigation', date: '2024-01-10', deadline: '2024-02-10', progress: '40%' },
        { id: 'C-2024-003', description: 'Employment discrimination', date: '2024-01-05', deadline: '2024-02-05', progress: '80%' },
        { id: 'C-2024-004', description: 'Cyber crime - online fraud', date: '2024-01-03', deadline: '2024-02-03', progress: '25%' }
    ];
    
    $('#assignedTable').DataTable({
        data: assignedCases,
        columns: [
            { data: 'id' },
            { data: 'description' },
            { data: 'date' },
            { data: 'deadline' },
            { 
                data: 'progress',
                render: function(data) {
                    return `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                                <div style="height: 100%; width: ${data}; background: var(--primary-color); border-radius: 3px;"></div>
                            </div>
                            <span style="font-size: 0.9rem; color: var(--text-secondary);">${data}</span>
                        </div>
                    `;
                }
            },
            {
                data: null,
                orderable: false,
                render: function(data, type, row) {
                    return `
                        <div class="action-buttons">
                            <button class="action-btn view-case-btn" title="View Details" data-id="${row.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn update-progress-btn" title="Update Progress" data-id="${row.id}">
                                <i class="fas fa-chart-line"></i>
                            </button>
                        </div>
                    `;
                }
            }
        ],
        pageLength: 10
    });
    
    // Add event handlers
    $('#assignedTable').on('click', '.view-case-btn', function() {
        const caseId = $(this).data('id');
        openCaseDetails(caseId);
    });
    
    $('#assignedTable').on('click', '.update-progress-btn', function() {
        const caseId = $(this).data('id');
        showNotification(`Updating progress for case ${caseId}...`, 'info');
    });
}

// Event Listeners
function initEventListeners() {
    // Update Status
    $('#updateStatusBtn').click(function() {
        const status = $('#statusSelect').val();
        const notes = $('#statusNotes').val();
        
        if (!notes) {
            showNotification('Please add update notes', 'warning');
            return;
        }
        
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`Case status updated to: ${getStatusText(status)}`, 'success');
            $('#statusNotes').val('');
            addActivity(`Updated case status to ${getStatusText(status)}`);
        }, 1500);
    });
    
    // Assign Officer
    $('#assignOfficerBtn').click(function() {
        const caseId = $('#caseSelect').val();
        const officerId = $('#officerSelect').val();
        
        if (!caseId || !officerId) {
            showNotification('Please select both case and officer', 'warning');
            return;
        }
        
        showLoading();
        setTimeout(() => {
            hideLoading();
            const officer = appState.officers.find(o => o.id === officerId);
            showNotification(`Case ${caseId} assigned to ${officer.name}`, 'success');
            
            // Reset form
            $('#caseSelect').val('');
            $('#officerSelect').val('');
            $('#caseDetails').html('');
            $('#officerDetails').html('');
            
            // Update stats
            appState.systemStats.assigned++;
            appState.systemStats.pending--;
            updateStatsDisplay();
            
            addActivity(`Assigned case ${caseId} to ${officer.name}`);
        }, 1500);
    });
    
    // Add Investigation Update
    $('#addInvestigationUpdate').click(function() {
        const caseId = $('#investigationCase').val();
        const update = $('#investigationUpdate').val();
        
        if (!caseId || !update) {
            showNotification('Please fill all fields', 'warning');
            return;
        }
        
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`Investigation update added for ${caseId}`, 'success');
            $('#investigationCase').val('');
            $('#investigationUpdate').val('');
            
            addActivity(`Added investigation update for case ${caseId}`);
        }, 1500);
    });
    
    // Mark as Resolved
    $('#markResolved').click(function() {
        const caseId = $('#resolutionCase').val();
        const type = $('#resolutionType').val();
        const details = $('#resolutionDetails').val();
        
        if (!caseId || !details) {
            showNotification('Please fill all fields', 'warning');
            return;
        }
        
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`Case ${caseId} marked as resolved (${type})`, 'success');
            $('#resolutionCase').val('');
            $('#resolutionDetails').val('');
            
            // Update stats
            appState.systemStats.resolved++;
            updateStatsDisplay();
            
            addActivity(`Marked case ${caseId} as resolved`);
        }, 1500);
    });
    
    // Logout
    $('#logoutBtn').click(function() {
        if (confirm('Are you sure you want to logout?')) {
            showLoading();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    });
    
    // Export Complaints
    $('#exportComplaints').click(function() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Complaints exported successfully (CSV file downloaded)', 'success');
        }, 2000);
    });
    
    // Filter Complaints
    $('#filterComplaints').click(function() {
        showNotification('Filter panel would open here', 'info');
    });
    
    // Assign New Case
    $('#assignNewCase').click(function() {
        $('.nav-link[data-section="assign-officer"]').click();
    });
    
    // Generate Report
    $('#generateReport').click(function() {
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification('Report generated and downloaded as PDF', 'success');
        }, 2000);
    });
    
    // AI Action Buttons
    $('.ai-action-btn').click(function() {
        const action = $(this).find('span').text() || $(this).text();
        showNotification(`AI ${action} initiated...`, 'info');
        showLoading();
        setTimeout(() => {
            hideLoading();
            showNotification(`AI ${action} completed successfully`, 'success');
        }, 2000);
    });
    
    // View Report Buttons
    $('.view-report').click(function() {
        showNotification('Opening report viewer...', 'info');
    });
}

// Load Sample Data
function loadSampleData() {
    // Sample complaints data
    appState.complaints = [
        { id: 'C-2024-001', type: 'Property Dispute', citizen: 'John Doe', date: '2024-01-15', priority: 'High', status: 'Pending', aiCategory: 'Property Law' },
        { id: 'C-2024-002', type: 'Consumer Fraud', citizen: 'Jane Smith', date: '2024-01-14', priority: 'High', status: 'Investigating', aiCategory: 'Consumer Protection' },
        { id: 'C-2024-003', type: 'Employment', citizen: 'Bob Johnson', date: '2024-01-13', priority: 'Medium', status: 'Pending', aiCategory: 'Labor Law' },
        { id: 'C-2024-004', type: 'Family Matter', citizen: 'Alice Brown', date: '2024-01-12', priority: 'Medium', status: 'Resolved', aiCategory: 'Family Law' },
        { id: 'C-2024-005', type: 'Cyber Crime', citizen: 'Charlie Wilson', date: '2024-01-11', priority: 'High', status: 'Investigating', aiCategory: 'Cyber Law' },
        { id: 'C-2024-006', type: 'Civil Rights', citizen: 'David Miller', date: '2024-01-10', priority: 'Medium', status: 'Pending', aiCategory: 'Civil Rights' },
        { id: 'C-2024-007', type: 'Property Damage', citizen: 'Emma Davis', date: '2024-01-09', priority: 'Low', status: 'Closed', aiCategory: 'Property Law' },
        { id: 'C-2024-008', type: 'Consumer Protection', citizen: 'Frank Wilson', date: '2024-01-08', priority: 'High', status: 'Investigating', aiCategory: 'Consumer Protection' }
    ];
    
    // Sample officers
    appState.officers = [
        { id: 'OFF-001', name: 'Officer Smith', department: 'Civil', cases: 12, email: 'smith@legaljustice.gov' },
        { id: 'OFF-002', name: 'Officer Johnson', department: 'Criminal', cases: 8, email: 'johnson@legaljustice.gov' },
        { id: 'OFF-003', name: 'Officer Williams', department: 'Family', cases: 15, email: 'williams@legaljustice.gov' },
        { id: 'OFF-004', name: 'Officer Brown', department: 'Property', cases: 10, email: 'brown@legaljustice.gov' }
    ];
    
    // Load case select options
    let caseOptions = '<option value="">Select a case...</option>';
    appState.complaints.forEach(complaint => {
        caseOptions += `<option value="${complaint.id}">${complaint.id} - ${complaint.type}</option>`;
    });
    $('#caseSelect').html(caseOptions);
    
    // Load officer select options
    let officerOptions = '<option value="">Select an officer...</option>';
    appState.officers.forEach(officer => {
        officerOptions += `<option value="${officer.id}">${officer.name} (${officer.department})</option>`;
    });
    $('#officerSelect').html(officerOptions);
    
    // Case select change handler
    $('#caseSelect').change(function() {
        const caseId = $(this).val();
        if (caseId) {
            const complaint = appState.complaints.find(c => c.id === caseId);
            if (complaint) {
                $('#caseDetails').html(`
                    <div style="margin-top: 1rem;">
                        <div class="info-item">
                            <span class="info-label">Type:</span>
                            <span class="info-value">${complaint.type}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Citizen:</span>
                            <span class="info-value">${complaint.citizen}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="status-badge status-${complaint.status.toLowerCase()}">${complaint.status}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">AI Category:</span>
                            <span class="info-value">${complaint.aiCategory}</span>
                        </div>
                    </div>
                `);
            }
        } else {
            $('#caseDetails').html('');
        }
    });
    
    // Officer select change handler
    $('#officerSelect').change(function() {
        const officerId = $(this).val();
        if (officerId) {
            const officer = appState.officers.find(o => o.id === officerId);
            if (officer) {
                $('#officerDetails').html(`
                    <div style="margin-top: 1rem;">
                        <div class="info-item">
                            <span class="info-label">Name:</span>
                            <span class="info-value">${officer.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Department:</span>
                            <span class="info-value">${officer.department}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Active Cases:</span>
                            <span class="info-value">${officer.cases}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email:</span>
                            <span class="info-value">${officer.email}</span>
                        </div>
                    </div>
                `);
            }
        } else {
            $('#officerDetails').html('');
        }
    });
    
    // Load investigation timeline
    const timeline = [
        { date: '2024-01-15', event: 'Complaint Filed', details: 'Initial complaint submitted online' },
        { date: '2024-01-16', event: 'Case Assigned', details: 'Assigned to Officer Smith for investigation' },
        { date: '2024-01-18', event: 'Evidence Collected', details: 'Preliminary evidence and documents gathered' },
        { date: '2024-01-20', event: 'Witness Interview', details: 'Interviewed key witness - John Doe' },
        { date: '2024-01-22', event: 'Site Visit', details: 'Property inspection conducted' }
    ];
    
    let timelineHtml = '';
    timeline.forEach(item => {
        timelineHtml += `
            <div style="margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--card-border); 
                position: relative; padding-left: 30px;">
                <div style="position: absolute; left: 0; top: 0; width: 20px; height: 20px; 
                    background: var(--primary-color); border-radius: 50%;"></div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong style="color: var(--text-primary);">${item.event}</strong>
                    <span style="color: var(--primary-color); font-size: 0.9rem;">${item.date}</span>
                </div>
                <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">${item.details}</p>
            </div>
        `;
    });
    $('#investigationTimeline').html(timelineHtml);
    
    // Load resolution stats
    const statsHtml = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; font-weight: bold; color: var(--primary-color); margin-bottom: 0.5rem;">89%</div>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Resolution Rate</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                <div style="background: rgba(255, 152, 0, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255, 152, 0, 0.2);">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">156</div>
                    <small style="color: var(--text-secondary);">Total Cases</small>
                </div>
                <div style="background: rgba(76, 175, 80, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(76, 175, 80, 0.2);">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--success-color);">139</div>
                    <small style="color: var(--text-secondary);">Resolved</small>
                </div>
                <div style="background: rgba(33, 150, 243, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(33, 150, 243, 0.2);">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #2196f3;">12</div>
                    <small style="color: var(--text-secondary);">In Progress</small>
                </div>
                <div style="background: rgba(158, 158, 158, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(158, 158, 158, 0.2);">
                    <div style="font-size: 1.5rem; font-weight: bold; color: #9e9e9e;">5</div>
                    <small style="color: var(--text-secondary);">Closed</small>
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--card-border);">
                <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Resolution Time</h4>
                <div style="font-size: 1.8rem; font-weight: bold; color: var(--primary-color);">14 days</div>
                <small style="color: var(--text-secondary);">Average resolution time</small>
            </div>
        </div>
    `;
    $('#resolutionStats').html(statsHtml);
}

// Modal Functions
function openModal(modalId) {
    $(`#${modalId}`).addClass('active');
}

function closeModal(modalId) {
    $(`#${modalId}`).removeClass('active');
}

function openCaseDetails(caseId) {
    const complaint = appState.complaints.find(c => c.id === caseId) || 
                     { id: caseId, type: 'Unknown', citizen: 'Unknown', date: 'Unknown', priority: 'Medium', status: 'Pending', aiCategory: 'Unknown' };
    
    const caseDetails = `
        <div class="case-details-modal">
            <div class="info-item">
                <span class="info-label">Case ID:</span>
                <span class="info-value">${complaint.id}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Complaint Type:</span>
                <span class="info-value">${complaint.type}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Citizen:</span>
                <span class="info-value">${complaint.citizen}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Filed Date:</span>
                <span class="info-value">${complaint.date}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Priority:</span>
                <span class="info-value"><span class="priority-${complaint.priority.toLowerCase()}">${complaint.priority}</span></span>
            </div>
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span class="info-value"><span class="status-badge status-${complaint.status.toLowerCase()}">${complaint.status}</span></span>
            </div>
            <div class="info-item">
                <span class="info-label">AI Category:</span>
                <span class="info-value">${complaint.aiCategory}</span>
            </div>
            
            <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--card-border);">
                <h4 style="color: var(--text-primary); margin-bottom: 1rem;">Case Description</h4>
                <p style="color: var(--text-secondary); line-height: 1.6;">
                    This is a detailed description of the case. In a real application, this would contain 
                    the full complaint details, evidence summary, and investigation notes.
                </p>
            </div>
            
            <div style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="assignCaseToSelf('${caseId}')">
                    <i class="fas fa-user-check"></i> Assign to Me
                </button>
                <button class="btn btn-secondary" onclick="updateCaseStatus('${caseId}')">
                    <i class="fas fa-edit"></i> Update Status
                </button>
                <button class="btn btn-outline" onclick="closeModal('caseDetailsModal')">
                    <i class="fas fa-times"></i> Close
                </button>
            </div>
        </div>
    `;
    
    $('#caseDetailsContent').html(caseDetails);
    openModal('caseDetailsModal');
}

function assignCaseToSelf(caseId) {
    showLoading();
    setTimeout(() => {
        hideLoading();
        showNotification(`Case ${caseId} assigned to you`, 'success');
        closeModal('caseDetailsModal');
        addActivity(`Assigned case ${caseId} to myself`);
    }, 1500);
}

function updateCaseStatus(caseId) {
    closeModal('caseDetailsModal');
    $('.nav-link[data-section="case-status"]').click();
    showNotification(`Now updating status for ${caseId}`, 'info');
}

function openAssignCaseModal(caseId) {
    if (caseId) {
        $('#caseSelect').val(caseId).trigger('change');
        $('.nav-link[data-section="assign-officer"]').click();
    } else {
        openModal('assignOfficerModal');
    }
}

// Utility Functions
function showLoading() {
    $('#loadingOverlay').addClass('active');
}

function hideLoading() {
    $('#loadingOverlay').removeClass('active');
}

function showNotification(message, type = 'info') {
    const iconMap = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    
    const toast = $(`
        <div class="toast ${type}">
            <i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `);
    
    $('#toastContainer').append(toast);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.addClass('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending Review',
        'investigating': 'Under Investigation',
        'hearing': 'Court Hearing Scheduled',
        'resolved': 'Resolved',
        'closed': 'Closed'
    };
    return statusMap[status] || status;
}

function addActivity(text) {
    console.log(`Activity: ${text}`);
    // In a real app, this would update the activity log
}

// Add CSS for btn-outline
const style = document.createElement('style');
style.textContent = `
    .btn-outline {
        background: transparent;
        border: 1px solid var(--card-border);
        color: var(--text-primary);
    }
    
    .btn-outline:hover {
        background: rgba(255, 152, 0, 0.1);
        border-color: var(--primary-color);
    }
    
    .case-details-modal {
        padding: 20px;
    }
    
    @media (max-width: 768px) {
        .main-content {
            padding: 1rem;
        }
        
        .section-header h2 {
            font-size: 1.5rem;
        }
        
        .stats-grid {
            gap: 1rem;
        }
        
        .stat-card {
            padding: 1rem;
        }
        
        .stat-content h3 {
            font-size: 1.5rem;
        }
    }
`;
document.head.appendChild(style);
