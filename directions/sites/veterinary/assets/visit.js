(() => {
  const widget = document.querySelector('[data-visit]');
  if (!widget) return;

  const fallback = document.querySelector('[data-visit-fallback]');
  const steps = Array.from(widget.querySelectorAll('.visit-step'));
  const track = Array.from(widget.querySelectorAll('.visit-track li'));
  const service = widget.querySelector('#visit-service');
  const doctor = widget.querySelector('#visit-doctor');
  const datesArea = widget.querySelector('[data-visit-dates]');
  const timesArea = widget.querySelector('[data-visit-times]');
  const showSummary = widget.querySelector('[data-visit-go="2"]');
  const doctors = [
    { key: 'therapist', title: 'Врач-терапевт', services: ['therapy', 'checkup'] },
    { key: 'surgeon', title: 'Врач-хирург', services: ['surgery'] },
  ];
  const shortDay = new Intl.DateTimeFormat('ru-RU', { weekday: 'short', timeZone: 'UTC' });
  const shortDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const longDate = new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  const clock = new Intl.DateTimeFormat('en-CA', { day: 'numeric', month: 'numeric', year: 'numeric', timeZone: 'Europe/Moscow' });
  const appointments = new Map();
  const dateParts = Object.fromEntries(clock.formatToParts(new Date()).map(part => [part.type, part.value]));
  const slots = new Map();
  let chosenDate = '';
  let chosenTime = '';

  function updateDoctors(preferredDoctor) {
    doctor.replaceChildren(new Option('Специалист по направлению', ''));
    for (const person of doctors) {
      if (person.services.includes(service.value)) doctor.add(new Option(person.title, person.key));
    }
    if (Array.from(doctor.options).some(option => option.value === preferredDoctor)) doctor.value = preferredDoctor;
  }

  function radioCard(parent, name, value, text, caption) {
    const label = document.createElement('label');
    const control = document.createElement('input');
    control.type = 'radio';
    control.name = name;
    control.value = value;
    const card = document.createElement('span');
    if (caption) {
      card.className = 'visit-date-card';
      const weekday = document.createElement('small');
      weekday.textContent = caption;
      const day = document.createElement('b');
      day.textContent = text;
      card.append(weekday, day);
      control.setAttribute('aria-label', longDate.format(appointments.get(value)));
    } else {
      card.textContent = text;
    }
    label.append(control, card);
    parent.append(label);
    return control;
  }

  function updateTimes() {
    const offeredTimes = slots.get(chosenDate) || [];
    if (!offeredTimes.includes(chosenTime)) chosenTime = '';
    timesArea.replaceChildren();
    for (const time of offeredTimes) {
      const control = radioCard(timesArea, 'visit-time', time, time);
      control.checked = time === chosenTime;
    }
    showSummary.disabled = !chosenTime;
  }

  function populateSchedule() {
    // UTC noon represents the calendar day, already resolved in Moscow.
    for (let i = 1; i <= 7; i++) {
      const date = new Date(Date.UTC(+dateParts.year, +dateParts.month - 1, +dateParts.day + i, 12));
      const key = date.toISOString().slice(0, 10);
      appointments.set(key, date);
      const morning = date.getUTCDate() % 2 === 0;
      slots.set(key, morning ? ['09:30', '11:00', '14:30', '17:00'] : ['10:00', '12:30', '15:00', '18:30']);
      const control = radioCard(datesArea, 'visit-date', key, shortDate.format(date).replace('.', ''), shortDay.format(date));
      if (i === 1) {
        control.checked = true;
        chosenDate = key;
      }
    }
    updateTimes();
  }

  function updateSummary() {
    const fields = {
      pet: widget.querySelector('input[name="visit-pet"]:checked').value,
      service: service.selectedOptions[0].text,
      doctor: doctor.selectedOptions[0].text,
      when: longDate.format(appointments.get(chosenDate)) + ', ' + chosenTime + ' (МСК)',
    };
    for (const output of widget.querySelectorAll('[data-visit-out]')) output.textContent = fields[output.dataset.visitOut];
  }

  function openStep(index) {
    if (index === 2) {
      if (!chosenTime || !slots.get(chosenDate)?.includes(chosenTime)) return;
      updateSummary();
    }
    steps.forEach((step, current) => {
      step.hidden = current !== index;
      if (current === index) track[current].setAttribute('aria-current', 'step');
      else track[current].removeAttribute('aria-current');
    });
    const title = steps[index].querySelector('h2');
    title.focus({preventScroll: true});
    const panel = widget.closest('.visit-panel');
    if (title.getBoundingClientRect().top < 100) panel.scrollIntoView({block:'start', behavior:'instant'});
  }

  const params = new URLSearchParams(window.location.search);
  const linkedService = params.get('service');
  const linkedDoctor = doctors.find(person => person.key === params.get('doctor'));
  if (Array.from(service.options).some(option => option.value === linkedService)) service.value = linkedService;
  else if (linkedDoctor) service.value = linkedDoctor.services[0];

  updateDoctors(linkedDoctor?.key);
  populateSchedule();
  service.addEventListener('change', () => updateDoctors(doctor.value));
  datesArea.addEventListener('change', event => {
    if (!appointments.has(event.target.value)) return;
    chosenDate = event.target.value;
    updateTimes();
  });
  timesArea.addEventListener('change', event => {
    if (!slots.get(chosenDate).includes(event.target.value)) return;
    chosenTime = event.target.value;
    showSummary.disabled = false;
  });
  widget.querySelectorAll('[data-visit-go]').forEach(button => {
    button.addEventListener('click', () => openStep(Number(button.dataset.visitGo)));
  });
  fallback.hidden = true;
  widget.hidden = false;
})();
