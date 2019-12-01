# Final Project: Online Paint Program

This project is a paint program with javascript, and also an online database for sharing you drawings through python and sql.


--------------------------------------------------
Python Files:

views.py - Main code file with all view functionality. References classes that to most of the work for it.

urls.py - URL paths to each view, including url arguments.

models.py - Database models for what a picture contains. Also tracks user's own saved/liked drawings.


creationForm.py - A sign up class with a basic creation form.

pictureData.py - Classes for saving a picture to the database and also a django form used for saving.

pictureLoader.py - Classes for loading a picture and also searching for one from the database.

--------------------------------------------------
Javascript Files:

CanvasManager.js - Handles all events that involving painting onto the canvas.

paintCanvas.js - Sets all on click events on the canvas page aside from the canvas itself.

PrepareCanvasLoad.js - Creates canvases of the images loaded from the database.

SaveAndLoad.js - Saves or loads images by image urls.

--------------------------------------------------
Template Files:

index.html - The main page prompting the user to login or sign up

signUp.html - Self explanatory

layout.html - CSS reference to inherit from in other html files. Also contains username and logout link.

canvas.html - Page where you draw images. Includes tools.

colourPallette.html - All the colour buttons in canvas.html.

homePage.html - Shows the user's previously created and liked drawings. The user can load in drawings into canvas.html, remove them or dislike ones they previously liked.

pictureListTemplate.html - For loops of tables displayings lists of drawings.

canvasTemplate.html - Loads canvases in on the home page or search page. (Not used in canvas.html)


--------------------------------------------------
Static Files:
orders/static/styles - CSS file 
orders/static/images and aesthetic images
orders/static/java - JS files
orders/static/manifest - Unused json file