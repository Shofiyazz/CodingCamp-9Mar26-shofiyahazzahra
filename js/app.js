// Productivity Dashboard Application

// ============================================
// Local Storage Manager
// ============================================

/**
 * Checks if localStorage is available and functional
 * @returns {boolean} True if localStorage is available, false otherwise
 */
function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Saves data to localStorage with JSON serialization
 * @param {string} key - The storage key
 * @param {*} data - The data to save (will be JSON serialized)
 */
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
}

/**
 * Loads data from localStorage with error handling for corrupted data
 * @param {string} key - The storage key
 * @returns {Array} The parsed data or empty array if not found/corrupted
 */
function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Failed to parse ${key}:`, e);
    localStorage.removeItem(key);
    return [];
  }
}

/**
 * Removes an item from localStorage
 * @param {string} key - The storage key to remove
 */
function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove ${key}:`, e);
  }
}

/**
 * Saves tasks array to localStorage
 * @param {Array} tasks - The tasks array to save
 */
function saveTasks(tasks) {
  saveToStorage('productivity_tasks', tasks);
}

/**
 * Loads tasks array from localStorage
 * @returns {Array} The tasks array or empty array if not found
 */
function loadTasks() {
  return loadFromStorage('productivity_tasks');
}

/**
 * Saves links array to localStorage
 * @param {Array} links - The links array to save
 */
function saveLinks(links) {
  saveToStorage('productivity_links', links);
}

/**
 * Loads links array from localStorage
 * @returns {Array} The links array or empty array if not found
 */
function loadLinks() {
  return loadFromStorage('productivity_links');
}

/**
 * Saves theme preference to localStorage
 * @param {string} theme - The theme to save ('light' or 'dark')
 */
function saveThemePreference(theme) {
  saveToStorage('productivity_theme', theme);
}

/**
 * Loads theme preference from localStorage
 * @returns {string} The theme preference ('light' or 'dark'), defaults to 'light'
 */
function loadThemePreference() {
  try {
    const theme = localStorage.getItem('productivity_theme');
    if (theme) {
      const parsed = JSON.parse(theme);
      // Validate theme value
      if (parsed === 'light' || parsed === 'dark') {
        return parsed;
      } else {
        console.warn('Invalid theme preference in storage, defaulting to light');
        saveThemePreference('light');
        return 'light';
      }
    }
    return 'light';
  } catch (e) {
    console.error('Failed to load theme preference:', e);
    return 'light';
  }
}

/**
 * Saves timer duration preference to localStorage
 * @param {number} minutes - The duration in minutes to save
 */
function saveDurationPreference(minutes) {
  saveToStorage('productivity_timer_duration', minutes);
}

/**
 * Loads timer duration preference from localStorage
 * @returns {number} The duration preference in minutes, defaults to 25
 */
function loadDurationPreference() {
  try {
    const duration = localStorage.getItem('productivity_timer_duration');
    if (duration) {
      const parsed = JSON.parse(duration);
      // Validate duration value
      const validDurations = [1, 5, 10, 15, 20, 25, 30, 45, 60];
      if (validDurations.includes(parsed)) {
        return parsed;
      } else {
        console.warn('Invalid duration preference in storage, defaulting to 25');
        saveDurationPreference(25);
        return 25;
      }
    }
    return 25;
  } catch (e) {
    console.error('Failed to load duration preference:', e);
    return 25;
  }
}


// ============================================
// Time Greeting Component
// ============================================

/**
 * Formats a date object to 12-hour time format with AM/PM
 * @param {Date} date - The date object to format
 * @returns {string} Time in format "h:mm AM/PM" (e.g., "3:45 PM")
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  // Pad minutes with leading zero
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Formats a date object to a readable date string
 * @param {Date} date - The date object to format
 * @returns {string} Date in format "Day, Month Date, Year" (e.g., "Monday, January 15, 2024")
 */
function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Returns contextual greeting based on hour of day
 * @param {number} hour - Hour in 24-hour format (0-23)
 * @returns {string} Greeting message
 */
function getGreeting(hour) {
  if (hour >= 5 && hour <= 11) {
    return 'Good morning';
  } else if (hour >= 12 && hour <= 16) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour <= 20) {
    return 'Good evening';
  } else {
    return 'Good night';
  }
}

// DOM references for time greeting
let greetingDisplay = null;
let timeDisplay = null;
let dateDisplay = null;
let timeIntervalId = null;

/**
 * Updates the time, date, and greeting displays
 */
function updateTimeDisplay() {
  const now = new Date();
  
  if (timeDisplay) {
    timeDisplay.textContent = formatTime(now);
  }
  
  if (dateDisplay) {
    dateDisplay.textContent = formatDate(now);
  }
  
  if (greetingDisplay) {
    greetingDisplay.textContent = getGreeting(now.getHours());
  }
}

/**
 * Initializes the time greeting component
 * Sets up DOM references and starts the update interval
 */
function initTimeGreeting() {
  greetingDisplay = document.getElementById('greeting-display');
  timeDisplay = document.getElementById('time-display');
  dateDisplay = document.getElementById('date-display');
  
  // Initial update
  updateTimeDisplay();
  
  // Update every second
  timeIntervalId = setInterval(updateTimeDisplay, 1000);
}


// ============================================
// Focus Timer Component
// ============================================

// Timer state
const timerState = {
  totalSeconds: 1500,      // 25 minutes
  remainingSeconds: 1500,
  isRunning: false,
  intervalId: null,
  customDuration: 25       // Duration in minutes
};

/**
 * Formats seconds to MM:SS display format
 * @param {number} seconds - Number of seconds to format
 * @returns {string} Time in format "MM:SS" (e.g., "25:00", "03:45")
 */
function formatTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  // Pad with leading zeros
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const secsStr = secs < 10 ? '0' + secs : secs;
  
  return `${minutesStr}:${secsStr}`;
}

// DOM references for timer
let timerDisplay = null;
let timerStartBtn = null;
let timerStopBtn = null;
let timerResetBtn = null;
let timerDurationSelect = null;

/**
 * Updates the timer display with current remaining time
 */
function updateTimerDisplay() {
  if (timerDisplay) {
    timerDisplay.textContent = formatTimerDisplay(timerState.remainingSeconds);
  }
}

/**
 * Notifies user when timer completes
 */
function notifyTimerComplete() {
  alert('Focus session complete!');
}

/**
 * Starts the timer countdown
 */
function startTimer() {
  // Don't start if already running
  if (timerState.isRunning) {
    return;
  }
  
  timerState.isRunning = true;
  
  // Disable duration control while running
  if (timerDurationSelect) {
    timerDurationSelect.disabled = true;
  }
  
  timerState.intervalId = setInterval(() => {
    if (timerState.remainingSeconds > 0) {
      timerState.remainingSeconds--;
      updateTimerDisplay();
    } else {
      // Timer reached 00:00
      stopTimer();
      notifyTimerComplete();
      // Re-enable duration control
      if (timerDurationSelect) {
        timerDurationSelect.disabled = false;
      }
    }
  }, 1000);
}

/**
 * Stops/pauses the timer countdown
 */
function stopTimer() {
  if (timerState.intervalId !== null) {
    clearInterval(timerState.intervalId);
    timerState.intervalId = null;
  }
  timerState.isRunning = false;
  
  // Re-enable duration control
  if (timerDurationSelect) {
    timerDurationSelect.disabled = false;
  }
}

/**
 * Resets the timer to initial state (custom duration)
 */
function resetTimer() {
  stopTimer();
  timerState.remainingSeconds = timerState.customDuration * 60;
  timerState.totalSeconds = timerState.customDuration * 60;
  updateTimerDisplay();
}

/**
 * Sets the timer duration to a custom value
 * @param {number} minutes - The duration in minutes
 * @returns {boolean} True if successful, false if invalid duration
 */
function setTimerDuration(minutes) {
  // Validate duration
  const validDurations = [1, 5, 10, 15, 20, 25, 30, 45, 60];
  if (!validDurations.includes(minutes)) {
    return false;
  }
  
  // Update custom duration
  timerState.customDuration = minutes;
  timerState.totalSeconds = minutes * 60;
  timerState.remainingSeconds = minutes * 60;
  
  // Save preference
  saveDurationPreference(minutes);
  
  // Update display
  updateTimerDisplay();
  
  return true;
}

/**
 * Initializes the focus timer component
 * Sets up DOM references and event listeners
 */
function initFocusTimer() {
  timerDisplay = document.getElementById('timer-display');
  timerStartBtn = document.getElementById('timer-start');
  timerStopBtn = document.getElementById('timer-stop');
  timerResetBtn = document.getElementById('timer-reset');
  timerDurationSelect = document.getElementById('timer-duration');
  
  // Load saved duration preference
  const savedDuration = loadDurationPreference();
  timerState.customDuration = savedDuration;
  timerState.totalSeconds = savedDuration * 60;
  timerState.remainingSeconds = savedDuration * 60;
  
  // Set up event listeners
  if (timerStartBtn) {
    timerStartBtn.addEventListener('click', startTimer);
  }
  
  if (timerStopBtn) {
    timerStopBtn.addEventListener('click', stopTimer);
  }
  
  if (timerResetBtn) {
    timerResetBtn.addEventListener('click', resetTimer);
  }
  
  // Set up duration control
  if (timerDurationSelect) {
    timerDurationSelect.value = savedDuration;
    timerDurationSelect.addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value, 10);
      setTimerDuration(minutes);
    });
  }
  
  // Initial display update
  updateTimerDisplay();
}


// ============================================
// Task List Component - Data Layer
// ============================================

// Tasks state
let tasks = [];
let sortOrder = 'date-oldest'; // Default sort order

/**
 * Generates a unique task ID using timestamp + random component
 * @returns {string} Unique task ID
 */
function generateTaskId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Validates task text
 * @param {string} text - The task text to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateTaskText(text) {
  // Check if text is a string
  if (typeof text !== 'string') {
    return false;
  }
  
  // Trim and check if empty or whitespace-only
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return false;
  }
  
  // Check max length (500 characters)
  if (trimmed.length > 500) {
    return false;
  }
  
  return true;
}

/**
 * Adds a new task
 * @param {string} text - The task text
 * @returns {Object|null} The created task object or null if validation fails
 */
function addTask(text) {
  // Validate text
  if (!validateTaskText(text)) {
    return null;
  }
  
  // Create new task
  const task = {
    id: generateTaskId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  };
  
  // Add to tasks array
  tasks.push(task);
  
  // Sync with storage
  saveTasks(tasks);
  
  return task;
}

/**
 * Edits an existing task's text
 * @param {string} id - The task ID
 * @param {string} newText - The new task text
 * @returns {boolean} True if successful, false otherwise
 */
function editTask(id, newText) {
  // Validate new text
  if (!validateTaskText(newText)) {
    return false;
  }
  
  // Find task by ID
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return false;
  }
  
  // Update text
  task.text = newText.trim();
  
  // Sync with storage
  saveTasks(tasks);
  
  return true;
}

/**
 * Toggles a task's completion status
 * @param {string} id - The task ID
 * @returns {boolean} True if successful, false otherwise
 */
function toggleTaskComplete(id) {
  // Find task by ID
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return false;
  }
  
  // Toggle completion status
  task.completed = !task.completed;
  
  // Sync with storage
  saveTasks(tasks);
  
  return true;
}

/**
 * Deletes a task
 * @param {string} id - The task ID
 * @returns {boolean} True if successful, false otherwise
 */
function deleteTask(id) {
  // Find task index
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return false;
  }
  
  // Remove from array
  tasks.splice(index, 1);
  
  // Sync with storage
  saveTasks(tasks);
  
  return true;
}

/**
 * Sorts tasks based on the specified order
 * @param {Array} tasksArray - The tasks array to sort
 * @param {string} order - The sort order ('status', 'date-newest', 'date-oldest', 'alphabetical')
 * @returns {Array} A sorted copy of the tasks array
 */
function sortTasks(tasksArray, order) {
  // Create a copy to avoid mutating the original array
  const sortedTasks = [...tasksArray];
  
  switch (order) {
    case 'status':
      // Active tasks (completed: false) before completed tasks (completed: true)
      sortedTasks.sort((a, b) => {
        if (a.completed === b.completed) {
          return 0;
        }
        return a.completed ? 1 : -1;
      });
      break;
      
    case 'date-newest':
      // Most recent createdAt timestamp first
      sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
      break;
      
    case 'date-oldest':
      // Oldest createdAt timestamp first
      sortedTasks.sort((a, b) => a.createdAt - b.createdAt);
      break;
      
    case 'alphabetical':
      // Case-insensitive alphabetical order by task text
      sortedTasks.sort((a, b) => {
        const textA = a.text.toLowerCase();
        const textB = b.text.toLowerCase();
        if (textA < textB) return -1;
        if (textA > textB) return 1;
        return 0;
      });
      break;
      
    default:
      // If invalid order, return copy without sorting
      break;
  }
  
  return sortedTasks;
}

/**
 * Sets the sort order for tasks
 * @param {string} order - The sort order ('status', 'date-newest', 'date-oldest', 'alphabetical')
 * @returns {boolean} True if successful, false if invalid order
 */
function setSortOrder(order) {
  // Validate order
  const validOrders = ['status', 'date-newest', 'date-oldest', 'alphabetical'];
  if (!validOrders.includes(order)) {
    return false;
  }
  
  // Update sort order
  sortOrder = order;
  
  // Re-render tasks with new sort order
  renderTasks();
  
  return true;
}


// ============================================
// Task List Component - UI Layer
// ============================================

// DOM references for task list
let taskInput = null;
let taskAddBtn = null;
let taskListContainer = null;

/**
 * Renders all tasks to the DOM
 * Handles empty state message and completion styling
 */
function renderTasks() {
  if (!taskListContainer) {
    return;
  }
  
  // Clear current list
  taskListContainer.innerHTML = '';
  
  // Handle empty state
  if (tasks.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No tasks yet. Add one to get started!';
    taskListContainer.appendChild(emptyMessage);
    return;
  }
  
  // Sort tasks before rendering
  const sortedTasks = sortTasks(tasks, sortOrder);
  
  // Use DocumentFragment for batched DOM updates
  const fragment = document.createDocumentFragment();
  
  // Render each task
  sortedTasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    if (task.completed) {
      taskItem.classList.add('completed');
    }
    taskItem.dataset.taskId = task.id;
    
    // Create checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    
    // Create task text
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-delete';
    deleteBtn.textContent = 'Delete';
    
    // Append elements to task item
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);
    
    // Append to fragment instead of directly to DOM
    fragment.appendChild(taskItem);
  });
  
  // Single DOM update
  taskListContainer.appendChild(fragment);
}

/**
 * Displays an error message for task input
 * @param {string} message - The error message to display
 */
function showTaskError(message) {
  // Remove existing error if present
  const existingError = document.querySelector('.task-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'task-error error-message';
  errorDiv.textContent = message;
  
  // Insert after task input container
  const inputContainer = document.querySelector('.task-input-container');
  if (inputContainer && inputContainer.parentNode) {
    inputContainer.parentNode.insertBefore(errorDiv, inputContainer.nextSibling);
  }
}

/**
 * Clears any displayed task error messages
 */
function clearTaskError() {
  const existingError = document.querySelector('.task-error');
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Handles adding a new task from user input
 */
function handleAddTask() {
  if (!taskInput) {
    return;
  }
  
  const text = taskInput.value;
  
  // Clear any previous errors
  clearTaskError();
  
  // Attempt to add task
  const task = addTask(text);
  
  if (task) {
    // Success - clear input and re-render
    taskInput.value = '';
    renderTasks();
  } else {
    // Validation failed - show error
    showTaskError('Please enter a valid task (cannot be empty or whitespace only)');
  }
}

/**
 * Handles task checkbox toggle
 * @param {string} taskId - The task ID to toggle
 */
function handleToggleTask(taskId) {
  const success = toggleTaskComplete(taskId);
  if (success) {
    renderTasks();
  }
}

/**
 * Handles task deletion
 * @param {string} taskId - The task ID to delete
 */
function handleDeleteTask(taskId) {
  const success = deleteTask(taskId);
  if (success) {
    renderTasks();
  }
}

/**
 * Handles inline editing of task text
 * @param {string} taskId - The task ID to edit
 * @param {HTMLElement} textElement - The text element being edited
 */
function handleEditTask(taskId, textElement) {
  const currentText = textElement.textContent;
  
  // Create input element
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'task-edit-input';
  input.value = currentText;
  
  // Replace text with input
  textElement.replaceWith(input);
  input.focus();
  input.select();
  
  // Handle save on blur or enter
  const saveEdit = () => {
    const newText = input.value;
    
    // Clear any previous errors
    clearTaskError();
    
    const success = editTask(taskId, newText);
    
    if (success) {
      // Success - re-render
      renderTasks();
    } else {
      // Validation failed - show error and re-render (restores original)
      showTaskError('Please enter a valid task (cannot be empty or whitespace only)');
      renderTasks();
    }
  };
  
  input.addEventListener('blur', saveEdit);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    }
  });
  
  // Handle escape to cancel
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      renderTasks(); // Restore without saving
    }
  });
}

/**
 * Initializes the task list component
 * Loads tasks from storage and sets up event listeners
 */
function initTaskList() {
  // Get DOM references
  taskInput = document.getElementById('task-input');
  taskAddBtn = document.getElementById('task-add-btn');
  taskListContainer = document.getElementById('task-list');
  const taskSortSelect = document.getElementById('task-sort');
  
  // Load tasks from storage
  tasks = loadTasks();
  
  // Apply default sort order
  sortOrder = 'date-oldest';
  
  // Set sort select to default value
  if (taskSortSelect) {
    taskSortSelect.value = sortOrder;
  }
  
  // Initial render
  renderTasks();
  
  // Set up add button listener
  if (taskAddBtn) {
    taskAddBtn.addEventListener('click', handleAddTask);
  }
  
  // Set up enter key on input
  if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddTask();
      }
    });
    
    // Clear error on input
    taskInput.addEventListener('input', clearTaskError);
  }
  
  // Set up sort control listener
  if (taskSortSelect) {
    taskSortSelect.addEventListener('change', (e) => {
      setSortOrder(e.target.value);
    });
  }
  
  // Set up event delegation for task list interactions
  if (taskListContainer) {
    taskListContainer.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) {
        return;
      }
      
      const taskId = taskItem.dataset.taskId;
      
      // Handle checkbox click
      if (e.target.classList.contains('task-checkbox')) {
        handleToggleTask(taskId);
      }
      
      // Handle delete button click
      if (e.target.classList.contains('task-delete')) {
        handleDeleteTask(taskId);
      }
      
      // Handle task text click for editing
      if (e.target.classList.contains('task-text')) {
        handleEditTask(taskId, e.target);
      }
    });
  }
}


// ============================================
// Quick Links Component - UI Layer
// ============================================

// DOM references for quick links
let linkNameInput = null;
let linkUrlInput = null;
let linkAddBtn = null;
let linkListContainer = null;

/**
 * Renders all links to the DOM
 * Handles empty state message and clickable link names
 */
function renderLinks() {
  if (!linkListContainer) {
    return;
  }
  
  // Clear current list
  linkListContainer.innerHTML = '';
  
  // Handle empty state
  if (links.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.className = 'empty-message';
    emptyMessage.textContent = 'No links yet. Add one to get started!';
    linkListContainer.appendChild(emptyMessage);
    return;
  }
  
  // Use DocumentFragment for batched DOM updates
  const fragment = document.createDocumentFragment();
  
  // Render each link
  links.forEach(link => {
    const linkItem = document.createElement('li');
    linkItem.className = 'link-item';
    linkItem.dataset.linkId = link.id;
    
    // Create clickable link name
    const linkName = document.createElement('span');
    linkName.className = 'link-name';
    linkName.textContent = link.name;
    linkName.style.cursor = 'pointer';
    
    // Create delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'link-delete';
    deleteBtn.textContent = 'Delete';
    
    // Append elements to link item
    linkItem.appendChild(linkName);
    linkItem.appendChild(deleteBtn);
    
    // Append to fragment instead of directly to DOM
    fragment.appendChild(linkItem);
  });
  
  // Single DOM update
  linkListContainer.appendChild(fragment);
}

/**
 * Displays an error message for link input
 * @param {string} message - The error message to display
 */
function showLinkError(message) {
  // Remove existing error if present
  const existingError = document.querySelector('.link-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Create error element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'link-error error-message';
  errorDiv.textContent = message;
  
  // Insert after link input container
  const inputContainer = document.querySelector('.link-input-container');
  if (inputContainer && inputContainer.parentNode) {
    inputContainer.parentNode.insertBefore(errorDiv, inputContainer.nextSibling);
  }
}

/**
 * Clears any displayed link error messages
 */
function clearLinkError() {
  const existingError = document.querySelector('.link-error');
  if (existingError) {
    existingError.remove();
  }
}

/**
 * Handles adding a new link from user input
 */
function handleAddLink() {
  if (!linkNameInput || !linkUrlInput) {
    return;
  }
  
  const name = linkNameInput.value;
  const url = linkUrlInput.value;
  
  // Clear any previous errors
  clearLinkError();
  
  // Attempt to add link
  const link = addLink(name, url);
  
  if (link) {
    // Success - clear inputs and re-render
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderLinks();
  } else {
    // Validation failed - show error
    if (!validateLinkName(name)) {
      showLinkError('Please enter a valid link name (cannot be empty)');
    } else if (!validateUrl(url)) {
      showLinkError('Please enter a valid URL (e.g., https://example.com)');
    }
  }
}

/**
 * Handles link click to open URL
 * @param {string} linkId - The link ID to open
 */
function handleOpenLink(linkId) {
  const link = links.find(l => l.id === linkId);
  if (link) {
    openLink(link.url);
  }
}

/**
 * Handles link deletion
 * @param {string} linkId - The link ID to delete
 */
function handleDeleteLink(linkId) {
  const success = deleteLink(linkId);
  if (success) {
    renderLinks();
  }
}

/**
 * Initializes the quick links component
 * Loads links from storage and sets up event listeners
 */
function initQuickLinks() {
  // Get DOM references
  linkNameInput = document.getElementById('link-name-input');
  linkUrlInput = document.getElementById('link-url-input');
  linkAddBtn = document.getElementById('link-add-btn');
  linkListContainer = document.getElementById('link-list');
  
  // Load links from storage
  links = loadLinks();
  
  // Initial render
  renderLinks();
  
  // Set up add button listener
  if (linkAddBtn) {
    linkAddBtn.addEventListener('click', handleAddLink);
  }
  
  // Set up enter key on inputs
  if (linkNameInput) {
    linkNameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddLink();
      }
    });
    
    // Clear error on input
    linkNameInput.addEventListener('input', clearLinkError);
  }
  
  if (linkUrlInput) {
    linkUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAddLink();
      }
    });
    
    // Clear error on input
    linkUrlInput.addEventListener('input', clearLinkError);
  }
  
  // Set up event delegation for link list interactions
  if (linkListContainer) {
    linkListContainer.addEventListener('click', (e) => {
      const linkItem = e.target.closest('.link-item');
      if (!linkItem) {
        return;
      }
      
      const linkId = linkItem.dataset.linkId;
      
      // Handle link name click to open URL
      if (e.target.classList.contains('link-name')) {
        handleOpenLink(linkId);
      }
      
      // Handle delete button click
      if (e.target.classList.contains('link-delete')) {
        handleDeleteLink(linkId);
      }
    });
  }
}


// ============================================
// Theme Settings Component
// ============================================

// Theme state
const themeState = {
  currentTheme: 'light'
};

/**
 * Applies theme by adding/removing CSS classes on body element
 * @param {string} theme - The theme to apply ('light' or 'dark')
 */
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.remove('theme-light');
    document.body.classList.add('theme-dark');
  } else {
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
  }
  
  // Update theme toggle icon
  updateThemeIcon(theme);
}

/**
 * Updates the theme toggle button icon
 * @param {string} theme - The current theme ('light' or 'dark')
 */
function updateThemeIcon(theme) {
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Sets theme and saves preference
 * @param {string} theme - The theme to set ('light' or 'dark')
 */
function setTheme(theme) {
  // Validate theme
  if (theme !== 'light' && theme !== 'dark') {
    console.warn('Invalid theme value, defaulting to light');
    theme = 'light';
  }
  
  themeState.currentTheme = theme;
  applyTheme(theme);
  saveThemePreference(theme);
}

/**
 * Toggles between light and dark themes
 */
function toggleTheme() {
  const newTheme = themeState.currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

// DOM references for theme settings
let themeToggleBtn = null;

/**
 * Initializes the theme settings component
 * Loads saved theme and sets up event listeners
 */
function initThemeSettings() {
  // Get DOM reference
  themeToggleBtn = document.getElementById('theme-toggle');
  
  // Load saved theme preference
  const savedTheme = loadThemePreference();
  themeState.currentTheme = savedTheme;
  
  // Apply theme immediately to prevent flash
  applyTheme(savedTheme);
  
  // Set up event listener for toggle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
}


// ============================================
// Application Initialization
// ============================================

/**
 * Main initialization function
 * Checks storage availability and initializes all components
 */
function init() {
  // Check if localStorage is available
  const storageAvailable = isStorageAvailable();
  
  // Display warning if storage is unavailable
  if (!storageAvailable) {
    displayStorageWarning();
  }
  
  // Initialize theme first to prevent flash
  initThemeSettings();
  
  // Initialize all other components in order
  initTimeGreeting();
  initFocusTimer();
  initTaskList();
  initQuickLinks();
}

/**
 * Displays a warning message when localStorage is unavailable
 */
function displayStorageWarning() {
  // Create warning element
  const warning = document.createElement('div');
  warning.className = 'storage-warning';
  warning.textContent = 'Local storage is unavailable. Your data will not be saved.';
  warning.style.cssText = 'background-color: #fff3cd; color: #856404; padding: 12px; text-align: center; border-bottom: 1px solid #ffeaa7; font-weight: 500;';
  
  // Insert at the top of the body
  document.body.insertBefore(warning, document.body.firstChild);
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', init);


// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    isStorageAvailable,
    saveToStorage,
    loadFromStorage,
    removeFromStorage,
    saveTasks,
    loadTasks,
    saveLinks,
    loadLinks,
    saveThemePreference,
    loadThemePreference,
    saveDurationPreference,
    loadDurationPreference,
    formatTime,
    formatDate,
    getGreeting,
    updateTimeDisplay,
    initTimeGreeting,
    formatTimerDisplay,
    startTimer,
    stopTimer,
    resetTimer,
    setTimerDuration,
    updateTimerDisplay,
    notifyTimerComplete,
    initFocusTimer,
    timerState,
    generateTaskId,
    validateTaskText,
    addTask,
    editTask,
    toggleTaskComplete,
    deleteTask,
    sortTasks,
    setSortOrder,
    sortOrder,
    tasks,
    renderTasks,
    initTaskList,
    generateLinkId,
    validateUrl,
    validateLinkName,
    addLink,
    deleteLink,
    openLink,
    links,
    renderLinks,
    initQuickLinks,
    themeState,
    applyTheme,
    setTheme,
    toggleTheme,
    updateThemeIcon,
    initThemeSettings,
    init,
    displayStorageWarning
  };
}


// ============================================
// Quick Links Component - Data Layer
// ============================================

// Links state
let links = [];

/**
 * Generates a unique link ID using timestamp + random component
 * @returns {string} Unique link ID
 */
function generateLinkId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Validates URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateUrl(url) {
  // Check if url is a string
  if (typeof url !== 'string') {
    return false;
  }
  
  // Trim and check if empty
  const trimmed = url.trim();
  if (trimmed.length === 0) {
    return false;
  }
  
  // Validate URL format using URL constructor
  try {
    const urlObj = new URL(trimmed);
    // Ensure it starts with http:// or https://
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * Validates link name
 * @param {string} name - The link name to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateLinkName(name) {
  // Check if name is a string
  if (typeof name !== 'string') {
    return false;
  }
  
  // Trim and check if empty or whitespace-only
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return false;
  }
  
  // Check max length (100 characters)
  if (trimmed.length > 100) {
    return false;
  }
  
  return true;
}

/**
 * Adds a new link
 * @param {string} name - The link name
 * @param {string} url - The link URL
 * @returns {Object|null} The created link object or null if validation fails
 */
function addLink(name, url) {
  // Validate name and url
  if (!validateLinkName(name) || !validateUrl(url)) {
    return null;
  }
  
  // Create new link
  const link = {
    id: generateLinkId(),
    name: name.trim(),
    url: url.trim(),
    createdAt: Date.now()
  };
  
  // Add to links array
  links.push(link);
  
  // Sync with storage
  saveLinks(links);
  
  return link;
}

/**
 * Deletes a link
 * @param {string} id - The link ID
 * @returns {boolean} True if successful, false otherwise
 */
function deleteLink(id) {
  // Find link index
  const index = links.findIndex(l => l.id === id);
  if (index === -1) {
    return false;
  }
  
  // Remove from array
  links.splice(index, 1);
  
  // Sync with storage
  saveLinks(links);
  
  return true;
}

/**
 * Opens a link in a new tab
 * @param {string} url - The URL to open
 */
function openLink(url) {
  window.open(url, '_blank');
}
