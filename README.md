# CodingCamp-9Mar26-shofiyahazzahra
Mini Project Batch 09-03-2026

## Productivity Dashboard

A lightweight productivity dashboard with time tracking, task management, and quick links.

### Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Open the Application**
   - Open `index.html` in your browser
   - Or use a local server: `npx serve .`

### Project Structure

```
├── css/
│   └── styles.css          # Application styles
├── js/
│   └── app.js              # Application logic
├── test/
│   └── setup.js            # Test configuration
├── index.html              # Main HTML file
├── package.json            # Dependencies
└── vitest.config.js        # Test framework config
```

### Testing

The project uses Vitest with jsdom for unit testing and fast-check for property-based testing.

- Run tests: `npm test`
- Watch mode: `npm run test:watch`
