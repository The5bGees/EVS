# Essential Validation Services

Essential Validation Services consists of an online database in which users are able to subscribe to gain access to laboratory test results on essential oils.

# Deployed Page
www.essentialvalidationservices.herokuapp.com (temp)

www.essentialvalidationservices.com (will be migrated to here once server/https issues are resolved)


# API's Used

The following API's were used:
  - Bootstrap Frame provided by Probootstrap.com
  - Stripe API provided by Stripe
  - Google Fonts provided by Google
  - Google Maps provided by Google

# Features Implemented
  ### Redesigned landing page

The entire front page was redesigned in order to be clear on what services are being offered. A navigation bar was added to find certain places on the page. The ability to create an account was added so that users are able to subscribe and log into the database.

![alt text](https://i.imgur.com/cl4cOl1.jpg "Homepage")

  ### EVS Database

The entire front page was redesigned in order to be clear on what services are being offered. A navigation bar was added to find certain places on the page. The ability to create an account was added so that users are able to subscribe and log into the database.

![alt text](https://i.imgur.com/H7ef3X6.png "Database")

![alt text](https://i.imgur.com/hmmqNoX.png "Database")


# How to run the project locally:
Requires Node version 8.0 or higher (https://nodejs.org/en/)

open the command line on the folder that contians the entire project and type:

npm install

bower install

node server.js

# How to update database and server connections:
modify file: config/env/development.js & config/env/production.js
the line that contains uri

exp: 
module.exports = {
	db: {
		uri: 'MONGODB URI GOES HERE',
		options: {}
	}
};
