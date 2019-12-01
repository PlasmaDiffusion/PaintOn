from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from .models import Layer, Picture, SavedPictures
from decimal import *
from .classes.creationForm import SignUpForm
from .classes.pictureData import SaveForm, PictureSaver, PictureRemover, PictureLiker
from .classes.pictureLoader import PictureLoader, PictureSearcher



# Login/sign up/user related code ---------------------------------------------------------
def index(request):


    return render(request, "index.html", {"user": "Logged out"})

#Common function to get the user and make sure they are logged in
def getAuthenticatedUser(request):
     
    if not request.user.is_authenticated:
        print("not authenticated")
        return None

    if request.user.is_anonymous:
        return None
    
    return request.user.username

#Uses the SignUpForm class to sign up a user. If the user enters valid data then they are added to the user database.
def signUp(request):

    print("\n \n \n")
    print("Signing up...")

    if request.method != 'POST':
        return render(request, "signUp.html", {"user": "Logged out", "form": SignUpForm()})
    

    form = SignUpForm(data=request.POST)
 
    username = "none :P"

    if form.is_valid():

        form.save()
        username = form.cleaned_data.get('username')
        password = form.cleaned_data.get('password1')
        print("New user: " + username)
        user = authenticate(request, username=username, password=password)
        return redirect('../login/')
        #return render(request, "menu.html", getMenuDataDict(username))

    else:

        print("Form invalid...\n")
        
        return render(request, "signUp.html", {"form": form})

def view_logout(request):
    logout(request)
    return render(request, "index.html", {"msg": "Logged out."})

#Display own pages
def defaultPage(request):

    username=getAuthenticatedUser(request)

    #Load in user's created drawings
    userPictureData = {}

    if username is not None:

        if Picture.objects.filter(owner=username).exists():
            
            createdPics = Picture.objects.filter(owner__icontains=username).all()
            
            userPictureData = {
                "pictures": createdPics,
                "user": username
            }


        #Load in user's liked drawings
        if SavedPictures.objects.filter(user=username).exists():
            savedPics = SavedPictures.objects.get(user=username)
            likedPics = savedPics.favourited.all()
            print(likedPics)
            userPictureData['likedPictures']=likedPics



    return render(request, "homePage.html", userPictureData)

def canvasView(request, name="0", owner="0"):
 
    user = getAuthenticatedUser(request)

    if user is None:
        print("Not logged in.")
        return redirect('../login/')

    #Save from form here
    if request.method == 'POST':
        return redirect(saveDrawing(request))

    #Load image in here. The class will check if the user can edit it or not.
    if name != "0" and owner != "0":
        picLoader = PictureLoader(name, owner, user)
        print("loading")
        return render(request, "canvas.html", {'form': SaveForm(), 'loader': picLoader}) 


    return render(request, "canvas.html", {'form': SaveForm(), 'loader':None})

def saveDrawing(request):

    user = getAuthenticatedUser(request)

    form = SaveForm(request.POST)

    print(form)

    # check whether it's valid:
    if form.is_valid():

        picToSave = PictureSaver(form, user)

        print(chr(27)+'[2j')
        print("saved?")
    else:
        print(form.errors)

    #Return stuff for a redirect
    return "/canvas/" + form.data['name'] + "/" + user + "/"

def deleteDrawing(request, id, owner):

    user = getAuthenticatedUser(request)

    if user is not None:
        PictureRemover(owner, id)


    return redirect("/accounts/profile/")

def search(request):

    results = None
    user = getAuthenticatedUser(request)

    #if request.method == 'POST':
    searchObj = PictureSearcher(request)
    results = {'pictures':searchObj.Search(), 'user': user}
            

    return render(request, "search.html", results)


#Like or dislike the image.
def likeDrawing(request, picName, picOwner, picId):

    userLikingThis = getAuthenticatedUser(request)

    if userLikingThis is None:
        return redirect('../login/')

    #This class will like/dislike this and also create a PictureSaver for the user if one doesn't exist yet.
    picLiker = PictureLiker(userLikingThis, picName, picOwner, picId)


    #Go back to previous page
    return HttpResponseRedirect(request.META.get('HTTP_REFERER'))