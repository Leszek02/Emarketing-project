document.getElementById('signup-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    
    alert('Dziękujemy za zgłoszenie! \nEmail: ' + email + '\nRola: ' + role);
    console.log('Formularz wysłany pomyślnie dla:', email);
    
    this.reset(); // Czyści formularz
});