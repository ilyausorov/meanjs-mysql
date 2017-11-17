# meanjs-mysql
The mean.js repository, already refactored into the MVC folder structure, again refactored for use with mySQL using Sequelize.
See my other meanjs-stack-MVC repo for more info: https://github.com/ilyausorov/meanjs-stack-MVC

# Pre-requisites
1. node.js
2. npm
3. bower
4. mySQL

# Getting Started
1. Download the repository onto your computer, preferably as close as possible to your root (~/[your-name] on Mac or C:/Users/[your-name] on Windows) directory
2. Open mySQL either through Terminal or a Database Editor UI such as Sequel Pro. Add a new database named 'meanjs-mysql'.
3. Use the terminal on Mac or command prompt on windows to navigate to the folder where you downloaded the repository and use the npm install command. This requires that you have already installed node.js, npm and bower.
4. Go into your settings/environment_settings/development.js file and update lines 8 and 9 with the username and password for your local mySQL instance.
5. In your terminal or command prompt, use the npm start command to start the app.
6. Navigate your browser to http://localhost:3000 to start the app. Make sure you always code with your Dev tools open :)
