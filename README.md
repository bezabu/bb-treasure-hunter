# Treasure Hunter

Treasure Hunter is a game in which the player must find three pieces of buried treasure on a small island. the game can be accessed [here](https://bezabu.github.io/bb-treasure-hunter/index.html).

![Mockup of the treasure hunter website on several different sized devices](assets/images/mockup01.webp)

# Features

## Existing Features

### Game Loop

The aim of the game is to find 3 hidden treasures. The player controls the hunter and can move them in 8 directions, and can dig at the hunter's current location to attempt to dig up treasure. Digging will make a hole in the ground so that the player knows not to try again in the same location.

![Treasure hunter game](assets/images/game-02.webp)

### 1 Procedurally generated terrain

The game world, or map is randomly generated each time the game loads. Trees, rocks and buried treasure are dispersed around the map for the player to avoid or interact with. There are also subtle variations in the colour and elevation of the ground and there are 4 tree variants and 3 rock variants. During generation, each cell has a chance to spawn a tree or a rock (unless it is the player starting cell) and three cells are randomly selected for the treasure.
The terrain data is stored in several 2 dimensional arrays. Nested for loops are used to iterate through every element in the array whenever values are being assigned or read.

### 2 Isometric projection

To give the illusion of perspective, an isometric projection is used to display the terrain. X and Y coordinates or objects and terrain are passed through a function which converts them. This results in the diamond shaped cells common in computer games in the 1990s and 2000s. All features that are not the terrain (trees, rocks, the player) are sorted by their isometric y coordinate and drawn in order so that features closer to the 'camera' are drawn over features that appear further away. To prevent the player losing track of where they are whn obscured by trees, a 20% opacity overlay of the player sprite is shown regardless.

### 3 the Hunter

The hunter is the player avatar. The hunter can move in 8 directions and can dig in the currently occupied cell. The player can control the hunter using either the keyboard or by pressing buttons. The hunter has an idle animation and a moving animation for each direction. This has been achieved by using canvas to only draw a section of the image, changing the section depending on the direction the hunter is facing and wether or not they are moving.

### 4 collision detection

Whenever the player attempts to move, the destination is checked against the feature map for potential obstacles. If a rock is in the location the player is trying to move to, movement is prevented.

### 5 reset button

The reset button reloads the page so that in the event of an unfavourable map, for example the player or treasure hemmed in by impassable rocks, the player can try again. It does this by reloading the page.

### 6 movement buttons

One of the ways input is obtained from the player on smaller devices is through the movement buttons. They are styled so that they should not obscure the centre of the game area regardless of portrait or landscape orientation.

### 7 hint message

While the player is traversing the game world, a small hint message is displayed to aid the player in locating the treasure. A function determines the distance between the player and the nearest treasure and displays a hot/cold style hint. The hint message is also styled so that the background changes colour to make it more noticable. It is placed in a central location above the hunter so that the user should not have to look back and forth between two locations.

### 8 treasure indicator

The game keeps track of how many pieces have been found by the player and displays them above the hint message.

### 9 start modal

![The start modal](assets/images/start-modal.webp)

Before the player can begin, a short message appears explaining the presmise and controls. The user must press the start button to begin the game. This also starts the timer. The players movement is prevented while the modal is displayed.

### 10 win modal

![The win modal](assets/images/win-modal.webp)

When the player has located and dug up each of the three treasure goals, a message is shown on the screen congratulating the player and displaying the time taken. The player is then prompted to press the reset button to play again. The players movement is prevented while the modal is displayed.

### 11 responsive design

![The website as it would appear in landscape and portrait configurations on phones](assets/images/mockup02.webp)

Particular care has been taken to ensure the buttons do not obscure too much of the game area on smaller devices in either portrait or landscape orientations. The game area also shrinks slightly to avoid the player avatar being cut off on smaller devices.

### 12 header

A simple header with the title of the game is shown at the top of the page. There are no navigational elements.

### 13 footer

A simple footer with a short sentance explaining the web site and game were created by me for educational purposes only. 

### 14 favicon

![Favicon icon](assets/images/icon-favicon.webp)

A custom favicon has been created to make the page stand out among other tabs.

### 15 custom 404 page

![My custom 404 page with image and link to index](assets/images/page_404.webp)

A custom 404 page has been made for the web site to enable the user to find their way back to the homepage if they become lost.

## Features to implement

### Pathfinding

I attempted to write a pathfinding algorithm that would plot a path between two points, but was unsuccessful.

### Customizable difficulty settings

Amount of treasure to find, amount of rocks or other obstacles. The nature of the game could be changed in a way so that finding treasure only adds time onto a timer which is constantly counting down to game over.

### Better terrain generation

Given more time, I would like to enhance the terrain generation so that it looks more natural and poses more of a challenge to the player. Trees could be grouped together more allowing for small clearings. More variation to the coasts, possibly even rivers extending into the island. Treasure prevented from spawning too close to other treasure.

### computer controlled antagonist

With pathfinding, it would be possible for another entity to hunt down the player, presenting more of a challenge and a fail state to the game.

# Technologies

- HTML has been used to structure the web site.
- CSS has been used to style the web site.
- javascript has been used to create the game including interactive elements
- [Blender](https://www.blender.org/) was used to create 3d models of trees, rocks, holes and crowns
- [Pain.NET](https://www.getpaint.net/) was used to edit images
- [GitHub](https://github.com/) has been used to store code, images and other contents.
- Gitpages was used to deploy the website.
- Git was used for version control, pushing contents to github.
- [Codeanywhere](https://app.codeanywhere.com/) was used as IDE.
- [favicon.io](https://favicon.io/) was used to make a simple favicon
- [Wave Web Accessibility Evaluation tool](https://wave.webaim.org/) was used to test the accessibility of the web site.
- [W3C Markup Validation Service](https://validator.w3.org/) was used to check HTML.
- [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/) was used to check CSS.
- [JSHint](https://jshint.com/) was used to test the javascript code
- [HTMLcolourcodes.com](https://htmlcolorcodes.com/) was used to get hex colour values.
- [Am I Responsive](https://ui.dev/amiresponsive?url=https://bezabu.github.io/bb-treasure-hunter/index.html) was used to create the mockup
- chrome developer tools was used for testing
- [Google fonts](https://fonts.google.com/specimen/Permanent+Marker/tester) has been used to import the font Permanent Marker.

# Testing

## General

Test: Open the website in each of the following browsers: chrome, Edge, Firefox, Opera


## Validator Testing

- No errors were returned when passing through the [W3C HTML Validator](https://validator.w3.org/nu/?doc=https%3A%2F%2Fbezabu.github.io%2Fbb-treasure-hunter%2Findex.html)
- No errors were returned when passing through the [W3C CSS Validator](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fbezabu.github.io%2Fbb-treasure-hunter%2Findex.html&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en)
- No errors were found when passing through the [JSHint Code Analysis Tool](https://jshint.com/)
- No errors or alerts were returned when passing through the [WAVE Web Accessibility Evaluation tool](https://wave.webaim.org/report#/https://bezabu.github.io/bb-treasure-hunter/index.html)

## Unfixed Bugs

button mouse movement
terrain features not shown on first loading


# Deployment

The site was deployed to GitHub pages. The steps to deploy are as follows:

- In the GitHub repository, navigate to the Settings tab
- From the source section drop-down menu, select the Master Branch
- Once the master branch has been selected, the page will be automatically refreshed with a detailed ribbon display to indicate the successful deployment.
- The live link can be found here: [https://bezabu.github.io/bb-treasure-hunter/](https://bezabu.github.io/bb-treasure-hunter/)

# Credits

## images

- Images used for trees, rocks, crowns and holes were made by me using Blender and Paint.NET

- The hunter sprite set was taken from [this tutorial](https://programmingmind.net/demo/isometric-game-development-in-html-5-canvas-part-1) and has been made [free for public use](https://flarerpg.org/) by the artist, [Clint Bellinger](https://clintbellanger.net/)

- The shovel and hole in the ground image used in the 404 page was taken from [creazilla](https://creazilla.com/nodes/7766525-hole-in-the-ground-clipart) and is "free for editorial, educational, commercial, and/or personal projects. No attribution required."

## code

- Instructions on how to convert to isometric coordinates were taken from [this tutorial](https://clintbellanger.net/articles/isometric_math/)
  
- Instructions on how to use canvas to animate sprites were taken from this [youtube tutorial](https://www.youtube.com/watch?v=GFO_txvwK_c)
  
- Insctructions on how to use canvas were taken from this [tutorial(part of developer documentation)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)

- Instructions on how to use 2 dimensional arrays were taken from [this stackoverflow thread](https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript)



## other