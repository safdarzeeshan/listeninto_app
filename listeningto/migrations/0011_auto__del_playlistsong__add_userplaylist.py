# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting model 'PlaylistSong'
        db.delete_table(u'listeningto_playlistsong')

        # Adding model 'UserPlaylist'
        db.create_table(u'listeningto_userplaylist', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('playlist', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['listeningto.Playlist'])),
            ('song', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['listeningto.Song'])),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'listeningto', ['UserPlaylist'])

        # Removing M2M table for field playlists on 'Song'
        db.delete_table(db.shorten_name(u'listeningto_song_playlists'))


    def backwards(self, orm):
        # Adding model 'PlaylistSong'
        db.create_table(u'listeningto_playlistsong', (
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'listeningto', ['PlaylistSong'])

        # Deleting model 'UserPlaylist'
        db.delete_table(u'listeningto_userplaylist')

        # Adding M2M table for field playlists on 'Song'
        m2m_table_name = db.shorten_name(u'listeningto_song_playlists')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('song', models.ForeignKey(orm[u'listeningto.song'], null=False)),
            ('playlist', models.ForeignKey(orm[u'listeningto.playlist'], null=False))
        ))
        db.create_unique(m2m_table_name, ['song_id', 'playlist_id'])


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'listeningto.comment': {
            'Meta': {'object_name': 'Comment'},
            'commenter': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'message': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'recommendation': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['listeningto.Recommendation']"})
        },
        u'listeningto.playlist': {
            'Meta': {'object_name': 'Playlist'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'listeningto.recommendation': {
            'Meta': {'object_name': 'Recommendation'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '500', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'played': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'receipient': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'sender': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'sent_recommendation'", 'to': u"orm['auth.User']"}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['listeningto.Song']"})
        },
        u'listeningto.song': {
            'Meta': {'object_name': 'Song'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'playlists': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['listeningto.Playlist']", 'symmetrical': 'False', 'through': u"orm['listeningto.UserPlaylist']", 'blank': 'True'}),
            'stream_url': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_artwork_url': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_id': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_name': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_type': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_url': ('django.db.models.fields.CharField', [], {'max_length': '500'})
        },
        u'listeningto.userplaylist': {
            'Meta': {'object_name': 'UserPlaylist'},
            'created_at': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'playlist': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['listeningto.Playlist']"}),
            'song': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['listeningto.Song']"})
        }
    }

    complete_apps = ['listeningto']