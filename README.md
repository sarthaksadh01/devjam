## Devjam 2020 - Team Cryptx

## 📍 Week 7 - Coding challenge system

## ℹ️  How to access our solution

**Link** : 

**Server Hosting** :


---
## 🔆 Design Specs 




---
## 🍒 Cherry on the cake



## 🔥 Admin Portal

1. **Site Walkthrough**

_To make Admin aware of the all functionalities of our portal, a walkthrough is prepared to make admin know all the features._

2. **Auto generated General Instructions**

_To save Admin's time in writing general intructions about the duration of test, number of questionsetc, we have added the functionality of auto generating these instructions to save admin's time._

3. **Prevent Tab Changing**

_To make sure there is no cheating during the challenge, we made sure that learner cannot change the tabs/browser during the challenge. Doing so for 5 times will end the test automatically._

4. **Copy/Paste Disabled**

_To make sure there is no copy/pasting of answers from resources, Admin can enable this functionality to prohibit copy/paste from challenge page._

5. **Random Number Generator for test cases**

_To save Admin's time in generating test cases involving large amount of numbers, we have added the functionality to allow admins generate numbers in a certain range._

6. **Random Strings Generator for test cases**

_To save Admin's time in generating test cases involving large amount of strings, we have added the functionality to allow admins generate strings of a certain length._

7.  **Question Bank**

_A reservoir of all questions(frontend, frontend dynamic & coding) made by the admin. Admin can edit the questions by clicking on them or preview the list by applying filters based on difficulty or type._

8. **Execution time monitoring**

_Admin can set execution time for test cases to run after which learner will get a TLE._

9. **Markdown Editor**

_Admin can create challenge using Markdown editor to apply various effects to their text and not just plain text. It will increase readabilty & user interaction._

10. **Javascript Auto-graded challenge**

_The tests are administered using a selenium browser, which renders the page within the DOM, allowing it to check if the elements’ properties are within expected ranges. Since this task require server in isolated environment, we didn't include it in our solution. However we made a demo of it's working in our local. Check the video to see its working. _

11. **Saving state of the questions in the published challenges**

_Say admins publishes a challenge and after taht he edits the question. This will not impact the published challenges because we are saving the state of every question in the challenge. Hence preventing unneccessary chaos._

12. **Admin can create challenges for focussed learner groups**

_Instead of publishing the challeneges to teh entire learner community, admin can publish the challenge to selected students._


## 🔥 Learner's Portal

1. **Coding Playground**

_To increase learner's interactivity with our coding portal, we added a coding playground where learner can try to execute any code and run them on custom inputs._

2. **UI Playground**

_To increase learner's interactivity with our UI portal, we added a UI playground where learner can try to execute any HTML/CSS/Javascript code and see its live preview._


3. **Notifications**

_Learners receive notifications to keep them updated about all the challenges assigned to them and the results released._

4. **Redeem Points**

_Learners can redeem the points earned by giving the challenges to purchase exclusive merchandise. This will ensure user interactivity and will urge the learner to use out platform more._

5. **Progress Graph**

_Learner's progress is shown as a line graph._

6. **Code auto completion**


7. **Syntax Highlighting in Editor**


8. **Email regarding Test published and Results released**

_Once the admins publish a challenge, the selected learner receives a mail regarding the test & a test link. This also happens when admisn release test results._

---


## 📍 Week 6 - Testing system & Megabonus challenge

## ℹ️  How to access our solution

**Admin Portal** : https://sarthak-493c6.web.app

**Student Portal** : https://hiii-15fdf.web.app/

**Admin Credentials** : guest@zaio.io 123456

**Server Hosting** : https://devjam-server.herokuapp.com




---
## 🔆 Bonus & Extra Features

1. **Redirect to test/course page after publishing test/course**

2. **Loading time reduced :**


_To populate the submissions and users section, data is being fetched in batches i.e we have done pagination of users and test submissions to decrease load on server._ 


_To try this funcationality,_

_Visit our APIs_
(users) : http://devjam-server.herokuapp.com/api/usersPaginaton/1_ <br>
(submissions) : http://devjam-server.herokuapp.com/api/submissionPagination/1

_Replace page parameter (1) with  with any other number,which will then give number of user/submission = page * 3._ 

3. **Select drop down in view test submission section**

_To Prevent Admins from giving more marks than 1 in each question instead of a text field a drop down is added_

4. **Saving Test Submissions**

_Submission of the test answers are done as soon as user select the answer ie Submissions are auto saved_

5. **Saving Test Progress**

_Test progress is saved after every 1 minute which reduces the load on the server_

6. **Reminder system**

_For reminder system we have used linux Cron job which wakes the server at exactly 6 pm every day_

```javascript
// every day 6 pm
var j = schedule.scheduleJob('0 18 * 1-12 0-6', function () {
    reminder().then((notifications) => {
       // send notification
        db.sendReminder(notifications);
    })
});

async function reminder() {

    return new Promise((resolve, reject) => {
        var date = new Date();
        var today = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`
        var notifications = [];

        db.getAllCourse().then((courses) => {
            courses.forEach((course) => {
                var events = [];
                course.events.forEach((event) => {
                    var eventDate = new Date(event.start);
                    eventDateFormat = `${eventDate.getDay()}-${eventDate.getMonth()}-${eventDate.getFullYear()}`;
                    
                    // save all the events with today's date
                    if (today === eventDateFormat) {
                        events.push(event);
                    }

                })
                // No event found
                if (events.length !== 0) {
                    notifications.push({
                        events,
                        receivers: course.courseFor,
                        courseId: course._id
                    })
                }
            })
            resolve(notifications);


        }).catch((err) => {
            reject(err);
        })
    })


}
```
visit http://devjam-server.herokuapp.com/api/reminder to directly trigger the reminder function

8. **Disabled Edit test page**

_Edit test page is disabled after the test is published to prevent database errors._

9. **Alert while adding event**
_When adding an event if admin forgets to add video/delverable/test an alert is shown_

10. **For custom/generic event we have added Markdown editor so not only links but video/images/tables... can be added**

**Note To add time to the event, switch to day view in the calendar**



---




## 📍 Week 5 - Marking system on Admin Portal

## ℹ️  How to access our solution

**Link** : https://sarthak-493c6.web.app

**Admin Credentials** : guest@zaio.io 123456

**Server Hosting** : https://devjam-server.herokuapp.com/api




---
## 🔆 Bonus & Extra Features

1. **Designing the Custom Grid : Bonus 2**

_The Showstopper of our site, custom made & responsive data grid allowing any type of media in its cells and not just text!._

2. **Loading time reduced : Bonus 2**

_And to make things better, this custom grid speeds up the loading time, hence admins dont have to wait long to see the data._


_**How this grid speeds up the loading time ?**_


_To populate the grid, data is being fetched in batches i.e we have done pagination of users to decrease load on server. This loads only that amount of users required to fill the first view of grid.As we scroll, api gets called and results are fetched simultaneously._ 


_To try this funcationality,_

_Visit our API : http://devjam-server.herokuapp.com/api/usersPaginaton/1_

_Replace page parameter (1) with  with any other number,which will then give number of user = page * 3._ 

3. **Deliverable Statistics : Bonus 2**

_To make it easier for the teacher to analyse performance and submission of students for a particular delievrable, we have added a pie chart to depict the submission for a particular deliverable.This graphic data will ease the understanding of the
deliverable for the teacher by visiting the Submissions page._

4. **Student Performance Statistics :Bonus 2**

_To make it easier for the teacher to analyse performance and submission of students, we have added a pie chart to depict the submission of deliverables by a particular student. This graphic data will ease the understanding of the
student submission for the teacher by just clicking on the user name in the Marks table.(A modal will open)_
![User Stats](https://res.cloudinary.com/sarthaksadh/image/upload/v1592639310/Screenshot_2020-06-20_at_1.16.35_PM_iu7h1y.png)

5. **Student Avatar : Bonus 1**

_Avatars have been added to appear for the students names in the dropdown on the submission page, the marks
page and commenting part._

6. **Redirects to Edit Deliverable Page : Bonus 2**

_To enable teachers to edit the deliverable easily, we added redirect to the edit deliverable page by just clicked on the Edit icon in the deliverable header in the marks table._

7. **Redirects to Submission Page : Bonus 2**

_It is possible that the teacher might want to see the submission of the student while he/she is on deliverable scores page. So we added this functionality where the teacher can click on the student name in the table and redirection to the submission page happens._

---




## 📍 Week 4 - Learner's Portal

## ℹ️  How to access our solution

**Link** : https://hiii-15fdf.web.app/

**Server Hosting** : https://devjam-server.herokuapp.com



---
## 🔆 Design Specs 

1. **Designing the video player**

_The React Video Player provides only basic functionalities. The controls such as Next/Previous, Playback speed and Video Quality is added by us from scratch._ 

2. **Video Quality**

_The Video Quality control in our video player can switch between HD and SD quality_

**See this video** : https://drive.google.com/file/d/1C-TKBIm6Vr-eG8PzeJDlN7jLLUI0-uzW/view?usp=sharing


---


## 🔥 Cherry on the Cake

1. **Video Encryption**

_To prevent video from downloading, we have used AWS S3 bucket + CloudFront services. To explain this, consider an 
example in which we first upload our video to a S3 bucket and an object URL will be generated. Then we create a Cloudfront web distribution which will point to our S3 bucket. This will create a Signed URL which prevent public access and downloading. Cloudfront also caches the content for low latency and high throughput video delivery.This means user doesnot have to wait for the video to load again and again incase of heavy usage!_


_For testing purposes, http://localhost:3000/* is allowed for video access._

2. **Rendering Markdown for amazing customer experience**

_To increase readablity and user experience on the client side as well, we incorporated markdown viewer so that the content created by the admin using markdown editor will be well documented._

3. **Topic Thumbnail**

_The content page contains all topics & each topic card has thumbnail of the first video in its playlist instead of generic picture._

4. **Feature Rich Comments Section**

_For comments section, we used DISQUS api which provides amazing, user friendly comments section. It also supports media to be attached with comments._

5. **Tackling unauthorized access**

_To prevent unauthorized access, Github login and Google login is verified on server side._

6. **Only .zip files allowed**

_User can only upload .zip files & he/she will be prompted if any other type of file will be uploaded._

6. **Deliverable Submission allowed once**

_User can only upload the deliverable till the time he/she hasn't marked the submission as COMPLETED. After completing the submission, user cannot change the response. This allows strict submission criteria._


## 📍 Week 2,3 - Allowing Admins to add content


## ℹ️  How to access our solution

**Link** : https://cryptx-1d614.web.app/

**Server Hosting** : https://devjam-server.herokuapp.com

**Admin Credentials** : guest@zaio.io  123456

**Super Admin Credentials** : superGuest@zaio.io. 123456

---
## ℹ️  Our Unique Approach  

1. **Denormalised Database**

_Since the database structure required for this task could become very complex & CRUD operations
could become cumbersome, hence we came up with this solution. To explain this, since we can access
subtopics using their id so it requires a **new Subtopics table** which contains its details. Moreover
**Topics** table would also contain reference to each subtopic table of each topic. So in case of 
CRUD operations, we need to update both Subtopic & Topics table increasing database accesses. Hence we used 
denormalised database in which each topic will contain a subtopic array wherein each subtopic Sid will be a 
concatenation of topic id and subtopic id. Hence to access any subtopic directly, we could just explode the 
subtopic Sid string to get topic id & subtopic id._ 

2. **Prioritising Topics/Subtopics**

_Since drag feature was required in this week's challenge, so we implemented it be assigning **Priority**
to each topic & subtopic. So whenever we drag & rearrange, the priority of initial & final destination
topics gets swapped & this change is reflected in database as well. Also each new topic/subtopic gets 
the priority of max_priority+1._

---


## 🔥 Cherry on the Cake

1. **Markdown Editor for Deliverable Page**

_Admin can create deliverable using Markdown editor to apply various effects to their text
and not just plain text. It will increase readabilty & user interaction._

2. **Video Upload from Multiple Sources**

_Admin can now upload videos from not only his local files but also upload it through various
online storages like Google Drive, Youtube, Vimeo etc. It will help the admin to ease the video 
uploading from other sources._

3. **Notifications**

_Admin will get instant notifications and alerts in case of successfull and failed operations._

