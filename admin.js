document.addEventListener("DOMContentLoaded", () => {
    // Sections
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const step1Selection = document.getElementById('step-1-selection');
    const step2Form = document.getElementById('step-2-form');
    
    // Forms & Inputs
    const loginForm = document.getElementById('login-form');
    const uploadForm = document.getElementById('upload-form');
    const loginError = document.getElementById('login-error');
    const statusMessage = document.getElementById('status-message');
    const formHeader = document.getElementById('form-header');
    const hiddenTypeInput = document.getElementById('asset-type-hidden');
    const fileInput = document.getElementById('asset-file');
    const movieExtras = document.getElementById('movie-extras');
    const movieDirectorInput = document.getElementById('movie-director');
    
    // Buttons
    const logoutBtn = document.getElementById('logout-btn');
    const assetBtns = document.querySelectorAll('.asset-btn');
    const backBtn = document.getElementById('back-to-selection');

    // --- SIMULATED LOGIN ---
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const user = document.getElementById('admin-user').value;
            const pass = document.getElementById('admin-pass').value;

            if (user === 'admin' && pass === 'cinema2026') {
                loginSection.style.display = 'none';
                dashboardSection.style.display = 'block';
                loginError.style.display = 'none';
            } else {
                loginError.style.display = 'block';
            }
        });
    }

    // --- LOGOUT ---
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            dashboardSection.style.display = 'none';
            loginSection.style.display = 'block';
            step2Form.style.display = 'none';
            step1Selection.style.display = 'block';
            document.getElementById('admin-user').value = '';
            document.getElementById('admin-pass').value = '';
        });
    }

    // --- ASSET SELECTION LOGIC ---
    assetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            
            // Update the form to match the selection
            formHeader.innerText = `Upload New ${type}`;
            hiddenTypeInput.value = type;
            
            // Adjust accepted file types
            if (type === 'Music Recording') {
                fileInput.setAttribute('accept', 'audio/*');
            } else {
                fileInput.setAttribute('accept', 'video/mp4,video/x-m4v,video/*');
            }

            // If it's a Movie, require the extra Director field
            if (type === 'Entire Movie') {
                movieExtras.style.display = 'block';
                movieDirectorInput.setAttribute('required', 'true');
            } else {
                movieExtras.style.display = 'none';
                movieDirectorInput.removeAttribute('required');
            }

            // Transition UI
            step1Selection.style.display = 'none';
            step2Form.style.display = 'block';
        });
    });

    // --- BACK BUTTON LOGIC ---
    if(backBtn) {
        backBtn.addEventListener('click', () => {
            step2Form.style.display = 'none';
            step1Selection.style.display = 'block';
            uploadForm.reset();
            statusMessage.style.display = 'none';
        });
    }

    // --- SIMULATED UPLOAD ---
    if(uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const btn = uploadForm.querySelector('.submit-btn');
            const originalText = btn.innerText;

            // Change button to show loading state
            btn.innerText = "UPLOADING...";
            btn.style.backgroundColor = "transparent";
            btn.style.color = "var(--primary-green)";
            btn.style.border = "2px solid var(--primary-green)";

            // Simulate server delay
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = "var(--primary-green)";
                btn.style.color = "#000";
                btn.style.border = "none";
                
                statusMessage.style.display = 'block';
                uploadForm.reset(); 

                // Send them back to the selection screen after success
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                    step2Form.style.display = 'none';
                    step1Selection.style.display = 'block';
                }, 3000); 
            }, 2500); 
        });
    }
});
