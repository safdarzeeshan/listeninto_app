from django.conf.urls import patterns, include, url

from django.contrib import admin
from listeningto import views
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'listeningto_app.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^listeningto/', include('listeningto.urls')),

    url(r'^admin/', include(admin.site.urls)),
)
