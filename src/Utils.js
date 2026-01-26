export function toggleViewsVisibility(employees, views) {
  if (!views.basic || !views.advance) return;

  const hasData = employees.length > 0;

  views.basic.style.display = hasData ? 'block' : 'none';
  views.advance.style.display = hasData ? 'block' : 'none';
  views.basicViewSec.style.display = hasData ? 'block' : 'none';
  views.basicViewSecHead.style.display = hasData ? 'block' : 'none';
  views.advanceViewSec.style.display = hasData ? 'block' : 'none';
  views.advanceViewSecHead.style.display = hasData ? 'block' : 'none';
  views.secHead.forEach((element) => {
    element.style.display = hasData ? 'block' : 'none';
  });
}

export function formatDOB(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${m}/${d}/${y}`;
}

export function showError(el, msg) {
  el.textContent = msg;
  el.classList.add('error-Msg');
  el.style.display = 'block';
}

export function hideError(el) {
  el.textContent = '';
  el.style.display = 'none';
}

export function setMaxDOB(dobInput) {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  dobInput.max = `${year}-${month}-${day}`;
}

export function getFormData(inputs, GENDER) {
  const hobbies = [];
  inputs.hobbies.forEach((h) => h.checked && hobbies.push(h.value));

  return {
    id: Date.now(),
    name: inputs.name.value.trim(),
    dob: inputs.dob.value,
    email: inputs.email.value.trim(),
    phone: inputs.phone.value.trim(),
    gender: inputs.male.checked ? GENDER.MALE : inputs.female.checked ? GENDER.FEMALE : '',
    hobbies,
  };
}
