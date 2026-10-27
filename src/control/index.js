import store from '../store';
import todo from './todo';

const keyboard = {
  37: 'left', // ArrowLeft (左移)
  38: 'rotate', // ArrowUp -> 旋转 (Rotate)
  39: 'right', // ArrowRight (右移)
  40: 'down', // ArrowDown (下移)
  32: 'space', // Space -> 掉落 (Drop)

  // 扩展直觉按键
  65: 'left', // A (左移)
  68: 'right', // D (右移)
  87: 'rotate', // W (上 -> 旋转)
  90: 'rotate', // Z (旋转)
  88: 'rotate', // X (旋转)
  75: 'rotate', // K (旋转)
  74: 'space', // J (掉落)
  67: 'space', // C (掉落)

  // 系统快捷键
  83: 's', // S (声音)
  77: 's', // M (Mute/声音切换)
  82: 'r', // R (重置)
  80: 'p', // P (暂停)
};

let keydownActive;

const boardKeys = Object.keys(keyboard).map(e => parseInt(e, 10));

const keyDown = (e) => {
  if (e.metaKey === true || boardKeys.indexOf(e.keyCode) === -1) {
    return;
  }
  const type = keyboard[e.keyCode];
  if (type === keydownActive) {
    return;
  }
  keydownActive = type;
  todo[type].down(store);
};

const keyUp = (e) => {
  if (e.metaKey === true || boardKeys.indexOf(e.keyCode) === -1) {
    return;
  }
  const type = keyboard[e.keyCode];
  if (type === keydownActive) {
    keydownActive = '';
  }
  todo[type].up(store);
};

document.addEventListener('keydown', keyDown, true);
document.addEventListener('keyup', keyUp, true);

