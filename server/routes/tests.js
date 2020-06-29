const express = require('express')
const router = new express.Router
var db = require("../database")

router.get("/api/tests", (req, res) => {
    db.getAllTest().then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/test/:id", (req, res) => {
    db.getTest(req.params.id).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/updateTest/", (req, res) => {
    var data = req.body.data;
    db.updateTest(data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/createTest/", (req, res) => {
    db.createTest({
        questions: [
            {
                imageUrl: "",
                type: "Multiple choice",
                title: "",
                options: []
            }
        ]
    }).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/publishTest", (req, res) => {
    db.publishTest(req.body.data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/getTestSubmission", (req, res) => {
    db.getTestSubmission(req.body.email, req.body.testId).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/updateTestSubmission", (req, res) => {
    db.updateTestSubmission(req.body.data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.post("/api/saveTestSubmission", (req, res) => {
    console.log(req.body.data)
    db.saveTestSubmission(req.body.data).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })
})
router.get("/api/submission", (req, res) => {
    db.getTestSubmissionsAll().then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.get("/api/submission/:id", (req, res) => {
    db.getTestSubmissionById(req.params.id).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.get("/api/submissionByTestId/:id", (req, res) => {
    db.getTestSubmissionByTestId(req.params.id).then((tests) => {
        res.status(200).json(tests);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.post("/api/getNotification",(req,res)=>{
    db.getNotification(req.body.email).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.post("/api/updateNotification",(req,res)=>{
    db.updateNotification(req.body.data).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.post("/api/releaseResult",(req,res)=>{
    db.releaseResult(req.body.test,req.body.submissions);
    res.status(200).send("done");

})


module.exports = router