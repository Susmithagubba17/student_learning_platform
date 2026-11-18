import React from "react";

function Dashboard() {

    const role = localStorage.getItem("role");

    return (
        <div style={{ padding: 40 }}>
            <h2>Dashboard</h2>

            {role === "admin" ? (
                <h3>👑 Admin Panel</h3>
            ) : (
                <h3>👤 User Panel</h3>
            )}

        </div>
    );
}

export default Dashboard;