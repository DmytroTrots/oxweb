import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";
import AddTaskForm from "./forms/AddTaskForm";
import EditTaskForm from "./forms/EditTaskForm";

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const auth = useAuth();
  const user = auth.getUser();
  const client = auth.getClient();

  const fetchTaskData = async () => {
    try {
      const taskData = await api.getTasksByClientId(user, client.id);
      setTasks(taskData?.data);
    } catch (err) {
      setError("Failed to fetch tasks data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);


  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setShowAddTaskForm(false);
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowAddTaskForm(true);
  };

  const handleTaskAdded  = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowAddTaskForm(false);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.deleteTaskById(user, taskId);
      setTasks((prevTasks) =>
                          prevTasks.filter((task) => task.id !== taskId)
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTask) =>
                        prevTask.map((task) =>
                                                 task.id === updatedTask.id ? updatedTask : task
                        )
    );
    setSelectedTask(null);
  };

  return (
          tasks &&
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div>
              <h2>Tasks</h2>
              <button onClick={handleAddTask} style={{ marginBottom: "10px" }}>
                Add Task
              </button>
              <table
                      border="1"
                      cellPadding="10"
                      style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                <tr>
                  <th>Task Description</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                        <tr key={task.id}>
                          <td
                                  style={{ cursor: "pointer", color: "blue" }}
                                  onClick={() => handleUpdateTask(task)}
                          >
                            {task.description}
                          </td>
                          <td>
                            <button onClick={() => handleDeleteTask(task.id)}>
                              Delete
                            </button>
                          </td>
                        </tr>
                ))}
                </tbody>
              </table>
            </div>

            {selectedTask && (
                    <div
                            style={{
                              border: "1px solid #ccc",
                              padding: "20px",
                              marginRight: "20px",
                              width: "300px",
                              backgroundColor: "#f9f9f9",
                            }}
                    >
                      <EditTaskForm selectedTask={selectedTask}
                                       onUpdate={handleTaskUpdate}
                                       onClose={() => setSelectedTask(null)}
                      />
                    </div>
            )}

            {showAddTaskForm && (
                    <div
                            style={{
                              border: "1px solid #ccc",
                              padding: "20px",
                              marginRight: "20px",
                              width: "300px",
                              backgroundColor: "#f9f9f9",
                            }}
                    >
                      <AddTaskForm onAdd={handleTaskAdded} />
                    </div>
            )}
          </div>
  );
};

export default TasksTable;