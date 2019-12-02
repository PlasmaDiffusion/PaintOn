# Generated by Django 2.2.6 on 2019-12-02 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField(default='')),
                ('layerNumber', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Picture',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('owner', models.CharField(max_length=50)),
                ('date', models.DateField(auto_now=True)),
                ('likes', models.IntegerField(default=0)),
                ('private', models.BooleanField(default=False)),
                ('othersCanEdit', models.BooleanField(default=False)),
                ('layers', models.ManyToManyField(related_name='layers', to='paint.Layer')),
            ],
        ),
        migrations.CreateModel(
            name='SavedPictures',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=50)),
                ('edited', models.ManyToManyField(related_name='edited_pictures', to='paint.Picture')),
                ('favourited', models.ManyToManyField(related_name='favourited_pictures', to='paint.Picture')),
            ],
        ),
    ]
