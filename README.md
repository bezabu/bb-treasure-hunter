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

### reset button

The reset button reloads the page so that in the event of an unfavourable map (for example the player or treasure hemmed in by mipassable roks) the player can try again.

### movement buttons

One of the ways input is obtained from the player on smaller devices is through the movement buttons. They are styled so that they do not obscure the centre of the game area regardless of portrait or landscape orientation and only appear on smaller screen sizes.

### start message

Before the player can begin, a short message appears explaining the presmise and controls. The user must press the start button to begin the game. This also starts the timer.

### win message