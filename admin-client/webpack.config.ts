// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";
import fs from "fs";
import webpack from "webpack";
import "webpack-dev-server";


import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const isProduction = process.env.NODE_ENV == 'production';


const stylesHandler = MiniCssExtractPlugin.loader;

const htmlFolderPath = path.resolve(__dirname, "src/html/");
const htmlFiles = fs.readdirSync(htmlFolderPath);

const htmlWebpackPlugins = htmlFiles.map(htmlFile => {
    const chunkName = path.parse(htmlFile).name;
    return new HtmlWebpackPlugin({
        template: path.resolve(htmlFolderPath, htmlFile),
        minify: isProduction,
        filename: htmlFile,
        chunks: [chunkName]
    })
})

const pagesPath = path.resolve(__dirname, "src/pages/");
const pagesScripts = fs.readdirSync(pagesPath);

const getEntryPoints = (): webpack.EntryObject => {
    const entryObject: webpack.EntryObject = {};

    pagesScripts.forEach(pageScript => {
        const scriptPath = path.resolve(pagesPath, pageScript);
        const nameWithoutExtension = path.parse(pageScript).name;
        // TODO: Remove this later
        console.log("Entry Point: ", path.parse(scriptPath).base)
        const scriptBaseName = path.parse(scriptPath).name; // script.ts -> script
        entryObject[nameWithoutExtension] = { filename: `${scriptBaseName}.bundle.[contenthash].js`, import: scriptPath }
    })

    return entryObject;
}

console.log(getEntryPoints())



const config: webpack.Configuration = {
    mode: isProduction ? "production" : "development",
    entry: getEntryPoints(),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        ...htmlWebpackPlugins,
        new MiniCssExtractPlugin(),
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