// Simulación simple de sesión (localStorage)
(function(){
  const KEY_USER = 'mc_user';

  const loginForm  = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm){
    loginForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-pass').value;
      if(!email || !pass){ alert('Completa los campos'); return; }
      localStorage.setItem(KEY_USER, JSON.stringify({email}));
      alert('Sesión iniciada como ' + email);
      location.href = 'catalogo.html';
    });
  }

  if (signupForm){
    signupForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      const email = document.getElementById('su-email').value.trim();
      const pass  = document.getElementById('su-pass').value;
      if(!email || pass.length<6){ alert('Correo válido y contraseña de 6+ caracteres'); return; }
      localStorage.setItem(KEY_USER, JSON.stringify({email}));
      alert('Cuenta creada: ' + email);
      location.href = 'catalogo.html';
    });
  }
})();
