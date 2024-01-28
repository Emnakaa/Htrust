function handleSubmit(event) {
    event.preventDefault();
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        alert('Compte Hedera créé avec succès! Votre ID de compte Hedera est : ' + data.accountId);
        window.location.href = '../html/login.html'; // Redirection vers login.html
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}
