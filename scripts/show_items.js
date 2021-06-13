function getItemByName(name) {
    let items = game.items._source;
    var item_id;
    for (var i = 0; i < items.length; i++) {
        if (items[i].name === name) {
            item_id = items[i]._id;
            break;
        }
    }
    return game.items.get(item_id);
}

function getItemDescriptionHTML(it) {
    return it.data.data.description.value;
}

function getItemImgHTML(it){
    return "<p><img src='" + it.data.img + "' /></p><p>&nbsp;</p>";
}

function getItemHTML(it){
    var s = getItemImgHTML(it).concat(getItemDescriptionHTML(it));
    s = s.replace('"', '\\"')    
               .replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
    s = s.replace(/[\u0000-\u0019]+/g,"");  
    return s;
}

function getModuleFolderID() {
    var folders = game.folders._source;
    for (var i = 0; i < folders.length; i++) {
        if (folders[i].name === "Actors and Items") {
            return folders[i]._id;
        }
    }
    return null;
}

function moduleFolderExists() {
    return getModuleFolderID() !== null;
}

function JournalEntryExists(name) {
    var journalEntrys = game.journal._source;
    for (var i = 0; i < journalEntrys.length; i++) {
        if (journalEntrys[i].name === name) {
            return journalEntrys[i]._id;
        }
    }
    return null;
}

async function createModuleFolder() {
    var folderData = '{"_id":null, "name":"Actors and Items", "type":"JournalEntry"}';
    return Folder.create(JSON.parse(folderData)).then(function (s) {
        return s._id;
    });
}

async function createModuleFolderIfNotExist() {
    var moduleFolderId = getModuleFolderID();
    if (getModuleFolderID() === null) {
        return createModuleFolder();
    }
    else {
        return new Promise((res, rej) => {
            res(moduleFolderId);
        });
    }
}

function getActiveItemSheet() {
    if (!game.user.isGM) {
        return;
    }
    var items = game.items._source;
    var item;
    for (var i = 0; i < items.length; i++) {
        item = game.items.get(items[i]._id);
        if (item.sheet.rendered && !item.sheet._minimized) {
            displayItemSheetToPlayers(item);
            console.log(item.name);
            break;
        }
    }
}

function displayItemSheetToPlayers(item) {
    if (item === null) {
        return;
    }
    var je = JournalEntryExists(item.name);
    if (je === null) {
        var folder_id;
        createModuleFolderIfNotExist().then((id) => {
            folder_id = id;
            var journalEntryData = '{"_id":null, "name":"' + item.name + '", "content":"' + getItemHTML(item) + '", "folder":"' + folder_id + '"}';

            JournalEntry.create(JSON.parse(journalEntryData)).then(() => {
                var j = game.journal.getName(item.name);
                j.sheet.render(true);
                j.show("text", true);
            });
        });
    }
    else {
        var j = game.journal.get(je);
        j.sheet.render(true);
        j.show("text", true);
    }
}

function doc_keyUpItems(e) {

    if (e.ctrlKey && e.key === 'ArrowUp') {
        getActiveItemSheet();
    }
}

document.addEventListener('keyup', doc_keyUpItems, false);