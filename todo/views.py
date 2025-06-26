from django.shortcuts import render, HttpResponseRedirect
from django.http import JsonResponse
from django.urls import reverse
from .models import User, Task, List
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
import json


def index(request):
    if request.user.is_authenticated:
        if request.method == 'POST':
            text = request.POST.get('text')
            description = request.POST.get('description')
            if len(text) > 0:
                task = Task()
                task.text = text
                task.description = description
                task.creator = User.objects.get(id=request.user.id)
                try:
                    task.list = List.objects.get(id=request.POST.get('list'))
                except (List.DoesNotExist, ValueError) as e:
                    task.list = None
                task.save()
            return HttpResponseRedirect(reverse('index'))
        else:
            data = List.objects.filter(creator=User.objects.get(id=request.user.id)).values()
            lists = []
            for list in data:
                list.pop('creator_id')
                list['count'] = Task.objects.filter(list=List.objects.get(creator=User.objects.get(id=request.user.id), name=list['name'])).count()
                lists.append(list)    
            return render(request, 'todo/index.html', {
                'lists': lists
            })
    else:
        return render(request, 'todo/index.html')
    
@login_required(login_url='login')  
def load_list(request, list_name):
    if list_name == 'All':
        data = Task.objects.filter(creator=User.objects.get(id=request.user.id)).order_by('done','-important', '-timestamp')
    elif list_name == 'Done':
        data = Task.objects.filter(creator=User.objects.get(id=request.user.id), done=True).order_by('-important', '-timestamp')
    elif list_name == 'Tasks':
        data = Task.objects.filter(creator=User.objects.get(id=request.user.id), done=False).order_by('-important', '-timestamp')
    elif list_name == 'Important':
        data = Task.objects.filter(creator=User.objects.get(id=request.user.id), important=True, done=False).order_by('done', '-timestamp')
    else:
        data = Task.objects.filter(creator=User.objects.get(id=request.user.id), list=List.objects.get(creator=User.objects.get(id=request.user.id), name=list_name)).order_by('done','-important', '-timestamp')

    tasks = []
    for task in data:
        tasks.append(task.serialize())
    return JsonResponse(tasks, safe=False)

def login_view(request):
    if request.method == "POST":

        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "todo/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "todo/login.html")
    
@login_required(login_url='login')
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "todo/register.html", {
                "message": "Passwords must match."
            })

        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "todo/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "todo/register.html")

@login_required(login_url='login')  
@csrf_exempt
def task(request, task_id):
    task = Task.objects.get(id=task_id)
    if task.creator == User.objects.get(id=request.user.id):
        if request.method == 'PUT':
            data = json.loads(request.body)
            if data.get('done') is not None:
                task.done = data.get('done')
                task.save()
                return JsonResponse({'success': 'success'})
            if data.get('important') is not None:
                task.important = data.get('important')
                task.save()
                return JsonResponse({'success': 'success'})
            if data.get('text') is not None:
                task.text = data.get('text')
                task.description = data.get('description')
                try:
                    task.list = List.objects.get(id=data.get('list'))
                except (List.DoesNotExist, ValueError) as e:
                    task.list = None
                task.save()
                return JsonResponse(Task.objects.get(id=task_id).serialize())
            else:
                return JsonResponse({'error': 'error'})
    else:
        return JsonResponse({'error': 'cannot access task'})

    if request.method == 'GET':
        data = List.objects.filter(creator=User.objects.get(id=request.user.id)).values()
        lists = []
        for list in data:
            list.pop('creator_id')
            list['count'] = Task.objects.filter(list=List.objects.get(creator=User.objects.get(id=request.user.id), name=list['name'])).count()
            lists.append(list)

        task = Task.objects.get(id=task_id)
        if task.creator == User.objects.get(id=request.user.id):
            data = task.serialize()
            return render(request, 'todo/task.html', {
                'data': data,
                'lists': lists
            })

@login_required(login_url='login')      
def delete(request, task_id):
    task = Task.objects.get(id=task_id)
    if task.creator == User.objects.get(id=request.user.id):
        task.delete()
    return HttpResponseRedirect(reverse('index'))

@login_required(login_url='login')  
@csrf_exempt
def lists(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data.get('text'):
            list = List()
            list.creator = User.objects.get(id=request.user.id)
            list.name = data.get('text')
            list.save()
            return JsonResponse({'success': 'success'})
        else:
            return JsonResponse({'error': 'cannot create list with no name'})
    elif request.method == 'GET':
        data = List.objects.filter(creator=User.objects.get(id=request.user.id)).values()
        lists = []
        for list in data:
            list.pop('creator_id')
            list['count'] = Task.objects.filter(list=List.objects.get(creator=User.objects.get(id=request.user.id), name=list['name'])).count()
            lists.append(list)
        return JsonResponse(lists, safe=False)

@login_required(login_url='login')
@csrf_exempt       
def list(request, list_id):
    if request.method == 'PUT':
        try:
            list = List.objects.get(id=list_id)
            if list.creator == User.objects.get(id=request.user.id):
                data = json.loads(request.body)
                if data.get('delete') is not None and data.get('delete') == True:
                    list.delete()
                    return JsonResponse({'success': 'success'})
            else:
                return JsonResponse({'error': 'cannot access list'})
        except Exception as e:
            return JsonResponse({'error': 'cannot access list'})
        
@login_required(login_url='login')
def search(request):
    query = request.GET.get('query')
    tasks = Task.objects.filter(creator=User.objects.get(id=request.user.id)).values()
    results = []
    for task in tasks:
        if query.upper() in task['text'].upper() or query.upper() in task['description'].upper():
            results.append(task)
    return render(request, 'todo/search.html', {
        'results': results,
        'title': query
    })