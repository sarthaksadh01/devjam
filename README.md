## Devjam 2020 - Team Cryptx

## 📍 Week 2 - Learner's Portal

## ℹ️  How to access our solution

**Link** : https://hiii-15fdf.web.app/

**Server Hosting** : https://devjam-server.herokuapp.com



---
## 🔆 Design Specs 

1. **Designing the video player**

_The React Video Player provides only basic functionalities. The controls such as Next/Previous, Playback speed and Video Quality is added by us from scratch._ 

2. **Video Quality**

_The Video Quality control in our video player can switch between HD and SD quality. But a bug in react video player causes video to be restarted in chrome but works fine in safari_

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


## 📍 Week 1 - Allowing Admins to add content


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

