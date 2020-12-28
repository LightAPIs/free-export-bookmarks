'use strict';

/**
 * Syntactic sugar
 */
const ui = {
  $(id) {
    return document.getElementById(id);
  },
  create(tag) {
    return document.createElement(tag);
  },
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
};

export default ui;
