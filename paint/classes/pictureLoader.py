from ..models import Picture, Layer

#Loads a single picture
class PictureLoader():

    def __init__(self, picName, picOwner, loggedInAs):

        #Picture database reference
        self.pic = None
        self.imageUrls = [None, None, None]

        #Check if image exists and get a variable for it. If it doesn't exits pic is None
        if Picture.objects.filter(owner=picOwner, name=picName).exists():

            self.pic = Picture.objects.get(name=picName, owner=picOwner)

            #Check if allowed to edit and if yes, then load the layers in
            if (loggedInAs == picOwner) or (self.pic.othersCanEdit):
                self.SetLayerURLs()

            

    def SetLayerURLs(self):

        if self.pic == None: 
            return None
        
        #Loop through all layers and record them
        for i in range(3):

            if self.pic.layers.filter(layerNumber=i).exists():
                layer = self.pic.layers.get(layerNumber=i)
                self.imageUrls[i] = layer.url

        


    def GetPicture(self):
        if pic == None:
            return None

        return self.pic

    #Was a password edited into the form?
    def CheckForPassword(self, password):
        if pic ==None:
            return None

        return password == self.pic.password


    def remove(self):
        self.pic.delete()
    





#Search for something based on the form data. ----------------------------------------------------------------------

class PictureSearcher():

    #Get form data
    def __init__(self, request):

        self.name = request.GET.get('searchName', '')
        self.user = request.GET.get('searchUser', '')
        self.byDate = request.GET.get('sort', '') == 'date'
        self.byLikes = request.GET.get('sort', '') == 'likes'

    #Search based on factors depending on what was filled in on the form
    def Search(self):
        
        
        #Search by name and user
        if self.user is not '' and self.name is not '':
            #Sort check
            if self.byDate:
                return Picture.objects.filter(name__icontains=self.name, owner__icontains=self.user).order_by('-date')
            elif self.byLikes:
                return Picture.objects.filter(name__icontains=self.name, owner__icontains=self.user).order_by('-likes')
            else:
                return Picture.objects.filter(name__icontains=self.name, owner__icontains=self.user)


        #Search by user only
        if self.user is not '':
            #Sort check
            if self.byDate:
                return Picture.objects.filter(owner__icontains=self.user).order_by('-date')
            elif self.byLikes:
                return Picture.objects.filter(owner__icontains=self.user).order_by('-likes')
            else:
                return Picture.objects.filter(owner__icontains=self.user)

        #Search by name only
        if self.name is not '':
            #Sort check
            if self.byDate:
                return Picture.objects.filter(name__icontains=self.name).order_by('-date')
            elif self.byLikes:
                return Picture.objects.filter(name__icontains=self.name).order_by('-likes')
            else:
                return Picture.objects.filter(name__icontains=self.name)
        
        #Show 10 most recent ones if no searches for above will happen
        if self.byDate:
            return Picture.objects.all().order_by('-date')[:20]

        #Show 10 most recent ones if no searches for above will happen
        if self.byLikes:
            return Picture.objects.all().order_by('-likes')[:20]
        else:
            return None


    def GetAll(self):
        return Picture.objects.all()
        