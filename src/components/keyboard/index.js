import React from 'react';
import Immutable from 'immutable';
import propTypes from 'prop-types';

import style from './index.less';
import Button from './button';
import store from '../../store';
import todo from '../../control/todo';
import { i18n, lan } from '../../unit/const';

export default class Keyboard extends React.Component {
  componentDidMount() {
    const touchEventCatch = {}; // 对于手机操作, 触发了touchstart, 将作出记录, 不再触发后面的mouse事件

    // 在鼠标触发mousedown时, 移除元素时可以不触发mouseup, 这里做一个兼容, 以mouseout模拟mouseup
    const mouseDownEventCatch = {};
    document.addEventListener('touchstart', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    // 解决issue: https://github.com/chvin/react-tetris/issues/24
    document.addEventListener('touchend', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    // 阻止双指放大
    document.addEventListener('gesturestart', (e) => {
      if (e.preventDefault) {
        event.preventDefault();
      }
    });

    document.addEventListener('mousedown', (e) => {
      if (e.preventDefault) {
        e.preventDefault();
      }
    }, true);

    Object.keys(todo).forEach((key) => {
      this[`dom_${key}`].dom.addEventListener('mousedown', () => {
        if (touchEventCatch[key] === true) {
          return;
        }
        todo[key].down(store);
        mouseDownEventCatch[key] = true;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseup', () => {
        if (touchEventCatch[key] === true) {
          touchEventCatch[key] = false;
          return;
        }
        todo[key].up(store);
        mouseDownEventCatch[key] = false;
      }, true);
      this[`dom_${key}`].dom.addEventListener('mouseout', () => {
        if (mouseDownEventCatch[key] === true) {
          todo[key].up(store);
        }
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchstart', () => {
        touchEventCatch[key] = true;
        todo[key].down(store);
      }, true);
      this[`dom_${key}`].dom.addEventListener('touchend', () => {
        todo[key].up(store);
      }, true);
    });
  }
  shouldComponentUpdate({ keyboard, filling }) {
    return !Immutable.is(keyboard, this.props.keyboard) || filling !== this.props.filling;
  }
  render() {
    const keyboard = this.props.keyboard;
    return (
      <div
        className={style.keyboard}
        style={{
          marginTop: 20 + this.props.filling,
        }}
      >
        <Button
          color="blue"
          size="s1"
          top={8}
          left={136}
          label={i18n.drop[lan]}
          arrow="translate(0, -10px)"
          position
          active={keyboard.get('drop')}
          ref={(c) => { this.dom_space = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={212}
          left={136}
          label=""
          arrow="rotate(180deg)"
          active={keyboard.get('down')}
          ref={(c) => { this.dom_down = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={110}
          left={20}
          label=""
          arrow="rotate(270deg)"
          active={keyboard.get('left')}
          ref={(c) => { this.dom_left = c; }}
        />
        <Button
          color="blue"
          size="s1"
          top={110}
          left={252}
          label=""
          arrow="rotate(90deg)"
          active={keyboard.get('right')}
          ref={(c) => { this.dom_right = c; }}
        />
        <Button
          color="orange"
          size="s0"
          top={140}
          left={395}
          label={i18n.rotation[lan]}
          active={keyboard.get('rotate')}
          ref={(c) => { this.dom_rotate = c; }}
        />
        <Button
          color="red"
          size="s2"
          top={12}
          left={508}
          label={i18n.reset[lan]}
          active={keyboard.get('reset')}
          ref={(c) => { this.dom_r = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={12}
          left={444}
          label={i18n.sound[lan]}
          active={keyboard.get('music')}
          ref={(c) => { this.dom_s = c; }}
        />
        <Button
          color="green"
          size="s2"
          top={12}
          left={380}
          label={i18n.pause[lan]}
          active={keyboard.get('pause')}
          ref={(c) => { this.dom_p = c; }}
        />
      </div>
    );
  }
}

Keyboard.propTypes = {
  filling: propTypes.number.isRequired,
  keyboard: propTypes.object.isRequired,
};
