import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('.btn-start');
const datePicker = document.querySelector('#datetime-picker');
let userSelectedDate;

// Початкове вимкнення кнопки старту
startButton.disabled = true;

flatpickr(datePicker, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    validateDate(userSelectedDate);
  },
});

function validateDate(userSelectedDate) {
  if (userSelectedDate < new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'center',
    });
    startButton.disabled = true;
  } else {
    startButton.disabled = false;
  }
}

class Timer {
  constructor({ onTick }) {
    this.isActive = false;
    this.onTick = onTick;
    this.intervalId = null;
  }

  start() {
    if (this.isActive) {
      // Якщо таймер вже активний, не запускати
      startButton.disabled = true;
      datePicker.disabled = true;

      iziToast.warning({
        title: 'Timer has already been active',
        message: 'Wait please!',
        position: 'center',
      });
      return;
    }
    // Отключаем кнопку сразу при старте таймера
    startButton.disabled = true;
    datePicker.disabled = true;

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - currentTime;

      if (deltaTime <= 0) {
        clearInterval(this.intervalId); // Зупинка таймера, коли час вичерпано
        this.onTick({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        this.isActive = false;

        // Після завершення таймера
        datePicker.disabled = false;
        startButton.disabled = true; // Залишаємо кнопку неактивною

        iziToast.success({
          title: 'Time is up!',
          message: 'The countdown has finished.',
        });
        return;
      }

      const time = this.convertMs(deltaTime);
      this.onTick(time);
    }, 1000);
  }

  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.addLeadingZero(Math.floor(ms / day));
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const time = new Timer({
  onTick: updateTimer,
});

startButton.addEventListener('click', time.start.bind(time));

function updateTimer({ days, hours, minutes, seconds }) {
  document.querySelector('[data-days]').textContent = days;
  document.querySelector('[data-hours]').textContent = hours;
  document.querySelector('[data-minutes]').textContent = minutes;
  document.querySelector('[data-seconds]').textContent = seconds;
}
