from django.conf.urls import patterns, include, url
from django.contrib import admin
from listeningto import views

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^$', views.home, name='home'),
    url(r'', include('listeningto.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$', views.login_view, name='login'),
    url(r'^accounts/logout/$', views.logout_view),
    url(r'^accounts/register/$', views.register),
    url('', include('social.apps.django_app.urls', namespace='social')),
)
