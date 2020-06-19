## Devjam 2020 - Team Cryptx

## 📍 Week 5 - Marking system on Admin Portal

## ℹ️  How to access our solution

**Link** : https://sarthak-493c6.web.app

**Server Hosting** : https://devjam-server.herokuapp.com/api


---
## 🔆 Bonus & Extra Features

1. **Designing the Custom Grid**

_The Showstopper of our site, custom made & responsive data grid allowing any type of media in its cells and not just text!._

2. **Loading time reduced**

_And to make things better, this custom grid speeds up the loading time, hence admins dont have to wait long to see the data._


_**How this grid speeds up the loading time ?**_


_To populate the grid, data is being fetched in batches i.e we have done pagination of users to decrease load on server. This loads only that amount of users required to fill the first view of grid.As we scroll, api gets called and results are fetched simultaneously._ 


_To try this funcationality,_

_Visit our API : http://devjam-server.herokuapp.com/api/usersPaginaton/1_

_Replace page parameter (1) with  with any other number,which will then give number of user = page * 3._ 

3. **Deliverable Statistics**

_To make it easier for the teacher to analyse performance and submission of students for a particular delievrable, we have added a pie chart to depict the submission for a particular deliverable.This graphic data will ease the understanding of the
deliverable for the teacher by visiting the Submissions page._

4. **Student Performance Statistics**

_To make it easier for the teacher to analyse performance and submission of students, we have added a pie chart to depict the submission of deliverables by a particular student. This graphic data will ease the understanding of the
student submission for the teacher by just clicking on the user name in the Marks table.(A modal will open)_

5. **Student Avatar**

_Avatars have been added to appear for the students names in the dropdown on the submission page, the marks
page and commenting part._

6. **Redirects to Edit Deliverable Page**

_To enable teachers to edit the deliverable easily, we added redirect to the edit deliverable page by just clicked on the Edit icon in the deliverable header in the marks table._

7. **Redirects to Submission Page**

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

