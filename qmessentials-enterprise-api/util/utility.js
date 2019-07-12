exports.promisify = f => {
    return function (...args) {
        return new Promise((resolve, reject) => {
            function callBack(err, result) {
                if (err) {
                    return reject(err);
                }
                else {
                    resolve(result);
                }
            }
            args.push(callBack);
            f.call(this, ...args);
        });
    };
};