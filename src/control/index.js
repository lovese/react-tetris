import store from '../store';
import todo from './todo';

const keyboard = {
  37: 'left', // ArrowLeft (左移)
  38: 'space', // ArrowUp -> 掉落 (Drop / 硬降)
  39: 'right', // ArrowRight (右移)
  40: 'down', // ArrowDown (下移 / 软降)
  32: 'rotate', // Space -> 变形 (Rotate / 旋转)

  // 扩展更符合直觉的按键方案 (WASD / 经典动作键)
  65: 'left', // A (左移)
  68: 'right', // D (右移)
  87: 'space', // W (上 -> 掉落)
  90: 'rotate', // Z (经典俄罗斯方块变形)
  88: 'rotate', // X (经典俄罗斯方块变形)
  75: 'rotate', // K (变形)
  74: 'space', // J (快速掉落)
  67: 'space', // C (快速掉落)

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

