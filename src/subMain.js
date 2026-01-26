import {
  toggleViewsVisibility,
  formatDOB,
  showError,
  hideError,
  getFormData,
  setMaxDOB,
} from './Utils.js';


const STORAGE_KEY = 'usersPrefs';

const GENDER = {
  MALE: 'Male',
  FEMALE: 'Female',
};
const DOM = {
  form: document.getElementById('employeeForm'),
  submitBtn: document.getElementById('submit-btn'),
  cancelBtn: document.getElementById('cancel-btn'),

  inputs: {
    name: document.getElementById('name'),
    dob: document.getElementById('dob'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    male: document.getElementById('male'),
    female: document.getElementById('female'),
    hobbies: document.querySelectorAll('input[name="hobby"]'),
  },

  views: {
    basic: document.querySelector('.basic-view'),
    advance: document.querySelector('.advance-view'),
    basicTable: document.querySelector('.basic-view-table'),
    advanceTable: document.querySelector('.advance-view-table'),
  },
};

export default class SubMain {
  constructor() {
    this.employees = [];
    this.id = null;
    this.loadFromStorage();
    setMaxDOB(DOM.inputs.dob);
    this.formHandler();

    this.render_Basic_Employee_Table(this.employees);
    this.render_Advanced_Employee_Table(this.employees);
  }


  loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      this.employees = JSON.parse(data);
    } else {
      this.employees = [];
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.employees));
  }



  LiveValidation() {
    DOM.inputs.name.addEventListener('input', () => {
      if (DOM.inputs.name.value.length >= 4 && DOM.inputs.name.value.length <= 20) {
        hideError(nameError);
      }
    });

    DOM.inputs.dob.addEventListener('change', () => {
      const value = DOM.inputs.dob.value;
      if (!value) return;

      const selectedDate = new Date(value);
      const today = new Date();
      const tommorow = new Date(today);
      tommorow.setDate(today.getDate()+1);
      tommorow.setHours(0, 0, 0, 0);

      if (!isNaN(selectedDate) && selectedDate <= tommorow ) {
        hideError(dateError);
      }
    });


    DOM.inputs.email.addEventListener('input', () => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(DOM.inputs.email.value)) {
        hideError(emailError);
      }
    });

    DOM.inputs.phone.addEventListener('input', () => {
      if (
        !DOM.inputs.phone.value ||
        DOM.inputs.phone.value.length === 10
      ) {
        hideError(phoneError);
      }
    });

  }



  formHandler() {
    const form = document.getElementById('employeeForm');

    this.LiveValidation();

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const employeeData = getFormData(DOM.inputs, GENDER);
      const errors = {};


      if (employeeData.name.length < 4 || employeeData.name.length > 20) {
        errors.name = "* Name Should contain character between 4 to 20";
      }



      if (!employeeData.dob) {
        errors.dob = "* DOB is required";
      } else {
        const selectedDate = new Date(employeeData.dob);
        const today = new Date();
        const tommorow = new Date(today);
        tommorow.setDate(today.getDate()+1);
        tommorow.setHours(0,0,0,0);
        if (isNaN(selectedDate.getTime())) {
          errors.dob = "* Invalid date";
        } else if (selectedDate > tommorow) {
          errors.dob = "* Future dates are not allowed";
        }
      }


      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailRegex.test(employeeData.email)) {
        errors.email = "* Enter a Valid Email";
      }


      if (employeeData.phone && employeeData.phone.length !== 10) {
        errors.phone = "* Enter a valid 10 digit number";
      }


      if (Object.keys(errors).length > 0) {
        if (errors.name) showError(nameError, errors.name);
        if (errors.dob) showError(dateError, errors.dob);
        if (errors.email) showError(emailError, errors.email);
        if (errors.phone) showError(phoneError, errors.phone);
        return;
      }

      if (this.id !== null) {
        this.employees[this.id] = employeeData;
        this.id = null;
      } else {
        this.employees.push(employeeData);
      }

      this.saveToStorage();
      this.render_Basic_Employee_Table(this.employees);
      this.render_Advanced_Employee_Table(this.employees);
      toggleViewsVisibility(this.employees, DOM.views);
      DOM.form.reset();
      this.id = null;
    });
  }


  // basic view
  render_Basic_Employee_Table(data) {
    const container = DOM.views.basicTable;

    container.innerHTML = '';

    toggleViewsVisibility(data, DOM.views);

    const table = document.createElement('table');
    table.classList.add('view-table-innertable');

    const headers = ['Name', 'Gender', 'DOB', 'Email', 'Phone', 'Hobbies'];
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach((text) => {
      const th = document.createElement('th');
      th.innerText = text;
      th.classList.add('basic-view-header');
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    data.forEach((emp, id) => {
      const row = document.createElement('tr');
      [emp.name, emp.gender, formatDOB(emp.dob), emp.email, emp.phone, emp.hobbies.join(',  ')].forEach(
        (value) => {
          const td = document.createElement('td');
          td.innerText = value;
          td.classList.add('basic-view-data');
          row.appendChild(td);
        }
      );

      const td = document.createElement('td');
      td.classList.add('basic-view-action-data');

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';
      del_btn.classList.add('del-btn');

      del_btn.addEventListener('click', () => {
        this.employees.splice(id, 1);
        this.saveToStorage();
        this.render_Advanced_Employee_Table(this.employees);
        this.render_Basic_Employee_Table(this.employees);
      });


      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up-btn');

      up_btn.addEventListener('click', () => {
        this.id = id;
        DOM.inputs.name.value = emp.name;
        DOM.inputs.dob.value = emp.dob;
        DOM.inputs.email.value = emp.email;
        DOM.inputs.phone.value = emp.phone;
        DOM.inputs.male.checked = emp.gender === GENDER.MALE;
        DOM.inputs.female.checked = emp.gender === GENDER.FEMALE;


        DOM.inputs.hobbies.forEach(h => {
          h.checked = emp.hobbies.includes(h.value);
        });

        DOM.submitBtn.textContent = 'Update';
        DOM.cancelBtn.style.display = 'block';
        DOM.cancelBtn.onclick = () => {
          DOM.form.reset();
          this.id = null;
          DOM.cancelBtn.style.display = 'none';
          DOM.submitBtn.textContent = 'Submit';
        }
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
    thaction.classList.add('basic-view-action');
    headerRow.appendChild(thaction);

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // Advanced view
  render_Advanced_Employee_Table(data) {
    const container = DOM.views.advanceTable;
    container.innerHTML = '';
    const table = document.createElement('table');
    table.classList.add('view-table-innertable');

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
      th.classList.add('advance-view-header');
      row.appendChild(th);

      data.forEach((emp) => {
        const td = document.createElement('td');
        td.classList.add('advance-view-data');
        if (header.key == 'dob') {
          td.innerText = formatDOB(emp[header.key]);
        } else if (header.key == 'hobbies') {
          td.innerText = emp[header.key].join(',  ');
        } else {
          td.innerText = emp[header.key];
        }
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    const bottom_row = document.createElement('tr');
    const th = document.createElement('th');
    th.innerText = 'Action';
    th.classList.add('advance-view-action');
    bottom_row.appendChild(th);

    data.forEach((emp, id) => {
      const td = document.createElement('td');
      td.classList.add('advance-view-action-data');

      const del_btn = document.createElement('button');
      del_btn.textContent = 'DELETE';
      del_btn.classList.add('del-btn');

      del_btn.addEventListener('click', () => {
        this.employees.splice(id, 1);
        this.saveToStorage(data);
        this.render_Advanced_Employee_Table(this.employees);
        this.render_Basic_Employee_Table(this.employees);
      });

      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up-btn');

      up_btn.addEventListener('click', () => {
        this.id = id;
        DOM.inputs.name.value = emp.name;
        DOM.inputs.dob.value = emp.dob;
        DOM.inputs.email.value = emp.email;
        DOM.inputs.phone.value = emp.phone;
        DOM.inputs.male.checked = emp.gender === GENDER.MALE;
        DOM.inputs.female.checked = emp.gender === GENDER.FEMALE;


        DOM.inputs.hobbies.forEach(h => {
          h.checked = emp.hobbies.includes(h.value);
        });

        DOM.submitBtn.textContent = 'Update';
        DOM.cancelBtn.style.display = 'block';
        DOM.cancelBtn.onclick = () => {
          DOM.form.reset();
          this.id = null;
          DOM.cancelBtn.style.display = 'none';
          DOM.submitBtn.textContent = 'Submit';
        }
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
