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
    const downloadUrl = urlObject.createObjectURL(exportBlob);

    if (process.env.VUE_APP_TITLE === 'chrome' || process.env.VUE_APP_TITLE === 'edge') {
      let saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
      saveLink.href = downloadUrl;
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
    } else {
      chrome.downloads.download(
        {
          url: downloadUrl,
          filename,
        },
        () => {
          typeof completed === 'function' && completed();
        }
      );
    }
  },

  /**
   * 转义 html 字符函数
   * - 参考：https://www.cnblogs.com/daysme/p/7100553.html
   * @param {String} text text 文本
   */
  htmlEncode(text) {
    let temp = document.createElement('div');
    temp.textContent = text;
    const output = temp.innerHTML;
    temp = null;
    return output;
  },

  /**
   * 获取图片 Base64 编码函数
   * - 参考：https://blog.csdn.net/DeMonliuhui/article/details/79731359
   * @param {String} src 图片地址
   * @param {String} ext 图片类型
   */
  getImageBase64(src, ext) {
    let canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = src;
    return new Promise(resolve => {
      img.onload = () => {
        canvas.width = 16;
        canvas.height = 16;
        ctx.drawImage(img, 0, 0, 16, 16);
        let dataURL = canvas.toDataURL('image/' + ext);
        resolve(dataURL);
        canvas = null;
      };
    });
  },

  /**
   * 获取网址图标值函数
   * @param {String} url 网址
   */
  async getIcon(url) {
    let icon = await this.getImageBase64('chrome://favicon/' + url, 'png');
    return icon;
  },

  async traverse(arr, settings = {}, tabSpace = '', isNoOther = false, progressHandle = null) {
    let html = '';
    const space = tabSpace + '    ';
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.children) {
        if (
          settings.noParentFolders &&
          !['1', '2', '3', '4', '5', '6', 'menu________', 'toolbar_____', 'unfiled_____', 'mobile______'].indluces(item.id)
        ) {
          html += `${await this.traverse(item.children, settings, '', isNoOther, progressHandle)}`;
        } else if (
          settings.noOtherBookmarks &&
          ['2', '3', '4', '5', '6', 'toolbar_____', 'unfiled_____', 'mobile______'].includes(item.id)
        ) {
          html += `${await this.traverse(item.children, settings, '', true, progressHandle)}`;
        } else {
          html += `
${space}<DT><H3${
            settings.includeDate
              ? ' ADD_DATE="' +
                (item.dateAdded ? item.dateAdded.toString().slice(0, 10) : '0') +
                '"' +
                ' LAST_MODIFIED="' +
                (item.dateGroupModified ? item.dateGroupModified.toString().slice(0, 10) : '0') +
                '"'
              : ''
          }${item.id == '1' ? ' PERSONAL_TOOLBAR_FOLDER="true"' : ''}>${this.htmlEncode(item.title)}</H3>
${space}<DL><p>${await this.traverse(item.children, settings, space, isNoOther, progressHandle)}
${space}</DL><p>`;
        }
      } else {
        //? 仅 Firefox 中存在 type 属性
        if (item.type === 'separator') {
          //! 处理 Firefox 中分隔符的情况
          html += `
${settings.noParentFolders ? (isNoOther ? '    ' : '        ') : space}<HR>`;
        } else {
          html += `
${settings.noParentFolders ? (isNoOther ? '    ' : '        ') : space}<DT><A HREF="${item.url}"${
            settings.includeDate ? ' ADD_DATE="' + (item.dateAdded ? item.dateAdded.toString().slice(0, 10) : '0') + '"' : ''
          }${settings.includeIcon ? ' ICON="' + (await this.getIcon(item.url)) + '"' : ''}>${this.htmlEncode(item.title)}</A>`;
        }

        typeof progressHandle === 'function' && progressHandle();
      }
    }

    return html;
  },

  async createHtmlFile(arr, settings, progressHandle = null, progressCompleted = null) {
    const header = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
`;
    const body = `<DL><p>${await this.traverse(arr, settings, '', false, progressHandle)}
</DL><p>
`;
    typeof progressCompleted === 'function' && progressCompleted();
    return header + body;
  },
};

export default tools;
