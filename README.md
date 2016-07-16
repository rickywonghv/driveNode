# driveNode
This is a project for user to build their own cloud storage. It use AES192 to encrypt all the uploaded file, RS256 for all token. It use RESFUL API to develop, so you can easy to develop your mobile Application or enhance it.

Requirement:
  1. NodeJS (tested on 6.2.0)
  2. MongoDB

Initial
 Step 1: create Mongo Database using mongo command  db.dir.insert({_id:0}) , it will create collection named dir, the name should be "dir" and insert _id:0
 Step 2: change config in ./config/config.json (connection is MongoDB IP or Endpoint, port: 27017 by default, dbname:INSERT YOUR mongoDB Database name that create before.)
 Step 3: npm start
 Step 4: open http://YOUR_DOMAIN/init (Use to create root user) (Default username: root, password:28911353)
 Step 5: enjoy!
 
 Optional:
  1. Change your own public & private key for user token (./key/public.key and ./key/private.key) (Do not change the file name)
  2. Change your own public & private key for file share token (./key/sharePublic.key and ./key/sharePrivate.key) (Do not change the file name)
