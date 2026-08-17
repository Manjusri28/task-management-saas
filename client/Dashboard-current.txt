import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./Dashboard.css";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const Dashboard = () => {
  const { user, logout } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [submitting, setSubmitting] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH TASKS
  // ==========================================

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/tasks");

      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Fetch tasks error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ==========================================
  // CREATE FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CREATE TASK
  // ==========================================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await API.post(
        "/tasks",
        formData
      );

      const newTask =
        response.data.task || response.data;

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);

      setFormData(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error("Create task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const startEditTask = (task) => {
    setError("");
    setShowForm(false);

    setEditingTask({
      ...task,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
    });
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingTask((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    if (!editingTask?.title?.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await API.put(
        `/tasks/${editingTask._id}`,
        {
          title: editingTask.title,
          description:
            editingTask.description || "",
          status: editingTask.status,
          priority: editingTask.priority,
          dueDate:
            editingTask.dueDate || null,
        }
      );

      const updatedTask =
        response.data.task || response.data;

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === editingTask._id
            ? updatedTask
            : task
        )
      );

      setEditingTask(null);
    } catch (error) {
      console.error("Update task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingTask(taskId);
      setError("");

      await API.delete(`/tasks/${taskId}`);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task._id !== taskId
        )
      );
    } catch (error) {
      console.error("Delete task error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete task."
      );
    } finally {
      setDeletingTask(null);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalTasks = tasks.length;

  const todoTasks = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // ==========================================
  // DATE HELPERS
  // ==========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    if (task.status === "completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  });

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    if (task.status === "completed") {
      return false;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  });

  // ==========================================
  // COMPLETION PERCENTAGE
  // ==========================================

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  // ==========================================
  // RECENT TASKS
  // ==========================================

  const recentTasks = [...tasks]
    .sort((a, b) => {
      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 5);

  // ==========================================
  // FORMAT STATUS
  // ==========================================

  const formatStatus = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "completed") {
      return "Completed";
    }

    return "To Do";
  };

  // ==========================================
  // FORMAT PRIORITY
  // ==========================================

  const formatPriority = (priority) => {
    if (!priority) {
      return "Medium";
    }

    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="dashboard-header">

        <div>
          <h1>Task Management</h1>

          <p>
            Welcome back,{" "}
            <strong>
              {user?.name || "User"}
            </strong>
          </p>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="dashboard-content">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>
            <h2>My Dashboard</h2>

            <p>
              Manage your tasks, track your
              progress, and stay productive.
            </p>
          </div>

          <button
            className="add-task-button"
            onClick={() => {
              setShowForm(!showForm);
              setEditingTask(null);
              setError("");
            }}
          >
            {showForm
              ? "Close"
              : "+ Add Task"}
          </button>

        </section>

        {/* ERROR */}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* ====================================
            CREATE TASK FORM
        ==================================== */}

        {showForm && (
          <section className="task-form-card">

            <div className="form-card-header">
              <div>
                <h3>Create New Task</h3>

                <p>
                  Add a new task to your
                  workspace.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleCreateTask}
              className="task-form"
            >

              <div className="form-group">
                <label>
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={handleChange}
                  placeholder="Enter task description"
                  rows="4"
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="todo">
                      To Do
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData(emptyForm);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Creating..."
                    : "Create Task"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ====================================
            EDIT TASK FORM
        ==================================== */}

        {editingTask && (
          <section className="task-form-card">

            <div className="form-card-header">

              <div>
                <h3>Edit Task</h3>

                <p>
                  Update your task details.
                </p>
              </div>

              <button
                className="close-edit-button"
                onClick={() =>
                  setEditingTask(null)
                }
              >
                X
              </button>

            </div>

            <form
              onSubmit={handleUpdateTask}
              className="task-form"
            >

              <div className="form-group">
                <label>
                  Task Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={
                    editingTask.title || ""
                  }
                  onChange={handleEditChange}
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={
                    editingTask.description ||
                    ""
                  }
                  onChange={handleEditChange}
                  placeholder="Enter task description"
                  rows="4"
                />
              </div>

              <div className="form-row">

                <div className="form-group">
                  <label>Status</label>

                  <select
                    name="status"
                    value={
                      editingTask.status ||
                      "todo"
                    }
                    onChange={handleEditChange}
                  >
                    <option value="todo">
                      To Do
                    </option>

                    <option value="in-progress">
                      In Progress
                    </option>

                    <option value="completed">
                      Completed
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={
                      editingTask.priority ||
                      "medium"
                    }
                    onChange={handleEditChange}
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={
                      editingTask.dueDate ||
                      ""
                    }
                    onChange={handleEditChange}
                  />
                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setEditingTask(null)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={submitting}
                >
                  {submitting
                    ? "Updating..."
                    : "Update Task"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* ====================================
            STATISTICS
        ==================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon total">
              T
            </div>

            <div>
              <p>Total Tasks</p>
              <h3>{totalTasks}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon todo">
              O
            </div>

            <div>
              <p>To Do</p>
              <h3>{todoTasks}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon progress">
              P
            </div>

            <div>
              <p>In Progress</p>
              <h3>{inProgressTasks}</h3>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon completed">
              C
            </div>

            <div>
              <p>Completed</p>
              <h3>{completedTasks}</h3>
            </div>

          </div>

        </section>

        {/* ====================================
            DASHBOARD INSIGHTS
        ==================================== */}

        <section className="dashboard-insights">

          {/* COMPLETION */}

          <div className="completion-card">

            <div className="insight-header">

              <div>
                <h3>
                  Task Completion
                </h3>

                <p>
                  Your overall task progress
                </p>
              </div>

              <span className="completion-percentage">
                {completionPercentage}%
              </span>

            </div>

            <div className="progress-track">

              <div
                className="progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />

            </div>

            <div className="completion-footer">

              <span>
                {completedTasks} of{" "}
                {totalTasks} completed
              </span>

              <span>
                {totalTasks -
                  completedTasks}{" "}
                remaining
              </span>

            </div>

          </div>

          {/* QUICK INSIGHTS */}

          <div className="quick-insights">

            <div className="quick-insight-card">

              <div className="quick-insight-icon">
                D
              </div>

              <div>
                <span>
                  Due Today
                </span>

                <strong>
                  {dueTodayTasks.length}
                </strong>
              </div>

            </div>

            <div className="quick-insight-card">

              <div className="quick-insight-icon">
                !
              </div>

              <div>
                <span>
                  Overdue
                </span>

                <strong>
                  {overdueTasks.length}
                </strong>
              </div>

            </div>

          </div>

        </section>

        {/* ====================================
            RECENT TASKS
        ==================================== */}

        <section className="recent-tasks-section">

          <div className="section-heading">

            <div>
              <h3>Recent Tasks</h3>

              <p>
                Your latest tasks
              </p>
            </div>

            <span className="task-count">
              {recentTasks.length}
            </span>

          </div>

          {loading ? (

            <div className="dashboard-loading">
              Loading tasks...
            </div>

          ) : recentTasks.length === 0 ? (

            <div className="empty-recent-tasks">

              <div className="empty-icon">
                +
              </div>

              <h4>
                No tasks yet
              </h4>

              <p>
                Create your first task
                to get started.
              </p>

            </div>

          ) : (

            <div className="recent-task-list">

              {recentTasks.map((task) => (

                <div
                  className="recent-task-item"
                  key={task._id}
                >

                  <div className="recent-task-main">

                    <div
                      className={`task-status-dot ${
                        task.status
                      }`}
                    />

                    <div>

                      <h4>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p>
                          {task.description
                            .length > 70
                            ? `${task.description.substring(
                                0,
                                70
                              )}...`
                            : task.description}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="recent-task-meta">

                    <span
                      className={`task-status-badge ${
                        task.status
                      }`}
                    >
                      {formatStatus(
                        task.status
                      )}
                    </span>

                    <span
                      className={`task-priority-badge ${
                        task.priority ||
                        "medium"
                      }`}
                    >
                      {formatPriority(
                        task.priority
                      )}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* ====================================
            ALL TASKS
        ==================================== */}

        <section className="all-tasks-section">

          <div className="section-heading">

            <div>
              <h3>All Tasks</h3>

              <p>
                Manage your current tasks
              </p>
            </div>

            <span className="task-count">
              {totalTasks}
            </span>

          </div>

          {loading ? (

            <div className="dashboard-loading">
              Loading tasks...
            </div>

          ) : tasks.length === 0 ? (

            <div className="empty-recent-tasks">

              <div className="empty-icon">
                +
              </div>

              <h4>
                No tasks found
              </h4>

              <p>
                Add a task to start
                managing your work.
              </p>

            </div>

          ) : (

            <div className="all-task-list">

              {tasks.map((task) => (

                <div
                  className="task-row"
                  key={task._id}
                >

                  <div className="task-row-main">

                    <div
                      className={`task-status-dot ${
                        task.status
                      }`}
                    />

                    <div>
                      <h4>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p>
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <small>
                          Due:{" "}
                          {new Date(
                            task.dueDate
                          ).toLocaleDateString()}
                        </small>
                      )}
                    </div>

                  </div>

                  <div className="task-row-actions">

                    <span
                      className={`task-status-badge ${
                        task.status
                      }`}
                    >
                      {formatStatus(
                        task.status
                      )}
                    </span>

                    <span
                      className={`task-priority-badge ${
                        task.priority ||
                        "medium"
                      }`}
                    >
                      {formatPriority(
                        task.priority
                      )}
                    </span>

                    <button
                      className="edit-task-button"
                      onClick={() =>
                        startEditTask(task)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-task-button"
                      onClick={() =>
                        handleDeleteTask(
                          task._id
                        )
                      }
                      disabled={
                        deletingTask ===
                        task._id
                      }
                    >
                      {deletingTask === task._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default Dashboard;