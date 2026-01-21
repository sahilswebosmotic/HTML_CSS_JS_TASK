import SubMain from './subMain.js';
export default class Main {
  constructor() {
    new SubMain();
    this.employees = [];
    this.editIn = null;
    this.startForm();
  }

  startForm() {
    const form = document.getElementById('employeeForm');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const maleRadio = document.getElementById('male');
      const femaleRadio = document.getElementById('female');
      const dobInput = document.getElementById('dob');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');
      // gender
      let gender = '';
      if (maleRadio.checked) gender = 'Male';
      else if (femaleRadio.checked) gender = 'Female';

      // dates
      const today = new Date();
      // Format the date as YYYY-MM-DD
      const year = today.getFullYear();
      const month = today.getMonth().toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      const maxDate = `${year}-${month}-${day}`;
      dobInput.setAttribute('max', maxDate);

      // hobbies
      const hobbyInputs = document.querySelectorAll('input[name="hobby"]:checked');

      const hobbies = [];
      for (let i = 0; i < hobbyInputs.length; i++) {
        hobbies.push(hobbyInputs[i].value);
      }

      const employeeData = {
        name: nameInput.value.trim(),
        gender,
        dob: dobInput.value,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        hobbies,
      };

      if (!employeeData.name || !employeeData.email || !employeeData.gender) {
        alert("Name, Email and Gender are required");
        return;
      }

      if (employeeData.name.length < 4 || employeeData.name.length > 20) {
        alert("Name must be between 4 and 20 characters");
        return;
      }

      // this.employees.push(employeeData);
      if (this.editIn !== null) {
        // UPDATE
        this.employees[this.editIn] = employeeData;
        this.editIn = null;
      } else {
        // CREATE
        this.employees.push(employeeData);
      }

      this.renderbasicEmployeeTable(this.employees);
      this.renderadvancedEmployeeTable(this.employees);

      form.reset();
    });
  }

  // basis view
  renderbasicEmployeeTable(data) {
    const container = document.querySelector('.basic-view-table');
    container.style.width = '100%';
    if (!container) return;

    container.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    // table.style.border-spacing ='0px';
    table.style.alignSelf = 'center';
    table.style.borderCollapse = 'collapse';

    const headers = ['Name', 'Gender', 'DOB', 'Email', 'Phone', 'Hobbies'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((text) => {
      const th = document.createElement('th');
      th.innerText = text;
      th.style.border = '1px solid #ccc';
      // th.style.padding = '8px';
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((emp, index) => {
      const row = document.createElement('tr');

      [emp.name, emp.gender, emp.dob, emp.email, emp.phone, emp.hobbies.join(', ')].forEach((value) => {
        const td = document.createElement('td');
        td.innerText = value;
        td.style.border = '1px solid #ccc';
        row.appendChild(td);
      });

      const td = document.createElement('td');
      td.style.display = 'flex';
      td.style.justifyContent = 'center';
      td.style.borderRight = '1px solid #ccc';
      td.style.borderBottom = '1px solid #ccc';
      td.style.padding = '8px';

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';

      del_btn.addEventListener('click', () => {
        this.employees.splice(index, 1);
        this.renderadvancedEmployeeTable(this.employees);
        this.renderbasicEmployeeTable(this.employees);
        // table.deleteRow(index);
      });

      del_btn.classList.add('del-btn');

      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up-btn');

      up_btn.addEventListener('click', () => {
        this.editIn = index;

        document.getElementById('name').value = emp.name;
        document.getElementById('dob').value = emp.dob;
        document.getElementById('email').value = emp.email;
        document.getElementById('phone').value = emp.phone;

        document.getElementById('male').checked = emp.gender === 'Male';
        document.getElementById('female').checked = emp.gender === 'Female';

        const hobbyInputs = document.querySelectorAll('input[name="hobby"]');
        hobbyInputs.forEach((hobby) => {
          hobby.checked = emp.hobbies.includes(hobby.value);
        });

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      td.appendChild(del_btn);
      td.appendChild(up_btn);
      row.appendChild(td);

      tbody.appendChild(row);
    });

    const thaction = document.createElement('th');
    thaction.innerText = 'Action';
    thaction.style.border = '1px solid #ccc';
    thaction.style.padding = '8px';
    headerRow.appendChild(thaction);

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Advanced view
  renderadvancedEmployeeTable(data) {
    const container = document.querySelector('.advance-view-table');
    if (!container) return;
    container.style.width = '100%';
    container.innerHTML = '';

    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const headers = [
      { label: 'Name', key: 'name' },
      { label: 'Gender', key: 'gender' },
      { label: 'DOB', key: 'dob' },
      { label: 'Email', key: 'email' },
      { label: 'Phone', key: 'phone' },
      { label: 'Hobbies', key: 'hobbies' },
    ];

    const tbody = document.createElement('tbody');

    headers.forEach((header) => {
      const row = document.createElement('tr');

      const th = document.createElement('th');
      th.innerText = header.label;
      th.style.border = '1px solid #ccc';
      th.style.padding = '8px';
      row.appendChild(th);

      data.forEach((emp) => {
        const td = document.createElement('td');
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';
        td.innerText = emp[header.key];
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    const bottom_row = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = 'Action';
    th.style.border = '1px solid #ccc';
    th.style.padding = '8px';
    bottom_row.appendChild(th);

    data.forEach((emp, index) => {
      const td = document.createElement('td');
      td.style.border = '1px solid #ccc';
      td.style.padding = '8px';

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';
      del_btn.classList.add('del-btn');

      del_btn.addEventListener('click', () => {
        // table.deleteColumn(index);
        // var rowCount = table.rows.length;
        // for (let i = 0; i < rowCount; i++) {
        //   table.rows[i].deleteCell(index);
        // }
        this.employees.splice(index, 1);
        this.renderadvancedEmployeeTable(this.employees);
        this.renderbasicEmployeeTable(this.employees);
      });

      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up-btn');

      up_btn.addEventListener('click', () => {
        this.editIn = index;

        document.getElementById('name').value = emp.name;
        document.getElementById('dob').value = emp.dob;
        document.getElementById('email').value = emp.email;
        document.getElementById('phone').value = emp.phone;

        document.getElementById('male').checked = emp.gender === 'Male';
        document.getElementById('female').checked = emp.gender === 'Female';

        const hobbyInputs = document.querySelectorAll('input[name="hobby"]');
        hobbyInputs.forEach((hobby) => {
          hobby.checked = emp.hobbies.includes(hobby.value);
        });

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      td.appendChild(del_btn);
      td.appendChild(up_btn);

      bottom_row.appendChild(td);
    });

    tbody.appendChild(bottom_row);
    table.appendChild(tbody);
    container.appendChild(table);
  }
}

window.onload = function () {
  new Main();
};
