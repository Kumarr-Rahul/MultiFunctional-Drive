(function () {
    let btnAddFolder = document.querySelector("#btnAdd");
    let btnAddTextFile = document.querySelector("#btnTextFile");
    let divBreadcrumb = document.querySelector("#breadcrump");
    let divContainer = document.querySelector("#container");
    let templates = document.querySelector("#templates");
    let aRootPath = divBreadcrumb.querySelector("a[purpose='path']");
    let resources = [];
    let cfid = -1;
    let rid = 0; //initially we are at root(which has an id of -1)

    btnAddFolder.addEventListener("click", addFolder);
    btnAddTextFile.addEventListener("click", addTextFile);
    aRootPath.addEventListener("click", viewFolderFromPath);

    function addFolder() {

        let rname = prompt("Enter folder name");
        
        if(rname != null) {                     //cancel gives null while OK gives "" i.e., empty string
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
    }

    function addTextFile() {
        alert("hello");
    };

    function deleteFolder() {
        spanDelete = this;
        divFolder = spanDelete.parentNode;
        divName = divFolder.querySelector("[purpose='name']");
        
        fname = divName.innerHTML;
        let fidTBD = parseInt(divFolder.getAttribute("rid"));

        //Confirmation
        let childrenExists = resources.some(r => r.pid == fidTBD);
        let sure = confirm(`Do you want to delete ${fname}?`+ (childrenExists? " It has children.":""));
        if(sure == false){
               return;
        }

        //Remove from HTML
        divContainer.removeChild(divFolder);

        //Remve from RAM
        deleteHelper(fidTBD);

        //Save to storge
        saveToStorage();

    }

    function deleteHelper(fidTBD) {
        let children = resources.filter(r => r.pid == fidTBD);
        for(let i=0; i < children.length; i++) {
            deleteHelper(children[i].rid);  //this is capable of delete
        }

        let ridx = resources.findIndex(r => r.rid == fidTBD);
        console.log(resources[ridx].rname);
        resources.splice(ridx, 1);
    }

    function deleteTextFile() {

    }

    function renameFolder() {
        let nrname = prompt("Enter folder name");
        
        if(nrname != null) {
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
        if(orname == nrname) {
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


    }

    function reanmeTextFile() {

    }

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
         if(resources[i].pid == cfid) {
              addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
         }
 
         if(resources[i].rid > rid) {       //reference 9th Jav, time:1:19:26
             rid = resources[i].rid;        //initially rid is 0, and we want that when new rid is created is greater than our current rid.
         } 

        }
    }

    function viewFolderFromPath() {
        let aPath = this;
        let fid = parseInt(aPath.getAttribute("rid"));

        //set the breadcrump
        // while(aPath.nextSibling) {
        //     aPath.parentNode.removeChild(aPath.nextSibling);
        // };

        //set the breadcrump 2nd Way
        for(let i = divBreadcrumb.children.length - 1; i >= 0; i--) {
            if(divBreadcrumb.children[i] == aPath) {
                break;
            }
            divBreadcrumb.removeChild(divBreadcrumb.children[i]);
        };

        //set the container
        cfid = fid;
        divContainer.innerHTML = "";
        for(let i = 0; i < resources.length; i++) {      //we going through all the objects in the array, and pass those objects only whose pid == cfid.    
            if(resources[i].pid == cfid) {
                 addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
        
            }
        }

    };
    
    function viewTextFile() {

    }

    function loadFromStorage() {
        let rjson = localStorage.getItem("data"); //extracting data from JSON which we saved in local storage using saveToStorage funvtion.
        if (!!rjson) {
            resources = JSON.parse(rjson);                    //we get the object from resources array
            for (let i = 0; i < resources.length; i++) {      //we going through all the objects in the array, and pass those objects only whose pid == cfid.    
                if (resources[i].pid == cfid) {
                    addFolderHTML(resources[i].rname, resources[i].rid, resources[i].pid);
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