import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  tasks,
  addTask,
  renderTasks,
  setSortOrder,
  setTheme,
  applyTheme,
  themeState
} from '../js/app.js';

describe('Performance Testing - Task 18.3', () => {
  beforeEach(() => {
    // Reset localStorage mock
    localStorage.getItem.mockClear();
    localStorage.setItem.mockClear();
    localStorage.removeItem.mockClear();
    
    // Mock localStorage to use in-memory storage
    const storage = {};
    localStorage.setItem.mockImplementation((key, value) => {
      storage[key] = value;
    });
    localStorage.getItem.mockImplementation((key) => {
      return storage[key] || null;
    });
    
    // Clear tasks array
    tasks.length = 0;
    
    // Mock DOM elements for rendering
    const mockTaskList = document.createElement('ul');
    mockTaskList.id = 'task-list';
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'task-list') return mockTaskList;
      return null;
    });
    
    // Mock body element for theme
    document.body.className = '';
  });

  describe('Requirement 8.1: Theme Switching Performance', () => {
    it('should switch theme within 100ms', () => {
      const startTime = performance.now();
      
      // Switch to dark theme
      setTheme('dark');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      expect(themeState.currentTheme).toBe('dark');
    });

    it('should apply theme within 100ms', () => {
      const startTime = performance.now();
      
      // Apply dark theme
      applyTheme('dark');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
      expect(document.body.classList.contains('theme-dark')).toBe(true);
    });

    it('should toggle between themes rapidly without performance degradation', () => {
      const iterations = 10;
      const durations = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        
        const theme = i % 2 === 0 ? 'dark' : 'light';
        setTheme(theme);
        
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }
      
      // Calculate average duration
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Average should be well under 100ms
      expect(avgDuration).toBeLessThan(100);
      
      // No single operation should exceed 100ms
      durations.forEach(duration => {
        expect(duration).toBeLessThan(100);
      });
    });
  });

  describe('Requirement 8.2, 8.3: Task Sorting Performance with 100 Tasks', () => {
    beforeEach(() => {
      // Create 100 tasks with varied data
      for (let i = 0; i < 100; i++) {
        const task = {
          id: `task-${i}-${Date.now()}`,
          text: `Task ${String.fromCharCode(65 + (i % 26))} ${i}`,
          completed: i % 3 === 0, // Every 3rd task is completed
          createdAt: Date.now() - (100 - i) * 1000 // Staggered timestamps
        };
        tasks.push(task);
      }
    });

    it('should sort 100 tasks by status within 100ms', () => {
      const startTime = performance.now();
      
      setSortOrder('status');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    it('should sort 100 tasks by date-newest within 100ms', () => {
      const startTime = performance.now();
      
      setSortOrder('date-newest');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    it('should sort 100 tasks by date-oldest within 100ms', () => {
      const startTime = performance.now();
      
      setSortOrder('date-oldest');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    it('should sort 100 tasks alphabetically within 100ms', () => {
      const startTime = performance.now();
      
      setSortOrder('alphabetical');
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    it('should render 100 sorted tasks within 100ms', () => {
      setSortOrder('status');
      
      const startTime = performance.now();
      
      renderTasks();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(100);
    });

    it('should switch between all sort orders rapidly without degradation', () => {
      const sortOrders = ['status', 'date-newest', 'date-oldest', 'alphabetical'];
      const durations = [];
      
      // Test each sort order multiple times
      for (let i = 0; i < 20; i++) {
        const order = sortOrders[i % sortOrders.length];
        
        const startTime = performance.now();
        setSortOrder(order);
        const endTime = performance.now();
        
        durations.push(endTime - startTime);
      }
      
      // Calculate average duration
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Average should be well under 100ms
      expect(avgDuration).toBeLessThan(100);
      
      // No single operation should exceed 100ms
      durations.forEach(duration => {
        expect(duration).toBeLessThan(100);
      });
    });
  });

  describe('Requirement 8.5: Combined Performance - No Degradation', () => {
    beforeEach(() => {
      // Create 100 tasks
      for (let i = 0; i < 100; i++) {
        const task = {
          id: `task-${i}-${Date.now()}`,
          text: `Task ${String.fromCharCode(65 + (i % 26))} ${i}`,
          completed: i % 3 === 0,
          createdAt: Date.now() - (100 - i) * 1000
        };
        tasks.push(task);
      }
    });

    it('should handle theme switching with 100 tasks without degradation', () => {
      const durations = [];
      
      // Switch themes multiple times with 100 tasks loaded
      for (let i = 0; i < 10; i++) {
        const theme = i % 2 === 0 ? 'dark' : 'light';
        
        const startTime = performance.now();
        setTheme(theme);
        const endTime = performance.now();
        
        durations.push(endTime - startTime);
      }
      
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Should still be fast even with 100 tasks
      expect(avgDuration).toBeLessThan(100);
    });

    it('should handle sorting with theme changes without degradation', () => {
      const sortOrders = ['status', 'date-newest', 'date-oldest', 'alphabetical'];
      const themes = ['light', 'dark'];
      const durations = [];
      
      // Alternate between sorting and theme changes
      for (let i = 0; i < 20; i++) {
        if (i % 2 === 0) {
          // Sort operation
          const order = sortOrders[i % sortOrders.length];
          const startTime = performance.now();
          setSortOrder(order);
          const endTime = performance.now();
          durations.push(endTime - startTime);
        } else {
          // Theme operation
          const theme = themes[i % themes.length];
          const startTime = performance.now();
          setTheme(theme);
          const endTime = performance.now();
          durations.push(endTime - startTime);
        }
      }
      
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Combined operations should still be fast
      expect(avgDuration).toBeLessThan(100);
    });

    it('should maintain performance when adding tasks with sorting enabled', () => {
      // Set a sort order
      setSortOrder('alphabetical');
      
      const durations = [];
      
      // Add 10 more tasks and measure each operation
      for (let i = 100; i < 110; i++) {
        const startTime = performance.now();
        
        addTask(`New Task ${i}`);
        renderTasks();
        
        const endTime = performance.now();
        durations.push(endTime - startTime);
      }
      
      const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      
      // Adding tasks with sorting should still be fast
      expect(avgDuration).toBeLessThan(100);
    });

    it('should handle rapid operations without performance degradation', () => {
      const operations = [];
      
      // Perform 50 mixed operations
      for (let i = 0; i < 50; i++) {
        const opType = i % 3;
        
        const startTime = performance.now();
        
        if (opType === 0) {
          // Theme change
          setTheme(i % 2 === 0 ? 'dark' : 'light');
        } else if (opType === 1) {
          // Sort change
          const orders = ['status', 'date-newest', 'date-oldest', 'alphabetical'];
          setSortOrder(orders[i % orders.length]);
        } else {
          // Render
          renderTasks();
        }
        
        const endTime = performance.now();
        operations.push(endTime - startTime);
      }
      
      const avgDuration = operations.reduce((sum, d) => sum + d, 0) / operations.length;
      const maxDuration = Math.max(...operations);
      
      // Average should be well under 100ms
      expect(avgDuration).toBeLessThan(100);
      
      // Even the slowest operation should be under 100ms
      expect(maxDuration).toBeLessThan(100);
    });
  });

  describe('Performance Baseline - Verify Requirements 8.1, 8.2, 8.3, 8.5', () => {
    it('should meet all performance requirements with new features', () => {
      // Create 100 tasks
      for (let i = 0; i < 100; i++) {
        const task = {
          id: `task-${i}-${Date.now()}`,
          text: `Task ${i}`,
          completed: i % 2 === 0,
          createdAt: Date.now() - i * 1000
        };
        tasks.push(task);
      }
      
      const results = {
        themeSwitch: [],
        sortOperations: [],
        renderOperations: [],
        combinedOperations: []
      };
      
      // Test theme switching (Req 8.1, 8.2)
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        setTheme(i % 2 === 0 ? 'dark' : 'light');
        results.themeSwitch.push(performance.now() - start);
      }
      
      // Test sorting (Req 8.3)
      const sortOrders = ['status', 'date-newest', 'date-oldest', 'alphabetical'];
      sortOrders.forEach(order => {
        const start = performance.now();
        setSortOrder(order);
        results.sortOperations.push(performance.now() - start);
      });
      
      // Test rendering (Req 8.3)
      for (let i = 0; i < 5; i++) {
        const start = performance.now();
        renderTasks();
        results.renderOperations.push(performance.now() - start);
      }
      
      // Test combined operations (Req 8.5)
      for (let i = 0; i < 10; i++) {
        const start = performance.now();
        setTheme(i % 2 === 0 ? 'dark' : 'light');
        setSortOrder(sortOrders[i % sortOrders.length]);
        renderTasks();
        results.combinedOperations.push(performance.now() - start);
      }
      
      // Verify all operations meet the 100ms requirement
      const allDurations = [
        ...results.themeSwitch,
        ...results.sortOperations,
        ...results.renderOperations,
        ...results.combinedOperations
      ];
      
      allDurations.forEach(duration => {
        expect(duration).toBeLessThan(100);
      });
      
      // Calculate and verify averages
      const avgTheme = results.themeSwitch.reduce((a, b) => a + b, 0) / results.themeSwitch.length;
      const avgSort = results.sortOperations.reduce((a, b) => a + b, 0) / results.sortOperations.length;
      const avgRender = results.renderOperations.reduce((a, b) => a + b, 0) / results.renderOperations.length;
      const avgCombined = results.combinedOperations.reduce((a, b) => a + b, 0) / results.combinedOperations.length;
      
      expect(avgTheme).toBeLessThan(100);
      expect(avgSort).toBeLessThan(100);
      expect(avgRender).toBeLessThan(100);
      expect(avgCombined).toBeLessThan(100);
      
      // Log results for visibility
      console.log('Performance Test Results:');
      console.log(`  Theme Switch Avg: ${avgTheme.toFixed(2)}ms`);
      console.log(`  Sort Operations Avg: ${avgSort.toFixed(2)}ms`);
      console.log(`  Render Operations Avg: ${avgRender.toFixed(2)}ms`);
      console.log(`  Combined Operations Avg: ${avgCombined.toFixed(2)}ms`);
    });
  });
});
