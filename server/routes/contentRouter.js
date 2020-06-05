/*

   This file contains routes specific to Week 1 Task i.e
   Allow admins to add Content.
   These routes will be used to query the database.

 */


const express = require('express')
const Topics = require('../models/topic')
const db = require("../database")
const router = new express.Router


router.get("/api/content/:id", (req, res) => {
    console.log(req.params.id)
    db.getContent(req.params.id).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

});

router.get("/api/topic/:id", (req, res) => {
    db.getTopic(req.params.id).then((docs) => {
        res.status(200).json(docs);
    }).catch((err) => {
        res.status(500).json(err);
    })

});

router.get("/api/video/:id", (req, res) => {
    var _id = req.params.id;
    if (!_id.includes("-")) {
        res.status(500).json({ err: "error" });
        return;
    }
    var ids = _id.split("-");
    db.getSubtopic(ids[0], ids[1]).then((video) => {
        res.status(200).json(video);
    }).catch((err) => {
        res.status(500).json(err);
    })

});


router.get("/api/deliverable/:id", (req, res) => {
    var _id = req.params.id;
    if (!_id.includes("-")) {
        res.status(500).json({ err: "error" });
        return;
    }
    var ids = _id.split("-");
    db.getSubtopic(ids[0], ids[1]).then((deliverable) => {
        res.status(200).json(deliverable);
    }).catch((err) => {
        res.status(500).json(err);
    })

});

router.post("/api/createTopic", (req, res) => {
    var admin = req.body.admin;
    var detail = {
        priority: 0,
        createdBy:admin
    }
    db.saveTopic(detail).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })
})

router.post("/api/removeTopic", (req, res) => {
    var topicId = req.body.topicId;
    db.removeTopic(topicId).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })
})

router.post("/api/insertSubtopic", (req, res) => {
    var subTopicDetails = req.body.subTopicDetails;
    var topicId = req.body.topicId;
    console.log(subTopicDetails)
    console.log(topicId)
    db.insertSubtopic(topicId, subTopicDetails).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.post("/api/removeSubtopic", (req, res) => {
    var subTopicId = req.body.subTopicId;
    var topicId = req.body.topicId;
    db.removeSubTopic(topicId, subTopicId).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })


})

router.post("/api/updateTopic", (req, res) => {
    var topic = req.body.topic;
    db.updateTopic(topic).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })

})
router.post("/api/updateSubtopic", (req, res) => {
    var _id = req.body.ids;
    if (!_id.includes("-")) {
        res.status(500).json({ err: "error" });
        return;
    }
    var _ids = _id.split("-");
    var subTopicDetails = req.body.subTopicDetails;
    var topicId = _ids[0];
    var subTopicId = _ids[1];
    console.log(subTopicDetails)
    console.log(_id)
    db.updateSubtopic(topicId, subTopicId, subTopicDetails).then((doc) => {
        console.log("sb sahi h")
        console.log(doc)
        res.status(200).json(doc);
    }).catch((err) => {
        console.log("error j")
        console.log(err);
        res.status(500).json(err);
    })
})

router.post("/api/reArrange", (req, res) => {
    var _id1 = req.body._id1;
    var _id2 = req.body._id2;
    var p1 = req.body.p1;
    var p2 = req.body.p2;
    db.reArrange(_id1, _id2, p1, p2).then((doc) => {
        res.status(200).json(doc);

    }).catch((err) => {
        res.status(500).json(err);

    })
    res.send("done");

})


module.exports = router