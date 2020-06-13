const express = require('express')
var encrypt = require("sha256");
const router = new express.Router
var db = require("../database")
const FormData = require("form-data");
const fetch = require("node-fetch");



var superUser = encrypt("superGuest@zaio.io");
var superPass = encrypt("123456");

router.post("/api/login", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.getAdmin(encrypt(userName), encrypt(password)).then((docs) => {
        console.log(docs);
        if (docs.length == 1) {
            res.status(200).json({
                success: true,
                userName: encrypt(userName),
                password: encrypt(password)

            })
        }
        else {
            res.status(200).json({
                success: false
            })

        }
    }).catch((err) => {
        res.status(500).json(err);
    })


});



router.post("/api/verifyLogin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.getAdmin(userName, password).then((docs) => {
        if (docs.length == 1) {
            res.status(200).json({
                success: true,
            })
        }
        else {
            res.status(200).json({
                success: false
            })

        }
    }).catch((err) => {
        res.status(500).json(err);
    })

});


router.post("/api/superLogin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    console.log(userName);
    console.log(password);
    if (userName === "superGuest@zaio.io" && password == "123456") {
        res.json({
            success: true,
            userName: superUser,
            password: superPass
        });
    }
    else {
        res.json({
            success: false
        })
    }

});

router.post("/api/verifySuperUser", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    if (userName == superUser && password == superPass) {
        res.json({
            success: true,
        });
    }
    else {
        res.json({
            success: false
        })
    }

});


router.post("/api/registerAdmin", (req, res) => {
    var userName = req.body.userName;
    var password = req.body.password;
    db.createAdmin(encrypt(userName), encrypt(password), userName).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })

})

router.get("/api/getAdmins", (req, res) => {
    db.getAllAdmins().then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })

})

router.post("/api/removeAdmin", (req, res) => {
    var userName = req.body.userName;
    db.removeAdmin(userName).then((doc) => {
        res.status(200).json(doc);
    }).catch((err) => {
        res.status(500).json(err);
    })
})




router.post("/api/userLogin", (req, res) => {
    var data = req.body.data;
    console.log(data)
    db.loginUser(data.email).then((users) => {
        if (users.length == 0) {
            res.status(200).json({ success: false, err: "Account Does not exist!" });
            return;
        }
        else {
            if (data.isSocialLogin != users[0].isSocialLogin) {
                var err = users[0].isSocialLogin ? "Previously logged in using social account!" : "Previously logged in using email and password!";
                res.status(200).json({ success: false, err });

            }
            else if (data.isSocialLogin) {
                res.status(200).json({ success: true });
            }
            else {
                if (encrypt(data.password) === users[0].password) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, err: "Invalid Password" });
                }
            }
        }

    }).catch((err) => {
        res.status(500).json(err);

    })


})

router.post("/api/userSignup", (req, res) => {
    var data = req.body.data;
    db.loginUser(data.email).then((docs) => {
        if (docs.length>0) {
            res.status(200).json({ success: false, err: "Account already exist!" });

        }
        else {
            if (!data.isSocialLogin) {
                data.password = encrypt(data.password);

            }
            db.registerUser(data).then((doc) => {
                res.status(200).json({ success: true });

            }).catch((err) => {
                res.status(500).json(err);
            })
        }
    })
})


router.post("/api/submitFile", (req, res) => {
    var data = req.body.data;
    console.log(data)
    db.submitFile(data).then((doc) => {
        console.log(doc);
        res.status(200).json(doc);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
})

router.post("/api/getFile", (req, res) => {
    var email = req.body.email;
    var id = req.body.id;

    db.getSubmissions(email, id).then((docs) => {


        res.status(200).json(docs);
    }).catch((err) => {

        res.status(500).json(err);
    })
})

router.post("/api/github-auth", (req, res) => {
    const client_id = "Iv1.819423876210273a";
    const client_secret = "413e18c843cc5df6cadf3b8e4112cbbfdd9a6f38";
    const { code ,type} = req.body;
    const data = new FormData();
    data.append("client_id", client_id);
    data.append("client_secret", client_secret);
    data.append("code", code);
    console.log(code);
    fetch(`https://github.com/login/oauth/access_token`, {
        method: "POST",
        body: data
    })
        .then(response => response.text())
        .then(paramsString => {
            let params = new URLSearchParams(paramsString);
            const access_token = params.get("access_token");
            const scope = params.get("scope");
            const token_type = params.get("token_type");

            // Request to return data of a user that has been authenticated
            return fetch(
                `https://api.github.com/user?access_token=${access_token}&scope=${scope}&token_type=${token_type}`
            );
        })
        .then(response => response.json())
        .then(response => {
            console.log(response)
            var data = {
                name:response.name,
                email:response.login,
                isSocialLogin:true,
                imageUrl:response.avatar_url,
                password:""
            }
            db.loginUser(response.login).then((docs)=>{
                console.log(docs);
                if(type=="login"){
                    if(docs.length>0){
                        res.status(200).json({
                            success:true,
                            data:docs[0]
                        });

                    }
                    else{
                        res.status(200).json({
                            success:false,
                            err:"Account Does not exist!"
                        });
                    }

                }
                else{
                    if(docs.length>0){
                        res.status(200).json({
                            success:false,
                            err:"Account already exist!"
                        });

                    }
                    else{
                        db.registerUser(data).then((doc)=>{
                            res.status(200).json({
                                success:true,
                                data:doc
                            });

                        }).catch((err)=>{
                            res.status(500).json(err);

                        })
                    }

                }
            }).catch((err)=>{
                res.status(500).json(err);

            })

        })
        .catch(error => {
            console.log(error);
            return res.status(400).json(error);
        });

})



module.exports = router