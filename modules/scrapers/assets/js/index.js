'use strict';

$('input[type="radio"] + label').on('click', (e) => {
  const input = $(e.currentTarget).siblings('input[type="radio"]');
  const origin = input.attr('name');
  const list = input.val();
  $(`.${origin} .controls button`).data('list', list);
});

const socket = io();

socket.on('connect', () => {
  $('.update').on('click', (e) => {
    e.preventDefault();
    const origin = $(e.currentTarget).data('origin');
    const list = $(e.currentTarget).data('list');
    $(e.currentTarget).hide();
    $(e.currentTarget).siblings('.spinner').show();
    socket.emit('start', { origin, list });
  });
  $('.stop').on('click', (e) => {
    e.preventDefault();
    const origin = $(e.currentTarget).data('origin');
    const list = $(e.currentTarget).data('list');
    socket.emit('stop', { origin, list });
  });

  socket.on('launching', (payload) => {
    const { origin, list } = payload;
    const element = $(`.${origin}`);
    element.find('.update').hide();
    element.find('.spinner').show();
    element.find('.stop').hide();
    element.find('.progress').hide();
    element.find(`input[type="radio"][value="${list}"]`).prop('checked', true);
    element.find('input[type="radio"]').prop('disabled', true);
  });
  socket.on('start', (payload) => {
    const { origin, list } = payload;
    const element = $(`.${origin}`);
    element.find('.update').hide();
    element.find('.spinner').hide();
    element.find('.stop').show();
    element.find('.progress').show();
    element.find(`input[type="radio"][value="${list}"]`).prop('checked', true);
    element.find('input[type="radio"]').prop('disabled', true);
  });
  socket.on('stop', (payload) => {
    const { origin } = payload;
    const element = $(`.${origin}`);
    element.find('.update').show();
    element.find('.spinner').hide();
    element.find('.stop').hide();
    element.find('.progress').hide();
    element.find('input[type="radio"]').prop('disabled', false);
  });
  socket.on('error', (payload) => {
    const { origin, error } = payload;
    const element = $(`.${origin}`);
    element.find('.update').show();
    element.find('.spinner').hide();
    element.find('.stop').hide();
    element.find('.progress').hide();
    element.find('input[type="radio"]').prop('disabled', false);
  });
  socket.on('progress', (payload) => {
    const { origin, progress } = payload;
    const element = $(`.${origin} .progress`);
    element.attr('aria-valuenow', progress);
    element.attr('aria-valuetext', `${progress} percent`);
    element.find('.progress-meter').width(`${progress}%`);
    element.find('.progress-meter-text').text(`${progress}%`);
  });
});
