const API = "http://localhost:5000";

async function register() {
    await fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });
    alert("Registered!");
}

async function login() {
    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    const data = await res.json();
    localStorage.setItem("token", data.token);
    window.location = "dashboard.html";
}

function toggleDark() {
    document.body.classList.toggle("dark");
}

let progress = 0;

function increaseProgress() {
    progress += 10;
    if (progress > 100) progress = 100;
    document.getElementById("progressFill").style.width = progress + "%";
}
