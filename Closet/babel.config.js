module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              '@': './', // This maps "@/components" to "./components"
            },
          },
        ],
        'react-native-reanimated/plugin',
      ],
    };
  };
  