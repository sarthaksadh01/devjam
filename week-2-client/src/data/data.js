import axios from 'axios';
// var baseUrl = "https://devjam-server.herokuapp.com/api";
// var baseUrl = "http://139.59.91.217/api"
var baseUrl = "http://localhost:4000/api";
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

async function submitFile(data, email) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/submitFile`, { data, email }).then((data) => {
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
async function getNotification(email) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/getNotification`, { email }).then((data) => {
            resolve(data.data);
        }).catch((err) => {

            reject(err);
        })
    })
}
async function updateNotification(data) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateNotification`, { data }).then((data) => {
            resolve(data.data);
        }).catch((err) => {

            reject(err);
        })
    })
}

async function getTest(id){
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/test/${id}`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}


async function saveTestSubmission(data){
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/saveTestSubmission/`,{data}).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function updateTestSubmission(data){
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/updateTestSubmission/`,{data}).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function getTestSubmission(email,testId){
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/getTestSubmission/`,{email,testId}).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}
async function getCourse(id){
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/course/${id}`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function getAllCourses(){
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/courses`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function getAllTests(){
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/tests`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function getSubmissionById(id){
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/submission/${id}`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function getCodingTest(id) {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/codingTest/${id}`).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}






async function compileCode(language, sourceCode, input) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/compileCode/`, { language, sourceCode, input }).then((res) => {

            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function submitCode(language, sourceCode, input) {
    return new Promise((resolve, reject) => {
        axios.post(`${baseUrl}/submitCode/`, { language, sourceCode, input }).then((res) => {
            resolve(res.data);
        }).catch((err) => {
            reject(err);
        })
    })

}

async function getAllCodingTests() {
    return new Promise((resolve, reject) => {
        axios.get(`${baseUrl}/codingTests`).then((res) => {
            resolve(res.data);
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
    githubAuth,
    updateNotification,
    getNotification,
    saveTestSubmission,
    getTestSubmission,
    updateTestSubmission,
    getTest,
    getCourse,
    getAllCourses,
    getAllTests,
    getSubmissionById,
    getCodingTest,
    submitCode,
    compileCode,
    getAllCodingTests


}