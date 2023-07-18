// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";
import fs from "fs";
import webpack from "webpack";
import "webpack-dev-server";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isProduction = process.env.NODE_ENV == 'production' || process.argv[process.argv.indexOf('--mode') + 1] === 'production';


const stylesHandler = MiniCssExtractPlugin.loader;

// * Creating Plugins for all HTML files
const htmlFolderPath = path.resolve(__dirname, "src/html/");
const htmlFiles = fs.readdirSync(htmlFolderPath);
const htmlWebpackPlugins = htmlFiles.map(htmlFile => {
    const parsedFilePath = path.parse(htmlFile);
    isProduction || console.debug("HTML File:", parsedFilePath.base);
    // The javascript chunk to be attached that has the same name
    const chunkName = parsedFilePath.name;

    return new HtmlWebpackPlugin({
        template: path.resolve(htmlFolderPath, htmlFile),
        minify: isProduction,
        filename: htmlFile,
        chunks: [chunkName]
    })
})

// * Creating entrypoints for all page handler script files
const pagesPath = path.resolve(__dirname, "src/pages/");
const pagesScripts = fs.readdirSync(pagesPath);
const entryPoints: webpack.EntryObject = ((): webpack.EntryObject => {
    const entryObject: webpack.EntryObject = {};

    pagesScripts.forEach(pageScript => {
        const scriptPath = path.resolve(pagesPath, pageScript);
        const nameWithoutExtension = path.parse(pageScript).name;
        const scriptBaseName = path.parse(scriptPath).name; // script.ts -> script
        entryObject[nameWithoutExtension] = { filename: `${scriptBaseName}.bundle.[contenthash].js`, import: scriptPath }
    })

    return entryObject;
})();
isProduction || console.debug("Entry Points:", entryPoints)



const config: webpack.Configuration = {
    mode: isProduction ? "production" : "development",
    entry: entryPoints,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
        hot: true,
        port: 3000,
        watchFiles: [path.resolve(__dirname, "src/**/*")]
    },
    plugins: [
        ...htmlWebpackPlugins,
        new MiniCssExtractPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/i,
                loader: 'ts-loader',
                exclude: ['/node_modules/'],
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler, 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },

            // Add your rules for custom modules here
            // Learn more about loaders from https://webpack.js.org/loaders/
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                defaultVendors: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
        },
    }
}

export default config;