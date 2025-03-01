module.exports = {
  types: [
    {
      types: ['feat'],
      label: 'Features',
    },
    {
      types: ['fix'],
      label: 'Bug Fixes',
    },
    {
      types: ['perf'],
      label: 'Performance Improvements',
    },
    {
      types: ['enh'],
      label: 'Enhancements',
    },
    {
      types: ['tweak'],
      label: 'Refinements',
    },
    {
      types: ['adjust'],
      label: 'Adjustments',
    },
    {
      types: ['simplify'],
      label: 'Simplifications',
    },
    {
      types: ['deprecate'],
      label: 'Deprecations',
    },
    {
      types: ['ui'],
      label: 'UI Improvements',
    },
    {
      types: ['security'],
      label: 'Security Fixes',
    },
  ],
  excludeTypes: ['refactor', 'test', 'docs', 'typo', 'style', 'types', 'chore', 'config', 'build', 'ci', 'revert', 'init', 'merge'],
};
