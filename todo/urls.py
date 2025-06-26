from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('register', views.register, name="register"),
    path('logout', views.logout_view, name='logout'),
    path('load_list/<str:list_name>', views.load_list, name='load_list'),
    path('task/<int:task_id>', views.task, name='task'),
    path('delete/<int:task_id>', views.delete, name='delete'),
    path('lists', views.lists, name='lists'),
    path('list/<int:list_id>', views.list, name='list'),
    path('search', views.search, name="search")
]