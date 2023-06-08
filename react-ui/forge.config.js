const path = require('path');

module.exports = {
  packagerConfig: {
    extraFiles: [
      {
        from: './jars/variantgraphcraft-backend-0.0.1-SNAPSHOT.jar',
        to: './jars/variantgraphcraft-backend-0.0.1-SNAPSHOT.jar',
      },
    ],
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.jsx',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    }
  ],
  build: {
    extraResources: [
      {
        "from": "./jars",
        "to": "jars",
        "filter": ["**/*"]
      }
    ],
    extraFiles: [
      {
        from: './src/components/Images',
        to: '.',
        filter: ['**/*.png', '**/*.jpg'],
      },
    ],
  },
};
