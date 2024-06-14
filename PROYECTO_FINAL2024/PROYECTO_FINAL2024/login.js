document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var users = JSON.parse(localStorage.getItem("users")) || [];

    var foundUser = users.find(function(user) {
        return user.username === username && user.password === password;
    });

    if (username === "admin" && password === "1234567") {
        window.location.href = "index.html"; 
    } else if (foundUser) {
        if (foundUser.role === "operator") {
            window.location.href = "operator_dashboard.html";
        }
    } else {
        alert("Usuario o contraseña incorrectos");
    }
});
