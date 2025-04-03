import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import injectHTML from 'vite-plugin-html-inject';

const startButton = document.querySelector('.btn-start');
const timerFace = document.querySelector('.timer');
const datePicker = document.querySelector('#datetime-picker');
let userSelectedDate;
// const timerValue = document.querySelector('[seconds]');
// const timerLabel = document.querySelectorAll('.label');

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
    this.init;
    // console.log(this.init);
    this.intervalId = null;
  }

  init() {
    const time = this.convertMs(0);
    this.onTick(time);
  }

  start() {
    if (this.isActive || !userSelectedDate) {
      datePicker.disabled = true;
      return;
    }

    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - currentTime;
      if (deltaTime <= 0) {
        clearInterval(this.intervalId); // зупинка таймера, коли час вичерпано
        this.onTick({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        this.isActive = false;
        datePicker.disabled = false;
        startButton.disabled = true;
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
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
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
  timerFace.textContent = `${days}:${hours}:${minutes}:${seconds}`;
}
console.log(time);
