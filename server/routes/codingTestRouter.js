/* 

This file contains routing for Test : test system on Admin Portal.
It contains the the methods to implement:
1. Fetch Tests
2. Update tests
3. pagination
4. Tests Notification
5. save feedback


*/

const express = require('express')
const router = new express.Router
var db = require("../database")
var compiler = require('../compileCode')

router.get("/api/codingTests", (req, res) => {
    db.getAllcodingTest().then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/codingTest/:id", (req, res) => {
    db.getCodingTestById(req.params.id).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/updateCodingTest/", (req, res) => {
    var data = req.body.data;
    db.updateCodingTest(data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/createCodingTest/", (req, res) => {
    db.createCodingTest({}).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/codingQuestions", (req, res) => {
    db.getAllQuestions().then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/codingQuestion/:id", (req, res) => {
    db.getQuestion(req.params.id).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/updateCodingQuestion/", (req, res) => {
    var data = req.body.data;
    db.updateQueston(data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/createCodingQuestion/", (req, res) => {
    var data = req.body.data;
    db.createQuestion(data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})

router.post("/api/publishCodingTest", (req, res) => {
    console.log(req.body.data)
    db.publishCodingTest(req.body.data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})

router.post("/api/compileCode", (req, res) => {
    const { language, sourceCode, input } = req.body;
    console.log(language);
    console.log(sourceCode);
    console.log(input);
    compiler.compileCode(sourceCode, input, language).then((result) => {
        // console.log(res);
        res.status(200).json(result);

    }).catch((err) => {
        console.log(err);
        res.status(200).json(err);

    })

})
router.post("/api/submitCode", (req, res) => {
    const { language, sourceCode, input } = req.body;
    console.log(language);
    console.log(sourceCode);
    console.log(input);
    compiler.runTestCases(sourceCode, input, language).then((result) => {
        console.log("lol-----")
        console.log(result);
        res.status(200).json({
            a:"lol"
        });

    }).catch((err) => {
        console.log(err);
        res.status(200).json(err);

    })

})
// router.post("/api/getTestSubmission", (req, res) => {
//     db.getTestSubmission(req.body.email, req.body.testId).then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })
// })
// router.post("/api/updateTestSubmission", (req, res) => {
//     db.updateTestSubmission(req.body.data).then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })
// })
// router.post("/api/saveTestSubmission", (req, res) => {
//     console.log(req.body.data)
//     db.saveTestSubmission(req.body.data).then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })
// })
// router.get("/api/submission", (req, res) => {
//     db.getTestSubmissionsAll().then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.get("/api/submission/:id", (req, res) => {
//     db.getTestSubmissionById(req.params.id).then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.get("/api/submissionByTestId/:id", (req, res) => {
//     db.getTestSubmissionByTestId(req.params.id).then((tests) => {
//         res.status(200).json(tests);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.post("/api/getNotification",(req,res)=>{
//     db.getNotification(req.body.email).then((docs) => {
//         res.status(200).json(docs);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.post("/api/updateNotification",(req,res)=>{
//     db.updateNotification(req.body.data).then((docs) => {
//         res.status(200).json(docs);
//     }).catch((err) => {
//         res.status(500).json(err);
//     })

// })
// router.post("/api/releaseResult",(req,res)=>{
//     db.releaseResult(req.body.test,req.body.submissions);
//     res.status(200).send("done");

// })

// router.get("/api/submissionPagination/:id",(req,res)=>{
//     var page = Math.abs(parseInt(req.params.id));
//     db.testSubmissionPagination(page).then((docs)=>{
//         res.json(docs)
//     }).catch((err)=>{
//         res.json(err);
//     })
// })

module.exports = router