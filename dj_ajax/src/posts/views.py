from django.shortcuts import render
from django.http import JsonResponse
from .models import Post, Photo
from .forms import PostForm
from profiles.models import Profile


def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

# Create your views here.
def post_list_and_create(request):
    form = PostForm(request.POST or None)
    qs = Post.objects.all()

    if is_ajax(request=request):
        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            instance = form.save(commit=False)
            instance.author = author
            instance.save()
            return JsonResponse({
                'title': instance.title,
                'body': instance.body,
                'author': instance.author.user.username,
                'id': instance.id,
            })
    context = {
        'qs': qs,
        'form': form
    }
    return render(request, 'posts/main.html', context)

def post_detail(request,pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form':form,
    }

    return render(request, 'posts/detail.html',context)

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

def post_detail_data_view(request,pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id':obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }
    return JsonResponse({'data': data})

def like_unlike_post(request):
    if is_ajax(request=request):
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count':obj.like_count})

def update_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        new_title = request.POST.get('title')
        new_body = request.POST.get('body')
        obj.title = new_title
        obj.body = new_body
        obj.save()
        return JsonResponse({
            'title': new_title,
            'body': new_body,
        })

def delete_post(request, pk):
    obj = Post.objects.get(pk=pk)
    if is_ajax(request=request):
        obj.delete()
        return JsonResponse({})

def image_upload_view(request):
    if request.method == 'POST':
        img = request.FILES.get('file')
        new_post_id = request.POST.get('new_post_id')
        try:
            post = Post.objects.get(id=new_post_id)
        except Post.DoesNotExist:
            print("Post with id {} does not exist".format(new_post_id))
        else:
            Photo.objects.create(image=img, post=post)
    return HttpResponse()
