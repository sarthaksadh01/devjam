import axios from 'axios';
var baseUrl = "https://devjam-server.herokuapp.com/api";
// var baseUrl = "http://localhost:4000/api";
async function signupWithEmailPassword(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/userLogin`, { data }).then((data) => {
            resolve(data.data);
        }).catch((err) => {
            reject(err);
        })
    })
}

async function createAccount(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/userSignup`, { data }).then((data) => {
            resolve(data.data);
        }).catch((err) => {
            alert(JSON.stringify(err))
            reject(err);
        })
    })

}

async function getContent() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/content/cryptx}`).then((content) => {
            resolve(content.data);
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

async function submitFile(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/submitFile`, { data }).then((data) => {
            resolve(data.data);
        }).catch((err) => {

            reject(err);
        })
    })



}
async function getSubmission(email, id) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/getFile`, { email, id }).then((data) => {
            resolve(data.data);
        }).catch((err) => {

            reject(err);
        })
    })

}

async function githubAuth(code, type) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/github-auth`, { code, type }).then((data) => {
            resolve(data.data);
        }).catch((err) => {

            reject(err);
        })
    })
}




export {
    signupWithEmailPassword,
    getContent,
    getTopic,
    createAccount,
    submitFile,
    getSubmission,
    githubAuth


}