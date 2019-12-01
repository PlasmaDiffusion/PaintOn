from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

#A class that uses the base sign up form with added fields
class SignUpForm(UserCreationForm):
    #email_field = forms.CharField(required=True)

    class Meta:
        model = User
        fields = ("username", "password1", "password2")

    def save(self, commit=True):
        user = super(SignUpForm, self).save(commit=False)

        #Save other fields here
        #user.email_field = self.cleaned_data["email_field"]
        
        if commit:
            user.save()
        return user