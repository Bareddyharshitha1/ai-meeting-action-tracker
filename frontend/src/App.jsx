import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [assigneeFilter, setAssigneeFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // ==============================
    // STATES
    // ==============================

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [user, setUser] = useState(() => {
        const savedUser =
            localStorage.getItem("user");

        try {
            return savedUser
                ? JSON.parse(savedUser)
                : null;
        } catch {
            return null;
        }
    });

    const [meetings, setMeetings] =
        useState([]);

    const [showRegister, setShowRegister] =
        useState(false);

    const [title, setTitle] =
        useState("");

    const [transcript, setTranscript] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    const [selectedMeeting, setSelectedMeeting] =
        useState(null);

    const [loadingDetails, setLoadingDetails] =
        useState(false);

    // ==============================
    // FETCH MEETINGS
    // ==============================

    const fetchMeetings = async () => {

        const currentToken =
            localStorage.getItem("token");

        if (!currentToken) {
            return;
        }

        try {

            setError("");

            const response =
                await fetch(
                    `${API_URL}/api/meetings`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${currentToken}`,
                        },
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch meetings"
                );
            }

            setMeetings(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Failed to fetch meetings"
            );
        }
    };

    useEffect(() => {

        if (user) {
            fetchMeetings();
        }

    }, [user]);

    // ==============================
    // LOGIN
    // ==============================

    const handleLogin = (loggedInUser) => {

        setUser(loggedInUser);

        fetchMeetings();
    };

    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setMeetings([]);
        setSelectedMeeting(null);
    };

    // ==============================
    // ANALYZE MEETING
    // ==============================

    const handleAnalyzeMeeting =
        async (e) => {

            e.preventDefault();

            if (
                !title.trim() ||
                !transcript.trim()
            ) {

                setMessage(
                    "Please enter meeting title and transcript."
                );

                return;
            }

            const currentToken =
                localStorage.getItem("token");

            if (!currentToken) {

                setMessage(
                    "Please login again."
                );

                return;
            }

            try {

                setLoading(true);
                setMessage("");
                setError("");

                const response =
                    await fetch(
                        `${API_URL}/api/meetings/analyze`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${currentToken}`,
                            },

                            body: JSON.stringify({
                                title,
                                transcript,
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Meeting analysis failed"
                    );
                }

                setMessage(
                    "Meeting analyzed successfully!"
                );

                setTitle("");
                setTranscript("");

                await fetchMeetings();

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to analyze meeting"
                );

            } finally {

                setLoading(false);
            }
        };

    // ==============================
    // UPDATE ACTION STATUS
    // ==============================

    const updateActionStatus =
        async (
            meetingId,
            actionId,
            status
        ) => {

            const currentToken =
                localStorage.getItem("token");

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/meetings/${meetingId}/actions/${actionId}`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${currentToken}`,
                            },

                            body: JSON.stringify({
                                status,
                            }),
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to update status"
                    );
                }

                await fetchMeetings();

                if (
                    selectedMeeting &&
                    selectedMeeting._id ===
                        meetingId
                ) {

                    setSelectedMeeting(
                        data.meeting
                    );
                }

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to update status"
                );
            }
        };

    // ==============================
    // VIEW MEETING DETAILS
    // ==============================

    const viewMeetingDetails =
        async (meetingId) => {

            const currentToken =
                localStorage.getItem("token");

            try {

                setLoadingDetails(true);

                const response =
                    await fetch(
                        `${API_URL}/api/meetings/${meetingId}`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${currentToken}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to fetch meeting"
                    );
                }

                setSelectedMeeting(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to fetch meeting"
                );

            } finally {

                setLoadingDetails(false);
            }
        };

    // ==============================
    // DELETE MEETING
    // ==============================

    const deleteMeeting =
        async (meetingId) => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to delete this meeting?"
                );

            if (!confirmed) {
                return;
            }

            const currentToken =
                localStorage.getItem("token");

            try {

                const response =
                    await fetch(
                        `${API_URL}/api/meetings/${meetingId}`,
                        {
                            method: "DELETE",

                            headers: {
                                Authorization:
                                    `Bearer ${currentToken}`,
                            },
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to delete meeting"
                    );
                }

                setMeetings(
                    (prev) =>
                        prev.filter(
                            (meeting) =>
                                meeting._id !==
                                meetingId
                        )
                );

                if (
                    selectedMeeting &&
                    selectedMeeting._id ===
                        meetingId
                ) {

                    setSelectedMeeting(null);
                }

            } catch (err) {

                console.error(err);

                setError(
                    err.message ||
                    "Failed to delete meeting"
                );
            }
        };

    // ==============================
    // AUTH SCREEN
    // ==============================

    if (!user) {

        if (showRegister) {

            return (
                <Register
                    onRegister={() =>
                        setShowRegister(false)
                    }
                    onSwitchToLogin={() =>
                        setShowRegister(false)
                    }
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}
                onSwitchToRegister={() =>
                    setShowRegister(true)
                }
            />
        );
    }

    // ==============================
    // ALL ACTION ITEMS
    // ==============================

    const allActionItems =
        meetings.flatMap(
            (meeting) =>
                (meeting.actionItems || []).map(
                    (item) => ({
                        ...item,

                        meetingTitle:
                            meeting.title,

                        meetingId:
                            meeting._id,
                    })
                )
        );

    // ==============================
    // ANALYTICS
    // ==============================

    const totalTasks =
        allActionItems.length;

    const pendingTasks =
        allActionItems.filter(
            (item) =>
                item.status === "Pending"
        ).length;

    const inProgressTasks =
        allActionItems.filter(
            (item) =>
                item.status ===
                "In Progress"
        ).length;

    const completedTasks =
        allActionItems.filter(
            (item) =>
                item.status === "Completed"
        ).length;

    const highPriority =
        allActionItems.filter(
            (item) =>
                item.priority === "High"
        ).length;

    const mediumPriority =
        allActionItems.filter(
            (item) =>
                item.priority === "Medium"
        ).length;

    const lowPriority =
        allActionItems.filter(
            (item) =>
                item.priority === "Low"
        ).length;

    const completionRate =
        totalTasks === 0
            ? 0
            : Math.round(
                  (completedTasks /
                      totalTasks) *
                      100
              );

    // ==============================
    // DATE
    // ==============================

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    // ==============================
    // UPCOMING DEADLINES
    // ==============================

    const upcomingDeadlines =
        allActionItems
            .filter((item) => {

                if (!item.deadline) {
                    return false;
                }

                if (
                    item.status ===
                    "Completed"
                ) {
                    return false;
                }

                const deadline =
                    new Date(
                        item.deadline
                    );

                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return deadline >= today;
            })
            .sort(
                (a, b) =>
                    new Date(a.deadline) -
                    new Date(b.deadline)
            )
            .slice(0, 5);

    // ==============================
    // OVERDUE TASKS
    // ==============================

   
const getDeadlineLabel = (deadline) => {
    if (!deadline) {
        return "";
    }

    const taskDate = new Date(deadline);

    taskDate.setHours(0, 0, 0, 0);

    const difference =
        Math.ceil(
            (taskDate - today) /
                (1000 * 60 * 60 * 24)
        );

    if (difference < 0) {
        return `${Math.abs(difference)} day(s) overdue`;
    }

    if (difference === 0) {
        return "Due today";
    }

    if (difference === 1) {
        return "Due tomorrow";
    }

    return `Due in ${difference} days`;
};
    const overdueTasks =
        allActionItems
            .filter((item) => {

                if (!item.deadline) {
                    return false;
                }

                if (
                    item.status ===
                    "Completed"
                ) {
                    return false;
                }

                const deadline =
                    new Date(
                        item.deadline
                    );

                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );

                return deadline < today;
            })
            .map((item) => {

                const deadline =
                    new Date(
                        item.deadline
                    );

                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );

                const daysLate =
                    Math.ceil(
                        (today -
                            deadline) /
                            (1000 *
                                60 *
                                60 *
                                24)
                    );

                return {
                    ...item,
                    daysLate,
                };
            });

    // ==============================
    // NOTIFICATIONS
    // ==============================

    const notifications =
        upcomingDeadlines.map(
            (item) => {

                const deadline =
                    new Date(
                        item.deadline
                    );

                deadline.setHours(
                    0,
                    0,
                    0,
                    0
                );

                const difference =
                    Math.ceil(
                        (deadline -
                            today) /
                            (1000 *
                                60 *
                                60 *
                                24)
                    );

                let reminderMessage;

                if (difference === 0) {

                    reminderMessage =
                        "Due today";

                } else if (
                    difference === 1
                ) {

                    reminderMessage =
                        "Due tomorrow";

                } else {

                    reminderMessage =
                        `Due in ${difference} days`;
                }

                return {
                    ...item,
                    reminderMessage,
                };
            }
        );

    // ==============================
    // CHART DATA
    // ==============================

    const statusChartData = [
        {
            name: "Pending",
            value: pendingTasks,
        },
        {
            name: "In Progress",
            value: inProgressTasks,
        },
        {
            name: "Completed",
            value: completedTasks,
        },
    ];

    const priorityChartData = [
        {
            name: "High",
            value: highPriority,
        },
        {
            name: "Medium",
            value: mediumPriority,
        },
        {
            name: "Low",
            value: lowPriority,
        },
    ];

    const meetingChartData =
        meetings.map((meeting) => ({

            name:
                meeting.title.length > 18
                    ? meeting.title.substring(
                          0,
                          18
                      ) + "..."
                    : meeting.title,

            tasks:
                meeting.actionItems
                    ?.length || 0,
        }));

    // ==============================
    // FILTER ACTION ITEMS
    // ==============================

    const filteredActionItems = allActionItems.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
        !search ||
        item.task.toLowerCase().includes(search) ||
        item.assignedTo.toLowerCase().includes(search) ||
        item.meetingTitle.toLowerCase().includes(search);

    const matchesPriority =
        priorityFilter === "All" ||
        item.priority === priorityFilter;

    const matchesAssignee =
        assigneeFilter === "All" ||
        item.assignedTo === assigneeFilter;

    const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

    return (
        matchesSearch &&
        matchesPriority &&
        matchesAssignee &&
        matchesStatus
    );
});

    // ==============================
    // UI
    // ==============================

    return (
        <div className="app-container">

            {/* =========================
                HEADER
            ========================= */}

            <header className="app-header">

                <div>
                    <h1>
                        AI Meeting Action Tracker
                    </h1>

                    <p>
                        Convert meetings into
                        actionable tasks
                    </p>
                </div>

                <div className="notification-wrapper">

                    <button
                        className="notification-btn"
                        title="Notifications"
                        onClick={() =>
                            setShowNotifications(
                                !showNotifications
                            )
                        }
                    >
                        🔔

                        {notifications.length >
                            0 && (
                            <span className="notification-count">
                                {
                                    notifications.length
                                }
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="notification-dropdown">

                            <div className="notification-dropdown-header">

                                <strong>
                                    Notifications
                                </strong>

                                <span>
                                    {
                                        notifications.length
                                    }{" "}
                                    pending
                                </span>

                            </div>

                            {notifications.length ===
                            0 ? (
                                <div className="notification-empty">
                                    🎉 No pending
                                    notifications
                                </div>
                            ) : (
                                notifications
                                    .slice(
                                        0,
                                        5
                                    )
                                    .map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                className="notification-item"
                                                key={
                                                    item._id
                                                }
                                            >

                                                <div className="notification-item-icon">
                                                    🔔
                                                </div>

                                                <div className="notification-item-content">

                                                    <strong>
                                                        {
                                                            item.task
                                                        }
                                                    </strong>

                                                    <p>
                                                        {
                                                            item.reminderMessage
                                                        }
                                                    </p>

                                                    <small>
                                                        📅{" "}
                                                        {new Date(
                                                            item.deadline
                                                        ).toLocaleDateString()}
                                                    </small>

                                                </div>

                                            </div>
                                        )
                                    )
                            )}

                        </div>
                    )}

                </div>

                <div className="user-section">

                    <span>
                        Welcome,{" "}
                        <strong>
                            {user.name}
                        </strong>
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* =========================
                MESSAGES
            ========================= */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* =========================
                STAT CARDS
            ========================= */}

            <section className="stats-grid">

                <div className="stat-card">

                    <h3>
                        Total Meetings
                    </h3>

                    <div className="stat-number">
                        {meetings.length}
                    </div>

                </div>

                <div className="stat-card">

                    <h3>
                        Pending Tasks
                    </h3>

                    <div className="stat-number">
                        {pendingTasks}
                    </div>

                </div>

                <div className="stat-card">

                    <h3>
                        In Progress
                    </h3>

                    <div className="stat-number">
                        {inProgressTasks}
                    </div>

                </div>

                <div className="stat-card">

                    <h3>
                        Completed
                    </h3>

                    <div className="stat-number">
                        {completedTasks}
                    </div>

                </div>

            </section>

            {/* =========================
                ANALYTICS
            ========================= */}

            <section className="analytics-section">

                <div className="section-heading">

                    <h2>
                        📊 Task Analytics
                    </h2>

                    <p>
                        Overview of your meeting
                        tasks
                    </p>

                </div>

                <div className="analytics-cards">

                    <div className="analytics-card">

                        <h3>
                            Total Tasks
                        </h3>

                        <strong>
                            {totalTasks}
                        </strong>

                    </div>
<div className="analytics-card">

    <h3>
        Completion Rate
    </h3>

    <strong>
        {completionRate}%
    </strong>

    <div className="progress-bar">
        <div
            className="progress-fill"
            style={{
                width: `${completionRate}%`
            }}
        ></div>
    </div>

    <p className="progress-text">
        {completionRate === 100
            ? "All tasks completed 🎉"
            : `${completionRate}% of tasks completed`}
    </p>

</div>

                    <div className="analytics-card">

                        <h3>
                            High Priority
                        </h3>

                        <strong>
                            {highPriority}
                        </strong>

                    </div>

                    <div className="analytics-card">

                        <h3>
                            Medium Priority
                        </h3>

                        <strong>
                            {mediumPriority}
                        </strong>

                    </div>

                    <div className="analytics-card">

                        <h3>
                            Low Priority
                        </h3>

                        <strong>
                            {lowPriority}
                        </strong>

                    </div>

                </div>

            </section>

            {/* ==============================
                NOTIFICATION CENTER
            ============================== */}

            <section className="notification-section">

                <div className="section-heading">

                    <h2>
                        🔔 Notifications
                    </h2>

                    <p>
                        Tasks that need your attention
                    </p>

                </div>

                {notifications.length ===
                0 ? (

                    <div className="empty-message">
                        No new notifications.
                    </div>

                ) : (

                    <div className="notification-list">

                        {notifications.map(
                            (item) => (

                                <div
                                    className="notification-card"
                                    key={item._id}
                                >

                                    <div>

                                        <h3>
                                            {item.task}
                                        </h3>

                                        <p>
                                            Assigned to:{" "}
                                            <strong>
                                                {
                                                    item.assignedTo
                                                }
                                            </strong>
                                        </p>

                                        <strong>
                                            {
                                                item.reminderMessage
                                            }
                                        </strong>

                                    </div>

                                    <span
                                        className={`priority-badge ${item.priority?.toLowerCase()}`}
                                    >
                                        {
                                            item.priority
                                        }
                                    </span>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* ==============================
                OVERDUE TASKS
            ============================== */}

            <section className="overdue-section">

                <div className="section-heading">

                    <h2>
                        🚨 Overdue Tasks
                    </h2>

                    <p>
                        Tasks that passed their deadline
                    </p>

                </div>

                {overdueTasks.length === 0 ? (

                    <div className="empty-message">
                        🎉 No overdue tasks. Great job!
                    </div>

                ) : (

                    <div className="overdue-list">

                        {overdueTasks.map(
                            (item) => (

                                <div
                                    className="overdue-card"
                                    key={item._id}
                                >

                                    <div className="overdue-info">

                                        <h3>
                                            {item.task}
                                        </h3>

                                        <p>
                                            Assigned to:{" "}
                                            <strong>
                                                {
                                                    item.assignedTo
                                                }
                                            </strong>
                                        </p>

                                        <p>
                                            Deadline:{" "}
                                            {new Date(
                                                item.deadline
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>

                                    <div className="overdue-right">

                                        <span className="overdue-badge">

                                            🚨{" "}
                                            {
                                                item.daysLate
                                            }{" "}

                                            {
                                                item.daysLate ===
                                                1
                                                    ? "day"
                                                    : "days"
                                            }{" "}

                                            late

                                        </span>

                                        <span
                                            className={`priority-badge ${item.priority?.toLowerCase()}`}
                                        >
                                            {
                                                item.priority
                                            }
                                        </span>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* ==============================
                UPCOMING DEADLINES
            ============================== */}

            <section className="deadlines-section">

                <div className="section-heading">

                    <h2>
                        ⏰ Upcoming Deadlines
                    </h2>

                    <p>
                        Your next pending tasks
                    </p>

                </div>

                {upcomingDeadlines.length ===
                0 ? (

                    <div className="empty-message">
                        No upcoming deadlines.
                    </div>

                ) : (

                    <div className="deadline-list">

                        {upcomingDeadlines.map(
                            (item) => (

                                <div
                                    className="deadline-card"
                                    key={item._id}
                                >

                                    <div className="deadline-info">

                                        <h3>
                                            {item.task}
                                        </h3>

                                        <p>
                                            Assigned to:{" "}
                                            <strong>
                                                {
                                                    item.assignedTo
                                                }
                                            </strong>
                                        </p>

                                        <p>
                                            Meeting:{" "}
                                            {
                                                item.meetingTitle
                                            }
                                        </p>

                                    </div>

                                    <div className="deadline-right">

                                        <span
                                            className={`priority-badge ${item.priority?.toLowerCase()}`}
                                        >
                                            {
                                                item.priority
                                            }
                                        </span>

                                        <span className="deadline-date">

    📅{" "}
    {new Date(
        item.deadline
    ).toLocaleDateString()}

    <span className="deadline-label">
        {getDeadlineLabel(item.deadline)}
    </span>

</span>
                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* ==============================
                CHARTS
            ============================== */}

            <section className="analytics-section">

                <div className="charts-grid">

                    {/* STATUS CHART */}

                    <div className="chart-card">

                        <h3>
                            Task Status
                        </h3>

                        <div className="chart-container">

                            {totalTasks === 0 ? (

                                <p className="empty-chart">
                                    No task data
                                    available.
                                </p>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                statusChartData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={
                                                95
                                            }
                                            label
                                        >

                                            {statusChartData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            `status-${index}`
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>
                            )}

                        </div>

                    </div>

                    {/* PRIORITY CHART */}

                    <div className="chart-card">

                        <h3>
                            Task Priority
                        </h3>

                        <div className="chart-container">

                            {totalTasks === 0 ? (

                                <p className="empty-chart">
                                    No task data
                                    available.
                                </p>

                            ) : (

                                <ResponsiveContainer
                                    width="100%"
                                    height={300}
                                >

                                    <PieChart>

                                        <Pie
                                            data={
                                                priorityChartData
                                            }
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={
                                                95
                                            }
                                            label
                                        >

                                            {priorityChartData.map(
                                                (
                                                    entry,
                                                    index
                                                ) => (

                                                    <Cell
                                                        key={
                                                            `priority-${index}`
                                                        }
                                                    />

                                                )
                                            )}

                                        </Pie>

                                        <Tooltip />

                                        <Legend />

                                    </PieChart>

                                </ResponsiveContainer>
                            )}

                        </div>

                    </div>

                </div>

                {/* MEETING TASK BAR CHART */}

                <div className="chart-card meeting-chart-card">

                    <h3>
                        Tasks by Meeting
                    </h3>

                    <div className="chart-container">

                        {meetings.length ===
                        0 ? (

                            <p className="empty-chart">
                                No meeting data
                                available.
                            </p>

                        ) : (

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <BarChart
                                    data={
                                        meetingChartData
                                    }
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 10,
                                        bottom: 50,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="name"
                                        angle={-20}
                                        textAnchor="end"
                                        interval={0}
                                    />

                                    <YAxis
                                        allowDecimals={
                                            false
                                        }
                                    />

                                    <Tooltip />

                                    <Legend />

                                    <Bar
                                        dataKey="tasks"
                                        name="Tasks"
                                    />

                                </BarChart>

                            </ResponsiveContainer>
                        )}

                    </div>

                </div>

            </section>

            {/* ==============================
                ANALYZE MEETING
            ============================== */}

            <section className="analyze-section">

                <h2>
                    Analyze New Meeting
                </h2>

                <form
                    onSubmit={
                        handleAnalyzeMeeting
                    }
                >

                    <input
                        type="text"
                        placeholder="Meeting title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />

                    <textarea
                        placeholder="Paste your meeting transcript here..."
                        value={transcript}
                        onChange={(e) =>
                            setTranscript(
                                e.target.value
                            )
                        }
                        rows="8"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Analyzing..."
                            : "Analyze Meeting"}
                    </button>

                </form>

            </section>

            {/* ==============================
                ACTION ITEMS
            ============================== */}

<section className="action-section">

    <div className="section-heading">

        <h2>
            Action Items
        </h2>

        <div className="task-filters">

            {/* Search */}
            <input
                type="text"
                placeholder="🔍 Search tasks, people or meetings..."
                value={searchTerm}
                onChange={(e) =>
                    setSearchTerm(e.target.value)
                }
            />

            {/* Priority */}
            <select
                value={priorityFilter}
                onChange={(e) =>
                    setPriorityFilter(e.target.value)
                }
            >
                <option value="All">
                    All Priorities
                </option>

                <option value="High">
                    High
                </option>

                <option value="Medium">
                    Medium
                </option>

                <option value="Low">
                    Low
                </option>
            </select>

            {/* Assignee */}
            <select
                value={assigneeFilter}
                onChange={(e) =>
                    setAssigneeFilter(e.target.value)
                }
            >
                <option value="All">
                    All Assignees
                </option>

                <option value="Harshitha">
                    Harshitha
                </option>

                <option value="Ravi">
                    Ravi
                </option>

                <option value="Priya">
                    Priya
                </option>

                <option value="Team">
                    Team
                </option>
            </select>

            {/* Status */}
            <select
                value={statusFilter}
                onChange={(e) =>
                    setStatusFilter(e.target.value)
                }
            >
                <option value="All">
                    All Status
                </option>

                <option value="Pending">
                    Pending
                </option>

                <option value="In Progress">
                    In Progress
                </option>

                <option value="Completed">
                    Completed
                </option>
            </select>

        </div>

    </div>

                {filteredActionItems.length ===
                0 ? (

                    <p className="empty-message">
                        No action items found.
                    </p>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Task
                                    </th>

                                    <th>
                                        Assigned To
                                    </th>

                                    <th>
                                        Deadline
                                    </th>

                                    <th>
                                        Priority
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Meeting
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredActionItems.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item._id
                                            }
                                        >

                                            <td>
                                                {
                                                    item.task
                                                }
                                            </td>

                                            <td>
                                                {
                                                    item.assignedTo
                                                }
                                            </td>

                                            <td>

                                                {item.deadline
                                                    ? new Date(
                                                          item.deadline
                                                      ).toLocaleDateString()
                                                    : "No deadline"}

                                            </td>

                                            <td>

                                                <span
                                                    className={`priority-badge ${item.priority?.toLowerCase()}`}
                                                >
                                                    {
                                                        item.priority
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <select
                                                    value={
                                                        item.status
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateActionStatus(
                                                            item.meetingId,
                                                            item._id,
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="Pending">
                                                        Pending
                                                    </option>

                                                    <option value="In Progress">
                                                        In Progress
                                                    </option>

                                                    <option value="Completed">
                                                        Completed
                                                    </option>

                                                </select>

                                            </td>

                                            <td>
                                                {
                                                    item.meetingTitle
                                                }
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

            {/* ==============================
                MEETING HISTORY
            ============================== */}

            <section className="history-section">

                <div className="section-heading">

                    <h2>
                        Meeting History
                    </h2>

                </div>

                {meetings.length ===
                0 ? (

                    <p className="empty-message">
                        No meetings available.
                    </p>

                ) : (

                    <div className="meeting-list">

                        {meetings.map(
                            (meeting) => (

                                <div
                                    className="meeting-card"
                                    key={
                                        meeting._id
                                    }
                                >

                                    <div>

                                        <h3>
                                            {
                                                meeting.title
                                            }
                                        </h3>

                                        <p>
                                            {new Date(
                                                meeting.createdAt ||
                                                    meeting.date
                                            ).toLocaleString()}
                                        </p>

                                        <span>
                                            {
                                                meeting
                                                    .actionItems
                                                    ?.length ||
                                                0
                                            }{" "}
                                            action items
                                        </span>

                                    </div>

                                    <div className="meeting-actions">

                                        <button
                                            onClick={() =>
                                                viewMeetingDetails(
                                                    meeting._id
                                                )
                                            }
                                        >
                                            View Details
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteMeeting(
                                                    meeting._id
                                                )
                                            }
                                            className="delete-btn"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* ==============================
                MEETING DETAILS MODAL
            ============================== */}

            {selectedMeeting && (

                <div className="modal-overlay">

                    <div className="meeting-modal">

                        <button
                            className="close-modal"
                            onClick={() =>
                                setSelectedMeeting(
                                    null
                                )
                            }
                        >
                            ×
                        </button>

                        <h2>
                            {
                                selectedMeeting.title
                            }
                        </h2>

                        <p className="modal-date">
                            {new Date(
                                selectedMeeting.createdAt ||
                                    selectedMeeting.date
                            ).toLocaleString()}
                        </p>

                        {selectedMeeting.summary && (

                            <div className="summary-box">

                                <h3>
                                    AI Summary
                                </h3>

                                <p>
                                    {
                                        selectedMeeting.summary
                                    }
                                </p>

                            </div>
                        )}

                        {selectedMeeting.keyPoints
                            ?.length >
                            0 && (

                            <div className="keypoints-box">

                                <h3>
                                    Key Points
                                </h3>

                                <ul>

                                    {selectedMeeting.keyPoints.map(
                                        (
                                            point,
                                            index
                                        ) => (

                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                {
                                                    point
                                                }
                                            </li>

                                        )
                                    )}

                                </ul>

                            </div>
                        )}

                        <div className="modal-actions">

                            <h3>
                                Action Items
                            </h3>

                            {selectedMeeting.actionItems?.map(
                                (item) => (

                                    <div
                                        className="modal-action-item"
                                        key={
                                            item._id
                                        }
                                    >

                                        <div>

                                            <strong>
                                                {
                                                    item.task
                                                }
                                            </strong>

                                            <p>
                                                Assigned to:{" "}
                                                {
                                                    item.assignedTo
                                                }
                                            </p>

                                            <p>
                                                Priority:{" "}
                                                {
                                                    item.priority
                                                }
                                            </p>

                                            <p>
                                                Deadline:{" "}
                                                {item.deadline
                                                    ? new Date(
                                                          item.deadline
                                                      ).toLocaleDateString()
                                                    : "No deadline"}
                                            </p>

                                        </div>

                                        <select
                                            value={
                                                item.status
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateActionStatus(
                                                    selectedMeeting._id,
                                                    item._id,
                                                    e.target.value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="In Progress">
                                                In Progress
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                        </select>

                                    </div>
                                )
                            )}

                        </div>

                    </div>

                </div>
            )}

            {loadingDetails && (

                <div className="loading-overlay">
                    Loading meeting...
                </div>

            )}

        </div>
    );
}

export default App;