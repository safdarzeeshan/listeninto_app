from django.conf.urls import patterns, include, url
from django.contrib.auth.views import login, logout
from django.contrib import admin
from listeningto import views
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'listeningto_app.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^listeningto/', include('listeningto.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/login/$', views.login_view),
    url(r'^accounts/logout/$', views.logout_view),
    url(r'^accounts/register/$', views.register)
)
