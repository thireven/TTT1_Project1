const students = [
  {
    id: 1,
    grade: 68,
    name: 'Joseph'
  },
  {
    id: 2,
    grade: 100,
    name: 'Howard'
  },
  {
    id: 3,
    grade: 79,
    name: 'Tan'
  },
  {
    id: 4,
    grade: 88,
    name: 'How'
  },
  {
    id: 5,
    grade: 90,
    name: 'Jessie'
  },
  {
    id: 6,
    grade: 95,
    name: 'Han'
  },
];

const toggleBtn = document.querySelector('#mode-toggle-btn');
const bodyEle = document.querySelector('body');
const studentTable = $('#student-grade-table');
const studentTableBody = studentTable.find('tbody');
const studentTableHeader = studentTable.find('thead');

const studentTableFooter = studentTable.find('tfoot');
const newStudentNameInput = studentTableFooter.find('#new-student-name');
const newStudentGradeInput = studentTableFooter.find('#new-student-grade');
const newStudentAddBtn = studentTableFooter.find('#add-btn');

const editForm = $('#edit-form');

let isDarkMode = false;
let currentEditedRow = null;
let currentEditedStudentId = null;
let currentSortColumn = null;

function sortByName(dir = 1) {
  return function(a, b) {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1 * dir;
    }
    if (nameA > nameB) {
      return 1 * dir;
    }

    // names must be equal
    return 0;
  }
}

function sortByGrade(dir) {
  return function(a, b) {
    const gradeA = Number(a.grade);
    const gradeB = Number(b.grade);
    if (gradeA < gradeB) {
      return -1 * dir;
    }
    if (gradeA > gradeB) {
      return 1 * dir;
    }

    return 0;
  }
}

/**
 * ===================================================================
 * EVENT LISTENERS
 * ===================================================================
 */
editForm.on('submit', function(event) {
  // Stop the usual submission process
  event.preventDefault();

  const formData = new FormData(editForm[0]);
  const edited = {
    id: Number(formData.get('id')),
    name: formData.get('name'),
    grade: Number(formData.get('grade')),
  }

  const index = students.findIndex(student => student.id === edited.id);
  students[index] = edited;

  currentEditedRow.html(generateRow(edited).html());
  currentEditedRow = null;
  currentEditedStudentId = null;
});

studentTableHeader.find('.sortable').on('click', function(event) {
  const sortBy = $(this).attr('data-sort');
  const sortDirStr = $(this).attr('data-sort-dir');

  let sortDir = 1;
  let sortIcon = '';

  if (currentSortColumn !== null) {
    currentSortColumn.find('.dir-icon').text('');
  }

  currentSortColumn = $(this);

  switch(sortDirStr) {
    case '':
    case '-1':
      sortDir = 1;
      sortIcon = '&and;';
      break;
    case '1':
    default:
      sortDir = -1;
      sortIcon = '&or;';
      break;
  }

  $(this).attr('data-sort-dir', sortDir);

  let sortFn = null;
  switch(sortBy) {
    case 'name':
      sortFn = sortByName(sortDir);
      break;
    case 'grade':
      sortFn = sortByGrade(sortDir);
      break;
  }

  $(this).find('.dir-icon').html(sortIcon);
  students.sort(sortFn);
  renderStudentTable();
});

toggleBtn.addEventListener('click', function(event) {
  bodyEle.classList.toggle('dark');
  isDarkMode = !isDarkMode;
  this.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
});

newStudentAddBtn.on('click', function(event) {
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

studentTableBody
  .on('click', '.delete-btn', function(event) {
    const row = $(event.target).parents('tr');
    const studentId = Number(row.attr('data-id'));
    row.animate({
      opacity: 0
    }, {
      duration: 500,
      complete: function() {
        row.remove();
        const index = students.findIndex(student => student.id === studentId);
        students.splice(index, 1);
      }
    });
  })
  .on('click', '.edit-btn', function(event) {
    const row = $(event.target).parents('tr');
    currentEditedRow = row;
    const student = students.find(student => student.id === Number(row.attr('data-id')));
    currentEditedStudentId = student.id;

    row.html(getEditTemplate(student));
  })
  .on('click', '#edit-cancel-btn', function(event) {
    const student = students.find(student => student.id === currentEditedStudentId);
    currentEditedRow.html(generateRow(student).html());
    currentEditedStudentId = null;
    currentEditedRow = null;
  })

/**
 * ===================================================================
 * END EVENT LISTENERS
 * ===================================================================
 */

const optionsTemplate = `<div class="options-container">
<strong>MENU</strong>
<ul class="options-list">
  <li class="edit-btn">Edit</li>
  <li class="delete-btn">Delete</li>
</ul></div>`;

const getEditTemplate = function(student) {
  return `
    <td><input type="text" name="name" autocomplete="false" placeholder="Student Name" value=${student.name} form="edit-form" /></td>
    <td><input type="number" name="grade" autocomplete="false" placeholder="Student Name" value=${student.grade} form="edit-form" /></td>
    <td>
      <button type="submit" form="edit-form">Save</button>
      <button type="reset" form="edit-form">Reset</button>
      <button type="button" form="edit-form" id="edit-cancel-btn">Cancel</button>
      <input type="hidden" name="id" value="${student.id}" form="edit-form" />
    </td>
  `;
}

function generateRow(student) {
  const row = $('<tr/>').attr('data-id', student.id);
  const nameCol = $('<td/>').addClass('name-col').text(student.name);
  const gradeCol = $('<td/>').addClass('grade-col').text(student.grade);
  const optionsCol = $('<td/>').addClass('options-col').html(optionsTemplate);

  row
    .append(nameCol)
    .append(gradeCol)
    .append(optionsCol);

  return row;
}

function renderStudentTable() {
  studentTableBody[0].innerHTML = '';

  for(let i = 0; i < students.length; i++) {
    const student = students[i];

    generateRow(student).appendTo(studentTableBody);
  }
}

renderStudentTable();