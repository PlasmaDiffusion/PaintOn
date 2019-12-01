from ..models import Picture, Layer, SavedPictures
from django import forms

#The form for saving into the calss below (POST).
class SaveForm(forms.Form):

    #URL data that gets automatically filled in.
    layer1_url = forms.CharField(label='Layer 1 Data', max_length=1000000)
    layer2_url = forms.CharField(label='Layer 2 Data', max_length=1000000)
    layer3_url = forms.CharField(label='Layer 3 Data', max_length=1000000)

    #Stuff the user must enter.
    
    name = forms.CharField(label='Name Of Drawing', max_length=200)
    private = forms.BooleanField(label='Private', required=False)
    othersCanEdit = forms.BooleanField(label='Others Can Copy', required=False)






#Save a picture to the database.
class PictureSaver():

    def __init__(self, form, picOwner):

        #Picture database reference
        self.pic = None
        self.picUser = picOwner
        #Image data
        self.imageUrls = [form.data['layer1_url'], form.data['layer2_url'], form.data['layer3_url']]
        #Form data including name, privacy, etc.
        self.form = form

        #Check if image exists and overwrite it if it does
        if Picture.objects.filter(owner=picOwner, name=form.data['name']).exists():

            self.pic = Picture.objects.get(name=form.data['name'], owner=picOwner)

            self.CreateOrSavePicture()


        else : #Make a new one!
            self.CreateOrSavePicture()
            

    def SaveLayers(self):
        
            #Loop through all layers
            for i in range(3):
                #Check if layer exists and overwrite it
                if self.pic.layers.filter(layerNumber=i).exists():
                    layer = self.pic.layers.get(layerNumber=i)
                    layer.url = self.imageUrls[i]
                    layer.save()
                    
                else: #Make a new layer
                    newLayer = Layer.objects.create(layerNumber=i, url = self.imageUrls[i])
                    self.pic.layers.add(newLayer)


    def CreateOrSavePicture(self):
        
        #Save over one if it exists
        if self.pic is not None:
            

            #Privacy settings are set here
            self.pic.private = ("private" in self.form.data)
            self.pic.othersCanEdit = ("othersCanEdit" in self.form.data)
            #self.pic.password = self.CheckForPassword()
            #Save actual image data here
            self.SaveLayers()

            self.pic.save()
        else: #Create a new one
            self.pic = Picture.objects.create(name = self.form.data['name'],
            owner = self.picUser,
            private = ("private" in self.form.data),
            othersCanEdit = ("othersCanEdit" in self.form.data),
            #password = self.CheckForPassword()
            )

            #Create new layers too and save changes
            self.SaveLayers()
            self.pic.save()

    #Was a password edited into the form?
    #def CheckForPassword(self):
    #    if "editPassword" in self.form.data:
    #        return self.form.data['editPassword']
    #    else:
    #        return ""

class PictureRemover():

    def __init__(self, picOwner, picId):

        #Picture database reference
        self.pic = None

        #Check if image exists and overwrite it if it does
        if Picture.objects.filter(id=picId).exists():

            self.pic = Picture.objects.get(id=picId)
            self.Delete()


    def Delete(self):

        if self.pic is not None:
            self.DeleteLayers()
            self.pic.delete()

    def DeleteLayers(self):
        
        #Loop through all layers
        for i in range(3):
            #Check if layer exists and overwrite it
            if self.pic.layers.filter(layerNumber=i).exists():
                layer = self.pic.layers.get(layerNumber=i)
                layer.delete()





#---------------------------------------------------------------------------------------------------------------
#Like or dislike a photo. One function that can call itself again if a user needs to be added to SavedPictures.
class PictureLiker():
    
    def __init__(self, userLikingThis, picName, picOwner, picId):
        self.likeDrawing(userLikingThis, picName, picOwner, picId)
    
    def likeDrawing(self, userLikingThis, picName, picOwner, picId):
        #Check if user exists with saved pictures
        if SavedPictures.objects.filter(user=userLikingThis).exists():
            savedPics = SavedPictures.objects.get(user=userLikingThis)
            #Only like once. The second time will unliked it.
            if savedPics.favourited.filter(name=picName, owner=picOwner).exists():
                print("Unliking")
                picture = Picture.objects.get(id=picId)
                savedPics.favourited.remove(picture)
                savedPics.save()
            
                #Decrease likes
                picture.likes -= 1
                picture.save()

            else:
                #Add it to liked pictures
                picture = Picture.objects.get(id=picId)
                print("Liking")
                savedPics.favourited.add(picture)
                savedPics.save()

                #Increase likes
                picture.likes += 1
                picture.save()
            
        else:
            #Create a saved picture object and then call this function again to like it.
            savedPics = SavedPictures.objects.create(user=userLikingThis)
            print("Created a new Saved Picture object")
            self.likeDrawing(userLikingThis, picName, picOwner, picId)