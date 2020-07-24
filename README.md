# Social-Media-WebD
Node modules are not added.

1)created server.js , added start,server to package.json file

2.1)mongo warnings: https://stackoverflow.com/questions/57546635/warning-on-connecting-to-mongodb-with-a-node-server

2.2) created routes/api => added auth.js(to get json webtoken for authentication) profile.js(profile operations of user) post.js(so users can post) users.js(handle registrations etc.)

2.3)created collections in postman.

3.1)created models , created Schema in User.js 

3.2)Init middleware, check using postman (created POST request)

3.3)used express validator in users.js for validations  => check('field','Error message').isEmpty(),not(),isEmail(),isLength()
    Include these conditions within the router.post parameters []

3.4)DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. => config => db.js => add useCreateIndex : true
    Check if user exist , user gravatar , initialised new user instance, encrypt password, ***await user.save()

3.5)

