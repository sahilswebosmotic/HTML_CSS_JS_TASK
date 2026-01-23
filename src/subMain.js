export default class SubMain {
  constructor() {
    this.employees = [];
    this.id = null;
    this.loadFromStorage();
    this.formHandler();
    
    this.render_Basic_Employee_Table(this.employees);
    this.render_Advanced_Employee_Table(this.employees);
  }

  toggleViewsVisibility() {
    const basicView = document.querySelector('.basic-view');
    const advanceView = document.querySelector('.advance-view');

    if (!basicView || !advanceView) return;

    const hasData = this.employees.length > 0;

    basicView.style.display = hasData ? 'block' : 'none';
    advanceView.style.display = hasData ? 'block' : 'none';
  }

  loadFromStorage() {
    const data = localStorage.getItem('userPrefs');
    if (data) {
      this.employees = JSON.parse(data);
    } else {
      this.employees = [];
      this.saveToStorage();
    }
  }

  saveToStorage() {
    localStorage.setItem('userPrefs', JSON.stringify(this.employees));
  }

  formatDOB(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${m}/${d}/${y}`;
  }

  // validation error
  showError(el, msg) {
    el.textContent = msg;
    el.classList.add('error-Msg');
    el.style.display = 'block';
  }

  hideError(el) {
    el.textContent = '';
    el.style.display = 'none';
  }

  formHandler() {
    const form = document.getElementById('employeeForm');
    const dobInput = document.getElementById('dob');
    // dates
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    dobInput.max = `${year}-${month}-${day}`;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const maleRadio = document.getElementById('male');
      const femaleRadio = document.getElementById('female');
      const emailInput = document.getElementById('email');
      const phoneInput = document.getElementById('phone');

      // gender
      let gender = '';
      if (maleRadio.checked) gender = 'Male';
      else if (femaleRadio.checked) gender = 'Female';

      // hobbies
      const hobbyInputs = document.querySelectorAll('input[name="hobby"]:checked');

      const hobbies = [];
      for (let i = 0; i < hobbyInputs.length; i++) {
        hobbies.push(hobbyInputs[i].value);
      }

      const employeeData = {
        id: Date.now(),
        name: nameInput.value.trim(),
        gender,
        dob: dobInput.value,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        hobbies,
      };


      if (!employeeData.name) {
        this.showError(nameError, 'Name is required');
        nameInput.focus();
        return;
      }
      this.hideError(nameError);

      if (employeeData.name.length < 4 || employeeData.name.length > 20) {
        this.showError(nameError, 'Name should contain character between 4 to 20');
        nameInput.focus();
        return;
      }
      this.hideError(nameError);

      if (!employeeData.dob) {
        this.showError(dateError, 'DOB is not Entered');
        dobInput.focus();
        return;
      }
      this.hideError(dateError);

      if(employeeData.dob>dobInput.max){
        this.showError(dateError,'Max input date is Today');
        dobInput.focus();
        return;
      }
      this.hideError(dateError);


      if (!employeeData.email) {
        this.showError(emailError, 'Email is required');
        emailInput.focus();
        return;
      }
      this.hideError(emailError);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      if (!emailRegex.test(employeeData.email)) {
        this.showError(emailError, 'Enter a valid email');
        emailInput.focus();
        return;
      }
      this.hideError(emailError);

      if (phoneInput.value.length > 1) {
        if (phoneInput.value.length > 10 || phoneInput.value.length < 10) {
          this.showError(phoneError, 'Enter a valid 10 digit phone number)');
          phoneInput.focus();
          return;
        }
      }
      this.hideError(phoneError);

      if (this.id !== null) {
        this.employees[id] = employeeData;
        this.id = null;
      } else {
        this.employees.push(employeeData);
      }

      this.saveToStorage();
      this.render_Basic_Employee_Table(this.employees);
      this.render_Advanced_Employee_Table(this.employees);
      this.toggleViewsVisibility();
      form.reset();
    });
  }
  

  // basic view
  render_Basic_Employee_Table(data) {
    this.toggleViewsVisibility();
    const container = document.querySelector('.basic-view-table');
    
    container.innerHTML = '';

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
      [emp.name, emp.gender, this.formatDOB(emp.dob), emp.email, emp.phone, emp.hobbies.join(',  ')].forEach(
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

      del_btn.addEventListener('click', () => {
        this.employees.splice(id, 1);
        this.saveToStorage(data);
        this.render_Advanced_Employee_Table(this.employees);
        this.render_Basic_Employee_Table(this.employees);
      });

      del_btn.classList.add('del-btn');

      const up_btn = document.createElement('button');
      up_btn.textContent = 'UPDATE';
      up_btn.classList.add('up-btn');

      up_btn.addEventListener('click', () => {
        this.id = id;

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
        let sbmtButton = document.getElementById('submit-btn');
        sbmtButton.textContent = 'Update';

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      document.getElementById('submit-btn').textContent = 'Submit';

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
    const container = document.querySelector('.advance-view-table');

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
          td.innerText = this.formatDOB(emp[header.key]);
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
        this.editIn = index;

        // b = ['name','dob','email'];
        // b.forEach(field => {
        //   document.getElementById(field).value = emp[field];
        // });

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
        document.getElementById('submit-btn').textContent = 'Update';

        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
      document.getElementById('submit-btn').textContent = 'Submit';
      td.appendChild(del_btn);
      td.appendChild(up_btn);

      bottom_row.appendChild(td);
    });

    tbody.appendChild(bottom_row);
    table.appendChild(tbody);
    container.appendChild(table);
  }
}
