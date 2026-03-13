import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveThemePreference,
  loadThemePreference,
  saveDurationPreference,
  loadDurationPreference,
  setTheme,
  setTimerDuration,
  timerState,
  addTask,
  setSortOrder,
  sortTasks,
  tasks,
  deleteTask,
  toggleTaskComplete,
  editTask,
  themeState
} from '../js/app.js';

describe('Integration Tests - New Features', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();

    // Mock localStorage to use an in-memory store
    const storage = {};
    localStorage.setItem.mockImplementation((key, value) => {
      storage[key] = value;
    });
    localStorage.getItem.mockImplementation((key) => {
      return storage[key] || null;
    });

    // Reset tasks array
    tasks.length = 0;

    // Reset theme state
    themeState.currentTheme = 'light';
    document.body.className = '';

    // Reset timer state
    timerState.customDuration = 25;
    timerState.totalSeconds = 1500;
    timerState.remainingSeconds = 1500;
  });

  describe('Theme Persistence Across Page Reload', () => {
    it('should persist light theme across page reload', () => {
      setTheme('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('productivity_theme', JSON.stringify('light'));
      const loadedTheme = loadThemePreference();
      expect(loadedTheme).toBe('light');
    });

    it('should persist dark theme across page reload', () => {
      setTheme('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('productivity_theme', JSON.stringify('dark'));
      const loadedTheme = loadThemePreference();
      expect(loadedTheme).toBe('dark');
    });

    it('should default to light theme when no preference exists after reload', () => {
      const loadedTheme = loadThemePreference();
      expect(loadedTheme).toBe('light');
    });

    it('should maintain theme after multiple changes and reload', () => {
      setTheme('dark');
      setTheme('light');
      setTheme('dark');
      const loadedTheme = loadThemePreference();
      expect(loadedTheme).toBe('dark');
    });
  });

  describe('Timer Duration Persistence Across Page Reload', () => {
    it('should persist 25 minute duration across page reload', () => {
      setTimerDuration(25);
      expect(localStorage.setItem).toHaveBeenCalledWith('productivity_timer_duration', JSON.stringify(25));
      const loadedDuration = loadDurationPreference();
      expect(loadedDuration).toBe(25);
    });

    it('should persist 45 minute duration across page reload', () => {
      setTimerDuration(45);
      expect(localStorage.setItem).toHaveBeenCalledWith('productivity_timer_duration', JSON.stringify(45));
      const loadedDuration = loadDurationPreference();
      expect(loadedDuration).toBe(45);
    });

    it('should persist 60 minute duration across page reload', () => {
      setTimerDuration(60);
      expect(localStorage.setItem).toHaveBeenCalledWith('productivity_timer_duration', JSON.stringify(60));
      const loadedDuration = loadDurationPreference();
      expect(loadedDuration).toBe(60);
    });

    it('should default to 25 minutes when no preference exists after reload', () => {
      const loadedDuration = loadDurationPreference();
      expect(loadedDuration).toBe(25);
    });

    it('should maintain duration after multiple changes and reload', () => {
      setTimerDuration(15);
      setTimerDuration(30);
      setTimerDuration(10);
      const loadedDuration = loadDurationPreference();
      expect(loadedDuration).toBe(10);
    });

    it('should update timer state when duration is loaded', () => {
      setTimerDuration(45);
      expect(timerState.customDuration).toBe(45);
      expect(timerState.totalSeconds).toBe(45 * 60);
      expect(timerState.remainingSeconds).toBe(45 * 60);
    });
  });

  describe('Sort Order Maintained When Tasks Are Modified', () => {
    it('should maintain sort order when tasks are added', () => {
      const task1 = addTask('Task A');
      task1.createdAt = 1000;
      const task2 = addTask('Task C');
      task2.createdAt = 3000;
      const task3 = addTask('Task B');
      task3.createdAt = 2000;

      setSortOrder('alphabetical');
      const sortedTasks = sortTasks(tasks, 'alphabetical');
      expect(sortedTasks[0].text).toBe('Task A');
      expect(sortedTasks[1].text).toBe('Task B');
      expect(sortedTasks[2].text).toBe('Task C');

      const task4 = addTask('Task D');
      const sortedAfterAdd = sortTasks(tasks, 'alphabetical');
      expect(sortedAfterAdd[0].text).toBe('Task A');
      expect(sortedAfterAdd[1].text).toBe('Task B');
      expect(sortedAfterAdd[2].text).toBe('Task C');
      expect(sortedAfterAdd[3].text).toBe('Task D');

      deleteTask(task1.id);
      deleteTask(task2.id);
      deleteTask(task3.id);
      deleteTask(task4.id);
    });

    it('should maintain sort order when tasks are completed', () => {
      const task1 = addTask('Active Task 1');
      const task2 = addTask('Active Task 2');
      const task3 = addTask('Active Task 3');

      setSortOrder('status');
      const sortedBefore = sortTasks(tasks, 'status');
      expect(sortedBefore.every(t => !t.completed)).toBe(true);

      toggleTaskComplete(task2.id);
      const sortedAfter = sortTasks(tasks, 'status');
      expect(sortedAfter[0].completed).toBe(false);
      expect(sortedAfter[1].completed).toBe(false);
      expect(sortedAfter[2].completed).toBe(true);
      expect(sortedAfter[2].id).toBe(task2.id);

      deleteTask(task1.id);
      deleteTask(task2.id);
      deleteTask(task3.id);
    });

    it('should maintain sort order when tasks are edited', () => {
      const task1 = addTask('Zebra');
      const task2 = addTask('Apple');
      const task3 = addTask('Banana');

      setSortOrder('alphabetical');
      const sortedBefore = sortTasks(tasks, 'alphabetical');
      expect(sortedBefore[0].text).toBe('Apple');
      expect(sortedBefore[1].text).toBe('Banana');
      expect(sortedBefore[2].text).toBe('Zebra');

      editTask(task1.id, 'Aardvark');
      const sortedAfter = sortTasks(tasks, 'alphabetical');
      expect(sortedAfter[0].text).toBe('Aardvark');
      expect(sortedAfter[1].text).toBe('Apple');
      expect(sortedAfter[2].text).toBe('Banana');

      deleteTask(task1.id);
      deleteTask(task2.id);
      deleteTask(task3.id);
    });

    it('should maintain sort order when tasks are deleted', () => {
      const task1 = addTask('Task 1');
      task1.createdAt = 1000;
      const task2 = addTask('Task 2');
      task2.createdAt = 2000;
      const task3 = addTask('Task 3');
      task3.createdAt = 3000;

      setSortOrder('date-newest');
      const sortedBefore = sortTasks(tasks, 'date-newest');
      expect(sortedBefore[0].createdAt).toBe(3000);
      expect(sortedBefore[1].createdAt).toBe(2000);
      expect(sortedBefore[2].createdAt).toBe(1000);

      deleteTask(task2.id);
      const sortedAfter = sortTasks(tasks, 'date-newest');
      expect(sortedAfter.length).toBe(2);
      expect(sortedAfter[0].createdAt).toBe(3000);
      expect(sortedAfter[1].createdAt).toBe(1000);

      deleteTask(task1.id);
      deleteTask(task3.id);
    });

    it('should maintain date-oldest sort order across operations', () => {
      const task1 = addTask('Old Task');
      task1.createdAt = 1000;
      const task2 = addTask('New Task');
      task2.createdAt = 3000;

      setSortOrder('date-oldest');
      const sortedBefore = sortTasks(tasks, 'date-oldest');
      expect(sortedBefore[0].createdAt).toBe(1000);
      expect(sortedBefore[1].createdAt).toBe(3000);

      const task3 = addTask('Middle Task');
      task3.createdAt = 2000;
      const sortedAfter = sortTasks(tasks, 'date-oldest');
      expect(sortedAfter[0].createdAt).toBe(1000);
      expect(sortedAfter[1].createdAt).toBe(2000);
      expect(sortedAfter[2].createdAt).toBe(3000);

      deleteTask(task1.id);
      deleteTask(task2.id);
      deleteTask(task3.id);
    });
  });

  describe('All Features Work Together Without Conflicts', () => {
    it('should handle theme, duration, and sort order changes simultaneously', () => {
      setTheme('dark');
      expect(themeState.currentTheme).toBe('dark');

      setTimerDuration(45);
      expect(timerState.customDuration).toBe(45);

      const task1 = addTask('Task A');
      const task2 = addTask('Task B');
      setSortOrder('alphabetical');

      expect(themeState.currentTheme).toBe('dark');
      expect(timerState.customDuration).toBe(45);
      const sorted = sortTasks(tasks, 'alphabetical');
      expect(sorted[0].text).toBe('Task A');
      expect(sorted[1].text).toBe('Task B');

      deleteTask(task1.id);
      deleteTask(task2.id);
    });

    it('should persist all features across simulated page reload', () => {
      setTheme('dark');
      setTimerDuration(60);
      const task1 = addTask('Task 1');
      const task2 = addTask('Task 2');
      setSortOrder('alphabetical');

      const loadedTheme = loadThemePreference();
      const loadedDuration = loadDurationPreference();
      const sorted = sortTasks(tasks, 'alphabetical');

      expect(loadedTheme).toBe('dark');
      expect(loadedDuration).toBe(60);
      expect(sorted[0].text).toBe('Task 1');
      expect(sorted[1].text).toBe('Task 2');

      deleteTask(task1.id);
      deleteTask(task2.id);
    });

    it('should not interfere when changing one feature while others are set', () => {
      setTheme('dark');
      setTimerDuration(30);
      const task1 = addTask('Task X');
      setSortOrder('date-oldest');

      setTheme('light');
      expect(themeState.currentTheme).toBe('light');
      expect(timerState.customDuration).toBe(30);
      expect(tasks.length).toBe(1);

      setTimerDuration(15);
      expect(themeState.currentTheme).toBe('light');
      expect(timerState.customDuration).toBe(15);
      expect(tasks.length).toBe(1);

      const task2 = addTask('Task Y');
      expect(themeState.currentTheme).toBe('light');
      expect(timerState.customDuration).toBe(15);
      expect(tasks.length).toBe(2);

      deleteTask(task1.id);
      deleteTask(task2.id);
    });

    it('should handle complex workflow with all features', () => {
      setTheme('light');
      setTimerDuration(25);

      const task1 = addTask('Buy groceries');
      task1.createdAt = 1000;
      const task2 = addTask('Write report');
      task2.createdAt = 2000;
      const task3 = addTask('Call dentist');
      task3.createdAt = 3000;

      setSortOrder('alphabetical');
      let sorted = sortTasks(tasks, 'alphabetical');
      expect(sorted[0].text).toBe('Buy groceries');
      expect(sorted[1].text).toBe('Call dentist');
      expect(sorted[2].text).toBe('Write report');

      setTheme('dark');
      expect(themeState.currentTheme).toBe('dark');

      toggleTaskComplete(task1.id);
      setSortOrder('status');
      sorted = sortTasks(tasks, 'status');
      expect(sorted[0].completed).toBe(false);
      expect(sorted[1].completed).toBe(false);
      expect(sorted[2].completed).toBe(true);

      setTimerDuration(45);
      expect(timerState.customDuration).toBe(45);

      editTask(task2.id, 'Finish report');
      const updatedTask = tasks.find(t => t.id === task2.id);
      expect(updatedTask.text).toBe('Finish report');

      const loadedTheme = loadThemePreference();
      const loadedDuration = loadDurationPreference();
      expect(loadedTheme).toBe('dark');
      expect(loadedDuration).toBe(45);

      deleteTask(task1.id);
      deleteTask(task2.id);
      deleteTask(task3.id);
    });
  });
});
