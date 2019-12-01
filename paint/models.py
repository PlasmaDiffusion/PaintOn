from django.db import models



class Layer(models.Model):
    #URL for saving and loading the image
    url = models.URLField(max_length=10485760, default="")

    #Layer (0-9)
    layerNumber = models.IntegerField(default=0)


class Picture(models.Model):
    name = models.CharField(max_length=50)
    owner = models.CharField(max_length=50)
    date = models.DateField(auto_now=True) 
    #creators = models.ManyToManyField(Creator, related_name="creators")

    layers = models.ManyToManyField(Layer, related_name="layers")
    #width = models.IntegerField(default=512)
    #height = models.IntegerField(default=512)

    likes = models.IntegerField(default=0)

    #Can other users see this publicly on the site?
    private = models.BooleanField(default=False)

    #Is a password required to edit this?
    othersCanEdit = models.BooleanField(default=False)


class SavedPictures(models.Model):

    user = models.CharField(max_length=50)

    #Pictures liked
    favourited = models.ManyToManyField(Picture, related_name="favourited_pictures")
    
    #Pictures that have been edited by the user
    edited = models.ManyToManyField(Picture, related_name="edited_pictures")
