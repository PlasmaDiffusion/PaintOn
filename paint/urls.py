from django.contrib.auth.views import LoginView
from django.urls import path

from . import views

app_name="paint"
urlpatterns = [
    path("", views.index, name="index"),
    path('login/', LoginView.as_view(template_name='index.html'), name="login"),
    path('signUp/', views.signUp, name='signUp'),
    path('logOut/', views.view_logout, name='logout'),
    path('accounts/profile/', views.defaultPage, name='defaultPage'),
    path('canvas/<name>/<owner>/', views.canvasView, name='canvasView'),
    path('deleteDrawing/<int:id>/<owner>/', views.deleteDrawing, name='deleteDrawing'),
    path('saveDrawing/', views.saveDrawing, name='saveDrawing'),
    path('likeDrawing/<picName>/<picOwner>/<int:picId>/', views.likeDrawing, name='likeDrawing'),
    path('search/', views.search, name='search'),

]
