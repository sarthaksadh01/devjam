const { c, cpp, node, python, java } = require('compile-run');
async function compileCode(sourcecode, input, language) {
    return new Promise((resolve, reject) => {
        switch (language) {
            case "java":
                java.runSource(sourcecode, { stdin: input }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);


                });


                break;
            case "cpp":
                cpp.runSource(sourcecode, { stdin: input }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);


                });
                break;
            case "python":
                python.runSource(sourcecode, { stdin: input }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);


                });
                break;
            case "javascript":
                node.runSource(sourcecode, { stdin: input }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);


                });

                break;
            default:
                break;
        }


    })
}

async function runTestCases(sourcecode, input = [], language) {
    return new Promise(async (resolve, reject) => {
        var output = [];

        for (var i = 0; i < input.length; i++) {
            var testCase = input[i];
            try {
                var res = await compileCode(sourcecode, testCase.input, language);
                output.push(res);
            } catch (error) {
                output.push(err);

            }
        }


        resolve(output);

    })
}

module.exports ={
    compileCode,
    runTestCases
}

