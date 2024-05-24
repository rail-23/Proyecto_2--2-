function calcularTiempo() {
  var precioHora = document.getElementById('precio').value;
  var tiempoElegido = parseInt(precioHora) / 20; 
  document.getElementById('tiempo').innerText = tiempoElegido + " horas";
}
document.getElementById('parking-form').addEventListener('submit', function(event) {
  event.preventDefault(); 
  window.location.href = "../login/login.html"; 
 });

document.getElementById('parking-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  
  var nombre = document.getElementById('nombre').value;
  var matricula = document.getElementById('matricula').value;
  var color = document.getElementById('color').value;
  var categoria = document.getElementById('categoria').value;
  var precio = document.getElementById('precio').value;
  
  
  localStorage.setItem('nombre', nombre);
  localStorage.setItem('matricula', matricula);
  localStorage.setItem('color', color);
  localStorage.setItem('categoria', categoria);
  localStorage.setItem('precio', precio);
  
  
  window.location.href = "../login/login.html";
});




