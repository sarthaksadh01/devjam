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
        res.status(200).json(result);

    });

})

router.post("/api/releaseCodingResult",(req,res)=>{
    // console.log(req.body.submissions)
    db.releaseResult2(req.body.test,req.body.submissions);
    res.status(200).send("done");

})

router.get("/api/code/:id/:qNo",(req,res)=>{
    var qNo = parseInt(req.params.qNo);
    db.getTestSubmissionById(req.params.id).then((submission)=>{
        if(submission === null) res.json({});
        res.json(submission.ans[qNo].submission.code);

    })
})

router.get("/api/html/:id/:qNo",(req,res)=>{
    var qNo = parseInt(req.params.qNo);
    db.getTestSubmissionById(req.params.id).then((submission)=>{
        console.log(submission)
        if(submission === null) res.json({});
        const {html,css,js} = submission.ans[qNo].submission;
        var obj = {
            html,
            css,
            js
        }
        res.json(obj);
       
    })
})


module.exports = router