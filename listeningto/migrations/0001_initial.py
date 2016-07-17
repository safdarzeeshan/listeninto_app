# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.CharField(max_length=500)),
                ('commenter', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Recommendation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('description', models.CharField(max_length=500, blank=True)),
                ('played', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('receipient', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(related_name='sent_recommendation', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Song',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('track_url', models.CharField(max_length=500)),
                ('track_name', models.CharField(max_length=500)),
                ('stream_url', models.CharField(max_length=500)),
                ('track_id', models.CharField(max_length=500)),
                ('track_artwork_url', models.CharField(max_length=500)),
                ('track_type', models.CharField(max_length=500)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserPlaylist',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('playlist', models.ForeignKey(to='listeningto.Playlist')),
                ('song', models.ForeignKey(to='listeningto.Song')),
            ],
        ),
        migrations.AddField(
            model_name='song',
            name='playlists',
            field=models.ManyToManyField(to='listeningto.Playlist', through='listeningto.UserPlaylist', blank=True),
        ),
        migrations.AddField(
            model_name='recommendation',
            name='song',
            field=models.ForeignKey(to='listeningto.Song'),
        ),
        migrations.AddField(
            model_name='comment',
            name='recommendation',
            field=models.ForeignKey(to='listeningto.Recommendation'),
        ),
    ]
