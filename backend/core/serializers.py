from rest_framework import serializers
from .models import Job,Profile, Application



class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "location",
            "salary",
            "skills",
        ]
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "id",
            "name",
            "education",
            "branch",
            "skills",
            "location",
            "experience",
            "desired_job",
            "expected_salary",
        ]        
        
from django.contrib.auth.models import User



class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        return user   
    
class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "profile",
            "job",
            "status",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "applied_at",
        ]         