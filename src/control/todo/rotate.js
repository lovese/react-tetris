import { want } from '../../unit/';
import event from '../../unit/event';
import actions from '../../actions';
import states from '../states';
import { music } from '../../unit/music';

const down = (store) => {
  store.dispatch(actions.keyboard.rotate(true));
  if (store.getState().get('cur') !== null) {
    event.down({
      key: 'rotate',
      once: true,
      callback: () => {
        const state = store.getState();
        if (state.get('lock')) {
          return;
        }
        if (state.get('pause')) {
          states.pause(false);
        }
        const cur = state.get('cur');
        if (cur === null) {
          return;
        }
        if (music.rotate) {
          music.rotate();
        }
        const next = cur.rotate();
        if (want(next, state.get('matrix'))) {
          store.dispatch(actions.moveBlock(next));
        }
      },
    });
  } else {
    event.down({
      key: 'rotate',
      once: true,
      callback: () => {
        if (store.getState().get('lock')) {
          return;
        }
        states.start();
      },
    });
  }
};

const up = (store) => {
  store.dispatch(actions.keyboard.rotate(false));
  event.up({
    key: 'rotate',
  });
};

export default {
  down,
  up,
};
