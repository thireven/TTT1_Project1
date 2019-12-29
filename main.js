const toggleBtn = document.querySelector('#mode-toggle-btn');
const bodyEle = document.querySelector('body');
let isDarkMode = false;

toggleBtn.addEventListener('click', function(event) {
  bodyEle.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  this.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});