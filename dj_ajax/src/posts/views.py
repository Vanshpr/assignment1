from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

# Create your views here.
def post_list_and_create(request):
    qs = Post.objects.all()
    return render(request, 'posts/main.html', {'qs':qs})

def load_post_data_view(request, num_posts):
    visible = 3
    upper = num_posts
    lower = upper - visible
    qs = Post.objects.all()
    size = qs.count()
    data = []

    for obj in qs:
        item = {
            'id':obj.id,
            'title':obj.title,
            'body': obj.body,
            'liked': True if request.user in obj.liked.all() else False,
            'count': obj.like_count,
            'author': obj.author.user.username
        }
        data.append(item)
    
    return JsonResponse({'data':data[lower:upper], 'size':size})

def hello_world_view(request):
    return JsonResponse({'text':'hello ajax'})