document.addEventListener("DOMContentLoaded", function () {
    // ==============================
    // 🔐 LOGIN / REGISTER SECTION
    // ==============================
    var form = document.getElementById("authForm");
    var message = document.getElementById("message");
    var toggleForm = document.getElementById("toggleForm");
    var formTitle = document.getElementById("formTitle");
    var submitBtn = document.getElementById("submitBtn");
    var isLogin = true;
    if (toggleForm) {
        toggleForm.addEventListener("click", function () {
            isLogin = !isLogin;
            if (isLogin) {
                formTitle.textContent = "Login";
                submitBtn.textContent = "Login";
                toggleForm.textContent = "Register";
                message.textContent = "";
            }
            else {
                formTitle.textContent = "Register";
                submitBtn.textContent = "Register";
                toggleForm.textContent = "Login";
                message.textContent = "";
            }
        });
    }
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            if (email === "" || password === "") {
                message.style.color = "red";
                message.textContent = "Please fill all fields";
                return;
            }
            var users = JSON.parse(localStorage.getItem("users") || "[]");
            if (isLogin) {
                var userExists = users.find(function (u) {
                    return u.email === email && u.password === password;
                });
                if (userExists) {
                    localStorage.setItem("user", email);
                    window.location.href = "dashboard.html";
                }
                else {
                    message.style.color = "red";
                    message.textContent = "Invalid email or password";
                }
            }
            else {
                var alreadyExists = users.find(function (u) { return u.email === email; });
                if (alreadyExists) {
                    message.style.color = "red";
                    message.textContent = "User already exists";
                }
                else {
                    users.push({ email: email, password: password });
                    localStorage.setItem("users", JSON.stringify(users));
                    message.style.color = "green";
                    message.textContent = "Registration successful! Please login.";
                }
            }
        });
    }
    // ==============================
    // 📊 DASHBOARD SECTION
    // ==============================
    var welcomeMessage = document.getElementById("welcomeMessage");
    var logoutBtn = document.getElementById("logoutBtn");
    if (welcomeMessage) {
        var user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "index.html";
        }
        else {
            welcomeMessage.textContent = "Welcome, " + user;
        }
    }
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }
    // ==============================
    // 📚 COURSES SECTION
    // ==============================
    var courseContainer = document.getElementById("courseContainer");
    if (courseContainer) {
        var user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "index.html";
        }
        var courses = [
            { id: 1, title: "HTML", instructor: "John", progress: 0 },
            { id: 2, title: "CSS", instructor: "Sam", progress: 0 },
            { id: 3, title: "Full Stack", instructor: "Mary", progress: 0 }
        ];
        var enrolledCourses_1 = JSON.parse(localStorage.getItem("enrolled") || "[]");
        courses.forEach(function (course) {
            var div = document.createElement("div");
            div.className = "course-card";
            div.classList.add("course-card");
            var isEnrolled = enrolledCourses_1.includes(course.id);
            div.innerHTML = "\n                <h3>".concat(course.title, "</h3>\n                <p><strong>Instructor:</strong> ").concat(course.instructor, "</p>\n                <p><strong>Progress:</strong> ").concat(course.progress, "%</p>\n                <button ").concat(isEnrolled ? "disabled" : "", " \n                    onclick=\"enroll(").concat(course.id, ")\">\n                    ").concat(isEnrolled ? "Enrolled" : "Enroll", "\n                </button>\n            ");
            courseContainer.appendChild(div);
        });
    }
});
// ==============================
// 🎓 GLOBAL ENROLL FUNCTION
// ==============================
window.enroll = function (id) {
    var enrolledCourses = JSON.parse(localStorage.getItem("enrolled") || "[]");
    if (!enrolledCourses.includes(id)) {
        enrolledCourses.push(id);
        localStorage.setItem("enrolled", JSON.stringify(enrolledCourses));
        alert("Successfully enrolled!");
        location.reload();
    }
};
