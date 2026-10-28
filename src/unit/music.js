import store from '../store';

// 使用 Web Audio API
const AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext
);

const hasWebAudioAPI = {
  data: !!AudioContext && location.protocol.indexOf('http') !== -1,
};

const music = {};

(() => {
  if (!hasWebAudioAPI.data) {
    return;
  }
  const url = './music.mp3';
  const context = new AudioContext();

  // 解决移动端 iOS Web Audio 挂起延迟问题
  const unlockAudio = () => {
    if (context && context.state === 'suspended') {
      context.resume();
    }
  };
  document.addEventListener('touchstart', unlockAudio, true);
  document.addEventListener('mousedown', unlockAudio, true);

  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';

  req.onload = () => {
    context.decodeAudioData(req.response, (buf) => { // 将拿到的audio解码转为buffer
      const getSource = () => { // 创建source源。
        if (context.state === 'suspended') {
          context.resume();
        }
        const source = context.createBufferSource();
        source.buffer = buf;
        source.connect(context.destination);
        return source;
      };

      music.killStart = () => { // 游戏开始的音乐只播放一次
        music.start = () => {};
      };

      music.start = () => { // 游戏开始
        music.killStart();
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 3.7202, 3.6224);
      };

      music.clear = () => { // 消除方块
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 0, 0.7675);
      };

      music.fall = () => { // 立即下落（校准精确波形起始点，消除50ms静音空白延迟）
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 1.298, 0.32);
      };

      music.gameover = () => { // 游戏结束
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 8.1276, 1.1437);
      };

      music.rotate = () => { // 旋转（校准起始时间，零延迟清脆响应）
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.235, 0.085);
      };

      let currentMoveSource = null;
      let lastMoveTime = 0;
      music.move = () => { // 移动（防拥塞短音效，与按键完美合拍）
        if (!store.getState().get('music')) {
          return;
        }
        const now = Date.now();
        if (now - lastMoveTime < 45) {
          return;
        }
        lastMoveTime = now;
        if (currentMoveSource) {
          try {
            currentMoveSource.stop();
          } catch (e) {}
        }
        currentMoveSource = getSource();
        currentMoveSource.start(0, 2.892, 0.065);
      };
    },
    (error) => {
      if (window.console && window.console.error) {
        window.console.error(`音频: ${url} 读取错误`, error);
        hasWebAudioAPI.data = false;
      }
    });
  };

  req.send();
})();

module.exports = {
  hasWebAudioAPI,
  music,
};
