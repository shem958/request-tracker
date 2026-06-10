// PhotoMed Request Tracker - Core Application Logic

// Mock Seed Data (loaded when LocalStorage is empty to showcase dashboard features)
const MOCK_REQUESTS = [
  {
    id: "req-1",
    name: "Jane Miller",
    email: "jane.miller@hospital.com",
    product: "PhotoMed Diagnostics",
    type: "Bug",
    priority: "High",
    message: "The DICOM viewer crashes when trying to load images larger than 50MB. This is blocking diagnostic workflows in our oncology department.",
    status: "New",
    createdAt: "2026-06-09T08:34:00.000Z",
    notes: "Assigned to the core viewer team for immediate triage. We need to optimize canvas rendering buffers."
  },
  {
    id: "req-2",
    name: "Dr. David Chen",
    email: "d.chen@cardio-med.com",
    product: "PhotoMed Portal",
    type: "Feature Request",
    priority: "Medium",
    message: "It would be extremely helpful to have an automated SMS alert system that notifies patients when their imaging reports are ready for download.",
    status: "In Review",
    createdAt: "2026-06-08T14:15:00.000Z",
    notes: "Requires coordination with our SMS gateway provider (Twilio). Standard compliance check is ongoing."
  },
  {
    id: "req-3",
    name: "Sarah Jenkins",
    email: "sjenkins@careclinic.org",
    product: "PhotoMed Patient App",
    type: "General Feedback",
    priority: "Low",
    message: "We recently updated to the latest mobile version, and the new login screen looks fantastic! The face unlock feature is very convenient.",
    status: "Resolved",
    createdAt: "2026-06-07T10:05:00.000Z",
    notes: "Feedback shared with the UI/UX design team. Closing ticket."
  },
  {
    id: "req-4",
    name: "Marcus Vance",
    email: "mvance@innovativehealth.io",
    product: "PhotoMed Billing & Claims",
    type: "Partnership",
    priority: "Medium",
    message: "We would like to discuss integrating our automated insurance claim processing API with your billing system.",
    status: "New",
    createdAt: "2026-06-06T16:45:00.000Z",
    notes: ""
  },
  {
    id: "req-5",
    name: "Rachel Adams",
    email: "r.adams@imagingcenter.net",
    product: "PhotoMed Diagnostics",
    type: "Bug",
    priority: "High",
    message: "The PACS server sync is throwing timeout errors (error code 504) since this morning's patch update.",
    status: "Rejected",
    createdAt: "2026-06-05T09:20:00.000Z",
    notes: "This was investigated and found to be a local firewall routing issue on the client's end. Advised their local IT."
  },
  {
    id: "req-6",
    name: "Liam Gallagher",
    email: "liam.g@oasis-health.com",
    product: "PhotoMed Lab System",
    type: "Other",
    priority: "Low",
    message: "Is there an archive of user manuals or training videos available for the Lab Services portal? We have a couple of new staff members who need onboarding.",
    status: "Resolved",
    createdAt: "2026-06-04T11:10:00.000Z",
    notes: "Sent links to the onboarding wiki page and video documentation directory."
  }
];

// App State
let appState = {
  requests: [],
  filters: {
    search: "",
    product: "all",
    type: "all",
    priority: "all",
    status: "all"
  },
  sortBy: "newest",
  selectedRequestId: null
};

// DOM Elements
const requestForm = document.getElementById("requestForm");
const requestsGrid = document.getElementById("requestsGrid");
const resultsCount = document.getElementById("resultsCount");
const toastContainer = document.getElementById("toastContainer");

// Stats Elements
const statsTotal = document.getElementById("statsTotal");
const statsNew = document.getElementById("statsNew");
const statsReview = document.getElementById("statsReview");
const statsResolved = document.getElementById("statsResolved");
const statsRejected = document.getElementById("statsRejected");

// Filter Elements
const searchQuery = document.getElementById("searchQuery");
const sortBy = document.getElementById("sortBy");
const filterProduct = document.getElementById("filterProduct");
const filterType = document.getElementById("filterType");
const filterPriority = document.getElementById("filterPriority");
const filterStatus = document.getElementById("filterStatus");

// Modal Elements
const detailsModal = document.getElementById("detailsModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalSaveBtn = document.getElementById("modalSaveBtn");
const modalBody = document.getElementById("modalBody");

// Form Fields
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const productCompany = document.getElementById("productCompany");
const requestType = document.getElementById("requestType");
const requestMessage = document.getElementById("requestMessage");

// Core Logic & Initialization
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setupEventListeners();
});

function initApp() {
  // Load data from LocalStorage or initialize with Mock Data
  const savedRequests = localStorage.getItem("photomed_requests");
  if (savedRequests) {
    try {
      appState.requests = JSON.parse(savedRequests);
    } catch (e) {
      console.error("Failed to parse local storage data, resetting with mock data", e);
      appState.requests = [...MOCK_REQUESTS];
      saveToStorage();
    }
  } else {
    appState.requests = [...MOCK_REQUESTS];
    saveToStorage();
  }

  // Initial render
  renderApp();
}

function saveToStorage() {
  localStorage.setItem("photomed_requests", JSON.stringify(appState.requests));
}

function renderApp() {
  renderStats();
  renderRequests();
}

// Stats Calculation
function renderStats() {
  const reqs = appState.requests;
  const total = reqs.length;
  const countNew = reqs.filter(r => r.status === "New").length;
  const countReview = reqs.filter(r => r.status === "In Review").length;
  const countResolved = reqs.filter(r => r.status === "Resolved").length;
  const countRejected = reqs.filter(r => r.status === "Rejected").length;

  statsTotal.textContent = total;
  statsNew.textContent = countNew;
  statsReview.textContent = countReview;
  statsResolved.textContent = countResolved;
  statsRejected.textContent = countRejected;
}

// Request Rendering & Filters
function renderRequests() {
  let filtered = [...appState.requests];

  // 1. Search Query Filter (name, email, message keyword)
  const searchVal = appState.filters.search.toLowerCase().trim();
  if (searchVal) {
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(searchVal) ||
      r.email.toLowerCase().includes(searchVal) ||
      r.message.toLowerCase().includes(searchVal)
    );
  }

  // 2. Product Area Filter
  if (appState.filters.product !== "all") {
    filtered = filtered.filter(r => r.product === appState.filters.product);
  }

  // 3. Request Type Filter
  if (appState.filters.type !== "all") {
    filtered = filtered.filter(r => r.type === appState.filters.type);
  }

  // 4. Priority Filter
  if (appState.filters.priority !== "all") {
    filtered = filtered.filter(r => r.priority === appState.filters.priority);
  }

  // 5. Status Filter
  if (appState.filters.status !== "all") {
    filtered = filtered.filter(r => r.status === appState.filters.status);
  }

  // 6. Sorting Logic
  filtered.sort((a, b) => {
    if (appState.sortBy === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (appState.sortBy === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    
    // Priority weights for sorting
    const prioWeight = { "High": 3, "Medium": 2, "Low": 1 };
    
    if (appState.sortBy === "priority-desc") {
      return prioWeight[b.priority] - prioWeight[a.priority];
    }
    if (appState.sortBy === "priority-asc") {
      return prioWeight[a.priority] - prioWeight[b.priority];
    }
    return 0;
  });

  // Render count
  resultsCount.querySelector("span").textContent = filtered.length;

  // Clear Grid
  requestsGrid.innerHTML = "";

  if (filtered.length === 0) {
    renderEmptyState();
    return;
  }

  filtered.forEach(request => {
    const card = document.createElement("div");
    card.className = `request-card prio-${request.priority.toLowerCase()}`;
    
    // Format creation date
    const dateFormatted = new Date(request.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

    // Determine type icon
    let typeIcon = "fa-circle-question";
    if (request.type === "Bug") typeIcon = "fa-bug";
    else if (request.type === "Feature Request") typeIcon = "fa-lightbulb";
    else if (request.type === "General Feedback") typeIcon = "fa-comment-dots";
    else if (request.type === "Partnership") typeIcon = "fa-handshake";

    card.innerHTML = `
      <div class="card-header">
        <div class="card-title-group">
          <div class="card-title">
            <span>${escapeHTML(request.name)}</span>
          </div>
          <div class="card-meta">
            <span class="badge badge-type badge-type-${request.type.toLowerCase().replace(" ", "-")}">
              <i class="fa-solid ${typeIcon}"></i> ${request.type}
            </span>
            <span class="badge badge-priority badge-prio-${request.priority.toLowerCase()}">
              ${request.priority}
            </span>
            <span class="badge badge-product">
              <i class="fa-solid fa-briefcase"></i> ${request.product}
            </span>
          </div>
        </div>
        <span class="card-date">${dateFormatted}</span>
      </div>
      
      <div class="card-body">${escapeHTML(request.message)}</div>
      
      <div class="card-footer">
        <div class="user-info">
          <div class="user-avatar">${request.name.charAt(0)}</div>
          <div class="user-email">${escapeHTML(request.email)}</div>
        </div>
        
        <div class="card-actions">
          <select class="status-pill-select status-${request.status.toLowerCase().replace(" ", "-")}" 
                  data-id="${request.id}" 
                  aria-label="Change Request Status">
            <option value="New" ${request.status === "New" ? "selected" : ""}>New</option>
            <option value="In Review" ${request.status === "In Review" ? "selected" : ""}>In Review</option>
            <option value="Resolved" ${request.status === "Resolved" ? "selected" : ""}>Resolved</option>
            <option value="Rejected" ${request.status === "Rejected" ? "selected" : ""}>Rejected</option>
          </select>
          
          <button class="btn-icon btn-view-details" data-id="${request.id}" title="View Details & Add Notes">
            <i class="fa-solid fa-expand"></i>
          </button>
          
          <button class="btn-icon btn-danger-icon btn-delete" data-id="${request.id}" title="Delete Request">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    requestsGrid.appendChild(card);
  });

  // Bind events to dynamic cards
  bindCardEvents();
}

function renderEmptyState() {
  requestsGrid.innerHTML = `
    <div class="empty-state">
      <i class="fa-solid fa-folder-open"></i>
      <h3>No Requests Found</h3>
      <p>No submissions match your current search queries or filter selections. Try clearing your filters.</p>
      <button class="btn btn-secondary btn-sm" id="clearFiltersBtn">Reset Filters</button>
    </div>
  `;

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    resetFilters();
  });
}

function resetFilters() {
  appState.filters = {
    search: "",
    product: "all",
    type: "all",
    priority: "all",
    status: "all"
  };
  appState.sortBy = "newest";

  searchQuery.value = "";
  sortBy.value = "newest";
  filterProduct.value = "all";
  filterType.value = "all";
  filterPriority.value = "all";
  filterStatus.value = "all";

  renderApp();
  showToast("Filters Cleared", "Dashboard displays all entries.", "info");
}

// Dynamic Action Event Bindings
function bindCardEvents() {
  // Status Pill Changes
  requestsGrid.querySelectorAll(".status-pill-select").forEach(select => {
    select.addEventListener("change", (e) => {
      const id = e.target.dataset.id;
      const newStatus = e.target.value;
      updateRequestStatus(id, newStatus);
    });
  });

  // View Details Modal Trigger
  requestsGrid.querySelectorAll(".btn-view-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const btnTarget = e.target.closest(".btn-view-details");
      const id = btnTarget.dataset.id;
      openDetailsModal(id);
    });
  });

  // Delete Trigger
  requestsGrid.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const btnTarget = e.target.closest(".btn-delete");
      const id = btnTarget.dataset.id;
      deleteRequest(id);
    });
  });
}

// Action Handlers
function updateRequestStatus(id, status) {
  const index = appState.requests.findIndex(r => r.id === id);
  if (index !== -1) {
    const oldStatus = appState.requests[index].status;
    appState.requests[index].status = status;
    saveToStorage();
    renderApp();
    showToast(
      "Status Updated", 
      `Changed status from "${oldStatus}" to "${status}".`, 
      "success"
    );
  }
}

function deleteRequest(id) {
  const request = appState.requests.find(r => r.id === id);
  if (!request) return;

  if (confirm(`Are you sure you want to delete the request from "${request.name}"?`)) {
    appState.requests = appState.requests.filter(r => r.id !== id);
    saveToStorage();
    renderApp();
    showToast("Request Deleted", "The record has been permanently removed.", "warning");
  }
}

// Form Validation & Submission
requestForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  if (validateForm()) {
    // Get Selected Priority
    const priorityChecked = document.querySelector('input[name="requestPriority"]:checked');
    const priorityValue = priorityChecked ? priorityChecked.value : "Low";

    const newRequest = {
      id: "req-" + Date.now() + Math.random().toString(36).substr(2, 4),
      name: userName.value.trim(),
      email: userEmail.value.trim(),
      product: productCompany.value,
      type: requestType.value,
      priority: priorityValue,
      message: requestMessage.value.trim(),
      status: "New",
      createdAt: new Date().toISOString(),
      notes: ""
    };

    appState.requests.unshift(newRequest);
    saveToStorage();
    
    // Clear form
    requestForm.reset();
    resetErrors();
    
    // Reset filters to show the newly submitted item at top
    resetFilters();
    
    showToast(
      "Submission Successful", 
      "Your request has been filed and added to the tracking system.", 
      "success"
    );
  } else {
    showToast("Form Invalid", "Please check and correct the highlighted fields.", "error");
  }
});

function validateForm() {
  let isValid = true;
  resetErrors();

  // Full Name Validate
  if (!userName.value.trim()) {
    showError("userName", "Full Name is required.");
    isValid = false;
  } else if (userName.value.trim().length < 3) {
    showError("userName", "Name must be at least 3 characters.");
    isValid = false;
  }

  // Email Validate
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!userEmail.value.trim()) {
    showError("userEmail", "Email address is required.");
    isValid = false;
  } else if (!emailPattern.test(userEmail.value.trim())) {
    showError("userEmail", "Please enter a valid email address.");
    isValid = false;
  }

  // Product Selection Validate
  if (!productCompany.value) {
    showError("productCompany", "Please select a product area.");
    isValid = false;
  }

  // Request Type Validate
  if (!requestType.value) {
    showError("requestType", "Please select a request type.");
    isValid = false;
  }

  // Message Validate
  if (!requestMessage.value.trim()) {
    showError("requestMessage", "Detailed message is required.");
    isValid = false;
  } else if (requestMessage.value.trim().length < 10) {
    showError("requestMessage", "Message description should be at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

function showError(fieldId, message) {
  const inputEl = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}Error`);
  
  if (inputEl) {
    inputEl.style.borderColor = "var(--status-rejected)";
  }
  if (errorEl) {
    errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
  }
}

function resetErrors() {
  const fields = ["userName", "userEmail", "productCompany", "requestType", "requestMessage"];
  fields.forEach(id => {
    const inputEl = document.getElementById(id);
    const errorEl = document.getElementById(`${id}Error`);
    if (inputEl) {
      inputEl.style.borderColor = "";
    }
    if (errorEl) {
      errorEl.textContent = "";
    }
  });
}

// Clear errors dynamically on input
[userName, userEmail, productCompany, requestType, requestMessage].forEach(field => {
  field.addEventListener("input", () => {
    const errorEl = document.getElementById(`${field.id}Error`);
    if (errorEl && errorEl.textContent) {
      field.style.borderColor = "";
      errorEl.textContent = "";
    }
  });
});

// Toast System
function showToast(title, message, type = "success") {
  const id = "toast-" + Date.now();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.id = id;

  let icon = "fa-circle-check";
  if (type === "error") icon = "fa-circle-exclamation";
  else if (type === "warning") icon = "fa-triangle-exclamation";
  else if (type === "info") icon = "fa-circle-info";

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close Notification"><i class="fa-solid fa-xmark"></i></button>
  `;

  toastContainer.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => toast.classList.add("show"), 10);

  // Close binder
  toast.querySelector(".toast-close").addEventListener("click", () => {
    removeToast(toast);
  });

  // Auto remove
  setTimeout(() => {
    removeToast(toast);
  }, 4000);
}

function removeToast(toast) {
  toast.classList.remove("show");
  // Wait for transition before removing DOM node
  toast.addEventListener("transitionend", () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });
}

// Modal Handlers
function openDetailsModal(id) {
  const request = appState.requests.find(r => r.id === id);
  if (!request) return;

  appState.selectedRequestId = id;

  const dateFormatted = new Date(request.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  modalBody.innerHTML = `
    <div class="modal-info-row">
      <div class="info-item">
        <span class="info-item-label">Submitted By</span>
        <span class="info-item-value">${escapeHTML(request.name)}</span>
      </div>
      <div class="info-item">
        <span class="info-item-label">Email Address</span>
        <span class="info-item-value">${escapeHTML(request.email)}</span>
      </div>
    </div>
    
    <div class="modal-info-row">
      <div class="info-item">
        <span class="info-item-label">Product Area</span>
        <span class="info-item-value">${request.product}</span>
      </div>
      <div class="info-item">
        <span class="info-item-label">Submission Date</span>
        <span class="info-item-value">${dateFormatted}</span>
      </div>
    </div>

    <div class="modal-info-row">
      <div class="info-item">
        <span class="info-item-label">Request Type</span>
        <span class="info-item-value">
          <span class="badge badge-type badge-type-${request.type.toLowerCase().replace(" ", "-")}">${request.type}</span>
        </span>
      </div>
      <div class="info-item">
        <span class="info-item-label">Priority Level</span>
        <span class="info-item-value">
          <span class="badge badge-priority badge-prio-${request.priority.toLowerCase()}">${request.priority}</span>
        </span>
      </div>
    </div>

    <div class="info-item-block">
      <span class="info-item-label">Message Details</span>
      <div class="info-item-value">${escapeHTML(request.message)}</div>
    </div>

    <div class="admin-notes-section">
      <label class="info-item-label" for="modalAdminNotes">Engineering/Admin Notes</label>
      <textarea id="modalAdminNotes" class="form-textarea" placeholder="Add status notes, resolution steps, or tracking logs...">${escapeHTML(request.notes || "")}</textarea>
    </div>

    <div class="form-group" style="margin-bottom: 0;">
      <label class="info-item-label" for="modalStatusSelect">Update Status</label>
      <select id="modalStatusSelect" class="form-select">
        <option value="New" ${request.status === "New" ? "selected" : ""}>New</option>
        <option value="In Review" ${request.status === "In Review" ? "selected" : ""}>In Review</option>
        <option value="Resolved" ${request.status === "Resolved" ? "selected" : ""}>Resolved</option>
        <option value="Rejected" ${request.status === "Rejected" ? "selected" : ""}>Rejected</option>
      </select>
    </div>
  `;

  detailsModal.classList.add("active");
}

function closeDetailsModal() {
  detailsModal.classList.remove("active");
  appState.selectedRequestId = null;
}

function saveModalChanges() {
  if (!appState.selectedRequestId) return;
  
  const id = appState.selectedRequestId;
  const index = appState.requests.findIndex(r => r.id === id);
  
  if (index !== -1) {
    const adminNotes = document.getElementById("modalAdminNotes").value.trim();
    const newStatus = document.getElementById("modalStatusSelect").value;
    
    appState.requests[index].notes = adminNotes;
    appState.requests[index].status = newStatus;
    
    saveToStorage();
    renderApp();
    closeDetailsModal();
    showToast("Changes Saved", "Request status and admin notes have been updated.", "success");
  }
}

// Filter Event Listeners Setup
function setupEventListeners() {
  // Search
  searchQuery.addEventListener("input", (e) => {
    appState.filters.search = e.target.value;
    renderRequests();
  });

  // Sort
  sortBy.addEventListener("change", (e) => {
    appState.sortBy = e.target.value;
    renderRequests();
  });

  // Product Filter
  filterProduct.addEventListener("change", (e) => {
    appState.filters.product = e.target.value;
    renderRequests();
  });

  // Type Filter
  filterType.addEventListener("change", (e) => {
    appState.filters.type = e.target.value;
    renderRequests();
  });

  // Priority Filter
  filterPriority.addEventListener("change", (e) => {
    appState.filters.priority = e.target.value;
    renderRequests();
  });

  // Status Filter
  filterStatus.addEventListener("change", (e) => {
    appState.filters.status = e.target.value;
    renderRequests();
  });

  // Modal Closers
  closeModalBtn.addEventListener("click", closeDetailsModal);
  modalCloseBtn.addEventListener("click", closeDetailsModal);
  modalSaveBtn.addEventListener("click", saveModalChanges);
  
  // Click overlay to close
  detailsModal.addEventListener("click", (e) => {
    if (e.target === detailsModal) {
      closeDetailsModal();
    }
  });

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && detailsModal.classList.contains("active")) {
      closeDetailsModal();
    }
  });
}

// Utility function to escape HTML string
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
