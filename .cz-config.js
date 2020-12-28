'use strict';

module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:     新功能(new feature)',
    },
    {
      value: 'fix',
      name: 'fix:      修复错误(bug fix)',
    },
    {
      value: 'docs',
      name: 'docs:     仅文档或注释变更',
    },
    {
      value: 'style',
      name: 'style:    代码格式(不影响代码含义和运行的变动)',
    },
    {
      value: 'refactor',
      name: 'refactor: 重构(既不是增加新功能，也不是修复错误)',
    },
    {
      value: 'perf',
      name: 'perf:     性能优化(提高性能的代码更改)',
    },
    {
      value: 'test',
      name: 'test:     增加缺失的测试',
    },
    {
      value: 'chore',
      name: 'chore:    构建过程或辅助工具和库(如文档生成)的变动',
    },
    {
      value: 'revert',
      name: 'revert:   回退(Revert to a commit)',
    },
    {
      value: 'build',
      name: 'build:    打包',
    },
  ],
  // override the messages, defaults are as follows
  messages: {
    type: '请选择提交类型:',
    customScope: '请输入文件修改范围(可选):',
    subject: '请简要描述提交(必填):',
    body: '请输入详细描述(可选):',
    footer: '请输入要关闭的 issue(可选):',
    confirmCommit: '请确认使用以上信息提交?(y/n/e/h)',
  },
  allowCustomScopes: true,
  subjectLimit: 72,
};
