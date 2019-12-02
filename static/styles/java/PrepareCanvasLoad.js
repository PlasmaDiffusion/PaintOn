document.addEventListener('DOMContentLoaded', () => {

    //Check if in mobile landscape mode. If so make images always small.
    var logoutText = document.getElementById("logout");
    var fontSize = window.getComputedStyle(logoutText, null).getPropertyValue('font-size');
    var inLandscape = fontSize == "33.3333px";

    //Load canvases in
    var loader = new SaveAndLoad();


    document.querySelectorAll('canvas').forEach(canvas => {

    //Shrink images if in landscape.
    if (inLandscape)
    {
        canvas.height=256;
        canvas.width=256;
        let parent = canvas.parentElement;
        
        parent.style.width = 256;
        parent.style.height = 256;
    }

    //Get children nodes to parse in data
    let root = canvas.parentNode.parentNode;
    let children = root.childNodes;

    //1, 3 and 5?
    let id = parseInt(canvas.id);
   
    childIndex = (id + (id+1));
        
    //console.log(children);
    
    loader.LoadLayer(canvas, children[childIndex].innerHTML);
    
    }
    );

    //Add confirmation for delete links
    document.querySelectorAll('a').forEach(link => {

        if (link.id == "deleteLink")
        {
            link.onclick = (evt) => {
                var exitMsg = confirm("Really delete?");
                if (exitMsg == false) 
                evt.preventDefault();
                
            }
            
        }

    });
    

});