if (document.getElementById('forgot-password')) {
    document.getElementById('forgot-password').addEventListener('click', function(e) {
        e.preventDefault(); // Previne o comportamento padrão do link
        Swal.fire({
            title: 'Esqueceu sua senha?',
            html: `
                <p>Caso tenha esquecido sua senha, você deverá entrar em contato com o suporte técnico da GigaCandanga para redefini-la. O suporte poderá orientá-lo sobre os procedimentos necessários para recuperar o acesso à sua conta.</p>
                <p>Para entrar em contato com o suporte técnico, envie um e-mail para <a href="mailto:suporte_ti@gigacandanga.net.br">suporte_ti@gigacandanga.net.br</a> ou envie um WhatsApp para <a href="https://api.whatsapp.com/send/?phone=5561999999999">+55 61 99999-9999</a> e informe sua situação.</p>
            `,
            icon: 'info',
            confirmButtonText: 'Ok'
        });
    });
}

document.getElementById('new-password').addEventListener('input', function () {
    var newPassword = this.value;
    var passwordHelpBlock = document.getElementById('passwordHelpBlock');
    if (!newPassword.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)) {
        passwordHelpBlock.style.display = 'block';
    } else {
        passwordHelpBlock.style.display = 'none';
    }
});

document.getElementById('confirm-password').addEventListener('input', function () {
    var confirmPassword = this.value;
    var newPassword = document.getElementById('new-password').value;
    var confirmHelpBlock = document.getElementById('confirmPasswordHelpBlock');
    if (newPassword !== confirmPassword) {
        confirmHelpBlock.style.display = 'block';
    } else {
        confirmHelpBlock.style.display = 'none';
    }
});

document.getElementById('changePasswordForm').addEventListener('submit', function (e) {
    var newPassword = document.getElementById('new-password').value;
    var confirmPassword = document.getElementById('confirm-password').value;
    var passwordHelpBlock = document.getElementById('passwordHelpBlock');
    var confirmHelpBlock = document.getElementById('confirmPasswordHelpBlock');

    var isValid = true;
    if (!newPassword.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}/)) {
        passwordHelpBlock.style.display = 'block';
        isValid = false;
    } else {
        passwordHelpBlock.style.display = 'none';
    }

    if (newPassword !== confirmPassword) {
        confirmHelpBlock.style.display = 'block';
        isValid = false;
    } else {
        confirmHelpBlock.style.display = 'none';
    }

    if (!isValid) {
        e.preventDefault();
    }
});

