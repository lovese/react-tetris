import store from '../store';
import todo from './todo';

const buttonState = {
  left: false,
  right: false,
  down: false,
  rotate: false,
  space: false,
  p: false,
  r: false,
};

let activeGamepadIndex = null;
let animFrameId = null;

const checkGamepad = () => {
  if (typeof navigator === 'undefined' || !navigator.getGamepads) {
    return;
  }
  const gamepads = navigator.getGamepads();
  let gp = null;
  if (activeGamepadIndex !== null && gamepads[activeGamepadIndex]) {
    gp = gamepads[activeGamepadIndex];
  } else {
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        gp = gamepads[i];
        activeGamepadIndex = i;
        break;
      }
    }
  }

  if (gp) {
    const b = gp.buttons;
    const isDown = (btn) => {
      if (!btn) return false;
      return typeof btn === 'object' ? btn.pressed : btn > 0.5;
    };

    const ax0 = gp.axes && gp.axes[0] !== undefined ? gp.axes[0] : 0;
    const ax1 = gp.axes && gp.axes[1] !== undefined ? gp.axes[1] : 0;

    const current = {
      // 左：十字键左(14) 或 左摇杆左
      left: isDown(b[14]) || ax0 < -0.5,
      // 右：十字键右(15) 或 左摇杆右
      right: isDown(b[15]) || ax0 > 0.5,
      // 下：十字键下(13) 或 左摇杆下
      down: isDown(b[13]) || ax1 > 0.5,
      // 上 / 掉落：十字键上(12) 或 Y键(3) 或 RB键(5)
      space: isDown(b[12]) || isDown(b[3]) || isDown(b[5]),
      // 旋转 / 变形：A键(0) 或 B键(1) 或 X键(2)
      rotate: isDown(b[0]) || isDown(b[1]) || isDown(b[2]),
      // 暂停：Start键(9)
      p: isDown(b[9]),
      // 重置：Select/Back键(8)
      r: isDown(b[8]),
    };

    Object.keys(current).forEach((key) => {
      if (current[key] && !buttonState[key]) {
        buttonState[key] = true;
        if (todo[key] && todo[key].down) {
          todo[key].down(store);
        }
      } else if (!current[key] && buttonState[key]) {
        buttonState[key] = false;
        if (todo[key] && todo[key].up) {
          todo[key].up(store);
        }
      }
    });
  }

  animFrameId = requestAnimationFrame(checkGamepad);
};

export const initGamepad = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('gamepadconnected', (e) => {
    activeGamepadIndex = e.gamepad.index;
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(checkGamepad);
    }
  });

  window.addEventListener('gamepaddisconnected', (e) => {
    if (activeGamepadIndex === e.gamepad.index) {
      activeGamepadIndex = null;
    }
  });

  if (!animFrameId) {
    animFrameId = requestAnimationFrame(checkGamepad);
  }
};

export default initGamepad;
