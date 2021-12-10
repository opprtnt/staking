let config = {
  coin: 0,
  time: 400,
  percentage: 1,
  coeff1: 20,
  coeff2: 35,
  coeff3: 50,
  days: 0,
}

// Конструктор стейкинга
function Staking(coef, day, coin) {
  this.coef = coef;
  this.day = day;//оставшееся
  this.coin = 0;// стейкинг
  this.period = day;//общее кол-во дней
  this.sum = coin; //отправленые в стейкинг
  this.work = true;
}

// Добыча крипты
document.addEventListener('keydown', function (e) {
  if (e.code == 'KeyD') {
    config.coin++;
    amount.innerHTML = config.coin;
    console.log()
  }
})
let interval;
let state = [];
let amount = document.querySelector('.amount');
let input = document.querySelector('.stak');
let btn = document.querySelector('.btn-stak');
let selectDay = document.querySelector('.stak-days');
let errorBlock = document.querySelector('.error');
let table = document.querySelector('.table-body');
let dayCounter;


btn.addEventListener('click', function () {
  if (isNaN(input.value) || input.value == false) {
    errorBlock.classList.add('error_active');
    errorBlock.innerHTML = 'Только числовые значения'
    return
  };
  if (+input.value > config.coin) {
    errorBlock.classList.add('error_active');
    errorBlock.innerHTML = 'Недостотачно денег';
    return
  }
  if (+input.value <= 1) {
    errorBlock.classList.add('error_active');
    errorBlock.innerHTML = 'Вводимое число должно быть больше 1';
    return
  }
  errorBlock.classList.remove('error_active')
  let coin = +input.value;
  let days = +selectDay.value;
  config.coin -= +input.value;
  let coef;
  if (selectDay.value == '30') coef = config.coeff1;
  else if (selectDay.value == '60') coef = config.coeff2;
  else coef = config.coeff3;
  state.push(new Staking(coef, days, +coin));
  let tr = document.createElement('tr');
  tr.innerHTML = `<td>${state[state.length - 1].sum}</td><td>${state[state.length - 1].period}d</td><td>${state[state.length - 1].day}d</td><td>${state[state.length - 1].coin}</td>`
  table.append(tr);
  if (!dayCounter) dayCounter = setInterval(staking, config.time);
})


// Вычисления стейкинга
function staking() {
  let tr = '';
  for (let row of state) {
    if (row.day > 0 && row.work) {
      row.coin = +(row.coin + (row.sum * config.percentage / 100) / (Math.log10(row.sum)) * row.coef / row.period).toFixed(4);
      row.day--;
      console.log(row.day)
      console.log(row.coin)
    }
    else if (row.work) {
      config.coin = +(config.coin + row.coin + row.sum).toFixed(4);
      row.work = false;
    }
    // Рисуем таблицу
    tr += `<tr><td>${row.sum}</td><td>${row.period}d</td><td>${row.day}d</td><td>${row.coin}</td></tr>`;
  }
  table.innerHTML = tr;
  amount.innerHTML = config.coin;
  // Вычитаем проценты кошелка со 100 дней
  if (!(config.days % 100)) {
    config.coin = +(config.coin - (config.coin * Math.log(config.coin) / 100)).toFixed(4);
  }
  config.days++;
}