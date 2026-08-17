import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "./Tasks.css";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [submitting, setSubmitting] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);

  const [error, setError] = useState("");

  // =========================
  // FETCH TASKS
  // =========================

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

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // CREATE TASK
  // =========================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await API.post("/tasks", formData);

      const newTask = response.data.task || response.data;

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

  // =========================
  // START EDIT
  // =========================

  const startEdit = (task) => {
    setError("");
    setShowForm(false);

    setEditingTask({
      ...task,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
    });
  };

  // =========================
  // EDIT FORM CHANGE
  // =========================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingTask((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // UPDATE TASK
  // =========================

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
          description: editingTask.description || "",
          status: editingTask.status,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate || null,
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

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (taskId) => {
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

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      task.title?.toLowerCase().includes(searchValue) ||
      task.description
        ?.toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  // =========================
  // RENDER
  // =========================

  return (
    <>
      <Navbar />

      <div className="tasks-page">

        {/* HEADER */}

        <div className="tasks-header">
          <div>
            <h1>My Tasks</h1>

            <p>
              Create, organize and manage your tasks.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() => {
              setShowForm((previous) => !previous);
              setEditingTask(null);
              setError("");
            }}
          >
            {showForm ? "Cancel" : "+ Create Task"}
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="tasks-error">
            {error}
          </div>
        )}

        {/* CREATE FORM */}

        {showForm && (
          <form
            className="task-form"
            onSubmit={handleCreateTask}
          >
            <h2>Create New Task</h2>

            <div className="form-group">
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                placeholder="Describe your task..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="task-form-row">

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
                  <option value="low">Low</option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">High</option>
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

            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Creating..."
                : "Create Task"}
            </button>
          </form>
        )}

        {/* EDIT FORM */}

        {editingTask && (
          <form
            className="task-form edit-form"
            onSubmit={handleUpdateTask}
          >
            <div className="edit-form-header">
              <div>
                <h2>Edit Task</h2>

                <p>
                  Update your task details.
                </p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setEditingTask(null)}
              >
                ×
              </button>
            </div>

            <div className="form-group">
              <label>Task Title</label>

              <input
                type="text"
                name="title"
                value={editingTask.title || ""}
                onChange={handleEditChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                rows="4"
                value={editingTask.description || ""}
                onChange={handleEditChange}
              />
            </div>

            <div className="task-form-row">

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={editingTask.status || "todo"}
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
                    editingTask.priority || "medium"
                  }
                  onChange={handleEditChange}
                >
                  <option value="low">Low</option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>

                <input
                  type="date"
                  name="dueDate"
                  value={editingTask.dueDate || ""}
                  onChange={handleEditChange}
                />
              </div>
            </div>

            <div className="edit-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          </form>
        )}

        {/* FILTERS */}

        <div className="task-filters">

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

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

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value)
            }
          >
            <option value="all">
              All Priorities
            </option>

            <option value="low">Low</option>

            <option value="medium">
              Medium
            </option>

            <option value="high">High</option>
          </select>

        </div>

        {/* TASK COUNT */}

        {!loading && (
          <div className="task-count">
            Showing{" "}
            <strong>{filteredTasks.length}</strong>{" "}
            of{" "}
            <strong>{tasks.length}</strong>{" "}
            tasks
          </div>
        )}

        {/* TASK LIST */}

        {loading ? (
          <div className="tasks-empty">
            <p>Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="tasks-empty">

            <div className="empty-task-icon">
              ✓
            </div>

            <h3>No tasks found</h3>

            <p>
              Try changing your search or filters,
              or create a new task.
            </p>

          </div>
        ) : (
          <div className="tasks-grid">

            {filteredTasks.map((task) => (
              <div
                className="task-item"
                key={task._id}
              >

                <div className="task-item-header">

                  <h3>{task.title}</h3>

                  <span
                    className={`priority-badge ${task.priority}`}
                  >
                    {task.priority}
                  </span>

                </div>

                <p className="task-description">
                  {task.description ||
                    "No description provided."}
                </p>

                <div className="task-item-footer">

                  <span
                    className={`status-badge ${task.status}`}
                  >
                    {task.status === "in-progress"
                      ? "In Progress"
                      : task.status === "todo"
                      ? "To Do"
                      : "Completed"}
                  </span>

                  {task.dueDate && (
                    <span className="task-due-date">
                      Due:{" "}
                      {new Date(
                        task.dueDate
                      ).toLocaleDateString()}
                    </span>
                  )}

                </div>

                <div className="task-item-actions">

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => startEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(task._id)
                    }
                    disabled={
                      deletingTask === task._id
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

      </div>
    </>
  );
};

export default Tasks;