## 创建react项目
```shell
npx create-react-app <project-name>

#进入项目文件夹
cd <project-name>

# 弹出react配置项（该步骤不可逆）
npm run eject
```

## react的一些配置
运行了npm run eject后，会多出config和scripts文件夹，
一些loader, plugin等都会在config/webpack.config.js下配置
### 配置全局sass
```shell
# 安装sass-loader node-sass sass-resources-loader
# node-sass 报错可能是版本问题，删掉之前的node-sass, 改为4.x版本就好了
npm install sass-loader node-sass@4.14.1 sass-resources-loader --save-dev

# 在webpack中配置sass-loader
# 这里的配置其实就是webpack配置
# 找到webpack.config.js下的module，在rule下添加规则，
{
    test: /\.scss$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
}

# 加载全局sass
# 找到rule下test为sassRegex的规则
{
    test: sassRegex,
    exclude: sassModuleRegex,
    use: getStyleLoaders(
    {
        importLoaders: 3,
        sourceMap: isEnvProduction
        ? shouldUseSourceMap
        : isEnvDevelopment,
    },
    'sass-loader'
    ).concat({
    loader: 'sass-resources-loader', # 安装的loader
    options: {
        resources: [
            # 全局scss文件路径，这样相当于全局注入了该scss文件
            path.resolve(__dirname, './../src/styles/main.scss')
        ]
    }
    }),
    sideEffects: true,
}
```
### 配置ant design
```shell
# 安装ant design
npm install antd --save-dev

# 在webpack.config.js文件中找到module中的配置js的规则
# 在plugins中加入依赖['import', { libraryName: 'antd', style: 'css'}]
{
    test: /\.(js|mjs|jsx|ts|tsx)$/,
    include: paths.appSrc,
    loader: require.resolve('babel-loader'),
    options: {
    customize: require.resolve(
        'babel-preset-react-app/webpack-overrides'
    ),
    presets: [
        [
        require.resolve('babel-preset-react-app'),
        {
            runtime: hasJsxRuntime ? 'automatic' : 'classic',
        },
        ],
    ],
    
    plugins: [
        [
        require.resolve('babel-plugin-named-asset-import'),
        {
            loaderMap: {
            svg: {
                ReactComponent:
                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
            },
            },
        },
        ],
        ['import', { libraryName: 'antd', style: 'css'}], //加在这里
        isEnvDevelopment &&
        shouldUseReactRefresh &&
        require.resolve('react-refresh/babel'),
    ].filter(Boolean),
    cacheCompression: false,
    compact: isEnvProduction,
    },
},

```
