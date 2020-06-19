/* 

This file is used connect backend APIs to
frontend i.e connect the frontend components
to database & functionalities.

*/

import axios from 'axios';
// var baseUrl = "https://devjam-server.herokuapp.com/api";
var baseUrl = "http://localhost:4000/api";
async function getContent(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/content/${id}`).then((content) => {
            resolve(content.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function createTopic(admin) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/createTopic`, { admin }).then((topicDetail) => {
            resolve(topicDetail.data);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function getTopic(_id) {

    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/topic/${_id}`).then((topicDetail) => {
            resolve(topicDetail.data);
        }).catch((err) => {
            reject(err);
        })
    })
}
async function removeTopic(_id) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/removeTopic`, { topicId: _id }).then((topicDetail) => {
            resolve(topicDetail.data);
        }).catch((err) => {
            reject(err);
        })
    })
}
async function updateTopic(topic) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateTopic`, { topic }).then((topicDetail) => {
            resolve(topicDetail.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function insertSubtopic(type, topicId) {

    return new Promise((resolve, reject) => {

        if (type === "video") {
            var subTopicDetails = {
                title: `video`,
                videoLink: ``,
                desc: `desc`,
                fileName: ``,
                type: `video`,
                thumbNail: "https://www.magisto.com/blog/wp-content/uploads/2019/04/NewBlogPostSize_Instagram.jpg"
            }

        }
        else {
            var subTopicDetails = {
                title: `deliverable`,
                instruction: ``,
                points: 0,
                type: `deliverable`,
                thumbNail: "https://www.magisto.com/blog/wp-content/uploads/2019/04/NewBlogPostSize_Instagram.jpg",
                due: new Date(),
            }

        }
        axios.post(`${baseUrl}/insertSubtopic`, { subTopicDetails, topicId }).then((topicDetail) => {
            resolve(topicDetail.data);
        }).catch((err) => {
            reject(err);
        })
    })




}
async function getSubTopic(ids, type) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/${type}/${ids}`).then((res) => {
            resolve(res.data);

        }).catch((err) => {
            reject(err);
        })
    })

}
async function updateSubTopic(ids, subTopicDetails) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateSubtopic`, { ids, subTopicDetails }).then((res) => {


            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function createProfile(doc) {
    // alert(JSON.stringify(doc))
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/createProfile`, { profileData: doc }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function updateProfile(doc) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateProfile`, { profileData: doc }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function getProfile(_id) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/profile/${_id}`).then((res) => {
            resolve(res.data);

        }).catch((err) => {
            reject(err);
        })
    })

}
async function getAllProfiles(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/profiles/${id}`).then((res) => {
            resolve(res.data);

        }).catch((err) => {
            reject(err);
        })
    })

}


async function login(userName, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/login`, { userName, password }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function verifyLogin(userName, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/verifyLogin`, { userName, password }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })
}
async function reArrangeList(_id1, _id2, p1, p2) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/reArrange`, { _id1, _id2, p1, p2 }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function superLogin(userName, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/superLogin`, { userName, password }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function verifySuperLogin(userName, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/verifySuperUser`, { userName, password }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function getAllAdmins() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/getAdmins`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function createAdmin(userName, password) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/registerAdmin`, { userName, password }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function removeAdmin(userName) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/removeAdmin`, { userName }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function removeProfile(id) {

    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/removeProfile`, { id }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}


async function getMarks() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/marks`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}



async function getUsers() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/users`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })


}

async function UpdateUser(email,points,subTopicId){
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateMarks`,{email,points,subTopicId}).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
export {
    getContent,
    createTopic,
    getTopic,
    removeTopic,
    updateTopic,
    insertSubtopic,
    getSubTopic,
    updateSubTopic,
    login,
    createProfile,
    updateProfile,
    getProfile,
    getAllProfiles,
    verifyLogin,
    reArrangeList,
    superLogin,
    verifySuperLogin,
    getAllAdmins,
    removeAdmin,
    createAdmin,
    removeProfile,
    getUsers,
    getMarks,
    UpdateUser
}