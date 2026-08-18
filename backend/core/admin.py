from django.contrib import admin
from .models import Profile, Job, Application


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "education",
        "branch",
        "location",
        "desired_job",
    )
    search_fields = (
        "name",
        "desired_job",
        "location",
    )


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "company",
        "location",
        "salary",
    )
    search_fields = (
        "title",
        "company",
        "location",
        "skills",
    )


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "profile",
        "job",
        "status",
        "applied_at",
    )
    list_filter = ("status",)