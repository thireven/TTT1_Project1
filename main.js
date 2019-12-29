const students = [
  {
    id: 'aa',
    grade: 68,
    name: 'Joseph'
  },
  {
    id: 'ab',
    grade: 100,
    name: 'Howard'
  },
  {
    id: 'ac',
    grade: 79,
    name: 'Tan'
  },
  {
    id: 'ad',
    grade: 88,
    name: 'Matt'
  },
  {
    id: 'ae',
    grade: 90,
    name: 'Jessie'
  },
  {
    id: 'af',
    grade: 95,
    name: 'Han'
  },
];

const toggleBtn = document.querySelector('#mode-toggle-btn');
const bodyEle = document.querySelector('body');
const studentTable = document.querySelector('#student-grade-table');
const studentTableBody = studentTable.querySelector('tbody');

const studentTableFooter = studentTable.querySelector('tfoot');
const newStudentNameInput = studentTableFooter.querySelector('#new-student-name');
const newStudentGradeInput = studentTableFooter.querySelector('#new-student-grade');
const newStudentAddBtn = studentTableFooter.querySelector('#add-btn');

let isDarkMode = false;

/**
 * ===================================================================
 * EVENT LISTENERS
 * ===================================================================
 */

toggleBtn.addEventListener('click', function(event) {
  bodyEle.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  this.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});

newStudentAddBtn.addEventListener('click', function(event) {
  const newName = newStudentNameInput.value;
  const newGrade = newStudentGradeInput.value;
  const newId = Date.now();

  const alphaOnlyRegex = new RegExp(`^[a-zA-Z ']+$`);

  if (newName.length < 1) {
    alert('Name cannot be empty');
    return;
  }

  if (!alphaOnlyRegex.test(newName)) {
    alert('Name can only contain letters');
    return;
  }

  if (newGrade.length < 0 && newGrade >= 0 && newGrade <= 100) {
    alert('Grade is not valid');
    return;
  }

  students.push({
    name: newName,
    grade: newGrade,
    id: newId,
  });

  newStudentNameInput.value = '';
  newStudentGradeInput.value = '';

  renderStudentTable();
});

/**
 * ===================================================================
 * END EVENT LISTENERS
 * ===================================================================
 */

function renderStudentTable() {
  studentTableBody.innerHTML = '';

  for(let i = 0; i < students.length; i++) {
    const student = students[i];
    const row = document.createElement('tr');
    const nameCol = document.createElement('td');
    const gradeCol = document.createElement('td');
    const optionsCol = document.createElement('td');

    nameCol.textContent = student.name;
    gradeCol.textContent = student.grade;

    row.appendChild(nameCol);
    row.appendChild(gradeCol);
    row.appendChild(optionsCol);
    studentTableBody.appendChild(row);
  }
}



renderStudentTable();