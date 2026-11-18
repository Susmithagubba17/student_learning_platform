document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // 🔐 LOGIN / REGISTER SECTION
    // ==============================

    const form = document.getElementById("authForm") as HTMLFormElement;
    const message = document.getElementById("message") as HTMLElement;
    const toggleForm = document.getElementById("toggleForm") as HTMLElement;
    const formTitle = document.getElementById("formTitle") as HTMLElement;
    const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;

    let isLogin = true;

    if (toggleForm) {
        toggleForm.addEventListener("click", function () {
            isLogin = !isLogin;

            if (isLogin) {
                formTitle.textContent = "Login";
                submitBtn.textContent = "Login";
                toggleForm.textContent = "Register";
                message.textContent = "";
            } else {
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

            const email = (document.getElementById("email") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;

            if (email === "" || password === "") {
                message.style.color = "red";
                message.textContent = "Please fill all fields";
                return;
            }

            const users = JSON.parse(localStorage.getItem("users") || "[]");

            if (isLogin) {
                const userExists = users.find((u: any) =>
                    u.email === email && u.password === password
                );

                if (userExists) {
                    localStorage.setItem("user", email);
                    window.location.href = "dashboard.html";
                } else {
                    message.style.color = "red";
                    message.textContent = "Invalid email or password";
                }

            } else {
                const alreadyExists = users.find((u: any) => u.email === email);

                if (alreadyExists) {
                    message.style.color = "red";
                    message.textContent = "User already exists";
                } else {
                    users.push({ email, password });
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

    const welcomeMessage = document.getElementById("welcomeMessage");
    const logoutBtn = document.getElementById("logoutBtn");

    if (welcomeMessage) {
        const user = localStorage.getItem("user");

        if (!user) {
            window.location.href = "index.html";
        } else {
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

    const courseContainer = document.getElementById("courseContainer");

    if (courseContainer) {

        const user = localStorage.getItem("user");
        if (!user) {
            window.location.href = "index.html";
        }

        const courses = [
            { id: 1, title: "HTML", instructor: "John", progress: 0 },
            { id: 2, title: "CSS", instructor: "Sam", progress: 0 },
            { id: 3, title: "Full Stack", instructor: "Mary", progress: 0 }
        ];

        const enrolledCourses = JSON.parse(localStorage.getItem("enrolled") || "[]");

        courses.forEach((course) => {

            const div = document.createElement("div");
            div.className="course-card";
            div.classList.add("course-card");

            const isEnrolled = enrolledCourses.includes(course.id);

            div.innerHTML = `
                <h3>${course.title}</h3>
                <p><strong>Instructor:</strong> ${course.instructor}</p>
                <p><strong>Progress:</strong> ${course.progress}%</p>
                <button ${isEnrolled ? "disabled" : ""} 
                    onclick="enroll(${course.id})">
                    ${isEnrolled ? "Enrolled" : "Enroll"}
                </button>
            `;

            courseContainer.appendChild(div);
        });
    }

});

// ==============================
// 🎓 GLOBAL ENROLL FUNCTION
// ==============================

(window as any).enroll = function (id: number) {

    let enrolledCourses = JSON.parse(localStorage.getItem("enrolled") || "[]");

    if (!enrolledCourses.includes(id)) {
        enrolledCourses.push(id);
        localStorage.setItem("enrolled", JSON.stringify(enrolledCourses));
        alert("Successfully enrolled!");
        location.reload();
    }
};
