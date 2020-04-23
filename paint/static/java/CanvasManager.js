//Class that handels all the drawing onto a canvas. Also can add or change layers.
class CanvasManager
{

    constructor()
    {
        //Drawing related variables
        this.drawingTool = 0;
        this.brushSize = 6;
        this.brushColour = '#000000';
        this.outlineColour = '#000000';
        this.fill = true;
        this.outline = true;
        this.lastClickedColourButton = null;
        this.alpha = 1.0
        this.globalCompositeOperation="source-over";

        //Flag for picking a fill colour. When false it is picking the outline colour.
        this.pickingFillColour = true;

        //Layer being worked on
        this.currentLayerId = "Layer 1";
        this.totalLayers = 1;


        this.addLayer("Layer 1");
     
        this.prevMousePos = {x: 0, y: 0};
    }

    //Add a layer button and change to it
    addLayer(layerId)
    {
            this.addCanvasListeners(layerId);
        
            //Reference to this for later
            var obj = this;

            //Add a new layer button
            var newBtn = document.createElement("BUTTON");
            newBtn.innerHTML = layerId;
            newBtn.className = "LayerChange"
            newBtn.addEventListener('click', function(){
                
                obj.changeLayer(layerId);
            });
           document.getElementById("layerBtns").appendChild(newBtn);

            this.changeLayer(layerId);
    }

    //Whenever a change layer button is pressed
    changeLayer(layerId)
    {
        this.currentLayerId = layerId


        this.hideUpperLayers(layerId);

        //Colour the button of the current layer
        document.querySelectorAll('button').forEach(button => {

            if (button.className == "LayerChange")
            {
                if (button.innerHTML == layerId)
                {
                    button.style.backgroundColor = "#FFFF00";
                }
                else
                {
                    button.style.backgroundColor = "";
                }
            }

        });

    }

    getCurrentLayerId()
    {
        return this.currentLayerId;
    }

    countLayers()
    {
    var count = 0;

    document.querySelectorAll('button').forEach(button => {

      

        //Buttons to change layers
        if (button.className == "LayerChange") count++;

        
    });

    return count;
    }

    //Call this when a layer is changed. It hides higher layers so they don't get in the way of click events.
    hideUpperLayers(layerId)
    {
        var currentLayerNumber = parseInt(layerId[layerId.length-1]);
    
        //Hide all above layers so they aren't in the way
        document.querySelectorAll('canvas').forEach(canvas => {

            console.log(canvas.id);
            var id = canvas.id;
            console.log(id[id.length-1]);
            var layerNumber = parseInt(id[id.length-1]);

            console.log(String(layerNumber) + ">" + String(currentLayerNumber));

            //Show/hide the layer canvas if it's a layer above
            if (layerNumber >currentLayerNumber) canvas.style.display = "none";
            else canvas.style.display = "block";
        });

        
    }
    //Input detection for mouse and touch events here ------------------------------------------------------------------------------------------------------------------

    //Whenever a layer is created add an appropriate listener to the canvas for click events.
    addCanvasListeners(layerId) {

        console.log("Adding listeners to " + layerId);
    
        var canvas = document.getElementById(layerId);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FF0000";


        var managerObj = this;
    
        //When mouse is dragged and the user just clicked, draw something
        canvas.addEventListener('mousemove', function(evt) {
            managerObj.InputMoved(canvas, evt, managerObj, ctx);

        });
        canvas.addEventListener('touchmove', function(evt) {
            //(Same as above but for mobile touch input)
            managerObj.InputMoved(canvas, evt, managerObj, ctx);
        });
    
        //When the mouse is clicked the first time record the click state and do something for certain tools
        canvas.addEventListener('mousedown', function (evt) {
            managerObj.InputDown(canvas, evt, managerObj, ctx);
            
        });
        canvas.addEventListener('touchstart', function (evt) {
            managerObj.InputDown(canvas, evt, managerObj, ctx);

        });

        //When the mouse is released do things like draw a square, circle, line, etc.
        canvas.addEventListener('mouseup', function (evt){

            managerObj.InputReleased(canvas, evt, managerObj, ctx);

        });
        canvas.addEventListener('touchend', function (evt){

            managerObj.InputReleased(canvas, evt, managerObj, ctx);
            console.log("Touch end");

        });
        
    }


    //Input functions the above events reference

    InputDown(canvas, evt, managerObj, ctx) {
        var mousePos = getMousePos(canvas, evt);
        canvas.setAttribute("clicked", "click");
        managerObj.UseDrawingTool(ctx, 0, mousePos, managerObj.drawingTool, managerObj.brushSize, { width: canvas.width, height: canvas.height });
        managerObj.prevMousePos = mousePos;
    }

    InputReleased(canvas, evt, managerObj, ctx) {
        var mousePos = getMousePos(canvas, evt);
        managerObj.UseDrawingTool(ctx, 2, mousePos, managerObj.drawingTool, managerObj.brushSize);
        canvas.setAttribute("clicked", "released");
    }

    InputMoved(canvas, evt, managerObj, ctx) {
        var mousePos = getMousePos(canvas, evt);
        if (canvas.getAttribute("clicked") == "click") {
            managerObj.UseDrawingTool(ctx, 1, mousePos, managerObj.drawingTool, managerObj.brushSize);
        }
    }

    

    
    //All canvas drawing actions happen here ---------------------------------------------------------------------------------------------------------------------------
    //Mouse state: 0 is press, 1 is dragged, 2 is released
    UseDrawingTool(ctx, mouseState, mousePos, drawingTool, brushSize, canvasSize = {width:512, height:512})
    {
        //console.log(ctx);
        //console.log(drawingTool);

        //Change colour here
        ctx.fillStyle = this.brushColour;
        ctx.globalAlpha = this.alpha;
        //Change outline here
        ctx.strokeStyle = this.outlineColour;
        ctx.lineWidth = this.brushSize;
        //Fill or Erase here
        ctx.imageSmoothingEnabled = false;
        ctx.globalCompositeOperation = this.globalCompositeOperation;

        //Don't do anything if choosing colour
        if (document.getElementById("ColourPopup")) return;

        switch (drawingTool)
            {
                case 0: //Pencil
                
                if (mouseState == 2) return;
                ctx.beginPath();
                ctx.fillRect(mousePos.x - brushSize/2,mousePos.y - brushSize/2, brushSize, brushSize);
                ctx.stroke();
                break;

                case 1: //Brush

                if (mouseState == 2) return;
                ctx.beginPath();
                ctx.arc(mousePos.x - brushSize/2, mousePos.y - brushSize/2, brushSize, 0, 2 * Math.PI); 
                ctx.fill();
                break;

                case 2: //line
                                    
                if (mouseState == 0)
                {
                
                //Save current state of canvas
                this.tempCanvas = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
                }
                else if (mouseState == 1)
                {

                //Load old canvas but then paint on it temporarily
                ctx.putImageData(this.tempCanvas, 0, 0);


                ctx.beginPath();
                ctx.moveTo(this.prevMousePos.x, this.prevMousePos.y);
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();


                }
                else if (mouseState == 2)
                {
                ctx.lineTo(mousePos.x, mousePos.y);
                ctx.stroke();
                }

                break;

                case 3: //Box
                if (mouseState == 0)
                {
                //Save current state of canvas
                this.tempCanvas = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
                }        
                else if (mouseState == 1)
                {
                
                //Load old canvas but then paint on it temporarily
                ctx.putImageData(this.tempCanvas, 0, 0);
            
                ctx.beginPath();
                if (this.fill) {ctx.fillRect(this.prevMousePos.x, this.prevMousePos.y, mousePos.x - this.prevMousePos.x, mousePos.y - this.prevMousePos.y);}
                if (this.outline) {ctx.rect(this.prevMousePos.x, this.prevMousePos.y, mousePos.x - this.prevMousePos.x, mousePos.y - this.prevMousePos.y); ctx.stroke();}
            
                }
                else if (mouseState == 2)
                {
                if (this.fill) ctx.fillRect(this.prevMousePos.x, this.prevMousePos.y, mousePos.x - this.prevMousePos.x, mousePos.y - this.prevMousePos.y);
                if (this.outline) {ctx.rect(this.prevMousePos.x, this.prevMousePos.y, mousePos.x - this.prevMousePos.x, mousePos.y - this.prevMousePos.y); ctx.stroke();}

                }
                break;

                case 4: //Elipse
                if (mouseState == 0)
                {
                //Save current state of canvas
                this.tempCanvas = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
                }
                else if (mouseState == 1)
                {
                    ctx.putImageData(this.tempCanvas, 0, 0);
                    ctx.beginPath();
                    this.makeElipse(mousePos, ctx);
                }
                else if (mouseState == 2)
                {
                    ctx.beginPath();
                    this.makeElipse(mousePos, ctx);
                }
                break;

                case 5: //Fill
                if (mouseState == 2)
                {
                    this.FillColours(ctx, mousePos, canvasSize);
                }
                break;

                case 6: //Replace
                if (mouseState == 2)
                {
                    this.ReplaceColours(ctx, mousePos, canvasSize);
                }
                break;

                case 7: //Colour Picker
                if (mouseState == 2)
                {
                    let newColourArray = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
                
                    
                    //Convert the selected colour to a hexidecimal string
                    this.lastClickedColourButton.value = "#" + this.fullColorHex(newColourArray[0],newColourArray[1],newColourArray[2],newColourArray[3]);

                    
                    this.lastClickedColourButton.click();
                    this.lastClickedColourButton.style.backgroundColor = this.lastClickedColourButton.value;
                    //console.log(this.lastClickedColourButton.value);
                    console.log(newColourArray);
                }
                break;
    
            }

        
    }

    //Int to hex function for the colour picker
    rgbToHex = function (rgb) { 
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
             hex = "0" + hex;
        }
        return hex;
    };

    fullColorHex = function(r,g,b,a) {   
        var red = this.rgbToHex(r);
        var green = this.rgbToHex(g);
        var blue = this.rgbToHex(b);
        var alpha = this.rgbToHex(a);
        return red+green+blue+alpha;
    };
      
    makeElipse(mousePos, ctx) {

       let movingToRight = true;
        if (this.prevMousePos.x > mousePos.x) movingToRight = false;

        let movingToTop = true;
        if (this.prevMousePos.y > mousePos.y) movingToTop = false;

        //ctx.ellipse((this.prevMousePos.x + mousePos.x) / 2, (this.prevMousePos.y + mousePos.y) / 2,
        //mousePos.x - this.prevMousePos.x, mousePos.y - this.prevMousePos.y, 0, 0, 180);

        ctx.ellipse((this.prevMousePos.x + mousePos.x) / 2, (this.prevMousePos.y + mousePos.y) / 2,
        (movingToRight ? (mousePos.x - this.prevMousePos.x) : (this.prevMousePos.x - mousePos.x)),
        (movingToTop ? (mousePos.y - this.prevMousePos.y) : (this.prevMousePos.y - mousePos.y)),
        0, 0, 180);
        
        //this.prevMousePos.x - mousePos.x, this.prevMousePos.y - mousePos.y

        if (this.outline)
            ctx.stroke();
        if (this.fill)
            ctx.fill();
    }

    //Functions for replacing and filling in colour below ----------------------------------------------------------
    ReplaceColours(ctx, mousePos, canvasSize) 
    {
        let colourToReplace = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
        //First convert the brush colour hex string to an RGBA array.
        let newColourRGB = [
            parseInt(this.brushColour.substr(1, 2), 16),
            parseInt(this.brushColour.substr(3, 2), 16),
            parseInt(this.brushColour.substr(5, 2), 16),
            255
        ];
        //console.log(newColourRGB);

        //Get the image to iterate through the entire image pixel by pixel...
        let pixels = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
        
        let maxHeightIndex = canvasSize.height;
        let maxWidthIndex = canvasSize.width * 4;

        for (let j = 0; j <= maxHeightIndex; j += 1) {
            for (let i = 0; i <= maxWidthIndex; i += 4) //+ 4 because 0...3 for colour index values
            {
                if (this.CheckIfInColourThreshold(i, j, pixels, colourToReplace, canvasSize, 70)) {
                    //...then make it the new colour.
                    pixels.data[i + (j * canvasSize.width * 4)] = newColourRGB[0];
                    pixels.data[i + (j * canvasSize.width * 4) + 1] = newColourRGB[1];
                    pixels.data[i + (j * canvasSize.width * 4) + 2] = newColourRGB[2];
                    pixels.data[i + (j * canvasSize.width * 4) + 3] = newColourRGB[3];
                    //console.log("Replacing");
                    //ctx.putImageData(pixels, i, (j*canvasSize.width));
                }
            }
        }
        //Replace image with this newer one.
        ctx.putImageData(pixels, 0, 0);
    }

    FillColours(ctx, mousePos, canvasSize) {
        let colourToReplace = ctx.getImageData(mousePos.x, mousePos.y, 1, 1).data;
        //First convert the brush colour hex string to an RGBA array.
        let newColour = [
            parseInt(this.brushColour.substr(1, 2), 16),
            parseInt(this.brushColour.substr(3, 2), 16),
            parseInt(this.brushColour.substr(5, 2), 16),
            255
        ];

        //Get the image to iterate through the entire image pixel by pixel...
        var pixels = ctx.getImageData(0, 0, canvasSize.width, canvasSize.height);
        
        let maxHeight = canvasSize.height;
        let maxWidth = canvasSize.width * 4;

        //this.FloodFill(Math.floor(mousePos.x) * 4, Math.floor(mousePos.y), pixels, colourToReplace, canvasSize, 0, newColour)

        var i = Math.floor(mousePos.x) * 4; //x4 Because it goes rgba for one pixel
        var j = Math.floor(mousePos.y); //Rows get multiplied later
        //console.log(pixels);

        //console.log(i + "," + j);
        //Is the target colour is the same as the replacement colour, do nothing
        if (newColour[0] == colourToReplace[0]
            && newColour[1] == colourToReplace[1]
            && newColour[2] == colourToReplace[2]
            && newColour[3] == colourToReplace[3])
        {
            //console.log("Target colour same as replacement colour.");
                return;
        }
        //Else is the  pixel not equal to the target colour? We don't want to colour over the wrong colour.
        else if (pixels.data[i + (j * canvasSize.width * 4)] != colourToReplace[0]
        && pixels.data[i + (j * canvasSize.width * 4) + 1] != colourToReplace[1]
        && pixels.data[i + (j * canvasSize.width * 4) + 2] != colourToReplace[2]
        && pixels.data[i + (j * canvasSize.widt * 4) + 3] != colourToReplace[3])
        {

            //console.log("Pixel is not the target colour.");
                return;
        }
        //Else colour it in
        else
        {
            pixels.data[i + (j * canvasSize.width)] = newColour[0];
            pixels.data[i + (j * canvasSize.width) + 1] = newColour[1];
            pixels.data[i + (j * canvasSize.width) + 2] = newColour[2];
            pixels.data[i + (j * canvasSize.width) + 3] = newColour[3];
            //ctx.putImageData(pixels, i/4, j, 0, 0, 1, 1);
        }

        var fillQueue = new Queue();
        fillQueue.enqueue([i,j])

        while (!fillQueue.isEmpty())
        {
            let pixelIndexArray = fillQueue.dequeue();
            let threshold = 30;

            i = pixelIndexArray[0];
            j = pixelIndexArray[1];

            //Go again in each direction
            if (((i + 4) < maxWidth) && this.CheckIfInColourThreshold(i + 4, j, pixels, colourToReplace, canvasSize, threshold))
            {
                //this.FloodFill(i + 4, j, pixels, colourToReplace, canvasSize, threshold, newColour)
                pixels = this.ReplacePixel(i + 4, j, pixels, newColour, canvasSize, ctx)
                fillQueue.enqueue([i+4, j]);
            }
            if ((i - 4  >=0)  && this.CheckIfInColourThreshold(i - 4, j, pixels, colourToReplace, canvasSize, threshold))
            {
                //this.FloodFill(i + 4, j, pixels, colourToReplace, canvasSize, threshold, newColour)
                pixels = this.ReplacePixel(i - 4, j, pixels, newColour, canvasSize, ctx)
                fillQueue.enqueue([i - 4, j]);
            }
            if ((j + 1) < (maxHeight) && this.CheckIfInColourThreshold(i, j+1, pixels, colourToReplace, canvasSize, threshold))
            {
                //this.FloodFill(i + 4, j, pixels, colourToReplace, canvasSize, threshold, newColour)
                pixels = this.ReplacePixel(i, j + 1, pixels, newColour, canvasSize, ctx)
                fillQueue.enqueue([i, j + 1]);
            }
            if ((j - 1) >=0 && this.CheckIfInColourThreshold(i, j-1, pixels, colourToReplace, canvasSize, threshold))
            {
                //this.FloodFill(i + 4, j, pixels, colourToReplace, canvasSize, threshold, newColour)
                pixels = this.ReplacePixel(i, j - 1, pixels, newColour, canvasSize, ctx)
                fillQueue.enqueue([i, j - 1]);
            }

            //setTimeout(() => {  ctx.putImageData(pixels, i, j, i, j, 1, 1); }, 1000);


        }

        ctx.putImageData(pixels, 0, 0);

        
    }

    CheckIfInColourThreshold(i, j, pixels, colourToReplace, canvasSize, threshold)
    {


        return (pixels.data[i + (j * canvasSize.width*4)] >= colourToReplace[0] - threshold
        && pixels.data[i + (j * canvasSize.width*4) + 1] >= colourToReplace[1] - threshold
        && pixels.data[i + (j * canvasSize.width*4) + 2] >= colourToReplace[2] - threshold
        && pixels.data[i + (j * canvasSize.width*4) + 3] >= colourToReplace[3] - threshold
        && pixels.data[i + (j * canvasSize.width*4)] <= colourToReplace[0] + threshold
        && pixels.data[i + (j * canvasSize.width*4) + 1] <= colourToReplace[1] + threshold
        && pixels.data[i + (j * canvasSize.width*4) + 2] <= colourToReplace[2] + threshold
        && pixels.data[i + (j * canvasSize.width*4) + 3] <= colourToReplace[3] + threshold);
    }

    ReplacePixel(i, j, pixels, newColour, canvasSize, ctx)
    {
        pixels.data[i + (j * canvasSize.width*4)] = newColour[0];
        pixels.data[i + (j * canvasSize.width*4) + 1] = newColour[1];
        pixels.data[i + (j * canvasSize.width*4) + 2] = newColour[2];
        pixels.data[i + (j * canvasSize.width*4) + 3] = newColour[3];


        return pixels;
    }
}
