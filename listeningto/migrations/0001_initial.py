# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Song'
        db.create_table(u'listeningto_song', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('track_url', self.gf('django.db.models.fields.CharField')(max_length=500)),
            ('track_name', self.gf('django.db.models.fields.CharField')(max_length=500)),
            ('stream_url', self.gf('django.db.models.fields.CharField')(max_length=500)),
            ('track_id', self.gf('django.db.models.fields.CharField')(max_length=500)),
            ('track_artwork_url', self.gf('django.db.models.fields.CharField')(max_length=500)),
            ('track_type', self.gf('django.db.models.fields.CharField')(max_length=500)),
        ))
        db.send_create_signal(u'listeningto', ['Song'])


    def backwards(self, orm):
        # Deleting model 'Song'
        db.delete_table(u'listeningto_song')


    models = {
        u'listeningto.song': {
            'Meta': {'object_name': 'Song'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'stream_url': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_artwork_url': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_id': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_name': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_type': ('django.db.models.fields.CharField', [], {'max_length': '500'}),
            'track_url': ('django.db.models.fields.CharField', [], {'max_length': '500'})
        }
    }

    complete_apps = ['listeningto']