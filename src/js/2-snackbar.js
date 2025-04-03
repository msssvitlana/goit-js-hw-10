import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';

iziToast.show({
  theme: 'dark',
  icon: 'icon-person',
  title: 'Hello',
  message: '🔔 Welcome!',
  position: 'topRight',
  backgroundColor: '#09f',
  timeout: 5000,
  closeOnClick: true,
  onOpening: function (instance, toast) {
    console.info('callback abriu!');
  },
});

let form = document.querySelector('.form');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const state = event.target.elements.state.value;
  console.log(state);
  const delay = Number(event.target.elements.delay.value);
  console.log(delay);

  if (delay <= 0 || !state) {
    iziToast.warning({
      title: 'Caution',
      message: '⚠️ You forgot important data or entered an invalid delay',
      position: 'topRight',
      timeout: 2000,
    });
    return;
  }

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(delay => {
      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});
