# Implementation Plan: Productivity Dashboard

## Overview

This plan implements a client-side productivity dashboard using vanilla JavaScript, HTML, and CSS. The implementation follows a component-based architecture with five main components: Time Greeting, Focus Timer, Task List, Quick Links, and Local Storage Manager. Each component is built incrementally with testing integrated throughout to validate correctness properties and catch errors early.

## Tasks

- [x] 1. Set up project structure and HTML foundation
  - Create directory structure (css/, js/)
  - Create index.html with semantic structure and all required DOM elements
  - Create empty app.js and styles.css files
  - Set up testing framework (Jest/Vitest with jsdom)
  - Install fast-check for property-based testing
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Implement Local Storage Manager
  - [x] 2.1 Create storage utility functions
    - Implement isStorageAvailable() with try-catch detection
    - Implement saveToStorage(key, data) with JSON serialization
    - Implement loadFromStorage(key) with error handling for corrupted data
    - Implement removeFromStorage(key)
    - Implement specific helpers: saveTasks(), loadTasks(), saveLinks(), loadLinks()
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4_
  
  - [x] 2.2 Write property test for task persistence round trip
    - **Property 14: Task Persistence Round Trip**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**
  
  - [x] 2.3 Write property test for link persistence round trip
    - **Property 21: Link Persistence Round Trip**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
  
  - [x] 2.4 Write unit tests for storage error handling
    - Test storage unavailable scenario
    - Test corrupted JSON data handling
    - Test quota exceeded error
    - _Requirements: 9.6_

- [x] 3. Implement Time Greeting Component
  - [x] 3.1 Create time and date formatting functions
    - Implement formatTime(date) returning 12-hour format with AM/PM
    - Implement formatDate(date) returning readable date string
    - Implement getGreeting(hour) with time-based logic
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_
  
  - [x] 3.2 Write property test for time format correctness
    - **Property 1: Time Format Correctness**
    - **Validates: Requirements 1.1**
  
  - [x] 3.3 Write property test for date format correctness
    - **Property 2: Date Format Correctness**
    - **Validates: Requirements 1.2**
  
  - [x] 3.4 Write property test for greeting time range correctness
    - **Property 3: Greeting Time Range Correctness**
    - **Validates: Requirements 1.3, 1.4, 1.5, 1.6**
  
  - [x] 3.5 Implement time greeting initialization and updates
    - Implement initTimeGreeting() to set up DOM references
    - Implement updateTimeDisplay() to update all display elements
    - Set up setInterval to call updateTimeDisplay() every 1000ms
    - _Requirements: 1.7_
  
  - [x] 3.6 Write unit tests for time greeting component
    - Test initial render shows current time
    - Test greeting examples for each time period
    - Mock Date object for deterministic testing
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 4. Checkpoint - Verify storage and time greeting
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement Focus Timer Component
  - [x] 5.1 Create timer state and formatting functions
    - Initialize timer state object (totalSeconds, remainingSeconds, isRunning, intervalId)
    - Implement formatTimerDisplay(seconds) converting to MM:SS format
    - _Requirements: 2.1, 2.5_
  
  - [x] 5.2 Write property test for timer display format correctness
    - **Property 7: Timer Display Format Correctness**
    - **Validates: Requirements 2.5**
  
  - [x] 5.3 Implement timer control functions
    - Implement startTimer() to begin countdown with interval
    - Implement stopTimer() to pause and clear interval
    - Implement resetTimer() to return to 1500 seconds
    - Implement updateTimerDisplay() to refresh DOM
    - Implement notifyTimerComplete() with alert notification
    - _Requirements: 2.2, 2.3, 2.4, 2.6, 2.7, 2.8_
  
  - [x] 5.4 Write property test for timer start preserves remaining time
    - **Property 4: Timer Start Preserves Remaining Time**
    - **Validates: Requirements 2.2**
  
  - [x] 5.5 Write property test for timer stop preserves remaining time
    - **Property 5: Timer Stop Preserves Remaining Time**
    - **Validates: Requirements 2.3**
  
  - [x] 5.6 Write property test for timer reset returns to initial state
    - **Property 6: Timer Reset Returns to Initial State**
    - **Validates: Requirements 2.4**
  
  - [x] 5.7 Wire timer controls to DOM event listeners
    - Implement initFocusTimer() to set up button event listeners
    - Connect start, stop, reset buttons to respective functions
    - _Requirements: 2.2, 2.3, 2.4_
  
  - [x] 5.8 Write unit tests for timer edge cases
    - Test timer at 00:00 triggers notification
    - Test starting already running timer
    - Test stopping already stopped timer
    - Mock setInterval and clearInterval for testing
    - _Requirements: 2.6, 2.7_

- [x] 6. Implement Task List Component - Data Layer
  - [x] 6.1 Create task data model and validation
    - Implement generateTaskId() using timestamp + random
    - Implement validateTaskText(text) checking non-empty and max length
    - Initialize tasks state array
    - _Requirements: 3.1, 3.7_
  
  - [x] 6.2 Write property test for whitespace task rejection
    - **Property 13: Whitespace Task Rejection**
    - **Validates: Requirements 3.7**
  
  - [x] 6.3 Implement task CRUD operations
    - Implement addTask(text) with validation and storage sync
    - Implement editTask(id, newText) with validation and storage sync
    - Implement toggleTaskComplete(id) with storage sync
    - Implement deleteTask(id) with storage sync
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [x] 6.4 Write property test for task creation with valid text
    - **Property 8: Task Creation with Valid Text**
    - **Validates: Requirements 3.1**
  
  - [x] 6.5 Write property test for task edit updates text
    - **Property 9: Task Edit Updates Text**
    - **Validates: Requirements 3.2**
  
  - [x] 6.6 Write property test for task completion toggle
    - **Property 10: Task Completion Toggle**
    - **Validates: Requirements 3.3**
  
  - [x] 6.7 Write property test for task deletion removes from list
    - **Property 11: Task Deletion Removes from List**
    - **Validates: Requirements 3.4**
  
  - [x] 6.8 Write property test for task creation order preservation
    - **Property 12: Task Creation Order Preservation**
    - **Validates: Requirements 3.5**

- [x] 7. Implement Task List Component - UI Layer
  - [x] 7.1 Create task rendering function
    - Implement renderTasks() to generate DOM elements for all tasks
    - Handle empty state message display
    - Apply completion styling to completed tasks
    - _Requirements: 3.5, 3.6, 8.3_
  
  - [x] 7.2 Wire task UI interactions
    - Implement initTaskList() to load tasks and set up event listeners
    - Connect add button to addTask()
    - Connect task checkboxes to toggleTaskComplete()
    - Connect delete buttons to deleteTask()
    - Implement inline editing on task text click
    - Display error messages for invalid input
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7, 8.2_
  
  - [ ] 7.3 Write unit tests for task UI interactions
    - Test empty task list shows "no tasks" message
    - Test adding first task removes empty message
    - Test deleting last task shows empty message again
    - Test error message for empty string input
    - _Requirements: 3.6, 3.7_

- [x] 8. Checkpoint - Verify timer and task list
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement Quick Links Component - Data Layer
  - [x] 9.1 Create link data model and validation
    - Implement generateLinkId() using timestamp + random
    - Implement validateUrl(url) using URL constructor with try-catch
    - Initialize links state array
    - _Requirements: 5.1, 5.5_
  
  - [ ] 9.2 Write property test for invalid URL rejection
    - **Property 19: Invalid URL Rejection**
    - **Validates: Requirements 5.5**
  
  - [ ] 9.3 Write property test for empty link field rejection
    - **Property 20: Empty Link Field Rejection**
    - **Validates: Requirements 5.7**
  
  - [x] 9.4 Implement link CRUD operations
    - Implement addLink(name, url) with validation and storage sync
    - Implement deleteLink(id) with storage sync
    - Implement openLink(url) using window.open with '_blank'
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ] 9.5 Write property test for link creation with valid data
    - **Property 15: Link Creation with Valid Data**
    - **Validates: Requirements 5.1**
  
  - [ ] 9.6 Write property test for link click opens correct URL
    - **Property 16: Link Click Opens Correct URL**
    - **Validates: Requirements 5.2**
  
  - [ ] 9.7 Write property test for link deletion removes from list
    - **Property 17: Link Deletion Removes from List**
    - **Validates: Requirements 5.3**
  
  - [ ] 9.8 Write property test for link display shows all links
    - **Property 18: Link Display Shows All Links**
    - **Validates: Requirements 5.4**

- [x] 10. Implement Quick Links Component - UI Layer
  - [x] 10.1 Create link rendering function
    - Implement renderLinks() to generate DOM elements for all links
    - Handle empty state message display
    - Make link names clickable
    - _Requirements: 5.4, 5.6, 8.4_
  
  - [x] 10.2 Wire link UI interactions
    - Implement initQuickLinks() to load links and set up event listeners
    - Connect add button to addLink()
    - Connect link names to openLink()
    - Connect delete buttons to deleteLink()
    - Display error messages for invalid URL or empty fields
    - Clear error messages on user input
    - _Requirements: 5.1, 5.2, 5.3, 5.5, 5.7, 8.2_
  
  - [ ] 10.3 Write unit tests for link UI interactions
    - Test empty link list shows "no links" message
    - Test clicking link calls window.open with correct parameters
    - Test error message for invalid URL
    - Test error message for empty name field
    - Mock window.open for testing
    - _Requirements: 5.2, 5.5, 5.6, 5.7_

- [x] 11. Implement CSS styling and responsive design
  - [x] 11.1 Create base styles and layout
    - Define CSS variables for colors, spacing, and typography
    - Implement grid or flexbox layout for component positioning
    - Style typography with readable fonts and sizes
    - Ensure all components fit on standard desktop without scrolling
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_
  
  - [x] 11.2 Style interactive elements
    - Add hover states for buttons and clickable elements
    - Add active/focus states for inputs
    - Style completed tasks with strikethrough or opacity
    - Add visual feedback for button clicks
    - Style error messages with appropriate colors
    - _Requirements: 7.3, 8.2_
  
  - [x] 11.3 Polish visual design
    - Apply consistent spacing and alignment
    - Add subtle shadows or borders for component separation
    - Ensure sufficient color contrast for accessibility
    - Test visual design in all target browsers
    - _Requirements: 7.1, 7.4, 7.6, 9.1, 9.2, 9.3, 9.4_

- [x] 12. Application initialization and integration
  - [x] 12.1 Create main initialization function
    - Implement init() function that calls all component init functions
    - Check storage availability and display warning if unavailable
    - Call init() on DOMContentLoaded event
    - _Requirements: 8.1, 9.6_
  
  - [x] 12.2 Add performance optimizations
    - Ensure all event listeners use event delegation where appropriate
    - Minimize DOM manipulations by batching updates
    - Test performance with 100 tasks and 50 links
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 12.3 Write integration tests
    - Test full user flow: add task, complete task, delete task
    - Test full user flow: add link, click link, delete link
    - Test storage unavailable scenario with all components
    - Test page reload preserves all data
    - _Requirements: 4.5, 4.6, 6.3, 6.4, 9.6_

- [x] 13. Final checkpoint and browser compatibility testing
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test in Chrome, Firefox, Edge, and Safari
  - Verify Local Storage disabled scenario works gracefully
  - Verify all requirements are met

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All 21 correctness properties are covered by property-based tests
- Error handling is integrated throughout for storage issues and invalid input

- [x] 14. Implement Theme Settings Component
  - [x] 14.1 Create theme state and storage functions
    - Implement saveThemePreference(theme) to save to Local Storage under key "productivity_theme"
    - Implement loadThemePreference() to load from Local Storage (defaults to 'light')
    - Initialize theme state object with currentTheme property
    - _Requirements: 11.4, 11.5, 11.6, 11.7_
  
  - [ ]* 14.2 Write property test for theme application
    - **Property 22: Theme Application**
    - **Validates: Requirements 11.2, 11.3**
  
  - [ ]* 14.3 Write property test for theme persistence round trip
    - **Property 23: Theme Persistence Round Trip**
    - **Validates: Requirements 11.4, 11.5, 11.6**
  
  - [x] 14.4 Implement theme application functions
    - Implement applyTheme(theme) to add/remove CSS classes on body element
    - Implement setTheme(theme) to apply theme and save preference
    - Implement toggleTheme() to switch between 'light' and 'dark'
    - _Requirements: 11.2, 11.3, 11.4_
  
  - [x] 14.5 Wire theme controls to DOM
    - Implement initThemeSettings() to load saved theme and set up event listeners
    - Connect theme toggle button to toggleTheme()
    - Apply loaded theme immediately on initialization to prevent flash
    - _Requirements: 11.1, 11.5, 11.6, 11.7_
  
  - [ ]* 14.6 Write unit tests for theme component
    - Test theme toggle switches between light and dark
    - Test light theme applies 'theme-light' CSS class
    - Test dark theme applies 'theme-dark' CSS class
    - Test default theme is light when no preference exists
    - _Requirements: 11.2, 11.3, 11.7_

- [x] 15. Implement Customizable Focus Timer Duration
  - [x] 15.1 Update timer state and storage functions
    - Add customDuration property to timer state (defaults to 25)
    - Implement saveDurationPreference(minutes) to save to Local Storage under key "productivity_timer_duration"
    - Implement loadDurationPreference() to load from Local Storage (defaults to 25)
    - Update timer state initialization to use loaded duration preference
    - _Requirements: 12.4, 12.5, 12.6, 12.7_
  
  - [ ]* 15.2 Write property test for duration validation
    - **Property 24: Duration Validation**
    - **Validates: Requirements 12.2**
  
  - [ ]* 15.3 Write property test for duration display update
    - **Property 25: Duration Display Update**
    - **Validates: Requirements 12.3**
  
  - [ ]* 15.4 Write property test for duration persistence round trip
    - **Property 26: Duration Persistence Round Trip**
    - **Validates: Requirements 12.4, 12.5, 12.6**
  
  - [x] 15.5 Implement duration control functions
    - Implement setTimerDuration(minutes) to validate and update duration
    - Validate duration is one of: 1, 5, 10, 15, 20, 25, 30, 45, 60
    - Update totalSeconds and remainingSeconds when duration changes
    - Save duration preference when changed
    - _Requirements: 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 15.6 Write property test for duration change prevention when running
    - **Property 27: Duration Change Prevention When Running**
    - **Validates: Requirements 12.8**
  
  - [ ]* 15.7 Write property test for reset uses custom duration
    - **Property 28: Reset Uses Custom Duration**
    - **Validates: Requirements 12.9**
  
  - [x] 15.8 Update timer control functions for custom duration
    - Modify resetTimer() to use customDuration * 60 instead of hardcoded 1500
    - Modify startTimer() to prevent duration changes (disable control)
    - Modify stopTimer() to re-enable duration control
    - Update timer completion to re-enable duration control
    - _Requirements: 12.8, 12.9_
  
  - [x] 15.9 Wire duration controls to DOM
    - Add duration select/dropdown element to HTML with predefined values
    - Connect duration control to setTimerDuration()
    - Disable duration control when timer is running
    - Update initFocusTimer() to load and apply saved duration
    - _Requirements: 12.1, 12.2, 12.5, 12.6, 12.8_
  
  - [ ]* 15.10 Write unit tests for duration functionality
    - Test duration dropdown contains all valid values (1, 5, 10, 15, 20, 25, 30, 45, 60)
    - Test duration control is disabled when timer is running
    - Test reset uses custom duration, not always 25 minutes
    - Test invalid duration is rejected
    - _Requirements: 12.2, 12.8, 12.9_

- [x] 16. Implement Task Sorting Component
  - [x] 16.1 Update task state and add sorting functions
    - Add sortOrder property to task state (defaults to 'date-oldest')
    - Implement sortTasks(tasks, order) to return sorted copy of tasks array
    - Implement sort logic for 'status', 'date-newest', 'date-oldest', 'alphabetical'
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.8_
  
  - [ ]* 16.2 Write property test for sort by status
    - **Property 29: Sort By Status**
    - **Validates: Requirements 13.2**
  
  - [ ]* 16.3 Write property test for sort by date newest first
    - **Property 30: Sort By Date Newest First**
    - **Validates: Requirements 13.3**
  
  - [ ]* 16.4 Write property test for sort by date oldest first
    - **Property 31: Sort By Date Oldest First**
    - **Validates: Requirements 13.4**
  
  - [ ]* 16.5 Write property test for sort alphabetically
    - **Property 32: Sort Alphabetically**
    - **Validates: Requirements 13.5**
  
  - [ ]* 16.6 Write property test for sort order persistence across operations
    - **Property 33: Sort Order Persistence Across Operations**
    - **Validates: Requirements 13.6, 13.7**
  
  - [x] 16.7 Implement sort order control function
    - Implement setSortOrder(order) to update sortOrder state
    - Validate order is one of: 'status', 'date-newest', 'date-oldest', 'alphabetical'
    - Call renderTasks() after changing sort order
    - _Requirements: 13.1, 13.6_
  
  - [x] 16.8 Update renderTasks to apply sorting
    - Modify renderTasks() to call sortTasks() before rendering
    - Apply current sortOrder to tasks before generating DOM elements
    - Ensure sort order is maintained after add, edit, complete, delete operations
    - _Requirements: 13.6, 13.7_
  
  - [x] 16.9 Wire sort controls to DOM
    - Add sort order select/dropdown element to HTML with sort options
    - Connect sort control to setSortOrder()
    - Update initTaskList() to apply default sort order ('date-oldest')
    - _Requirements: 13.1, 13.8_
  
  - [ ]* 16.10 Write unit tests for task sorting
    - Test sort by status shows active tasks before completed tasks
    - Test sort by date newest shows most recent first
    - Test sort by date oldest shows oldest first
    - Test sort alphabetically orders by text (case-insensitive)
    - Test sort order persists after adding a task
    - Test sort order persists after completing a task
    - _Requirements: 13.2, 13.3, 13.4, 13.5, 13.6, 13.7_

- [x] 17. Update CSS for new features
  - [x] 17.1 Add theme-specific CSS variables and classes
    - Define CSS variables for light theme colors (backgrounds, text, borders)
    - Define CSS variables for dark theme colors (backgrounds, text, borders)
    - Create .theme-light and .theme-dark classes that apply respective variables
    - Ensure sufficient contrast in both themes for accessibility
    - _Requirements: 11.2, 11.3, 7.6_
  
  - [x] 17.2 Style theme toggle control
    - Style theme toggle button with clear visual indication
    - Add hover and active states for theme toggle
    - Position theme toggle appropriately in layout
    - _Requirements: 11.1, 7.3_
  
  - [x] 17.3 Style duration and sort controls
    - Style duration select dropdown consistently with existing inputs
    - Style sort order select dropdown consistently with existing inputs
    - Ensure disabled state is visually clear for duration control
    - Add appropriate spacing and alignment
    - _Requirements: 12.1, 13.1, 7.1, 7.4_

- [x] 18. Integration and final testing
  - [x] 18.1 Update initialization to include new components
    - Update init() function to call initThemeSettings()
    - Ensure theme is applied before other components initialize
    - Verify all components work together correctly
    - _Requirements: 11.5, 11.6_
  
  - [x] 18.2 Write integration tests for new features
    - Test theme change persists across page reload
    - Test timer duration persists across page reload
    - Test sort order is maintained when tasks are modified
    - Test all three features work together without conflicts
    - _Requirements: 11.4, 11.5, 11.6, 12.4, 12.5, 12.6, 13.6, 13.7_
  
  - [x] 18.3 Performance testing with new features
    - Test performance with theme switching
    - Test performance with different sort orders on 100 tasks
    - Verify no performance degradation from new features
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [x] 19. Final checkpoint - Verify all new features
  - Ensure all tests pass, ask the user if questions arise.
  - Manually test theme toggle in all target browsers
  - Manually test timer duration customization
  - Manually test task sorting with various data sets
  - Verify all new requirements (11, 12, 13) are met
