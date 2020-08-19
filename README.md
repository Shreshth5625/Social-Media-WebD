# Social-Media-WebD
Node modules are not added.

1)created server.js , added start,server to package.json file

2.1)mongo warnings: https://stackoverflow.com/questions/57546635/warning-on-connecting-to-mongodb-with-a-node-server

2.2) created routes/api => added auth.js(to get json webtoken for authentication) profile.js(profile operations of user) post.js(so users can post) users.js(handle registrations etc.)

2.3)created collections in postman.

3.1)created models , created Schema in User.js 

3.2)Init middleware (server.js), check using postman (created POST request)

3.3)used express validator in users.js for validations  => check('field','Error message').isEmpty(),not(),isEmail(),isLength()
    Include these conditions within the router.post parameters []

3.4)DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. => config => db.js => add useCreateIndex : true
    Check if user exist , user gravatar , initialised new user instance, encrypt password, ***await user.save()

3.5)return jsonwebtoken

3.6)Create middleware => auth.js  (video13). Also includes testing the jsonwebToken***

3.7) get user details by editing auth.js (routes/api)

UPTO MODULE 3.13 => User registration, jsonwebtoken application and authentication

3.14) copied from users.js and modified for login authentication. AUTHENTICATION FOR BACKEND DONE (login and registration).

4.15) Created Profile model

4.16)Getting the profile of a user using the userID, checking if a profile exists for a given user. Used a new method called .populate()

4.17) Creating and updating profile routes
-> added profileFields 
-> skills are divided by "," so used split(), map() and trim()  method
-> check for a profile and update , if not found then create the profile for that user
->ERROR FACED : do not forget to put >save"()"  bracket !!!

4.18) Getting all the profiles , get profile by userID (req.params.user_id)
************************************************************************* (do check for error case and multiple user case)

4.19) Delete a user post or profile (if doesn't delete => run npm start again)

4.20)Adding experience to the user profile

4.21) Delete an experience.
-> take id from the database

************ the current field in the experience and education will itself set according to the date entered

******************* NOT DONE: FETCHING GITHUB REPOSITORIES OF USER 