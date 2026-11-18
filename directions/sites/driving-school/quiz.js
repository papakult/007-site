(() => {
  const root = document.querySelector('#practice.adq');
  if (!root) return;

  const rules = 'https://www.consultant.ru/document/cons_doc_LAW_2709/';
  const maneuvers = '2fdfa8559de67744dab415a31c1f987bc016016b/';
  const questions = [
    {
      topic: 'Выезд из двора',
      heading: 'Кому уступить при выезде?',
      situation: 'Вы выезжаете со двора на улицу. По тротуару перед вами идёт человек, а по дороге приближается машина. Кто проедет или пройдёт первым?',
      answers: ['Только пешеход', 'Только автомобиль на дороге', 'И пешеход, и автомобиль', 'Вы, если уже включили поворотник'],
      correct: 2,
      explanation: 'Сначала пропустите пешехода на тротуаре. Затем дождитесь промежутка, чтобы при выезде на дорогу никому не пришлось тормозить или менять направление.',
      rule: '8.3',
      chapter: maneuvers
    },
    {
      topic: 'Смена полосы',
      heading: 'Когда можно перестроиться?',
      situation: 'Вам нужно в левый ряд. Вы включили поворотник. Слева чуть позади по своей полосе едет машина. Как поступить?',
      answers: ['Подождать безопасного промежутка', 'Перестроиться сразу после сигнала', 'Попросить водителя слева затормозить', 'Занять часть его полосы и подождать'],
      correct: 0,
      explanation: 'У автомобиля, который продолжает ехать в своей полосе, преимущество. Сигнал поворота сообщает о вашем намерении. Перед манёвром проверьте зеркало и слепую зону.',
      rule: '8.4',
      chapter: maneuvers
    },
    {
      topic: 'Поворот направо',
      heading: 'Кто первым проедет поворот?',
      situation: 'Вы поворачиваете направо на зелёный. Справа по велодорожке на разрешающий сигнал едет велосипедист. Ваши пути пересекутся.',
      answers: ['Автомобиль, если он ближе к повороту', 'Автомобиль, потому что ему зелёный', 'Кто первым подаст звуковой сигнал', 'Велосипедист, а за ним автомобиль'],
      correct: 3,
      explanation: 'При повороте уступите велосипедисту, пересекающему дорогу, на которую вы поворачиваете. Оставьте ему место, чтобы он проехал, сохраняя скорость и направление.',
      rule: '13.1',
      chapter: '74cbe820904f4f8ce76047ddbd81d14c8b953d3e/'
    },
    {
      topic: 'Остановка у перехода',
      heading: 'Здесь можно высадить пассажира?',
      situation: 'У правого края дороги есть свободное место. Если остановиться, от переднего бампера до зебры останется три метра. Вы хотите высадить пассажира.',
      answers: ['Да, если остановиться на одну минуту', 'Нет, выберу место, где остановка разрешена', 'Да, если пешеходов пока нет', 'Да, если включить аварийную сигнализацию'],
      correct: 1,
      explanation: 'Перед пешеходным переходом нужно оставить не менее пяти метров. Даже короткая остановка для высадки ближе к зебре запрещена, чтобы водители могли вовремя увидеть пешехода.',
      rule: '12.4',
      chapter: '59ded54942baa2143676e12b31244b0cb7ada00d/'
    }
  ];

  const get = selector => root.querySelector(selector);
  const choices = get('.adq-choices');
  const feedback = get('.adq-feedback');
  const followup = get('.adq-followup');
  const source = get('[data-adq-source]');
  const next = get('[data-adq-next]');
  const heading = get('[data-adq-heading]');
  const stage = get('[data-adq-stage]');
  const result = get('.adq-result');
  const questionPanel = get('[data-adq-question]');
  const review = get('.adq-review');
  const answers = [];
  let current = 0;

  function element(tag, content, className) {
    const node = document.createElement(tag);
    node.textContent = content;
    if (className) node.className = className;
    return node;
  }

  function showProgress(position) {
    root.querySelectorAll('.adq-steps i').forEach((step, index) => {
      step.classList.toggle('adq-active', index < position);
    });
  }

  function showQuestion(focusHeading) {
    const question = questions[current];
    result.hidden = true;
    questionPanel.hidden = false;
    stage.textContent = 'Ситуация ' + (current + 1) + ' из ' + questions.length;
    showProgress(current + 1);
    heading.textContent = question.heading;
    get('#adq-context').textContent = question.situation;
    followup.hidden = true;
    feedback.replaceChildren();
    choices.replaceChildren();

    question.answers.forEach((answer, index) => {
      const button = element('button', '', 'adq-choice');
      button.type = 'button';
      const mark = element('span', 'АБВГ'[index], 'adq-choice-mark');
      mark.setAttribute('aria-hidden', 'true');
      button.append(mark, element('span', answer));
      button.addEventListener('click', () => gradeAnswer(index));
      choices.append(button);
    });
    if (focusHeading) heading.focus();
  }

  function gradeAnswer(selected) {
    if (answers.length !== current) return;
    const question = questions[current];
    answers.push(selected);
    Array.from(choices.children).forEach((button, index) => {
      button.setAttribute('aria-disabled', 'true');
      button.tabIndex = selected === index ? 0 : -1;
      if (index === question.correct) {
        button.classList.add('adq-right');
        button.firstChild.textContent = '✓';
        button.setAttribute('aria-label', question.answers[index] + '. Верный ответ.');
      } else if (index === selected) {
        button.classList.add('adq-wrong');
        button.firstChild.textContent = '×';
        button.setAttribute('aria-label', question.answers[index] + '. Ваш ответ, неверно.');
      }
    });

    const verdict = selected === question.correct ? 'Верно.' : 'Верный ответ — ' + question.answers[question.correct].toLocaleLowerCase('ru-RU') + '.';
    feedback.replaceChildren(element('strong', verdict), element('p', question.explanation));
    source.href = rules + question.chapter;
    source.textContent = 'ПДД, пункт ' + question.rule;
    const label = current === questions.length - 1 ? 'Посмотреть результат' : 'Следующая ситуация';
    const arrow = element('span', '→');
    arrow.setAttribute('aria-hidden', 'true');
    next.replaceChildren(label, arrow);
    followup.hidden = false;
  }

  function showResult() {
    questionPanel.hidden = true;
    result.hidden = false;
    stage.textContent = 'Маршрут пройден';
    showProgress(questions.length);
    const score = answers.filter((answer, index) => answer === questions[index].correct).length;
    const title = get('[data-adq-score]');
    title.textContent = score + ' из ' + questions.length + ' верно';
    get('[data-adq-summary]').textContent = score === questions.length
      ? 'Вы разобрались со всеми четырьмя ситуациями городского выезда.'
      : 'Посмотрите, какие ситуации стоит ещё раз разобрать перед поездкой.';
    review.replaceChildren();
    questions.forEach((question, index) => {
      const correct = answers[index] === question.correct;
      const item = element('li', '');
      const details = element('details', '');
      const summary = element('summary', question.topic);
      summary.append(element('span', correct ? 'Верно' : 'Есть ошибка', correct ? '' : 'adq-missed'));
      const explanation = element('p', question.explanation);
      details.append(summary, explanation);
      item.append(details);
      review.append(item);
    });
    title.focus();
  }

  next.addEventListener('click', () => {
    if (answers.length !== current + 1) return;
    current += 1;
    if (current < questions.length) showQuestion(true);
    else showResult();
  });
  get('[data-adq-restart]').addEventListener('click', () => {
    current = 0;
    answers.length = 0;
    showQuestion(true);
  });
  get('.adq-interface').hidden = false;
  showQuestion(false);
})();
