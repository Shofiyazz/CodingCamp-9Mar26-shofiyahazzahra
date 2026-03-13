/**
 * Unit tests for task sorting functionality
 */

const {
  sortTasks,
  setSortOrder,
  sortOrder: initialSortOrder
} = require('../js/app.js');

describe('Task Sorting', () => {
  let testTasks;

  beforeEach(() => {
    // Create test tasks with different properties
    testTasks = [
      { id: '1', text: 'Zebra task', completed: false, createdAt: 1000 },
      { id: '2', text: 'Apple task', completed: true, createdAt: 3000 },
      { id: '3', text: 'Banana task', completed: false, createdAt: 2000 }
    ];
  });

  describe('sortTasks function', () => {
    test('should sort by date-oldest (oldest first)', () => {
      const sorted = sortTasks(testTasks, 'date-oldest');
      
      expect(sorted[0].id).toBe('1'); // createdAt: 1000
      expect(sorted[1].id).toBe('3'); // createdAt: 2000
      expect(sorted[2].id).toBe('2'); // createdAt: 3000
    });

    test('should sort by date-newest (newest first)', () => {
      const sorted = sortTasks(testTasks, 'date-newest');
      
      expect(sorted[0].id).toBe('2'); // createdAt: 3000
      expect(sorted[1].id).toBe('3'); // createdAt: 2000
      expect(sorted[2].id).toBe('1'); // createdAt: 1000
    });

    test('should sort by status (active before completed)', () => {
      const sorted = sortTasks(testTasks, 'status');
      
      // First two should be active (completed: false)
      expect(sorted[0].completed).toBe(false);
      expect(sorted[1].completed).toBe(false);
      // Last one should be completed (completed: true)
      expect(sorted[2].completed).toBe(true);
    });

    test('should sort alphabetically (case-insensitive)', () => {
      const sorted = sortTasks(testTasks, 'alphabetical');
      
      expect(sorted[0].text).toBe('Apple task');
      expect(sorted[1].text).toBe('Banana task');
      expect(sorted[2].text).toBe('Zebra task');
    });

    test('should return a copy, not mutate original array', () => {
      const originalOrder = testTasks.map(t => t.id);
      const sorted = sortTasks(testTasks, 'alphabetical');
      
      // Original array should be unchanged
      expect(testTasks.map(t => t.id)).toEqual(originalOrder);
      // Sorted array should be different
      expect(sorted.map(t => t.id)).not.toEqual(originalOrder);
    });

    test('should handle invalid sort order by returning copy without sorting', () => {
      const sorted = sortTasks(testTasks, 'invalid-order');
      
      // Should return a copy with same order
      expect(sorted.length).toBe(testTasks.length);
      expect(sorted).not.toBe(testTasks); // Different reference
    });

    test('should handle empty array', () => {
      const sorted = sortTasks([], 'date-oldest');
      
      expect(sorted).toEqual([]);
    });

    test('should handle single task', () => {
      const singleTask = [testTasks[0]];
      const sorted = sortTasks(singleTask, 'alphabetical');
      
      expect(sorted.length).toBe(1);
      expect(sorted[0]).toEqual(singleTask[0]);
    });
  });

  describe('setSortOrder function', () => {
    test('should accept valid sort orders', () => {
      expect(setSortOrder('status')).toBe(true);
      expect(setSortOrder('date-newest')).toBe(true);
      expect(setSortOrder('date-oldest')).toBe(true);
      expect(setSortOrder('alphabetical')).toBe(true);
    });

    test('should reject invalid sort orders', () => {
      expect(setSortOrder('invalid')).toBe(false);
      expect(setSortOrder('')).toBe(false);
      expect(setSortOrder('random')).toBe(false);
    });
  });

  describe('Alphabetical sorting edge cases', () => {
    test('should sort case-insensitively', () => {
      const tasks = [
        { id: '1', text: 'zebra', completed: false, createdAt: 1000 },
        { id: '2', text: 'Apple', completed: false, createdAt: 2000 },
        { id: '3', text: 'BANANA', completed: false, createdAt: 3000 }
      ];
      
      const sorted = sortTasks(tasks, 'alphabetical');
      
      expect(sorted[0].text).toBe('Apple');
      expect(sorted[1].text).toBe('BANANA');
      expect(sorted[2].text).toBe('zebra');
    });

    test('should handle tasks with same text', () => {
      const tasks = [
        { id: '1', text: 'Same task', completed: false, createdAt: 1000 },
        { id: '2', text: 'Same task', completed: false, createdAt: 2000 }
      ];
      
      const sorted = sortTasks(tasks, 'alphabetical');
      
      expect(sorted.length).toBe(2);
      // Order should be stable for equal elements
    });
  });

  describe('Status sorting edge cases', () => {
    test('should handle all completed tasks', () => {
      const tasks = [
        { id: '1', text: 'Task 1', completed: true, createdAt: 1000 },
        { id: '2', text: 'Task 2', completed: true, createdAt: 2000 }
      ];
      
      const sorted = sortTasks(tasks, 'status');
      
      expect(sorted.length).toBe(2);
      expect(sorted.every(t => t.completed)).toBe(true);
    });

    test('should handle all active tasks', () => {
      const tasks = [
        { id: '1', text: 'Task 1', completed: false, createdAt: 1000 },
        { id: '2', text: 'Task 2', completed: false, createdAt: 2000 }
      ];
      
      const sorted = sortTasks(tasks, 'status');
      
      expect(sorted.length).toBe(2);
      expect(sorted.every(t => !t.completed)).toBe(true);
    });
  });
});
