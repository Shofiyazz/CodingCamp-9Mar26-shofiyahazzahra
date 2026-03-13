# Design Document: Productivity Dashboard

## Overview

The Productivity Dashboard is a client-side web application built with vanilla JavaScript, HTML, and CSS. It provides essential productivity features in a unified interface: a time display with contextual greetings, a customizable focus timer, task management with sorting capabilities, quick link access, and theme customization.

The application follows a component-based architecture where each feature (Time Greeting, Focus Timer, Task List, Quick Links, Theme Settings) operates independently but shares a common data persistence layer through the Browser Local Storage API. The design prioritizes simplicity, performance, and maintainability by avoiding external dependencies and using standard Web APIs.

Recent enhancements include:
- Theme customization with Light/Dark mode toggle and persistence
- Customizable focus timer durations (1-60 minutes) with preference persistence
- Task sorting capabilities (by status, creation date, or alphabetically)

Key design principles:
- Single-page application with no server dependencies
- All data stored client-side using Local Storage
- Vanilla JavaScript for maximum compatibility and minimal overhead
- Component-based organization for maintainability
- Responsive UI updates with immediate visual feedback

## Architecture

### System Architecture

The application uses a layered architecture:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (HTML Structure + CSS Styling)         │
│  (Theme-aware: Light/Dark modes)        │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│         Component Layer                 │
│  ┌──────────┐  ┌──────────┐            │
│  │  Time    │  │  Focus   │            │
│  │ Greeting │  │  Timer   │            │
│  └──────────┘  └──────────┘            │
│                 (Customizable Duration) │
│  ┌──────────┐  ┌──────────┐            │
│  │   Task   │  │  Quick   │            │
│  │   List   │  │  Links   │            │
│  └──────────┘  └──────────┘            │
│  (Sortable)                             │
│  ┌──────────┐                           │
│  │  Theme   │                           │
│  │ Settings │                           │
│  └──────────┘                           │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│      Data Persistence Layer             │
│      (Local Storage Manager)            │
│  - Tasks                                │
│  - Links                                │
│  - Theme Preference                     │
│  - Timer Duration Preference            │
└─────────────────────────────────────────┘
                  ↕
┌─────────────────────────────────────────┐
│      Browser Local Storage API          │
└─────────────────────────────────────────┘
```

### Component Responsibilities

**Time Greeting Component**
- Displays current time in 12-hour format
- Displays current date
- Determines and displays contextual greeting based on time of day
- Updates display every second

**Focus Timer Component**
- Manages customizable countdown timer state (1-60 minutes)
- Handles start, stop, and reset controls
- Persists custom duration preference to Local Storage
- Supports predefined durations: 1, 5, 10, 15, 20, 25, 30, 45, 60 minutes
- Updates display every second while running
- Provides notification when timer completes
- Prevents duration changes while timer is running
- Resets to currently selected custom duration (not always 25 minutes)

**Task List Component**
- Manages task CRUD operations (Create, Read, Update, Delete)
- Handles task completion status toggling
- Provides sorting capabilities (by status, creation date, alphabetically)
- Maintains sort order across task operations
- Validates task input
- Syncs with Local Storage on every change

**Quick Links Component**
- Manages link CRUD operations
- Validates URL format
- Opens links in new tabs
- Syncs with Local Storage on every change

**Local Storage Manager**
- Provides abstraction over Browser Local Storage API
- Handles serialization/deserialization of data
- Manages storage keys for tasks, links, theme preference, and timer duration
- Handles graceful degradation if Local Storage unavailable

**Theme Settings Component**
- Manages theme selection (Light/Dark mode)
- Applies theme-specific CSS classes to the interface
- Persists theme preference to Local Storage
- Loads and applies saved theme on initialization
- Defaults to Light mode when no preference exists

## Components and Interfaces

### Time Greeting Component

**Interface:**
```javascript
// Initialization
initTimeGreeting()

// Internal functions
updateTimeDisplay()      // Updates time, date, and greeting
getGreeting(hour)        // Returns greeting string based on hour
formatTime(date)         // Returns formatted time string
formatDate(date)         // Returns formatted date string
```

**DOM Elements:**
- `#time-display`: Shows current time
- `#date-display`: Shows current date
- `#greeting-display`: Shows contextual greeting

**Behavior:**
- Calls `updateTimeDisplay()` every 1000ms using `setInterval`
- Greeting logic based on 24-hour time:
  - 5-11: "Good morning"
  - 12-16: "Good afternoon"
  - 17-20: "Good evening"
  - 21-4: "Good night"

### Focus Timer Component

**Interface:**
```javascript
// Initialization
initFocusTimer()

// Public functions
startTimer()             // Begins countdown
stopTimer()              // Pauses countdown
resetTimer()             // Resets to currently selected custom duration
setTimerDuration(minutes) // Sets custom duration (1, 5, 10, 15, 20, 25, 30, 45, 60)

// Internal functions
updateTimerDisplay()     // Updates MM:SS display
formatTimerDisplay(seconds)  // Converts seconds to MM:SS
notifyTimerComplete()    // Handles timer completion
saveDurationPreference(minutes) // Saves duration to Local Storage
loadDurationPreference() // Loads duration from Local Storage
```

**State:**
```javascript
{
  customDuration: 25,      // Selected duration in minutes (1-60)
  totalSeconds: 1500,      // customDuration * 60
  remainingSeconds: 1500,
  isRunning: false,
  intervalId: null
}
```

**DOM Elements:**
- `#timer-display`: Shows MM:SS countdown
- `#timer-duration-select`: Dropdown or input for custom duration
- `#timer-start`: Start button
- `#timer-stop`: Stop button
- `#timer-reset`: Reset button

**Behavior:**
- Accepts only predefined duration values: 1, 5, 10, 15, 20, 25, 30, 45, 60 minutes
- When duration is changed, updates `totalSeconds` and `remainingSeconds`
- Saves duration preference to Local Storage under key "productivity_timer_duration"
- Loads duration preference on initialization (defaults to 25 if not found)
- Prevents duration changes while timer is running (disable duration control)
- When started, decrements `remainingSeconds` every 1000ms
- When reaching 0, stops automatically and calls `notifyTimerComplete()`
- Reset button returns timer to `customDuration * 60` seconds (not always 1500)
- Notification can be visual (alert/modal) or audio (optional)

### Task List Component

**Interface:**
```javascript
// Initialization
initTaskList()

// Public functions
addTask(text)            // Creates new task
editTask(id, newText)    // Updates task text
toggleTaskComplete(id)   // Toggles completion status
deleteTask(id)           // Removes task
setSortOrder(order)      // Sets sort order ('status', 'date-newest', 'date-oldest', 'alphabetical')

// Internal functions
renderTasks()            // Re-renders entire task list with current sort order
sortTasks(tasks, order)  // Returns sorted copy of tasks array
validateTaskText(text)   // Returns true if valid
saveTasksToStorage()     // Persists to Local Storage
loadTasksFromStorage()   // Retrieves from Local Storage
generateTaskId()         // Creates unique ID
```

**State:**
```javascript
{
  tasks: [
    {
      id: string,
      text: string,
      completed: boolean,
      createdAt: timestamp
    }
  ],
  sortOrder: 'date-oldest' // Default sort order
}
```

**DOM Elements:**
- `#task-input`: Text input for new tasks
- `#task-add-btn`: Add task button
- `#task-sort-select`: Dropdown for sort order selection
- `#task-list`: Container for task items
- `.task-item`: Individual task element
- `.task-checkbox`: Completion toggle
- `.task-text`: Task text (editable on click)
- `.task-delete`: Delete button

**Behavior:**
- Validates input is not empty or whitespace-only
- Generates unique ID using timestamp + random component
- Stores tasks array in Local Storage under key "productivity_tasks"
- Loads tasks on initialization
- Applies default sort order (date-oldest) on initialization
- Re-renders list after every modification, maintaining current sort order
- Sort orders:
  - `status`: Active tasks (completed: false) before completed tasks (completed: true)
  - `date-newest`: Most recent createdAt timestamp first
  - `date-oldest`: Oldest createdAt timestamp first (default)
  - `alphabetical`: Case-insensitive alphabetical order by task text
- Maintains sort order when tasks are added, edited, completed, or deleted

### Quick Links Component

**Interface:**
```javascript
// Initialization
initQuickLinks()

// Public functions
addLink(name, url)       // Creates new link
deleteLink(id)           // Removes link

// Internal functions
renderLinks()            // Re-renders entire link list
validateUrl(url)         // Returns true if valid URL format
saveLinksToStorage()     // Persists to Local Storage
loadLinksFromStorage()   // Retrieves from Local Storage
generateLinkId()         // Creates unique ID
openLink(url)            // Opens URL in new tab
```

**State:**
```javascript
{
  links: [
    {
      id: string,
      name: string,
      url: string,
      createdAt: timestamp
    }
  ]
}
```

**DOM Elements:**
- `#link-name-input`: Text input for link name
- `#link-url-input`: Text input for URL
- `#link-add-btn`: Add link button
- `#link-list`: Container for link items
- `.link-item`: Individual link element
- `.link-name`: Clickable link name
- `.link-delete`: Delete button

**Behavior:**
- Validates name and URL are not empty
- Validates URL format using regex or URL constructor
- Stores links array in Local Storage under key "productivity_links"
- Opens links using `window.open(url, '_blank')`
- Re-renders list after every modification

### Theme Settings Component

**Interface:**
```javascript
// Initialization
initThemeSettings()

// Public functions
setTheme(theme)          // Sets theme ('light' or 'dark')
toggleTheme()            // Toggles between light and dark

// Internal functions
applyTheme(theme)        // Applies CSS classes for theme
saveThemePreference(theme) // Saves to Local Storage
loadThemePreference()    // Loads from Local Storage
```

**State:**
```javascript
{
  currentTheme: 'light'  // 'light' or 'dark'
}
```

**DOM Elements:**
- `#theme-toggle`: Toggle button or switch for theme selection
- `body` or root element: Receives theme CSS class

**Behavior:**
- Applies theme by adding/removing CSS classes on body element
- Light mode: Adds `theme-light` class (or removes `theme-dark`)
- Dark mode: Adds `theme-dark` class (or removes `theme-light`)
- Saves theme preference to Local Storage under key "productivity_theme"
- Loads theme preference on initialization
- Defaults to 'light' if no preference exists
- Applies loaded theme immediately on page load to prevent flash

### Local Storage Manager

**Interface:**
```javascript
// Generic storage operations
saveToStorage(key, data)     // Serializes and saves
loadFromStorage(key)         // Loads and deserializes
removeFromStorage(key)       // Removes item
isStorageAvailable()         // Checks if Local Storage works

// Specific operations
saveTasks(tasks)             // Saves task array
loadTasks()                  // Loads task array
saveLinks(links)             // Saves link array
loadLinks()                  // Loads link array
saveThemePreference(theme)   // Saves theme ('light' or 'dark')
loadThemePreference()        // Loads theme preference
saveDurationPreference(minutes) // Saves timer duration
loadDurationPreference()     // Loads timer duration
```

**Storage Keys:**
- `productivity_tasks`: Task array
- `productivity_links`: Link array
- `productivity_theme`: Theme preference ('light' or 'dark')
- `productivity_timer_duration`: Timer duration in minutes

**Behavior:**
- Serializes data to JSON before storing
- Deserializes JSON when loading
- Returns empty array if key doesn't exist (for arrays)
- Returns default value if key doesn't exist (for preferences)
- Handles errors gracefully (returns empty data, logs warning)
- Checks storage availability on initialization

## Data Models

### Task Model

```javascript
{
  id: string,           // Unique identifier (timestamp + random)
  text: string,         // Task description (1-500 characters)
  completed: boolean,   // Completion status
  createdAt: number     // Unix timestamp
}
```

**Validation Rules:**
- `text`: Required, non-empty, not whitespace-only, max 500 characters
- `completed`: Boolean, defaults to false
- `id`: Auto-generated, must be unique
- `createdAt`: Auto-generated timestamp

### Link Model

```javascript
{
  id: string,           // Unique identifier (timestamp + random)
  name: string,         // Display name (1-100 characters)
  url: string,          // Valid URL
  createdAt: number     // Unix timestamp
}
```

**Validation Rules:**
- `name`: Required, non-empty, max 100 characters
- `url`: Required, valid URL format (http:// or https://)
- `id`: Auto-generated, must be unique
- `createdAt`: Auto-generated timestamp

### Timer State Model

```javascript
{
  customDuration: number,    // Selected duration in minutes (1, 5, 10, 15, 20, 25, 30, 45, or 60)
  totalSeconds: number,      // customDuration * 60
  remainingSeconds: number,  // 0 to totalSeconds
  isRunning: boolean,        // Timer active state
  intervalId: number|null    // setInterval reference
}
```

**State Transitions:**
- Initial: `{ customDuration: 25, totalSeconds: 1500, remainingSeconds: 1500, isRunning: false, intervalId: null }`
- Running: `isRunning: true`, `intervalId` set, `remainingSeconds` decrements
- Paused: `isRunning: false`, `intervalId` cleared, `remainingSeconds` preserved
- Complete: `remainingSeconds: 0`, `isRunning: false`, `intervalId` cleared
- Reset: Returns to `{ remainingSeconds: totalSeconds, isRunning: false, intervalId: null }`
- Duration Changed: Updates `customDuration`, `totalSeconds`, and `remainingSeconds` (only when not running)

### Storage Schema

**Local Storage Structure:**
```javascript
{
  "productivity_tasks": "[{\"id\":\"...\",\"text\":\"...\",\"completed\":false,\"createdAt\":...}]",
  "productivity_links": "[{\"id\":\"...\",\"name\":\"...\",\"url\":\"...\",\"createdAt\":...}]",
  "productivity_theme": "\"light\"",
  "productivity_timer_duration": "25"
}
```

### Theme Preference Model

```javascript
{
  theme: string  // 'light' or 'dark'
}
```

**Validation Rules:**
- `theme`: Must be either 'light' or 'dark'
- Defaults to 'light' if invalid or missing

### Timer Duration Preference Model

```javascript
{
  duration: number  // 1, 5, 10, 15, 20, 25, 30, 45, or 60
}
```

**Validation Rules:**
- `duration`: Must be one of the predefined values: 1, 5, 10, 15, 20, 25, 30, 45, 60
- Defaults to 25 if invalid or missing


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time Format Correctness

*For any* Date object, the formatted time output should match the 12-hour format pattern with AM/PM indicator (e.g., "3:45 PM", "11:30 AM").

**Validates: Requirements 1.1**

### Property 2: Date Format Correctness

*For any* Date object, the formatted date output should be in a human-readable format containing month, day, and year information.

**Validates: Requirements 1.2**

### Property 3: Greeting Time Range Correctness

*For any* hour value (0-23), the greeting function should return:
- "Good morning" for hours 5-11
- "Good afternoon" for hours 12-16
- "Good evening" for hours 17-20
- "Good night" for hours 21-4

**Validates: Requirements 1.3, 1.4, 1.5, 1.6**

### Property 4: Timer Start Preserves Remaining Time

*For any* timer state with remaining seconds, starting the timer should preserve the current remaining seconds value and set the running state to true.

**Validates: Requirements 2.2**

### Property 5: Timer Stop Preserves Remaining Time

*For any* running timer state, stopping the timer should preserve the current remaining seconds value and set the running state to false.

**Validates: Requirements 2.3**

### Property 6: Timer Reset Returns to Initial State

*For any* timer state, resetting the timer should set remaining seconds to 1500 and running state to false.

**Validates: Requirements 2.4**

### Property 7: Timer Display Format Correctness

*For any* number of seconds (0-1500), the formatted timer display should match the MM:SS pattern where MM is zero-padded minutes and SS is zero-padded seconds.

**Validates: Requirements 2.5**

### Property 8: Task Creation with Valid Text

*For any* non-empty, non-whitespace string, adding it as a task should result in a new task appearing in the task list with that text.

**Validates: Requirements 3.1**

### Property 9: Task Edit Updates Text

*For any* existing task and any valid new text, editing the task should update the task's text to the new value.

**Validates: Requirements 3.2**

### Property 10: Task Completion Toggle

*For any* existing task, toggling its completion status should flip the completed boolean value.

**Validates: Requirements 3.3**

### Property 11: Task Deletion Removes from List

*For any* existing task, deleting it should result in the task no longer appearing in the task list.

**Validates: Requirements 3.4**

### Property 12: Task Creation Order Preservation

*For any* sequence of task additions, the task list should maintain the order in which tasks were created (oldest first).

**Validates: Requirements 3.5**

### Property 13: Whitespace Task Rejection

*For any* string composed entirely of whitespace characters (spaces, tabs, newlines), attempting to add it as a task should be rejected and the task list should remain unchanged.

**Validates: Requirements 3.7**

### Property 14: Task Persistence Round Trip

*For any* set of tasks, saving them to storage and then loading from storage should produce an equivalent set of tasks with the same IDs, text, completion status, and creation timestamps.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

### Property 15: Link Creation with Valid Data

*For any* non-empty name and valid URL, adding them as a link should result in a new link appearing in the link list with that name and URL.

**Validates: Requirements 5.1**

### Property 16: Link Click Opens Correct URL

*For any* existing link, clicking it should call window.open with the link's URL and '_blank' target.

**Validates: Requirements 5.2**

### Property 17: Link Deletion Removes from List

*For any* existing link, deleting it should result in the link no longer appearing in the link list.

**Validates: Requirements 5.3**

### Property 18: Link Display Shows All Links

*For any* set of links in state, the rendered link list should contain all links with their user-defined names visible.

**Validates: Requirements 5.4**

### Property 19: Invalid URL Rejection

*For any* string that is not a valid URL format (missing protocol, invalid characters, etc.), attempting to add it as a link URL should be rejected.

**Validates: Requirements 5.5**

### Property 20: Empty Link Field Rejection

*For any* link creation attempt where the name or URL field is empty or whitespace-only, the link should not be created and the link list should remain unchanged.

**Validates: Requirements 5.7**

### Property 21: Link Persistence Round Trip

*For any* set of links, saving them to storage and then loading from storage should produce an equivalent set of links with the same IDs, names, URLs, and creation timestamps.

**Validates: Requirements 6.1, 6.2, 6.3, 6.4**

### Property 22: Theme Application

*For any* theme selection ('light' or 'dark'), applying the theme should result in the corresponding CSS class being added to the body element ('theme-light' or 'theme-dark').

**Validates: Requirements 11.2, 11.3**

### Property 23: Theme Persistence Round Trip

*For any* theme preference ('light' or 'dark'), saving it to storage and then loading from storage should produce the same theme value.

**Validates: Requirements 11.4, 11.5, 11.6**

### Property 24: Duration Validation

*For any* duration value, the timer should only accept values from the predefined set: 1, 5, 10, 15, 20, 25, 30, 45, 60 minutes.

**Validates: Requirements 12.2**

### Property 25: Duration Display Update

*For any* valid duration selection, changing the duration should update the timer display to show the new duration in MM:SS format.

**Validates: Requirements 12.3**

### Property 26: Duration Persistence Round Trip

*For any* valid duration preference, saving it to storage and then loading from storage should produce the same duration value.

**Validates: Requirements 12.4, 12.5, 12.6**

### Property 27: Duration Change Prevention When Running

*For any* timer state where isRunning is true, attempting to change the duration should be prevented and the duration should remain unchanged.

**Validates: Requirements 12.8**

### Property 28: Reset Uses Custom Duration

*For any* custom duration setting, resetting the timer should set remainingSeconds to (customDuration * 60), not always 1500.

**Validates: Requirements 12.9**

### Property 29: Sort By Status

*For any* task list, sorting by status should result in all active tasks (completed: false) appearing before all completed tasks (completed: true).

**Validates: Requirements 13.2**

### Property 30: Sort By Date Newest First

*For any* task list, sorting by date newest first should result in tasks being ordered with the most recent createdAt timestamp first.

**Validates: Requirements 13.3**

### Property 31: Sort By Date Oldest First

*For any* task list, sorting by date oldest first should result in tasks being ordered with the oldest createdAt timestamp first.

**Validates: Requirements 13.4**

### Property 32: Sort Alphabetically

*For any* task list, sorting alphabetically should result in tasks being ordered by task text in case-insensitive alphabetical order.

**Validates: Requirements 13.5**

### Property 33: Sort Order Persistence Across Operations

*For any* selected sort order and any task operation (add, edit, complete, delete), the task list should maintain the selected sort order after the operation completes.

**Validates: Requirements 13.6, 13.7**

## Error Handling

### Local Storage Unavailability

**Scenario:** Local Storage is disabled, unavailable, or quota exceeded

**Handling Strategy:**
- Detect storage availability on initialization using try-catch around `localStorage.setItem`
- If unavailable, set a flag `storageAvailable = false`
- Display a warning message to the user: "Local storage is unavailable. Your data will not be saved."
- Allow the application to function normally with in-memory state only
- All CRUD operations work but data is lost on page refresh

**Implementation:**
```javascript
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
```

### Invalid Data in Local Storage

**Scenario:** Corrupted or invalid JSON in storage

**Handling Strategy:**
- Wrap `JSON.parse` in try-catch blocks
- If parsing fails, log error to console and return empty array
- Clear the corrupted storage key
- Display a message: "Unable to load saved data. Starting fresh."

**Implementation:**
```javascript
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
```

### Timer Completion

**Scenario:** Timer reaches 00:00

**Handling Strategy:**
- Stop the timer automatically
- Clear the interval
- Display a browser alert: "Focus session complete!"
- Optionally play a notification sound (if implemented)
- Keep timer at 00:00 until user clicks reset

### Invalid URL Input

**Scenario:** User enters malformed URL

**Handling Strategy:**
- Validate URL using URL constructor in try-catch
- If invalid, display inline error message: "Please enter a valid URL (e.g., https://example.com)"
- Prevent link creation
- Keep focus on URL input field

**Implementation:**
```javascript
function validateUrl(url) {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (e) {
    return false;
  }
}
```

### Empty Input Validation

**Scenario:** User attempts to add empty task or link

**Handling Strategy:**
- Trim input and check if empty
- If empty, display inline error message: "This field cannot be empty"
- Prevent creation
- Keep focus on input field
- Clear error message when user starts typing

### Maximum Data Limits

**Scenario:** User approaches Local Storage quota (typically 5-10MB)

**Handling Strategy:**
- Catch `QuotaExceededError` when saving
- Display message: "Storage limit reached. Please delete some items."
- Prevent new additions until space is freed
- Allow deletions to work normally

### Invalid Duration Selection

**Scenario:** User attempts to set an invalid timer duration

**Handling Strategy:**
- Validate duration against predefined values: 1, 5, 10, 15, 20, 25, 30, 45, 60
- If invalid, reject the change and keep current duration
- Display inline error message: "Please select a valid duration"
- Use dropdown/select element to prevent invalid input

### Duration Change While Timer Running

**Scenario:** User attempts to change duration while timer is running

**Handling Strategy:**
- Disable duration control when timer is running
- Add visual indicator (grayed out, disabled state)
- Optional: Display tooltip "Stop timer to change duration"
- Re-enable control when timer is stopped or completes

### Invalid Theme Preference

**Scenario:** Corrupted or invalid theme value in Local Storage

**Handling Strategy:**
- Validate theme value is 'light' or 'dark'
- If invalid, default to 'light'
- Log warning to console
- Save corrected default value to storage

## Testing Strategy

### Dual Testing Approach

The application will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples that demonstrate correct behavior
- Edge cases (empty lists, timer at zero, boundary conditions)
- Error conditions (storage unavailable, invalid input)
- Integration points between components

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Validating correctness properties defined in this document

Both approaches are complementary and necessary. Unit tests catch concrete bugs and verify specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection:**
- **JavaScript**: Use `fast-check` library for property-based testing
- Install via: `npm install --save-dev fast-check`

**Test Configuration:**
- Each property test must run minimum 100 iterations
- Each test must reference its design document property using a comment tag
- Tag format: `// Feature: productivity-dashboard, Property {number}: {property_text}`

**Example Property Test Structure:**
```javascript
// Feature: productivity-dashboard, Property 3: Greeting Time Range Correctness
test('greeting returns correct message for any hour', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
      const greeting = getGreeting(hour);
      if (hour >= 5 && hour <= 11) {
        return greeting === 'Good morning';
      } else if (hour >= 12 && hour <= 16) {
        return greeting === 'Good afternoon';
      } else if (hour >= 17 && hour <= 20) {
        return greeting === 'Good evening';
      } else {
        return greeting === 'Good night';
      }
    }),
    { numRuns: 100 }
  );
});
```

### Unit Testing Strategy

**Test Framework:**
- Use Jest or Vitest for unit testing
- Use jsdom for DOM manipulation testing

**Test Organization:**
- Group tests by component (Time Greeting, Focus Timer, Task List, Quick Links, Storage Manager)
- Use descriptive test names that reference requirements
- Mock Local Storage for storage tests
- Mock timers for time-dependent tests

**Key Unit Tests:**

1. **Time Greeting Component**
   - Example: Initial render shows current time
   - Example: Greeting at 8 AM shows "Good morning"
   - Example: Greeting at 3 PM shows "Good afternoon"

2. **Focus Timer Component**
   - Example: Timer initializes at 25:00
   - Example: Timer at 00:00 triggers notification
   - Edge case: Starting already running timer has no effect
   - Edge case: Stopping already stopped timer has no effect

3. **Task List Component**
   - Example: Empty task list shows "no tasks" message
   - Example: Adding first task removes empty message
   - Edge case: Deleting last task shows empty message again
   - Error: Adding empty string shows error message

4. **Quick Links Component**
   - Example: Empty link list shows "no links" message
   - Example: Clicking link calls window.open
   - Error: Invalid URL shows error message
   - Error: Empty name shows error message

5. **Storage Manager**
   - Example: Storage unavailable returns empty arrays
   - Example: Corrupted JSON returns empty array and clears storage
   - Round trip: Save and load returns same data

6. **Theme Settings Component**
   - Example: Theme toggle switches between light and dark
   - Example: Light theme applies correct CSS class
   - Example: Dark theme applies correct CSS class
   - Example: Default theme is light when no preference exists
   - Round trip: Save and load theme preference

7. **Timer Duration Settings**
   - Example: Duration dropdown contains all valid values
   - Example: Duration control is disabled when timer is running
   - Example: Reset uses custom duration, not always 25 minutes
   - Round trip: Save and load duration preference

8. **Task Sorting**
   - Example: Sort by status shows active tasks first
   - Example: Sort by date newest shows most recent first
   - Example: Sort by date oldest shows oldest first
   - Example: Sort alphabetically orders by text
   - Example: Sort order persists after adding a task
   - Example: Sort order persists after completing a task

### Test Coverage Goals

- Minimum 80% code coverage
- 100% coverage of error handling paths
- All 33 correctness properties implemented as property tests
- All edge cases covered by unit tests
- All user-facing error messages tested

### Testing Workflow

1. Write unit tests for specific examples and edge cases
2. Write property tests for each correctness property
3. Run tests with coverage reporting
4. Manually test in all target browsers (Chrome, Firefox, Edge, Safari)
5. Manually test with Local Storage disabled
6. Manually test UI responsiveness and visual design
7. Performance test with 100 tasks and 50 links

