const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'flow-runtime',
      {
        assert: true,
        annotate: true,
      },
    ],
    config,
  );

  if (env === 'production') {
    console.log('⚡ Production build with optimization ⚡');
    config = injectBabelPlugin('closure-elimination', config);
    config = injectBabelPlugin('transform-react-inline-elements', config);
    config = injectBabelPlugin('transform-react-constant-elements', config);
  }

  // remove eslint in eslint, we only need it on VSCode
  config.module.rules.splice(1, 1);

  return config;
};
