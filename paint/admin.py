from django.contrib import admin

from .models import  Layer, Picture, SavedPictures


admin.site.register(Layer)
admin.site.register(Picture)
admin.site.register(SavedPictures)