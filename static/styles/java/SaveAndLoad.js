class SaveAndLoad
{
    //This class really just saves and loads an image url. Everything else is a different saving method that went unused.
    constructor()
    {
        //Drawing related variables
        this.rowStrings = [];
        this.rowWidth = 512;
        
        
        

        //Enter colour pallete here.
        this.colourCharValues = {

        'a':[128, 0, 0, 255],
        'A':[255, 0, 0, 255],
        'b':[0, 0, 128, 255],
        'B':[0, 0, 255, 255],
        'c':[0, 128, 0, 255],
        'C':[0, 255, 0, 255],
 
        }
    }

    SaveLayer(canvas)
    {
        console.log(canvas.toDataURL());
        return canvas.toDataURL();
    }


    //Giant string url method
    LoadLayer(canvas, url) {
        let img = new Image();

        
        img.onload = () => {
            //let canvas = document.getElementById(canvasId);
            let ctx = canvas.getContext('2d');
            if(canvas.width < 512)
            {
                //img.naturalHeight = canvas.height;
                //img.naturalWidth = canvas.width;
                ctx.scale(0.5, 0.5);
                
            console.log("Image downscaled");
            }
            ctx.drawImage(img, 0, 0);
          }

          img.src = url;
          
      }
      

    CheckForPixelChar(pixel)
    {
        //Check all char keys
        for (var key in this.colourCharValues)
        {
            //Check all colour values match  up
            var match = false;

            for(var i = 0; i < 4; i++)
            {
                match = (key[i] == pixel[i]);
            }

            if (match) return key;
        }

        return null;
    }

    


}
