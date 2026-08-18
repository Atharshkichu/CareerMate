from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",
        null=True,
        blank=True,
    )

    name = models.CharField(max_length=100)
    education = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    skills = models.TextField(blank=True)
    location = models.CharField(max_length=100)
    experience = models.CharField(max_length=50)
    desired_job = models.CharField(max_length=100)
    expected_salary = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Job(models.Model):
    title = models.CharField(max_length=150)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=100)
    salary = models.CharField(max_length=100)
    skills = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Application(models.Model):
    profile = models.ForeignKey(
        Profile,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    status = models.CharField(
        max_length=50,
        default="Applied"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.profile.name} - {self.job.title}"