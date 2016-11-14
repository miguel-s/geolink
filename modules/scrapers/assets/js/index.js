'use strict';

const socket = io();

socket.on('connect', () => {
  $('.update').on('click', (e) => {
    e.preventDefault();
    const element = $(e.target).parents('tr');
    const origin = element.data('origin');
    const list = element.data('list');
    element.find('.update').hide();
    element.find('.spinner').show();
    element.find('.stop').hide();
    element.find('.progress-bar')
      .attr('aria-valuenow', 0)
      .width('0%')
      .text('0%');
    socket.emit('start', { origin, list });
  });
  $('.stop').on('click', (e) => {
    e.preventDefault();
    const element = $(e.target).parents('tr');
    const origin = element.data('origin');
    const list = element.data('list');
    element.find('.update').show();
    element.find('.spinner').hide();
    element.find('.stop').hide();
    socket.emit('stop', { origin, list });
  });

  socket.on('launching', (payload) => {
    const { origin, list } = payload;
    const element = $(`.${origin}.${list}`);
    element.find('.update').hide();
    element.find('.spinner').show();
    element.find('.stop').hide();
  });
  socket.on('start', (payload) => {
    const { origin, list } = payload;
    const element = $(`.${origin}.${list}`);
    element.find('.update').hide();
    element.find('.spinner').hide();
    element.find('.stop').show();
  });
  socket.on('stop', (payload) => {
    const { origin, list } = payload;
    const element = $(`.${origin}.${list}`);
    element.find('.update').show();
    element.find('.spinner').hide();
    element.find('.stop').hide();
  });
  socket.on('error', (payload) => {
    const { origin, list, error } = payload;
    const element = $(`.${origin}.${list}`);
    element.find('.update').show();
    element.find('.spinner').hide();
    element.find('.stop').hide();
  });
  socket.on('progress', (payload) => {
    const { origin, list, progress } = payload;
    $(`.${origin}.${list}`)
      .find('.progress-bar')
      .attr('aria-valuenow', progress)
      .width(`${progress}%`)
      .text(`${progress}%`);
  });
});
