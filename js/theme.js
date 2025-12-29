// ============ THEME MANAGEMENT ============

// Light theme
var lightTheme = {
  primary: '#0056b3',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  dark: '#f8f9fa',
  darker: '#e9ecef',
  light: '#ffffff',
  gold: '#ff8c00',

  boardBg: '#f5f5f5',
  panelBg: '#ffffff',
  modalBg: '#ffffff',
  text: '#212529',
  textDark: '#000',
  border: '#dee2e6',
  borderLight: '#adb5bd',
  highlight: '#fff3cd',
  highlightDark: '#ffe5cc'
};

// Dark theme
var darkTheme = {
  primary: '#007BFF',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  dark: '#1d1f21',
  darker: '#0a0a0a',
  light: '#f8f9fa',
  gold: '#FFD700',

  boardBg: '#1d1f21',
  panelBg: '#2a2a2a',
  modalBg: '#2a2a2a',
  text: '#FFF',
  textDark: '#000',
  border: '#555',
  borderLight: '#777',
  highlight: '#CED26B',
  highlightDark: '#AAA23B'
};

// Current theme (default: dark)
var currentTheme = darkTheme;
var isDarkMode = true;

// Function to apply theme to CSS variables
function applyTheme(theme) {
  var root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-secondary', theme.secondary);
  root.style.setProperty('--color-success', theme.success);
  root.style.setProperty('--color-danger', theme.danger);
  root.style.setProperty('--color-warning', theme.warning);
  root.style.setProperty('--color-info', theme.info);
  root.style.setProperty('--color-dark', theme.dark);
  root.style.setProperty('--color-darker', theme.darker);
  root.style.setProperty('--color-light', theme.light);
  root.style.setProperty('--color-gold', theme.gold);
  root.style.setProperty('--color-border', theme.border);
  root.style.setProperty('--color-text', theme.text);
  root.style.setProperty('--color-highlight', theme.highlight);
  root.style.setProperty('--color-highlight-dark', theme.highlightDark);
}

// Function to toggle theme
function toggleTheme() {
  if(isDarkMode) {
    currentTheme = lightTheme;
    isDarkMode = false;
    localStorage.setItem('chessTheme', 'light');
    document.body.style.backgroundColor = lightTheme.dark;
    document.getElementById('themeToggleBtn').textContent = '🌙 Dark Mode';
  } else {
    currentTheme = darkTheme;
    isDarkMode = true;
    localStorage.setItem('chessTheme', 'dark');
    document.body.style.backgroundColor = darkTheme.dark;
    document.getElementById('themeToggleBtn').textContent = '☀️ Light Mode';
  }
  applyTheme(currentTheme);
}

// Load saved theme preference on page load
function loadThemePreference() {
  var savedTheme = localStorage.getItem('chessTheme');
  if(savedTheme === 'light') {
    currentTheme = lightTheme;
    isDarkMode = false;
    document.body.style.backgroundColor = lightTheme.dark;
    if(document.getElementById('themeToggleBtn')) {
      document.getElementById('themeToggleBtn').textContent = '🌙 Dark Mode';
    }
  } else {
    currentTheme = darkTheme;
    isDarkMode = true;
    document.body.style.backgroundColor = darkTheme.dark;
    if(document.getElementById('themeToggleBtn')) {
      document.getElementById('themeToggleBtn').textContent = '☀️ Light Mode';
    }
  }
  applyTheme(currentTheme);
}
