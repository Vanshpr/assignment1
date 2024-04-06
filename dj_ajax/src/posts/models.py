from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    liked = models.ManyToManyField(User, blank=True)
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def as_dict(self):
        d = {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'author': {
                'username': self.author.user.username,
                # 'author_avatar': self.author.avatar
            }
        }
        return d

    def __str__(self):
        return f'{self.title}'