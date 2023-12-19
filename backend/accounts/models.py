from django.contrib.auth.models import AbstractBaseUser, Permission
from django.db import models 

class User(AbstractBaseUser):
    avatar = models.TextField(
        blank=True, default='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPyGNr2qL63Sfugk2Z1-KBEwMGOfycBribew')
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True) 

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 

    def __str__(self):
        return self.email  
