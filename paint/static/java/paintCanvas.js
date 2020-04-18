//Script for mostly non-canvas related events
document.addEventListener('DOMContentLoaded', () => {


    var canvasManager = new CanvasManager();

    console.log(canvasManager.getCurrentLayerId());


    
    //All canvas buttons and other forms of ui events are defined here ------------------------------------------------------------------
    document.querySelectorAll('button').forEach(button => {


        //Buttons to change layers
        if (button.className == "LayerChange")
        {
            button.onclick = () =>
            {
                canvasManager.changeLayer(button.innerHTML, button.value);
            };
        }
        //Button to add a layer
        else if (button.className == "LayerAdd")
        {
            button.onclick = () =>
            {

                var newId="Layer 1";
                var newNumber = 1;
                


                //Check if layer of that name exists already
                var layerElements = document.getElementsByClassName("LayerChange");

                for (var i = 0; i < layerElements.length; i++)
                {

                    if(newId == layerElements[i].innerHTML);
                    {
                        newNumber +=1;
                        newId = "Layer " + String(newNumber);
                    }

                }

                console.log("Adding " + newId);
                //Add a new layer
                if (newNumber < 4)
                canvasManager.addLayer(newId);
            }
        }
        //Button that changes your drawing tool
        else if (button.className == "Tool" || button.className == "Tool_Small")
        {
            
            button.onclick = () => {
                
                //Change drawing tool
                canvasManager.drawingTool = parseInt(button.value);

                //Colour in button to show what was selected, and decolour other buttons
                HighlightTool(button);
            }

            //Highlight the default tool
            if (button.id == "Pencil") HighlightTool(button);
        }
        //Colour change button
        else if (button.className == "Colour")
        {
            button.onclick = () => {
                canvasManager.globalCompositeOperation="source-over";

                if (canvasManager.pickingFillColour) //Change fill colour
                {
                //Change it in the canvas manager and then change it for the UI button too.
                canvasManager.brushColour = button.value;
                var otherBtn = document.getElementById("fillColUI");
                otherBtn.style.backgroundColor = button.value;
                canvasManager.lastClickedColourButton = button;
                }
                else //Change outline colour
                {
                //Change it in the canvas manager and then change it for the UI button too.
                canvasManager.outlineColour = button.value;
                var otherBtn = document.getElementById("outlineColUI");
                otherBtn.style.backgroundColor = button.value;
                }
            }

            //Set this as the default button for the colour picker
            if (button.id == "Red") canvasManager.lastClickedColourButton = button;
        }
        else if (button.className == "Erase")
        {
            button.onclick = () => {
                canvasManager.globalCompositeOperation = "destination-out";
            }
            
        }
        //Changing colour for fill or outline button
        else if (button.className == "FillOrOutline")
        {
            button.onclick = () => {

                //Change to the fill colour or outline colour depending on id
                canvasManager.pickingFillColour = (button.id == "fillColUI");
                
                //Change outline to show it's selected
                if (canvasManager.pickingFillColour) 
                {
                    button.style.border= "dotted yellow 1px";
                    document.getElementById("outlineColUI").style.border= "solid black 1px";
                }
                else
                {
                    button.style.border= "dotted yellow 1px";
                    document.getElementById("fillColUI").style.border= "solid black 1px";
                }
                
            }
            
            //Both colours default to black. The fill button is selected by default.
            button.style.backgroundColor = "000000";
            if (button.id == "fillColUI") button.style.border= "dotted yellow 1px";
        }
        //Exit with a prompt if the user wants to leave this page.
        else if (button.className == "Exit")
        {
            button.onclick = () => {
            var exitMsg = confirm("Stop drawing? Unsaved changes will be lost.");
            if (exitMsg == true)
                {
                window.location.href = '/accounts/profile/';
                }
            }
        }
        else if (button.className == "Save")
        {
            button.onclick = () => {

                hideLayerFormData();
                if(button.innerHTML != "Cancel") button.innerHTML = "Cancel";
                else button.innerHTML = "Save";
                console.log(button.innerHTML);

            }
        }

    });


    //Brush size slider
    var slider = document.getElementById("brushSize");

    // Update the current brush size
    slider.oninput = function() {
    canvasManager.brushSize = this.value;
    var sliderText = document.getElementById("brushSizeText");
    sliderText.innerHTML = "Size: " + this.value + "px";
    }

    //Brush size slider
    var slider = document.getElementById("alpha");

    // Update the current brush size
    slider.oninput = function() {
    canvasManager.alpha = this.value / 10;
    var sliderText = document.getElementById("alphaText");
    sliderText.innerHTML = "Alpha: " + (this.value/10) ;
    }

    //Tick box for enabling fill
    var fillOn = document.getElementById("fillCheckbox");

    fillOn.addEventListener('change', (evt) => {
        if (evt.target.checked) canvasManager.fill = true;
         else canvasManager.fill = false;
      })

    //Tick box for enabling an outline
    var outlineOn = document.getElementById("outlineCheckbox");

    outlineOn.addEventListener('change', (evt) => {
        if (evt.target.checked) canvasManager.outline = true;
         else canvasManager.outline = false;
      })

      
    
    CheckToLoadCanvas(canvasManager);

});

//Function to get point clicked on the canvas
function getMousePos(canvas, evt)
{
    var rect = canvas.getBoundingClientRect();
    
    //Return mouse positions
    if (evt.clientX != null)
    {
        
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    else //...Or return touch positions if there are no x positions
    {
        return {
            x: evt.changedTouches[0].pageX - rect.left,
            y: (evt.changedTouches[0].pageY - rect.top) - window.pageYOffset, //Offset if the user scrolled the window down
        };
    
    }

}

function CheckToLoadCanvas(canvasManager)
{
    //Get Div with canvas urls
    var div = document.getElementById("loaders");

    if (div != null)
    {
        console.log("Loading");

    //Get Canvases
    let canvas1 = document.getElementById("Layer 1");
    let canvas2 = document.getElementById("Layer 2");
    let canvas3 = document.getElementById("Layer 3");

    loader = new SaveAndLoad();


    loader.LoadLayer(canvas1, div.childNodes[1].innerHTML);
    loader.LoadLayer(canvas2, div.childNodes[3].innerHTML);
    loader.LoadLayer(canvas3, div.childNodes[5].innerHTML);

    //Add layer buttons
    canvasManager.addLayer("Layer 2");
    canvasManager.addLayer("Layer 3");
    }
    
}


                
function hideLayerFormData()
{
    
//Make visible
var form = document.getElementById("SaveForm");

if (form.style.display=="none") form.style.display="block";
else {form.style.display="none"; return;}


var canvas1 = document.getElementById("Layer 1");
var canvas2 = document.getElementById("Layer 2");
var canvas3 = document.getElementById("Layer 3");

var saver = new SaveAndLoad();

var imageToSave ={
    "Layer 1" : saver.SaveLayer(canvas1),
    "Layer 2" : saver.SaveLayer(canvas2),
    "Layer 3" : saver.SaveLayer(canvas3),
};


//Put in the layer data and also make the form not be visible for simplicity
var layer1_field = document.getElementById("id_layer1_url");
layer1_field.value = imageToSave["Layer 1"];
layer1_field.style.fontSize="8";
layer1_field.style.display ="none";

var layer2_field = document.getElementById("id_layer2_url");
layer2_field.value = imageToSave["Layer 2"];
layer2_field.style.fontSize="8";
layer2_field.style.display ="none";

var layer3_field = document.getElementById("id_layer3_url");
layer3_field.value = imageToSave["Layer 3"];
layer3_field.style.fontSize="8";
layer3_field.style.display ="none";


document.querySelectorAll('label').forEach(label => {
    if (label.htmlFor == "id_layer1_url" || label.htmlFor == "id_layer2_url" || label.htmlFor == "id_layer3_url")
    {
        label.style.display ="none";
    }

});


}


//Highlight the selected tool with a border and yellow background. Unhighlight every other button.
function HighlightTool(button) {
    otherToolButtons = document.getElementsByClassName("Tool");
    otherToolSmallButtons = document.getElementsByClassName("Tool_Small");

    //Regular sized buttons
    for (let i = 0; i < otherToolButtons.length; i++) {
        if (button.id != otherToolButtons[i].id) {
            otherToolButtons[i].style.border = "solid black 1px";
            otherToolButtons[i].style.backgroundColor = "white";
        }
        else {
            otherToolButtons[i].style.border = "dotted orange 1px";
            otherToolButtons[i].style.backgroundColor = "yellow";
        }
    }

    //Smaller buttons
    for (let i = 0; i < otherToolSmallButtons.length; i++) {
        if (button.id != otherToolSmallButtons[i].id) {
            otherToolSmallButtons[i].style.border = "solid black 1px";
            otherToolSmallButtons[i].style.backgroundColor = "white";
        }
        else {
            otherToolSmallButtons[i].style.border = "dotted orange 1px";
            otherToolSmallButtons[i].style.backgroundColor = "yellow";
        }
    }
}
