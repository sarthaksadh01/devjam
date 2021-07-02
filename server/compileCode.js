const { c, cpp, node, python, java } = require('compile-run');
var fs = require('fs');

async function compileCode(sourcecode, input, language) {
    return new Promise((resolve, reject) => {
        switch (language) {
            case "java":
                fs.writeFile('Solution.java', sourcecode, function (err) {
                    if (err) throw err;
                    java.runFile("./Solution.java", { stdin: input }, (err, result) => {
                        if (err) reject(err);
                        console.log(result)
                        resolve(result);
    
    
                    });
                  });
               


                break;
            case "cpp":
                cpp.runSource(sourcecode, { stdin: input }, (err, result) => {
                    if (err) reject(err);
                    resolve(result);


                });
                break;
            case "python":
                python.runSource(sourcecode, { stdin: input ,executionPath: 'python3'}, (err, result) => {
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
                if(res.stderr==='')res.stdout = res.stdout.trim();
                output.push(res);
            } catch (error) {
                output.push(err);

            }
        }


        resolve(output);

    })
}


 var sourceCode = `// "static void main" must be defined in a public class.
 public class Solution {
     public static void main(String[] args) {
         System.out.println("Hello World!");
     }
 }`
var input = [
    {
        intput:0,
        output:1
    },
    {
        intput:0,
        output:1
    },
    {
        intput:0,
        output:1
    },
    {
        intput:0,
        output:1
    },
    {
        intput:0,
        output:1
    }
]

module.exports ={
    compileCode,
    runTestCases
}

