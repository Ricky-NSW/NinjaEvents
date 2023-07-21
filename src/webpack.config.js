const million = require('million/compiler');
module.exports = {
    plugins: [
        million.webpack(),
    ],
    webpack: {
        configure: {
            experiments: {
                topLevelAwait: true,
            },
        },
    },
};
