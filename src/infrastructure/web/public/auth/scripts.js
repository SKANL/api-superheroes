import authService from '../shared/auth.service.js';
// ...existing code...
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');
    const alertElement = document.getElementById('message-alert');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            tab.classList.add('active');
            const targetForm = document.getElementById(`${tab.dataset.target}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
            alertElement.style.display = 'none';
        });
    });

    function showAlert(message, type) {
        alertElement.textContent = message;
        alertElement.className = `alert ${type}`;
        alertElement.style.display = 'block';
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }

    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await authService.login(email, password);
            showAlert('Inicio de sesión exitoso. Redirigiendo...', 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            showAlert(`Error: ${error.message}`, 'danger');
        }
    });

    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const role = document.getElementById('register-role').value;
        
        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden', 'danger');
            return;
        }
        
        try {
            await authService.register(username, email, password, role);
            showAlert(`Registro exitoso como ${role === 'admin' ? 'Administrador' : 'Usuario'}. Redirigiendo...`, 'success');
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (error) {
            showAlert(`Error: ${error.message}`, 'danger');
        }
    });
});
