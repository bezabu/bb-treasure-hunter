# Treasure Hunter

Treasure Hunter is a game in which the player must find three pieces of buried treasure on a small island.

images

# Features

## Existing Features

### Procedurally generated terrain

The game world, or map is randomly generated each time the game loads. Trees, rocks and buried treasure are dispersed around the map for the player to avoid or interact with. There are also subtle variations in the colour and elevation of the ground. During generation, each cell has a chance to spawn a tree or a rock (unless it is the player starting cell) and three cells are randomly selected for the treasure.
The terrain data is stored in several 2 dimensional arrays. Nested for loops are used to iterate through every element in the array whenever values are being assigned or read.

### Isometric projection

To give the illusion of perspective, an isometric projection is used to display the terrain. X and Y coordinates are passed through a function which converts them. This results in the diamond shaped cells common in computer games in the 1990s and 2000s. All features that are not the terrain (trees, rocks, the player) are sorted by their isometric y coordinate and drawn in order so that features closer to the 'camera' are drawn over features that appear further away.

### the Hunter

The hunter is the player avatar. The hunter can move in 8 directions and can dig in the currently occupied cell. The player can control the hunter using either the keyboard or by pressing buttons. Animated

### collision detection

Whenever the player attempts to move the player, the destination is checked against the feature map for potential obstacles. If a rock is in the location the player is trying to move to, movement is prevented.

### reset button

The reset button reloads the page so that in the event of an unfavourable map (for example the player or treasure hemmed in by impassable rocks) the player can try again.

### movement buttons

One of the ways input is obtained from the player on smaller devices is through the movement buttons. They are styled so that they do not obscure the centre of the game area regardless of portrait or landscape orientation and only appear on smaller screen sizes.

### hint message

While the player is traversing the game world, a small hint message is displayed to aid the player in locating the treasure. A function determines the distance between the player and the nearest treasure and displays a hot/cold style hint. The hint message is also styled so that the background changes colour to make it more noticable.

### start modal

Before the player can begin, a short message appears explaining the presmise and controls. The user must press the start button to begin the game. This also starts the timer. The players movement is prevented while the modal is displayed.

### win modal

When the player has located and dug up each of the three treasure goals, a message is shown on the screen congratulating the player and displaying the time taken. The player is then prompted to press the reset button to play again. The players movement is prevented while the modal is displayed.

### header

A simple header with the title of the game is shown at the top of the page. There are no navigational elements.

### footer

A simple footer with a short sentance explaining the web site and game were created by me for educational purposes only. 

### favicon

A custom favicon has been created to make the page stand out among other tabs.

### custom 404 page

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



# Testing

## Validator Testing

## Unfixed Bugs

# Deployment
