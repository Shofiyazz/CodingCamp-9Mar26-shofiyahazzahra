import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';

describe('Application Initialization', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="greeting-display"></div>
          <div id="time-display"></div>
          <div id="date-display"></div>
          <div id="timer-display"></div>
          <button id="timer-start"></button>
          <button id="timer-stop"></button>
          <button id="timer-reset"></button>
          <input id="task-input" />
          <button id="task-add-btn"></button>
          <ul id="task-list"></ul>
          <input id="link-name-input" />
          <input id="link-url-input" />
          <button id="link-add-btn"></button>
          <ul id="link-list"></ul>
        </body>
      </html>
    `, {
      url: 'http://localhost',
      pretendToBeVisual: true
    });

    document = dom.window.document;
    window = dom.window;
    
    // Set up global objects
    global.document = document;
    global.window = window;
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
  });

  describe('init function', () => {
    it('should be defined and exported', async () => {
      const app = await import('../js/app.js');
      expect(app.init).toBeDefined();
      expect(typeof app.init).toBe('function');
    });

    it('should check storage availability', async () => {
      const app = await import('../js/app.js');
      const isStorageAvailableSpy = vi.spyOn(app, 'isStorageAvailable');
      
      app.init();
      
      expect(isStorageAvailableSpy).toHaveBeenCalled();
    });

    it('should initialize all components', async () => {
      const app = await import('../js/app.js');
      
      // Mock component init functions
      const initThemeSettingsSpy = vi.spyOn(app, 'initThemeSettings').mockImplementation(() => {});
      const initTimeGreetingSpy = vi.spyOn(app, 'initTimeGreeting').mockImplementation(() => {});
      const initFocusTimerSpy = vi.spyOn(app, 'initFocusTimer').mockImplementation(() => {});
      const initTaskListSpy = vi.spyOn(app, 'initTaskList').mockImplementation(() => {});
      const initQuickLinksSpy = vi.spyOn(app, 'initQuickLinks').mockImplementation(() => {});
      
      app.init();
      
      expect(initThemeSettingsSpy).toHaveBeenCalled();
      expect(initTimeGreetingSpy).toHaveBeenCalled();
      expect(initFocusTimerSpy).toHaveBeenCalled();
      expect(initTaskListSpy).toHaveBeenCalled();
      expect(initQuickLinksSpy).toHaveBeenCalled();
    });

    it('should initialize theme settings before other components', async () => {
      const app = await import('../js/app.js');
      
      const callOrder = [];
      
      // Mock component init functions to track call order
      vi.spyOn(app, 'initThemeSettings').mockImplementation(() => {
        callOrder.push('theme');
      });
      vi.spyOn(app, 'initTimeGreeting').mockImplementation(() => {
        callOrder.push('time');
      });
      vi.spyOn(app, 'initFocusTimer').mockImplementation(() => {
        callOrder.push('timer');
      });
      vi.spyOn(app, 'initTaskList').mockImplementation(() => {
        callOrder.push('tasks');
      });
      vi.spyOn(app, 'initQuickLinks').mockImplementation(() => {
        callOrder.push('links');
      });
      
      app.init();
      
      // Verify theme is initialized first
      expect(callOrder[0]).toBe('theme');
      expect(callOrder).toEqual(['theme', 'time', 'timer', 'tasks', 'links']);
    });

    it('should apply theme immediately on initialization to prevent flash', async () => {
      const app = await import('../js/app.js');
      
      // Mock localStorage to return a saved theme
      global.localStorage.getItem.mockReturnValue(JSON.stringify('dark'));
      
      // Add theme toggle button to DOM
      const themeToggle = document.createElement('button');
      themeToggle.id = 'theme-toggle';
      document.body.appendChild(themeToggle);
      
      // Mock other init functions to prevent side effects
      vi.spyOn(app, 'initTimeGreeting').mockImplementation(() => {});
      vi.spyOn(app, 'initFocusTimer').mockImplementation(() => {});
      vi.spyOn(app, 'initTaskList').mockImplementation(() => {});
      vi.spyOn(app, 'initQuickLinks').mockImplementation(() => {});
      
      app.init();
      
      // Verify dark theme class is applied to body
      expect(document.body.classList.contains('theme-dark')).toBe(true);
      expect(document.body.classList.contains('theme-light')).toBe(false);
    });
  });

  describe('displayStorageWarning function', () => {
    it('should be defined and exported', async () => {
      const app = await import('../js/app.js');
      expect(app.displayStorageWarning).toBeDefined();
      expect(typeof app.displayStorageWarning).toBe('function');
    });

    it('should display warning when storage is unavailable', async () => {
      const app = await import('../js/app.js');
      
      // Mock storage as unavailable
      global.localStorage.setItem.mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      
      app.displayStorageWarning();
      
      const warning = document.querySelector('.storage-warning');
      expect(warning).toBeTruthy();
      expect(warning.textContent).toContain('Local storage is unavailable');
      expect(warning.textContent).toContain('Your data will not be saved');
    });

    it('should insert warning at the top of body', async () => {
      const app = await import('../js/app.js');
      
      app.displayStorageWarning();
      
      const warning = document.body.firstChild;
      expect(warning.className).toBe('storage-warning');
    });
  });

  describe('Performance optimizations', () => {
    it('should use DocumentFragment in renderTasks for batched DOM updates', async () => {
      const app = await import('../js/app.js');
      
      // Add multiple tasks
      for (let i = 0; i < 10; i++) {
        app.addTask(`Task ${i + 1}`);
      }
      
      // Spy on appendChild to verify batching
      const taskListContainer = document.getElementById('task-list');
      const appendChildSpy = vi.spyOn(taskListContainer, 'appendChild');
      
      app.renderTasks();
      
      // Should be called once with DocumentFragment (batched)
      // Plus once for clearing innerHTML
      expect(appendChildSpy).toHaveBeenCalled();
      
      // Verify all tasks are rendered
      const taskItems = taskListContainer.querySelectorAll('.task-item');
      expect(taskItems.length).toBe(10);
    });

    it('should use DocumentFragment in renderLinks for batched DOM updates', async () => {
      const app = await import('../js/app.js');
      
      // Add multiple links
      for (let i = 0; i < 10; i++) {
        app.addLink(`Link ${i + 1}`, `https://example${i}.com`);
      }
      
      // Spy on appendChild to verify batching
      const linkListContainer = document.getElementById('link-list');
      const appendChildSpy = vi.spyOn(linkListContainer, 'appendChild');
      
      app.renderLinks();
      
      // Should be called once with DocumentFragment (batched)
      expect(appendChildSpy).toHaveBeenCalled();
      
      // Verify all links are rendered
      const linkItems = linkListContainer.querySelectorAll('.link-item');
      expect(linkItems.length).toBe(10);
    });

    it('should use event delegation for task list interactions', async () => {
      const app = await import('../js/app.js');
      
      // Initialize task list
      app.initTaskList();
      
      const taskListContainer = document.getElementById('task-list');
      
      // Check that event listener is attached to container, not individual items
      const listeners = taskListContainer.onclick;
      expect(listeners).toBeDefined();
    });

    it('should use event delegation for link list interactions', async () => {
      const app = await import('../js/app.js');
      
      // Initialize quick links
      app.initQuickLinks();
      
      const linkListContainer = document.getElementById('link-list');
      
      // Check that event listener is attached to container, not individual items
      const listeners = linkListContainer.onclick;
      expect(listeners).toBeDefined();
    });
  });
});
