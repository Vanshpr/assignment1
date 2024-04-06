from django.shortcuts import render
from django.http import JsonResponse
from .models import Post

# Create your views here.
def post_list_and_create(request):
  qs = Post.objects.all()
  return render(request, 'posts/main.html', {'qs':qs})

def load_post_data_view(request, num_posts):
  def post_as_dict(post:Post):
    d = post.as_dict()
    d['liked'] = request.user in post.liked.all()
    return d

  qs = Post.objects.all()
  visible = 3
  upper = num_posts
  lower = num_posts - visible
  size = qs.count()

  data = [post_as_dict(o) for o in qs]
  return JsonResponse({'data':data[lower:upper], 'size':size, 'lower':lower, 'upper':upper})

def hello_world_view(request):
  return JsonResponse({'text':'hello ajax'})