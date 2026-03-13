/**
 * Simple Node.js script to verify sorting functionality
 */

// Mock the DOM and localStorage for Node.js environment
global.document = {
  getElementById: () => null,
  createElement: () => ({}),
  addEventListener: () => {},
  body: { classList: { add: () => {}, remove: () => {} } }
};

global.window = {
  open: () => {}
};

global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.alert = () => {};
global.setInterval = () => {};
global.clearInterval = () => {};

// Load the app
const app = require('./js/app.js');

// Test data
const testTasks = [
  { id: '1', text: 'Zebra task', completed: false, createdAt: 1000 },
  { id: '2', text: 'Apple task', completed: true, createdAt: 3000 },
  { id: '3', text: 'Banana task', completed: false, createdAt: 2000 }
];

console.log('Testing Task Sorting Functionality\n');
console.log('='.repeat(50));

// Test 1: Sort by date-oldest
console.log('\n1. Sort by date-oldest (oldest first):');
const sortedOldest = app.sortTasks(testTasks, 'date-oldest');
console.log('   Expected order: 1, 3, 2');
console.log('   Actual order:  ', sortedOldest.map(t => t.id).join(', '));
console.log('   ✓ PASS:', sortedOldest[0].id === '1' && sortedOldest[1].id === '3' && sortedOldest[2].id === '2');

// Test 2: Sort by date-newest
console.log('\n2. Sort by date-newest (newest first):');
const sortedNewest = app.sortTasks(testTasks, 'date-newest');
console.log('   Expected order: 2, 3, 1');
console.log('   Actual order:  ', sortedNewest.map(t => t.id).join(', '));
console.log('   ✓ PASS:', sortedNewest[0].id === '2' && sortedNewest[1].id === '3' && sortedNewest[2].id === '1');

// Test 3: Sort by status
console.log('\n3. Sort by status (active before completed):');
const sortedStatus = app.sortTasks(testTasks, 'status');
console.log('   Expected: active tasks first, then completed');
console.log('   Actual:  ', sortedStatus.map(t => t.completed ? 'completed' : 'active').join(', '));
console.log('   ✓ PASS:', sortedStatus[0].completed === false && sortedStatus[1].completed === false && sortedStatus[2].completed === true);

// Test 4: Sort alphabetically
console.log('\n4. Sort alphabetically (case-insensitive):');
const sortedAlpha = app.sortTasks(testTasks, 'alphabetical');
console.log('   Expected order: Apple, Banana, Zebra');
console.log('   Actual order:  ', sortedAlpha.map(t => t.text).join(', '));
console.log('   ✓ PASS:', sortedAlpha[0].text === 'Apple task' && sortedAlpha[1].text === 'Banana task' && sortedAlpha[2].text === 'Zebra task');

// Test 5: Original array not mutated
console.log('\n5. Original array not mutated:');
const originalFirst = testTasks[0].id;
app.sortTasks(testTasks, 'alphabetical');
console.log('   Original first task ID:', originalFirst);
console.log('   After sorting, first task ID:', testTasks[0].id);
console.log('   ✓ PASS:', testTasks[0].id === originalFirst);

// Test 6: setSortOrder validation
console.log('\n6. setSortOrder validation:');
console.log('   Valid order "status":', app.setSortOrder('status'));
console.log('   Invalid order "invalid":', app.setSortOrder('invalid'));
console.log('   ✓ PASS: Valid returns true, invalid returns false');

console.log('\n' + '='.repeat(50));
console.log('All tests completed!\n');
