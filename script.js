// Mock Data
const mockStudent = {
    name: 'Abdul Frempong',
    id: 'ST12345',
    email: 'frempong@gmail.com',
    cgpa: 3.68,
    credits: 16,
    academicYear: '2025/2026',
    registrationProgress: 45,
    registrationStatus: 'In Progress',
    notifications: [
        { id: 1, message: 'Course registration deadline: January 20, 2026' },
        { id: 2, message: 'New announcement from administration' }
    ],
    profile: {
        fullName: 'Abdul Frempong',
        dob: '2000-01-01',
        program: 'Computer Science',
        photo: 'images/profile.jpeg',
        contactEmail: 'frempong@gmail.com',
        emergencyName: 'Fafali Frempong' 
    },
    courses: [
        { code: 'CS101', name: 'Intro to CS', credits: 3, type: 'core', dept: 'cs' },
        { code: 'MATH101', name: 'Calculus', credits: 4, type: 'core', dept: 'math' },
        { code: 'ELECTIVE1', name: 'AI Basics', credits: 3, type: 'elective', dept: 'cs' },
        { code: 'CS120', name: 'Web Dev', credits: 3, type: 'elective', dept: 'cs' },
        { code: 'MATH103', name: 'Discrete Maths', credits: 3, type: 'core', dept: 'math' }
    ],
    results: [
        { semester: 'Fall 2025', course: 'CS101', grade: 'A', credits: 3, status: 'Pass' },
        { semester: 'Fall 2025', course: 'MATH101', grade: 'B', credits: 4, status: 'Pass' },
        { semester: 'Fall 2025', course: 'ELECTIVE1', grade: 'A', credits: 3, status: 'Pass' },
        { semester: 'Fall 2025', course: 'CS120', grade: 'A', credits: 3, status: 'Pass' },
        { semester: 'Fall 2025', course: 'MATH103', grade: 'B', credits: 3, status: 'Pass' }
    ]
};

// Utility Functions
function saveToLocal(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocal(key) {
    return JSON.parse(localStorage.getItem(key));
}

// Authentication Logic
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');
    const loading = document.getElementById('loading');
    const remember = document.getElementById('remember');

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.classList.toggle('fa-eye-slash');
    }); 

    togglePassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') togglePassword.click();
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        loading.classList.remove('hidden');
        loginError.textContent = '';

        setTimeout(() => {  // Simulate API call
            if (email === 'user' && password === '12345') {  // Mock credentials
                saveToLocal('student', mockStudent);
                if (remember.checked) {
                    saveToLocal('token', 'mock-token');  // For remember me
                }
                document.getElementById('login-page').classList.add('hidden');
                document.getElementById('main-app').classList.remove('hidden');
                loadDashboard();
            } else {
                loginError.textContent = 'Invalid credentials';
            }
            loading.classList.add('hidden');
        }, 1000);
    });
}

/// Navigation Handling
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-menu li:not(#logout)');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const quickActions = document.querySelectorAll('.quick-actions button');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            showPage(page);
            navItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            pageTitle.textContent = item.textContent.trim();
            if (window.innerWidth <= 768) sidebar.classList.remove('active');
        });
    });

    quickActions.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.action;
            showPage(page);
            navItems.forEach(li => li.classList.remove('active'));
            document.querySelector(`[data-page="${page}"]`).classList.add('active');
            pageTitle.textContent = btn.textContent;
        });
    });

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the document click from immediately closing it
        sidebar.classList.toggle('active');
    });

    hamburger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            hamburger.click();
        }
    });

    // Close sidebar when clicking outside on mobile/tablet
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !hamburger.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });

    function showPage(pageId) {
        pages.forEach(p => p.classList.add('hidden'));
        document.getElementById(pageId).classList.remove('hidden');
        if (pageId === 'dashboard') loadDashboard();
        if (pageId === 'semester-registration') loadSemesterRegistration();
        if (pageId === 'course-registration') loadCourseRegistration();
        if (pageId === 'results') loadResults();
        if (pageId === 'profile') loadProfile();
    }
}

// UI State Management
function initUI() {
    const darkToggle = document.getElementById('dark-toggle');
    const body = document.body;

    if (getFromLocal('theme') === 'dark') {
        body.classList.add('dark');
    }

    darkToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        saveToLocal('theme', theme);
    });

    darkToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') darkToggle.click();
    });

    // Logout
    const logout = document.getElementById('logout');
    const modal = document.getElementById('logout-modal');
    const confirm = document.getElementById('confirm-logout');
    const cancel = document.getElementById('cancel-logout');

    logout.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    confirm.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    });

    cancel.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
}

// Dashboard Logic
function loadDashboard() {
    const student = getFromLocal('student') || mockStudent;
    document.getElementById('welcome-message').textContent = `Welcome, ${student.name}`;
    document.getElementById('progress-fill').style.width = `${student.registrationProgress}%`;
    document.getElementById('progress-percent').textContent = `${student.registrationProgress}%`;
    document.getElementById('reg-status').textContent = student.registrationStatus;
    document.getElementById('cgpa').textContent = student.cgpa.toFixed(2);
    document.getElementById('credits').textContent = student.credits;
    document.getElementById('academic-year').textContent = student.academicYear;

    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';
    student.notifications.forEach(notif => {
        const li = document.createElement('li');
        li.textContent = notif.message;
        notificationsList.appendChild(li);
    });

    const noNotif = document.getElementById('no-notifications');
    if (student.notifications.length === 0) {
        noNotif.classList.remove('hidden');
    } else {
        noNotif.classList.add('hidden');
    }
}

// Semester Registration Logic
function loadSemesterRegistration() {
    const steps = document.querySelectorAll('.step');
    const stepperItems = document.querySelectorAll('.stepper li');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    const saveDraft = document.getElementById('save-draft');
    const submitBtn = document.getElementById('submit-reg');
    const form = document.getElementById('semester-form');
    const error = document.getElementById('semester-error');
    let currentStep = 1;

    const savedData = getFromLocal('semesterData') || {};

    // Populate fields from saved data
    Object.keys(savedData).forEach(key => {
        const input = document.getElementById(key);
        if (input) input.value = savedData[key];
    });

    function updateStep() {
        steps.forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${currentStep}`).classList.remove('hidden');
        stepperItems.forEach(item => item.classList.remove('active'));
        document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
        prevBtn.disabled = currentStep === 1;
        nextBtn.classList.toggle('hidden', currentStep === 4);
        submitBtn.classList.toggle('hidden', currentStep !== 4);

        if (currentStep === 4) {
            const review = document.getElementById('review-content');
            review.innerHTML = '';
            // Collect data and display
            const formData = new FormData(form);
            for (let [key, value] of formData.entries()) {
                const p = document.createElement('p');
                p.textContent = `${key}: ${value}`;
                review.appendChild(p);
            }
        }
    }

    prevBtn.addEventListener('click', () => {
        currentStep--;
        updateStep();
    });

    nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
            currentStep++;
            updateStep();
        } else {
            error.textContent = 'Please fill all required fields.';
        }
    });

    saveDraft.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        saveToLocal('semesterData', data);
        alert('Draft saved!');
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(4)) {
            // Submit logic
            alert('Registration submitted!');
            localStorage.removeItem('semesterData');
            // Update progress etc.
            const student = getFromLocal('student');
            student.registrationProgress = 100;
            student.registrationStatus = 'Complete';
            saveToLocal('student', student);
        }
    });

    stepperItems.forEach(item => {
        item.addEventListener('click', () => {
            const step = parseInt(item.dataset.step);
            if (step < currentStep || validateStep(currentStep)) {
                currentStep = step;
                updateStep();
            }
        });
    });

    function validateStep(step) {
        const current = document.getElementById(`step-${step}`);
        const inputs = current.querySelectorAll('input[required], select[required]');
        return Array.from(inputs).every(input => input.value.trim() !== '');
    }

    updateStep();
}

// Course Registration Logic
function loadCourseRegistration() {
    const student = getFromLocal('student') || mockStudent;
    const tableBody = document.getElementById('course-body');
    const search = document.getElementById('course-search');
    const typeFilter = document.getElementById('course-type');
    const deptFilter = document.getElementById('course-dept');
    const selectedCredits = document.getElementById('selected-credits');
    const submitBtn = document.getElementById('submit-courses');
    const error = document.getElementById('course-error');
    const maxCredits = 18;
    let currentCredits = 0;

    function renderCourses(courses) {
        tableBody.innerHTML = '';
        courses.forEach(course => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" data-credits="${course.credits}"></td>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.credits}</td>
                <td>${course.type}</td>
                <td>${course.dept}</td>
            `;
            tableBody.appendChild(tr);
        });

        const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(box => {
            box.addEventListener('change', () => {
                const credits = parseInt(box.dataset.credits);
                if (box.checked) {
                    if (currentCredits + credits > maxCredits) {
                        box.checked = false;
                        error.textContent = 'Max credits exceeded';
                        return;
                    }
                    currentCredits += credits;
                } else {
                    currentCredits -= credits;
                }
                selectedCredits.textContent = currentCredits;
                error.textContent = '';
            });
        });
    }

    renderCourses(student.courses);

    search.addEventListener('input', filterCourses);
    typeFilter.addEventListener('change', filterCourses);
    deptFilter.addEventListener('change', filterCourses);

    function filterCourses() {
        const query = search.value.toLowerCase();
        const type = typeFilter.value;
        const dept = deptFilter.value;
        const filtered = student.courses.filter(course => {
            return (
                (course.code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query)) &&
                (!type || course.type === type) &&
                (!dept || course.dept === dept)
            );
        });
        renderCourses(filtered);
    }

    submitBtn.addEventListener('click', () => {
        if (currentCredits === 0) {
            error.textContent = 'Select at least one course';
            return;
        }
        alert('Courses registered!');
        // Update student credits
        const updatedStudent = getFromLocal('student');
        updatedStudent.credits = currentCredits;
        saveToLocal('student', updatedStudent);
    });
}

// Results Logic
function loadResults() {
    const student = getFromLocal('student') || mockStudent;
    const tableBody = document.getElementById('results-body');
    const gpaSpan = document.getElementById('gpa');
    const cgpaSpan = document.getElementById('cgpa-results');
    const downloadBtn = document.getElementById('download-transcript');

    tableBody.innerHTML = '';
    student.results.forEach(result => {
        const tr = document.createElement('tr');
        const statusClass = result.status.toLowerCase();
        tr.innerHTML = `
            <td>${result.semester}</td>
            <td>${result.course}</td>
            <td>${result.grade}</td>
            <td>${result.credits}</td>
            <td><span class="badge ${statusClass}">${result.status}</span></td>
        `;
        tableBody.appendChild(tr);
    });

    // Mock GPA calculation
    const gpa = 3.69;  // Calculate properly if needed
    gpaSpan.textContent = gpa.toFixed(2);
    cgpaSpan.textContent = student.cgpa.toFixed(2);

    downloadBtn.addEventListener('click', () => {
        alert('Downloading transcript...');
        // Actual download logic can be added
    });
}

// Profile Logic
function loadProfile() {
    const student = getFromLocal('student') || mockStudent;
    const photo = document.getElementById('profile-photo');
    const uploadBtn = document.getElementById('upload-photo');
    const photoInput = document.getElementById('photo-input');
    const profileName = document.getElementById('profile-name');
    const form = document.getElementById('profile-form');
    const changePassBtn = document.getElementById('change-password');
    const logoutSessions = document.getElementById('logout-sessions');

    photo.src = student.profile.photo;
    profileName.textContent = student.profile.fullName;

    // Populate fields
    document.getElementById('profile-full-name').value = student.profile.fullName;
    document.getElementById('profile-email').value = student.profile.contactEmail;
    document.getElementById('emergency-name').value = student.profile.emergencyName;
    // Add more fields

    uploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photo.src = e.target.result;
                student.profile.photo = e.target.result;
                saveToLocal('student', student);
            };
            reader.readAsDataURL(file);
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        // Update student profile
        Object.assign(student.profile, data);
        saveToLocal('student', student);
        alert('Profile updated!');
    });

    changePassBtn.addEventListener('click', () => {
        const newPass = document.getElementById('new-password').value;
        if (newPass) {
            alert('Password changed!');
            // Actual logic
        }
    });

    logoutSessions.addEventListener('click', () => {
        alert('All sessions logged out!');
        // Logic
    });
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    if (getFromLocal('token')) {
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        loadDashboard();
    } else {
        initLogin();
    }
    initNavigation();
    initUI();
});
initNavigation