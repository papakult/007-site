'use strict';

for (const button of document.querySelectorAll('[data-open-tour]')) {
  const room = rooms.find(item => item.id === button.dataset.openTour);
  button.addEventListener('click', () => {
    openHotelTour(room, 'Перейти к бронированию', () => location.assign('../booking/'));
  });
}
