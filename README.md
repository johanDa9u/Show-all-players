# Show-all-players
A simple foundryVTT module that adds the 'show all players' feature to NPC sheets and items by converting them to Journal Entries.

### Installation
You may install this module by using the following JSON manifest URL: https://raw.githubusercontent.com/johanDa9u/Show-all-players/main/module.json

You can also download the folder and place it in {userData}/Data/modules

### How to use

This module will get the currently opened actor sheet or item sheet, convert it to a Journal Entry and display it to your players.

* For actor sheets: 
    Once the actor sheet is opened, press ctrl + ArrowDown.

* For item sheets:
    Once the item sheet is opened, press ctrl + ArrowUp.

### Notes

* This module can only show one sheet at a time so be sure to only have the desired sheet open by closing (or just minimizing) the other active sheets.

* All created journal entries will be stored in the "Actors and Items" folder in the Journal Entries tab.
Only you can see the folder and its content. You may delete the folder whenever you want.

### Known issues

* The module might fail if there are double quotes (") in the bio or description of the sheet. You may however use single quotes instead.

* When you update a sheet, be sure to delete the corresponding journal entry before you use the module to show it to players. Otherwise, the module will show the previous version of the sheet instead.














