# Generated by Django 2.2.6 on 2019-11-23 21:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('paint', '0005_remove_layer_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='picture',
            name='height',
            field=models.IntegerField(default=512),
        ),
        migrations.AddField(
            model_name='picture',
            name='width',
            field=models.IntegerField(default=512),
        ),
    ]
