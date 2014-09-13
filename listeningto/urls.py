__author__ = 'zeeshan'

from django.conf.urls import url

from listeningto import views

urlpatterns = [
    url(r'^home/$', views.home, name='home'),
    url(r'^addsong/$', views.add_song, name='add_song')

]