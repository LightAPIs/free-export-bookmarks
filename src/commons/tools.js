'use strict';

/**
 * Custom tools
 */
const tools = {
  /**
   * 防抖延时器值
   */
  debounceTimer: null,

  /**
   * 防抖方法
   * 1. 参考：https://github.com/mqyqingfeng/Blog/issues/22
   * 2. 参考：https://blog.csdn.net/qq_32678401/article/details/81779274
   * @param {Function} func 函数方法
   * @param {Number} delay 延迟时间
   * @param {Boolean} [immediate] 是否立即执行
   */
  debounce(func, delay, immediate = false) {
    let result;

    const debounced = function(...args) {
      tools.debounceTimer && clearTimeout(tools.debounceTimer);
      if (immediate) {
        /** 如果已经执行过了，不再执行 */
        const callNow = !tools.debounceTimer;
        tools.debounceTimer = setTimeout(() => {
          tools.debounceTimer = null;
        }, delay);
        if (callNow) {
          // 只在 immediate 为 true 时返回函数的执行结果
          result = func.apply(this, args);
        }
      } else {
        tools.debounceTimer = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      }

      return result;
    };

    debounced.cancel = function() {
      clearTimeout(tools.debounceTimer);
      tools.debounceTimer = null;
    };

    return debounced();
  },

  /**
   * 下载文本文件至本地的方法
   * @param {String} content 文件内容
   * @param {String} filename 文件名 - 支持带扩展名(默认为 txt)
   * @param {Function} completed 下载完成后的回调函数
   */
  downloadTextFile: (content, filename = null, completed = null) => {
    if (!filename) {
      filename = 'no-name.txt';
    } else {
      filename = /\.(?:txt|text|json|config|html)$/i.test(filename) ? filename : filename + '.txt';
    }

    const urlObject = window.URL || window.webKitURL || window;
    const exportBlob = new Blob([content]);
    let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = urlObject.createObjectURL(exportBlob);
    saveLink.download = filename;

    /** MouseEvent 鼠标事件构造器 */
    const ev = new MouseEvent('click', {
      bubbles: true,
      cancelable: false,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    });
    saveLink.dispatchEvent(ev);
    saveLink = null;

    typeof completed === 'function' && completed();
  },
};

export default tools;
