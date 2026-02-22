/* Main JS: Eco-Future Pro Interactions */

document.addEventListener('DOMContentLoaded', () => {
    initProInteractions();
});

function initProInteractions() {
    const fileInput = document.getElementById('fileInput');
    const uploadZone = document.getElementById('uploadZone');
    const form = document.getElementById('predictForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const previewContainer = document.getElementById('previewContainer');
    const scanLine = document.querySelector('.scan-line');

    if (!fileInput) return;

    // Trigger Upload
    uploadZone.addEventListener('click', () => fileInput.click());

    // File Selected
    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                // Show Preview
                uploadZone.style.display = 'none';
                previewContainer.style.display = 'block';
                previewContainer.innerHTML = `
                    <div class="scan-line"></div>
                    <img src="${e.target.result}" style="width: 100%; display: block;">
                    <button type="button" id="resetBtn" style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border: none; color: white; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">×</button>
                `;

                // Add event listener to new reset button
                document.getElementById('resetBtn').addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    resetUpload();
                });
            };
            reader.readAsDataURL(file);
        }
    });

    function resetUpload() {
        fileInput.value = '';
        previewContainer.style.display = 'none';
        uploadZone.style.display = 'block';
    }

    // Drag & Drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = 'var(--primary)';
        uploadZone.style.background = 'var(--primary-dim)';
    });
    uploadZone.addEventListener('dragleave', (e) => {
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';
    });
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.style.borderColor = '';
        uploadZone.style.background = '';

        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });

    // Submit
    if (form) {
        form.addEventListener('submit', (e) => {
            if (!fileInput.value) {
                e.preventDefault();
                alert("Please upload a leaf image first.");
                return;
            }
            loadingOverlay.classList.add('active');
        });
    }
}
