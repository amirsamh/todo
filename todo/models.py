from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass

class List(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=64)

class Task(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    description = models.CharField(max_length=1000, null=True, blank=True, default=None)
    done = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    list = models.ForeignKey(List, on_delete=models.CASCADE, null=True, blank=True)

    def serialize(self):
        try:
            listname = self.list.name
        except AttributeError:
            listname = 'Tasks'
        
        return {
            'id': self.id,
            'list': listname,
            'creator': self.creator.username,
            'text': self.text,
            'description': self.description,
            'done': self.done,
            'important': self.important
        }