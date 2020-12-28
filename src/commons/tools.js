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
   * 节流延时器值
   */
  throttleTimer: null,
  /**
   * 节流时间戳值
   */
  throttlePrevious: 0,

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
   * 节流方法
   * - 参考：https://github.com/mqyqingfeng/Blog/issues/26
   * @param {Function} func 函数方法
   * @param {Number} delay 延迟时间
   * @param {Object} [options] 参数对象 - leading: false 表示禁用第一次执行; trailing: false 表示禁用停止触发的回调 (两者不能同时设置为 false)
   */
  throttle(func, delay, options = {}) {
    let that, result;

    const throttled = function(...args) {
      const now = Date.now();

      if (!tools.throttlePrevious && options.leading === false) {
        // 禁用第一次执行
        tools.throttlePrevious = now;
      }

      /** 下次触发 func 剩余的时间 */
      const remaining = delay - (now - tools.throttlePrevious);
      that = this;
      // 如果没有剩余的时间了或者改了系统时间
      if (remaining <= 0 || remaining > delay) {
        if (tools.throttleTimer) {
          clearTimeout(tools.throttleTimer);
          tools.throttleTimer = null;
        }
        tools.throttlePrevious = now;
        result = func.apply(that, args);
        if (!tools.throttleTimer) {
          // 垃圾回收，方便下次执行定时器
          that = args = null;
        }
      } else if (!tools.throttleTimer && options.trailing !== false) {
        tools.throttleTimer = setTimeout(() => {
          tools.throttlePrevious = options.leading === false ? 0 : Date.now();
          tools.throttleTimer = null;
          result = func.apply(that, args);
          if (!tools.throttleTimer) {
            that = args = null;
          }
        }, remaining);
      }

      return result;
    };

    throttled.cancel = function() {
      clearTimeout(tools.throttleTimer);
      tools.throttlePrevious = 0;
      tools.throttleTimer = null;
    };

    return throttled();
  },

  /**
   * 获取输入焦点(聚焦)方法
   * @param {*} el 节点
   * @param {*} binding 指令对象
   */
  focus(el, binding) {
    if (binding.value && binding.oldValue !== binding.value) {
      tools.debounce(() => {
        try {
          if (binding.value) {
            el.focus();
            el.select();
          }
        } catch (e) {
          console.error('Error in focus command.');
          console.error(e);
        }
      }, 200);
    }
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

  /**
   * 打开并读取文本文件的方法
   * @param {Function} callback 回调函数 (res: 状态, content: 内容)
   */
  openTextFile: callback => {
    const fileInput = document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
    fileInput.type = 'file';
    fileInput.accept = '.txt, .text, .json, .conf, .config';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', () => {
      if (!fileInput.value) {
        console.warn('No file selected.');
        callback(false, 'no file');
        return;
      }

      const file = fileInput.files[0];
      const { type } = file;

      if (type !== 'application/json' && type !== 'application/xml' && type !== 'text/plain') {
        console.warn('Not a valid file.');
        callback(false, 'valid');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const data = e.target.result;
        callback(true, data);
        return;
      };

      reader.readAsText(file);
    });

    fileInput.click();
  },
};

export default tools;
