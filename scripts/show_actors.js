function getActorByName(name) {
    let actors = game.actors._source;
    var actor_id;
    for (var i = 0; i < actors.length; i++) {
        if (actors[i].name === name) {
            actor_id = actors[i]._id;
            break;
        }
    }
    return game.actors.get(actor_id);
}

function getActorBioHTML(act) {
    if(act.type === "character"){
        return act.data.data.details.biography.value;
    }
    return act.sheet.getData().actor.data.details.biography.value;
}

function getActorImgHTML(act) {
    return "<p><img src='" + act.sheet.object.data.img + "' height='304' /></p><p>&nbsp;</p>";
}

function getActorHTML(act){
    var s = getActorImgHTML(act);
    if(getActorBioHTML(act) !== null){
        s = s.concat(getActorBioHTML(act));
    }
    s = s.replace(/\\n/g, "\\n")  
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

function getActiveActorSheet() {
    if (!game.user.isGM) {
        return;
    }
    var actors = game.actors._source;
    var actor;
    for (var i = 0; i < actors.length; i++) {
        actor = game.actors.get(actors[i]._id);
        if (actor.sheet.rendered && !actor.sheet._minimized) {
            displayActorSheetToPlayers(actor);
            break;
        }
    }
}

function displayActorSheetToPlayers(actor) {
    if (actor === null) {
        return;
    }
    var je = JournalEntryExists(actor.name);
    if (je === null) {
        var folder_id;
        createModuleFolderIfNotExist().then((id) => {
            folder_id = id;
            var journalEntryData = '{"_id":null, "name":"' + actor.name + '", "content":"' + getActorHTML(actor) + '", "folder":"' + folder_id + '"}';

            JournalEntry.create(JSON.parse(journalEntryData)).then(() => {
                var j = game.journal.getName(actor.name);
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

function doc_keyDownActors(e) {

    if (e.ctrlKey && e.key === 'ArrowDown') {
        getActiveActorSheet();
    }
}

document.addEventListener('keydown', doc_keyDownActors, false);
