document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const password = document.getElementById('password').value.trim();

        if (name === '' || password === '') {
            alert('Por favor, complete todos los campos.');
        } else {
            alert('Formulario enviado con éxito. El navegador se cerrará.');

      
            setTimeout(() => {
                window.close();
            }, 1000); 
        }

    });
});
window.onload = function() {
    
    function mostrarDatosFormulario() {
     
      var nombre = localStorage.getItem('nombre');
      var matricula = localStorage.getItem('matricula');
      var color = localStorage.getItem('color');
      var categoria = localStorage.getItem('categoria');
      var precio = localStorage.getItem('precio');
  
      
      if (nombre && matricula && color && categoria && precio) {
        alert("Mi Datos Son:\nNombre: " + nombre + "\nMatrícula: " + matricula + "\nColor: " + color + "\nCategoría: " + categoria + "\nPrecio: " + precio+ "BS");
  
        
        localStorage.clear();
      }
    }
  
   
    document.getElementById('guardar-btn').addEventListener('click', function(event) {
        
        mostrarDatosFormulario();
    });
  };
    
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    window.location.href = "../Codigo/index.html";
});