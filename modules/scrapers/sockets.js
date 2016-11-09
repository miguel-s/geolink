'use strict';

const fs = require('fs');
const path = require('path');
const fork = require('child_process').fork;

const names = fs.readdirSync(path.join(__dirname, './workers'));
const workers = [];

module.exports = function sockets(io) {
  io.on('connection', (socket) => {
    workers.forEach((worker) => {
      const { state, origin, list, progress } = worker;
      if (state === 'launching') {
        socket.emit('launching', { origin, list });
      } else if (state === 'started') {
        socket.emit('start', { origin, list });
        socket.emit('progress', { origin, list, progress });
      }
    });

    socket.on('start', (payload) => {
      const { origin, list } = payload;

      if (names.indexOf(origin) !== -1) {
        let worker = workers.find(w => w.origin === origin && w.list === list);

        if (!worker) {
          worker = {
            origin,
            list,
            state: 'stopped',
            proc: null,
            progress: 0,
          };
          workers.push(worker);
        }

        if (worker.state === 'stopped') {
          worker.state = 'launching';
          worker.proc = fork(path.join(__dirname, `./workers/${origin}/${origin}_${list}.js`));
          if (worker.proc) {
            if (process.NODE_ENV !== 'production') {
              console.log(`${origin}_${list} worker started`);
            }

            worker.proc.on('message', (m) => {
              if (m.origin === origin && m.list === list) {
                switch (m.type) {
                  case 'start': {
                    worker.state = 'started';
                    io.sockets.emit('start', { origin, list });
                    break;
                  }
                  case 'stop': {
                    if (worker && worker.state !== 'stopped' && worker.proc.kill) {
                      worker.proc.kill();
                    }
                    break;
                  }
                  case 'progress': {
                    const progress = m.data;
                    worker.progress = progress;
                    io.sockets.emit('progress', { origin, list, progress });
                    break;
                  }
                  case 'error': {
                    const error = m.data;
                    if (process.NODE_ENV !== 'production') {
                      console.error(error);
                    }
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }
            });

            worker.proc.on('disconnect', () => {
              worker.state = 'stopped';
              io.sockets.emit('stop', { origin, list });

              if (process.NODE_ENV !== 'production') {
                console.log(`${origin}_${list} worker exited`);
              }
            });
          }
        }
      }
    });

    socket.on('stop', (payload) => {
      const { origin, list } = payload;
      const worker = workers.find(w => w.origin === origin && w.list === list);
      if (worker && worker.state !== 'stopped' && worker.proc.kill) {
        worker.proc.kill();
      }
    });
  });
};
