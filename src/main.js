import SubMain from "./subMain.js";
export default class Main {
  constructor() {
    new SubMain();
    this.employees = [
    {
        name: "John",
        gender: "Male",
        dob: "01/02/1988",
        email: "john@example.com",
        phone: "9898767514",
        hobbies: ["Cricket"]
    },
    {
        name: "Mary",
        gender: "Female",
        dob: "01/06/1988",
        email: "mary@example.com",
        phone: "9977541236",
        hobbies: ["Cricket", "Chess"]
    }
  ];
    this.initializeForm();
  }

  initializeForm() {
    const form = document.getElementById("employeeForm");
    if (!form) {
      console.error("Form not found");
      return;
    }

    const nameInput = document.getElementById("name");
    const maleRadio = document.getElementById("male");
    const femaleRadio = document.getElementById("female");
    const dobInput = document.getElementById("dob");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const hobbyInputs = document.getElementsByClassName("hobby");

    // block future dates (UI)
    // const today = new Date().toISOString().split("T")[0];
    // dobInput.max = today;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // gender
      let gender = "";
      if (maleRadio.checked) gender = "Male";
      else if (femaleRadio.checked) gender = "Female";

      // hobbies
      let hobbies = [];
      for (let i = 0; i < hobbyInputs.length; i++) {
        if (hobbyInputs[i].checked) {
          hobbies.push(hobbyInputs[i].value);
        }
      }

      const employeeData = {
        name: nameInput.value.trim(),
        gender,
        dob: dobInput.value,
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        hobbies
      };

      // REQUIRED validation
      if (!employeeData.name || !employeeData.email || !employeeData.gender) {
        alert("Name, Email and Gender are required");
        return;
      }

      // NAME length validation
      if (employeeData.name.length < 4 || employeeData.name.length > 20) {
        alert("Name must be between 4 and 20 characters");
        return;
      }

      // DATE validation (logic level)
      // const selectedDate = new Date(employeeData.dob);
      // const currentDate = new Date();
      // currentDate.setHours(0, 0, 0, 0);

      // if (selectedDate > currentDate) {
      //   alert("Future dates are not allowed");
      //   return;
      // }

      // STORE
      this.employees.push(employeeData);

      // RENDER
      this.renderEmployeeTable(this.employees);

      form.reset();
    });
  }
  // basis view
  renderEmployeeTable(data) {
    const container = document.querySelector(".basic-view");
    container.style.width='80%';
    if (!container) return;

    container.innerHTML = "";

    const table = document.createElement("table");
    table.style.width = "80%";
    table.style.alignSelf="center";
    // table.style.borderCollapse = "collapse";

    const headers = ["Name", "Gender", "DOB", "Email", "Phone", "Hobbies"];
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    headers.forEach(text => {
      const th = document.createElement("th");
      th.innerText = text;
      th.style.border = "1px solid #ccc";
      th.style.padding = "8px";
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    data.forEach(emp => {
      const row = document.createElement("tr");

      [
        emp.name,
        emp.gender,
        emp.dob,
        emp.email,
        emp.phone,
        emp.hobbies.join(", ")
      ].forEach(value => {
        const td = document.createElement("td");
        td.innerText = value;
        td.style.border = "1px solid #ccc";
        td.style.padding = "8px";
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }
}



window.onload = function () {
  new Main();
};
