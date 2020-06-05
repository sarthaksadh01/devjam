## Devjam 2020 - Team Cryptx

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
the priority of max_priority+1. _

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

