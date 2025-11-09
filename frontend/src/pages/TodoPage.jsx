import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { 
  Home, 
  CheckSquare, 
  Heart, 
  Calendar, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Star,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { comman } from './en/comman';
import { fetchTodos, createTodo as apiCreateTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from '../services/todoService';

export default function TodoPage() {
  const [userName, setUserName] = useState('User');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.name) {
          setUserName(payload.name);
        }
      } catch (error) {
        console.log('Could not decode token, using default name');
      }
    }
    (async () => {
      try {
        const data = await fetchTodos();
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          priority: t.priority || 'medium',
          dueDate: t.dueDate || ''
        })));
      } catch (e) {
        console.error(e);
        toast.error('Failed to load tasks');
      }
    })();
  }, []);

  
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const created = await apiCreateTodo({
        title: newTask.trim(),
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null
      });
      setTasks([...tasks, {
        id: created.id,
        title: created.title,
        completed: created.completed,
        priority: created.priority,
        dueDate: created.dueDate || ''
      }]);
      setNewTask('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      toast.success('Task added successfully!');
    } catch (e) {
      console.error(e);
      toast.error(e.message || 'Failed to add task');
    }
  };

  const toggleTask = async (id) => {
    const current = tasks.find(t => t.id === id);
    if (!current) return;
    const newCompleted = !current.completed;
    try {
      const updated = await apiUpdateTodo(id, { completed: newCompleted });
      setTasks(tasks.map(task => task.id === id ? { ...task, completed: updated.completed } : task));
    } catch (e) {
      console.error(e);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiDeleteTodo(id);
      setTasks(tasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete task');
    }
  };

  const startEditing = (task) => {
    setEditingTask(task);
  };

  const saveEdit = async () => {
    if (!editingTask || !editingTask.title.trim()) return;
    try {
      const updated = await apiUpdateTodo(editingTask.id, {
        title: editingTask.title,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate || null
      });
      setTasks(tasks.map(task => task.id === editingTask.id ? {
        id: updated.id,
        title: updated.title,
        completed: updated.completed,
        priority: updated.priority,
        dueDate: updated.dueDate || ''
      } : task));
      setEditingTask(null);
      toast.success('Task updated successfully!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Navbar userName={userName} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{comman.TodoList}</h1>
          <p className="text-sm sm:text-base text-gray-600">{comman.ManageTasks}, {userName}!</p>
        </div>

        {/* Add New Task */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{comman.AddNewTask}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task title..."
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="low">{comman.LowPriority}</option>
                <option value="medium">{comman.MediumPriority}</option>
                <option value="high">{comman.HighPriority}</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
          <button
            onClick={addTask}
            className="mt-4 w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{comman.AddTask}</span>
          </button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{completedTasks.length}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{comman.TodoList}</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <div className="p-6 text-center">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">{comman.NoTasks}</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 sm:space-x-4 flex-1">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                          task.completed 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {task.completed && <CheckSquare className="w-3 h-3" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        {editingTask?.id === task.id ? (
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                            autoFocus
                          />
                        ) : (
                          <span className={`text-gray-900 text-sm sm:text-base ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </span>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:flex-shrink-0">
                      {editingTask?.id === task.id ? (
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startEditing(task)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
