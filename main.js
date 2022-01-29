(function () {
    let btnAddFolder = document.querySelector("#btnAdd");
    let btnAddTextFile = document.querySelector("#btnTextFile");
    let btnAddAlbum = document.querySelector("#btnAlbum");
    let divBreadcrumb = document.querySelector("#breadcrump");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let aRootPath = divBreadcrumb.querySelector("a[purpose='path']");
    let divApp = document.querySelector("#app");
    let divAppTitleBar = document.querySelector("#app-title-bar");
    let divAppTitle = document.querySelector("#app-title");
    let divAppMenuBar = document.querySelector("#app-menu-bar");
    let divAppBody = document.querySelector("#app-body");
    let appClose = document.querySelector("#app-close");
    let resources = [];
    let cfid = -1;
    let rid = 0; //initially we are at root(which has an id of -1)

    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    btnAddAlbum.addEventListener("click", addAlbum);
    aRootPath.addEventListener("click", viewFolderFromPath);
    appClose.addEventListener("click", closeApp);

    function addFolder() {

        let rname = prompt("Enter folder name");

        if (rname != null) {                     //cancel gives null while OK gives "" i.e., empty string
            rname = rname.trim();
        }

        if (!rname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(rname + " already exist. Try some other name");
            return;
        }

        let pid = cfid;
        rid++;
        //HTML
        addFolderHTML(rname, rid, pid);
        //RAM
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "folder",
            pid: cfid
        })
        //Storage
        saveToStorage();
    };

    function addFolderHTML(rname, rid, pid) {
        let divFolderTemplate = templates.content.querySelector(".folder");
        let divFolder = document.importNode(divFolderTemplate, true);

        let spanRename = divFolder.querySelector("[action='rename']");
        let spanDelete = divFolder.querySelector("[action='delete']");
        let spanView = divFolder.querySelector("[action='view']");
        let divName = divFolder.querySelector("[purpose='name']");

        spanRename.addEventListener("click", renameFolder);
        spanDelete.addEventListener("click", deleteFolder);
        spanView.addEventListener("click", viewFolder);

        divName.innerHTML = rname;
        divFolder.setAttribute("rid", rid);
        divFolder.setAttribute("pid", pid);

        divContainer.appendChild(divFolder);
    };

    function addTextFileHTML(rname, rid, pid) {
        let divTextFileTemplate = templates.content.querySelector(".text-file");
        let divTextFile = document.importNode(divTextFileTemplate, true);

        let spanRename = divTextFile.querySelector("[action='rename']");
        let spanDelete = divTextFile.querySelector("[action='delete']");
        let spanView = divTextFile.querySelector("[action='view']");
        let divTextFileName = divTextFile.querySelector("[purpose='name']");

        spanRename.addEventListener("click", renameTextFile);
        spanDelete.addEventListener("click", deleteTextFile);
        spanView.addEventListener("click", viewTextFile);

        divTextFileName.innerHTML = rname;
        divTextFile.setAttribute("rid", rid);
        divTextFile.setAttribute("pid", pid);

        divContainer.appendChild(divTextFile);
    }

    function addTextFile() {
        let rname = prompt("Enter text file name");

        if (rname != null) {                     //cancel gives null while OK gives "" i.e., empty string
            rname = rname.trim();
        }

        if (!rname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(rname + " already exist. Try some other name");
            return;
        }

        let pid = cfid;
        rid++;
        //HTML
        addTextFileHTML(rname, rid, pid);

        //RAM
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "text-file",
            pid: cfid,
            //Default Notepad Value
            isBold: false,
            isItalic: false,
            isUnderline: false,
            bgColor: '#263238',
            textColor: '#ffffff',
            fontFamily: "serif",
            fontSize: 18,
            content: "I am a new file"
        })
        //Storage
        saveToStorage();
    };

    function viewAlbum() {
        let spanView = this;
        let divAlbum = spanView.parentNode;
        let divName = divAlbum.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divAlbum.getAttribute("rid"));

        let divAlbumMenuTemplate = templates.content.querySelector("[purpose='album-menu']");
        let divAlbumMenu = document.importNode(divAlbumMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divAlbumMenu);

        let divAlbumBodyTemplate = templates.content.querySelector("[purpose='album-body']");
        let divAlbumBody = document.importNode(divAlbumBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divAlbumBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanAdd = divAlbumMenu.querySelector("[action=add]");
        spanAdd.addEventListener("click", addPictureToAlbum)
    }

    function addPictureToAlbum() {
        let iurl =prompt("Enter an image url");
        let img = document.createElement("img");
        img.setAttribute("src",iurl);
        img.addEventListener("click", showPictureInMain);

        let divPictureList = divAppBody.querySelector(".picture-list");
        divPictureList.appendChild(img);
    }

    function showPictureInMain() {
        let divPictureMainImg = divAppBody.querySelector(".picture-main > img");
        divPictureMainImg.setAttribute("src", this.getAttribute("src"));

        let divPictureList = divAppBody.querySelector(".picture-list");
        let imgs = divPictureList.querySelectorAll("img");
        for(let i=0; i < imgs.length; i++) {
            imgs[i].setAttribute("pressed", false);
        }

        this.setAttribute("pressed", true);

    }

    function addAlbum(){
        let rname = prompt("Enter Album name");

        if (rname != null) {                     //cancel gives null while OK gives "" i.e., empty string
            rname = rname.trim();
        }

        if (!rname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == rname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(rname + " already exist. Try some other name");
            return;
        }

        let pid = cfid;
        rid++;
        //HTML
        addAlbumHTML(rname, rid, pid);

        //RAM
        resources.push({
            rid: rid,
            rname: rname,
            rtype: "album",
            pid: cfid,
        })
        //Storage
        saveToStorage();
    };

    function addAlbumHTML(rname, rid, pid) {
        let divAlbumTemplate = templates.content.querySelector(".album");
        let divAlbum = document.importNode(divAlbumTemplate, true);

        let spanRename = divAlbum.querySelector("[action='rename']");
        let spanDelete = divAlbum.querySelector("[action='delete']");
        let spanView = divAlbum.querySelector("[action='view']");
        let divAlbumName = divAlbum.querySelector("[purpose='name']");

        spanRename.addEventListener("click", renameAlbum);
        spanDelete.addEventListener("click", deleteAlbum);
        spanView.addEventListener("click", viewAlbum);

        divAlbumName.innerHTML = rname;
        divAlbum.setAttribute("rid", rid);
        divAlbum.setAttribute("pid", pid);

        divContainer.appendChild(divAlbum);
    };

    function deleteFolder() {
        spanDelete = this;
        divFolder = spanDelete.parentNode;
        divName = divFolder.querySelector("[purpose='name']");

        fname = divName.innerHTML;
        let fidTBD = parseInt(divFolder.getAttribute("rid"));

        //Confirmation
        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Do you want to delete ${fname}?` + (childrenExists ? " It has children." : ""));
        if (sure == false) {
            return;
        }

        //Remove from HTML
        divContainer.removeChild(divFolder);

        //Remve from RAM
        deleteHelper(fidTBD);

        //Save to storge
        saveToStorage();

    };

    function deleteHelper(fidTBD) {
        let children = resources.filter(r => r.pid == fidTBD);
        for (let i = 0; i < children.length; i++) {
            deleteHelper(children[i].rid);  //this is capable of delete
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        console.log(resources[ridx].rname);
        resources.splice(ridx, 1);
    };

    function deleteTextFile() {
        spanDelete = this;
        divTextFile = spanDelete.parentNode;
        divName = divTextFile.querySelector("[purpose='name']");

        fname = divName.innerHTML;
        let fidTBD = parseInt(divTextFile.getAttribute("rid"));

        //Confirmation
        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Do you want to delete ${fname}?`);
        if (sure == false) {
            return;
        }

        //Remove from HTML
        divContainer.removeChild(divTextFile);

        //Remve from RAM
        let ridx = resources.findIndex(r => r.id == fidTBD);
        resources.splice(ridx, 1);

        //Save to storge
        saveToStorage();
    };

    function renameFolder() {
        let nrname = prompt("Enter folder name");

        if (nrname != null) {
            nrname = nrname.trim();
        }

        if (!nrname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        let spanRename = this;     //jispe click hua wo this      
        let divFolder = spanRename.parentNode;       //parent of rename i.e., <div class="folder"....>
        let divName = divFolder.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divFolder.getAttribute("rid"));  //resource id to be updated

        // old name validation
        if (orname == nrname) {
            alert("Please enter a new name.");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(nrname + " already exist. Try some other name");
            return;
        }

        //change in html
        divName.innerHTML = nrname;
        //change in RAM
        let resource = resources.find(r => ridTBU == r.rid);
        resource.rname = nrname;
        //change in storage
        saveToStorage();


    };

    function renameTextFile() {
        let nrname = prompt("Enter file name");

        if (nrname != null) {
            nrname = nrname.trim();
        }

        if (!nrname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        let spanRename = this;     //jispe click hua wo this      
        let divTextFile = spanRename.parentNode;       //parent of rename i.e., <div class="folder"....>
        let divName = divTextFile.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divTextFile.getAttribute("rid"));  //resource id to be updated

        // old name validation
        if (orname == nrname) {
            alert("Please enter a new name.");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(nrname + " already exist. Try some other name");
            return;
        }

        //change in html
        divName.innerHTML = nrname;
        //change in RAM
        let resource = resources.find(r => ridTBU == r.rid);
        resource.rname = nrname;
        //change in storage
        saveToStorage();
    };

    function deleteAlbum() {
        spanDelete = this;
        divAlbum = spanDelete.parentNode;
        divName = divAlbum.querySelector("[purpose='name']");

        fname = divName.innerHTML;
        let fidTBD = parseInt(divAlbum.getAttribute("rid"));

        //Confirmation
        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Do you want to delete ${fname}?`);
        if (sure == false) {
            return;
        }

        //Remove from HTML
        divContainer.removeChild(divAlbum);

        //Remve from RAM
        let ridx = resources.findIndex(r => r.id == fidTBD);
        resources.splice(ridx, 1);

        //Save to storge
        saveToStorage();
    };

    function renameAlbum() {
        let nrname = prompt("Enter file name");

        if (nrname != null) {
            nrname = nrname.trim();
        }

        if (!nrname) {                        // empty name validation //empty node gives true
            alert("Empty name not fine");
            return;
        }

        let spanRename = this;     //jispe click hua wo this      
        let divAlbum = spanRename.parentNode;       //parent of rename i.e., <div class="folder"....>
        let divName = divAlbum.querySelector("[purpose=name]");
        let orname = divName.innerHTML;
        let ridTBU = parseInt(divAlbum.getAttribute("rid"));  //resource id to be updated

        // old name validation
        if (orname == nrname) {
            alert("Please enter a new name.");
            return;
        }

        //uniqueness validation
        let alreadyExists = resources.some(r => r.rname == nrname && r.pid == cfid);
        if (alreadyExists == true) {
            alert(nrname + " already exist. Try some other name");
            return;
        }

        //change in html
        divName.innerHTML = nrname;
        //change in RAM
        let resource = resources.find(r => ridTBU == r.rid);
        resource.rname = nrname;
        //change in storage
        saveToStorage();
    };

    function viewFolder() {
        spanView = this;
        let divFolder = spanView.parentNode;
        let divName = divFolder.querySelector("[purpose='name']");

        fname = divName.innerHTML;
        let fid = parseInt(divFolder.getAttribute("rid"));

        let aPathTemplate = templates.content.querySelector("a[purpose='path']");
        let aPath = document.importNode(aPathTemplate, true);

        aPath.innerHTML = fname;
        aPath.setAttribute("rid", fid);
        aPath.addEventListener("click", viewFolderFromPath);
        divBreadcrumb.appendChild(aPath);

        cfid = fid;
        divContainer.innerHTML = "";

        for (let i = 0; i < resources.length; i++) {      //we going through all the objects in the array, and pass those objects only whose pid == cfid.    
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                else if (resources[i].rtype == "album") {
                    addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }

            if (resources[i].rid > rid) {       //reference 9th Jav, time:1:19:26
                rid = resources[i].rid;        //initially rid is 0, and we want that when new rid is created is greater than our current rid.
            }                                  //Suppose we have two folders(rid:1,rid:2), we want new folder's rid to be 3.
        }
    };

    function viewFolderFromPath() {
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        //set the breadcrump
        // while(aPath.nextSibling) {
        //     aPath.parentNode.removeChild(aPath.nextSibling);
        // };

        //set the breadcrump 2nd Way
        for (let i = divBreadcrumb.children.length - 1; i >= 0; i--) {
            if (divBreadcrumb.children[i] == aPath) {
                break;
            }
            divBreadcrumb.removeChild(divBreadcrumb.children[i]);
        };

        //set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for (let i = 0; i < resources.length; i++) {      //we going through all the objects in the array, and pass those objects only whose pid == cfid.    
            if (resources[i].pid == cfid) {
                if (resources[i].rtype == "folder") {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                else if (resources[i].rtype == "text-file") {
                    addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
                else if (resources[i].rtype == "album") {
                    addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                }
            }
        }

    };

    function viewTextFile() {
        let spanView = this;
        let divTextFile = spanView.parentNode;
        let divName = divTextFile.querySelector("[purpose=name]");
        let fname = divName.innerHTML;
        let fid = parseInt(divTextFile.getAttribute("rid"));

        let divNotepadMenuTemplate = templates.content.querySelector("[purpose='notepad-menu']");
        let divNotepadMenu = document.importNode(divNotepadMenuTemplate, true);
        divAppMenuBar.innerHTML = "";
        divAppMenuBar.appendChild(divNotepadMenu);

        let divNotepadBodyTemplate = templates.content.querySelector("[purpose='notepad-body']");
        let divNotepadBody = document.importNode(divNotepadBodyTemplate, true);
        divAppBody.innerHTML = "";
        divAppBody.appendChild(divNotepadBody);

        divAppTitle.innerHTML = fname;
        divAppTitle.setAttribute("rid", fid);

        let spanSave = divAppMenuBar.querySelector("[action=save]");
        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let spanDownload = divAppMenuBar.querySelector("[action=download]");
        let inputUpload = divAppMenuBar.querySelector("[action=upload]");
        let spanForUpload = divAppMenuBar.querySelector("[action=forupload]");
        let textArea = divAppBody.querySelector("textArea");


        spanSave.addEventListener("click", saveNotepad);
        spanSave.addEventListener("click", function popup() {
            alert("File saved");
        });
        spanBold.addEventListener("click", makeNotepadBold);
        spanItalic.addEventListener("click", makeNotepadItalic);
        spanUnderline.addEventListener("click", makeNotepadUnderline);
        inputBGColor.addEventListener("change", changeNotepadBGColor);
        inputTextColor.addEventListener("change", changeNotepadTextColor);
        selectFontFamily.addEventListener("change", changeNotepadFontFamily);
        selectFontSize.addEventListener("change", changeNotepadFontSize);
        spanDownload.addEventListener("click", downloadNotepad);
        inputUpload.addEventListener("change", uploadNotepad);
        spanForUpload.addEventListener("click", function() {
            inputUpload.click();
        })

        let resource = resources.find(r => r.rid == fid);
        spanBold.setAttribute("pressed", !resource.isBold);
        spanItalic.setAttribute("pressed", !resource.isItalic);
        spanUnderline.setAttribute("pressed", !resource.isUnderline);
        inputBGColor.value = resource.bgColor;
        inputTextColor.value = resource.textColor;
        selectFontFamily.value = resource.fontFamily;
        selectFontSize.value = resource.fontSize;
        textArea.value = resource.content;

        //event trigger
        spanBold.dispatchEvent(new Event("click"));
        spanItalic.dispatchEvent(new Event("click"));
        spanUnderline.dispatchEvent(new Event("click"));
        inputBGColor.dispatchEvent(new Event("change"));
        inputTextColor.dispatchEvent(new Event("change"));
        selectFontFamily.dispatchEvent(new Event("change"));
        selectFontSize.dispatchEvent(new Event("change"));
    };

    function saveNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);

        let spanBold = divAppMenuBar.querySelector("[action=bold]");
        let spanItalic = divAppMenuBar.querySelector("[action=italic]");
        let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
        let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
        let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
        let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
        let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
        let textArea = divAppBody.querySelector("textArea");

        resource.isBold = spanBold.getAttribute("pressed") == "true";
        resource.isItalic = spanItalic.getAttribute("pressed") == "true";
        resource.isUnderline = spanUnderline.getAttribute("pressed") == "true";
        resource.bgColor = inputBGColor.value;
        resource.textColor = inputTextColor.value;
        resource.fontFamily = selectFontFamily.value;
        resource.fontSize = selectFontSize.value;
        resource.content = textArea.value;

        saveToStorage();

    }

    function makeNotepadBold() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontWeight = "bold";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontWeight = "normal";
        }
    }

    function makeNotepadItalic() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.fontStyle = "italic";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.fontStyle = "normal";
        }
    }

    function makeNotepadUnderline() {
        let textArea = divAppBody.querySelector("textArea");
        let isPressed = this.getAttribute("pressed") == "true";
        if (isPressed == false) {
            this.setAttribute("pressed", true);
            textArea.style.textDecoration = "underline";
        } else {
            this.setAttribute("pressed", false);
            textArea.style.textDecoration = "none";
        }
    }

    function changeNotepadBGColor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.backgroundColor = color;
    }

    function changeNotepadTextColor() {
        let color = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.color = color;
    }

    function changeNotepadFontFamily() {
        let fontFamily = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontFamily = fontFamily;
    }

    function changeNotepadFontSize() {
        let fontSize = this.value;
        let textArea = divAppBody.querySelector("textArea");
        textArea.style.fontSize = fontSize;
    }

    function downloadNotepad() {
        let fid = parseInt(divAppTitle.getAttribute("rid"));
        let resource = resources.find(r => r.rid == fid);
        let divNotepadMenu = this.parentNode;

        let strForDownload = JSON.stringify(resource);
        let encodedData = encodeURIComponent(strForDownload);

        let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
        aDownload.setAttribute("href", "data:text/json; charset=utf-8, " + encodedData);
        aDownload.setAttribute("download", resource.rname + ".json");

        aDownload.click();
    };

    function uploadNotepad() {
        let file = window.event.target.files[0];

        let reader = new FileReader();         //creating a object
        reader.addEventListener("load", function () {
            let data = window.event.target.result;
            let resource = JSON.parse(data);    //converting string into object

            let spanBold = divAppMenuBar.querySelector("[action=bold]");
            let spanItalic = divAppMenuBar.querySelector("[action=italic]");
            let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
            let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
            let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
            let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
            let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
            let textArea = divAppBody.querySelector("textArea");

            spanBold.setAttribute("pressed", !resource.isBold);
            spanItalic.setAttribute("pressed", !resource.isItalic);
            spanUnderline.setAttribute("pressed", !resource.isUnderline);
            inputBGColor.value = resource.bgColor;
            inputTextColor.value = resource.textColor;
            selectFontFamily.value = resource.fontFamily;
            selectFontSize.value = resource.fontSize;
            textArea.value = resource.content;

            //event trigger
            spanBold.dispatchEvent(new Event("click"));
            spanItalic.dispatchEvent(new Event("click"));
            spanUnderline.dispatchEvent(new Event("click"));
            inputBGColor.dispatchEvent(new Event("change"));
            inputTextColor.dispatchEvent(new Event("change"));
            selectFontFamily.dispatchEvent(new Event("change"));
            selectFontSize.dispatchEvent(new Event("change"));
        })

        reader.readAsText(file);


    };

    function closeApp() {
        divAppTitle.innerHTML = "Title will be come here";
        divAppTitle.setAttribute("rid","");
        divAppMenuBar.innerHTML = "";
        divAppBody.innerHTML = "";
    };


    function loadFromStorage() {
        let rjson = localStorage.getItem("data"); //extracting data from JSON which we saved in local storage using saveToStorage funvtion.
        if (!!rjson) {
            resources = JSON.parse(rjson);                    //we get the object from resources array
            for (let i = 0; i < resources.length; i++) {      //we going through all the objects in the array, and pass those objects only whose pid == cfid.    
                if (resources[i].pid == cfid) {
                    if (resources[i].rtype == "folder") {
                        addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }
                    else if (resources[i].rtype == "text-file") {
                        addTextFileHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }
                    else if (resources[i].rtype == "album") {
                        addAlbumHTML(resources[i].rname, resources[i].rid, resources[i].pid);
                    }
                }

                if (resources[i].rid > rid) {       //reference 9th Jav, time:1:19:26
                    rid = resources[i].rid;        //initially rid is 0, and we want that when new rid is created is greater than our current rid.
                }                                  //Suppose we have two folders(rid:1,rid:2), we want new folder's rid to be 3.
            }
        }
    }

    function saveToStorage() {
        //we have resources in array form, we can't directly save as array we have to convert it to string
        let rjson = JSON.stringify(resources);//used to convert array to string which can be saved
        localStorage.setItem("data", rjson);
    };

    loadFromStorage();

})();