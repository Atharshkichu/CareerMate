from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
)
from rest_framework.response import Response

from .models import Job, Profile, Application

from .serializers import (
    JobSerializer,
    ProfileSerializer,
    SignupSerializer,
    ApplicationSerializer,
)

import os


# --------------------------------------------------
# GET ALL JOBS
# --------------------------------------------------

@api_view(["GET"])
def jobs_list(request):
    jobs = Job.objects.all().order_by("-created_at")

    serializer = JobSerializer(
        jobs,
        many=True
    )

    return Response(serializer.data)


# --------------------------------------------------
# CREATE / UPDATE PROFILE
# JWT PROTECTED
# --------------------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_profile(request):
    user = request.user

    profile, created = Profile.objects.update_or_create(
        user=user,
        defaults={
            "name": request.data.get(
                "name",
                ""
            ),
            "education": request.data.get(
                "education",
                ""
            ),
            "branch": request.data.get(
                "branch",
                ""
            ),
            "skills": request.data.get(
                "skills",
                ""
            ),
            "location": request.data.get(
                "location",
                ""
            ),
            "experience": request.data.get(
                "experience",
                ""
            ),
            "desired_job": request.data.get(
                "desired_job",
                ""
            ),
            "expected_salary": request.data.get(
                "expected_salary"
            ),
        },
    )

    serializer = ProfileSerializer(
        profile
    )

    return Response(
        serializer.data,
        status=201 if created else 200,
    )


# --------------------------------------------------
# SIGN UP
# --------------------------------------------------

@api_view(["POST"])
def signup(request):
    serializer = SignupSerializer(
        data=request.data
    )

    if serializer.is_valid():
        user = serializer.save()

        return Response(
            {
                "message":
                    "Account created successfully",
                "username":
                    user.username,
            },
            status=201,
        )

    return Response(
        serializer.errors,
        status=400,
    )


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@api_view(["POST"])
def login_user(request):
    username = request.data.get(
        "username"
    )

    password = request.data.get(
        "password"
    )

    user = authenticate(
        username=username,
        password=password,
    )

    if user is None:
        return Response(
            {
                "error":
                    "Invalid username or password."
            },
            status=401,
        )

    return Response(
        {
            "message":
                "Login successful",

            "user": {
                "id":
                    user.id,

                "username":
                    user.username,

                "email":
                    user.email,
            },
        },
        status=200,
    )


# --------------------------------------------------
# USER APPLICATIONS
# GET  -> Logged-in user's applications
# POST -> Create application
# JWT PROTECTED
# --------------------------------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def applications(request):

    user = request.user

    # ----------------------------------------------
    # Find logged-in user's profile
    # ----------------------------------------------

    try:
        profile = Profile.objects.get(
            user=user
        )

    except Profile.DoesNotExist:
        return Response(
            {
                "error":
                    "Profile not found."
            },
            status=404,
        )

    # ----------------------------------------------
    # GET APPLICATIONS
    # ----------------------------------------------

    if request.method == "GET":

        application_list = (
            Application.objects
            .filter(
                profile=profile
            )
            .select_related("job")
            .order_by("-applied_at")
        )

        data = []

        for application in application_list:

            data.append(
                {
                    "id":
                        application.id,

                    "job_title":
                        application.job.title,

                    "company":
                        application.job.company,

                    "location":
                        application.job.location,

                    "salary":
                        application.job.salary,

                    "status":
                        application.status,

                    "applied_at":
                        application.applied_at,
                }
            )

        return Response(data)

    # ----------------------------------------------
    # POST APPLICATION
    # ----------------------------------------------

    job_id = request.data.get(
        "job_id"
    )

    if not job_id:
        return Response(
            {
                "error":
                    "job_id is required."
            },
            status=400,
        )

    try:
        job = Job.objects.get(
            id=job_id
        )

    except Job.DoesNotExist:
        return Response(
            {
                "error":
                    "Job not found."
            },
            status=404,
        )

    application, created = (
        Application.objects.get_or_create(
            profile=profile,
            job=job,
            defaults={
                "status":
                    "Applied"
            },
        )
    )

    serializer = ApplicationSerializer(
        application
    )

    return Response(
        serializer.data,
        status=201 if created else 200,
    )


# --------------------------------------------------
# USER UPDATE APPLICATION STATUS
# JWT PROTECTED
# --------------------------------------------------

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_application_status(
    request,
    application_id
):
    new_status = request.data.get(
        "status"
    )

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
    ]

    if new_status not in allowed_statuses:
        return Response(
            {
                "error":
                    "Invalid status.",

                "allowed_statuses":
                    allowed_statuses,
            },
            status=400,
        )

    user = request.user

    try:
        profile = Profile.objects.get(
            user=user
        )

        application = Application.objects.get(
            id=application_id,
            profile=profile,
        )

    except Profile.DoesNotExist:
        return Response(
            {
                "error":
                    "Profile not found."
            },
            status=404,
        )

    except Application.DoesNotExist:
        return Response(
            {
                "error":
                    "Application not found."
            },
            status=404,
        )

    application.status = new_status
    application.save()

    return Response(
        {
            "message":
                "Application status updated.",

            "id":
                application.id,

            "status":
                application.status,
        }
    )


# --------------------------------------------------
# GET MY PROFILE
# JWT PROTECTED
# --------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_profile(request):

    user = request.user

    try:
        profile = Profile.objects.get(
            user=user
        )

    except Profile.DoesNotExist:
        return Response(
            {
                "error":
                    "Profile not found."
            },
            status=404,
        )

    serializer = ProfileSerializer(
        profile
    )

    return Response(
        serializer.data
    )


# --------------------------------------------------
# ADMIN DASHBOARD
# ADMIN / STAFF ONLY
# --------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_dashboard(request):

    total_users = User.objects.count()

    total_jobs = Job.objects.count()

    total_applications = (
        Application.objects.count()
    )

    selected = Application.objects.filter(
        status="Selected"
    ).count()

    rejected = Application.objects.filter(
        status="Rejected"
    ).count()

    interview = Application.objects.filter(
        status="Interview"
    ).count()

    return Response(
        {
            "total_users":
                total_users,

            "total_jobs":
                total_jobs,

            "total_applications":
                total_applications,

            "selected":
                selected,

            "rejected":
                rejected,

            "interview":
                interview,
        }
    )


# --------------------------------------------------
# ADMIN JOB MANAGEMENT
# GET  -> All jobs
# POST -> Create job
# ADMIN / STAFF ONLY
# --------------------------------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAdminUser])
def admin_jobs(request):

    # ----------------------------------------------
    # GET ALL JOBS
    # ----------------------------------------------

    if request.method == "GET":

        jobs = Job.objects.all().order_by(
            "-created_at"
        )

        serializer = JobSerializer(
            jobs,
            many=True
        )

        return Response(
            serializer.data
        )

    # ----------------------------------------------
    # CREATE JOB
    # ----------------------------------------------

    title = request.data.get(
        "title"
    )

    company = request.data.get(
        "company"
    )

    location = request.data.get(
        "location"
    )

    salary = request.data.get(
        "salary"
    )

    skills = request.data.get(
        "skills"
    )

    if not all(
        [
            title,
            company,
            location,
            salary,
            skills,
        ]
    ):
        return Response(
            {
                "error":
                    "All fields are required."
            },
            status=400,
        )

    job = Job.objects.create(
        title=title,
        company=company,
        location=location,
        salary=salary,
        skills=skills,
    )

    serializer = JobSerializer(
        job
    )

    return Response(
        serializer.data,
        status=201,
    )


# --------------------------------------------------
# ADMIN JOB DETAIL
# PUT    -> Update job
# DELETE -> Delete job
# ADMIN / STAFF ONLY
# --------------------------------------------------

@api_view(["PUT", "DELETE"])
@permission_classes([IsAdminUser])
def admin_job_detail(
    request,
    job_id
):

    try:
        job = Job.objects.get(
            id=job_id
        )

    except Job.DoesNotExist:
        return Response(
            {
                "error":
                    "Job not found."
            },
            status=404,
        )

    # ----------------------------------------------
    # UPDATE JOB
    # ----------------------------------------------

    if request.method == "PUT":

        job.title = request.data.get(
            "title",
            job.title
        )

        job.company = request.data.get(
            "company",
            job.company
        )

        job.location = request.data.get(
            "location",
            job.location
        )

        job.salary = request.data.get(
            "salary",
            job.salary
        )

        job.skills = request.data.get(
            "skills",
            job.skills
        )

        job.save()

        serializer = JobSerializer(
            job
        )

        return Response(
            serializer.data
        )

    # ----------------------------------------------
    # DELETE JOB
    # ----------------------------------------------

    job.delete()

    return Response(
        {
            "message":
                "Job deleted successfully."
        }
    )


# --------------------------------------------------
# ADMIN APPLICATIONS
# GET -> All users' applications
# ADMIN / STAFF ONLY
# --------------------------------------------------

@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_applications(request):

    application_list = (
        Application.objects
        .select_related(
            "profile__user",
            "job"
        )
        .order_by("-applied_at")
    )

    data = []

    for application in application_list:

        data.append(
            {
                "id":
                    application.id,

                "username":
                    application.profile.user.username,

                "name":
                    application.profile.name,

                "job_title":
                    application.job.title,

                "company":
                    application.job.company,

                "location":
                    application.job.location,

                "status":
                    application.status,

                "applied_at":
                    application.applied_at,
            }
        )

    return Response(data)


# --------------------------------------------------
# ADMIN UPDATE APPLICATION STATUS
# ADMIN / STAFF ONLY
# --------------------------------------------------

@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def admin_update_application_status(
    request,
    application_id
):

    new_status = request.data.get(
        "status"
    )

    allowed_statuses = [
        "Applied",
        "Shortlisted",
        "Interview",
        "Selected",
        "Rejected",
    ]

    if new_status not in allowed_statuses:
        return Response(
            {
                "error":
                    "Invalid status.",

                "allowed_statuses":
                    allowed_statuses,
            },
            status=400,
        )

    try:
        application = Application.objects.get(
            id=application_id
        )

    except Application.DoesNotExist:
        return Response(
            {
                "error":
                    "Application not found."
            },
            status=404,
        )

    application.status = new_status
    application.save()

    return Response(
        {
            "message":
                "Application status updated.",

            "id":
                application.id,

            "status":
                application.status,
        }
    )


# --------------------------------------------------
# TEMPORARY ADMIN SETUP
# CREATE ADMIN ONLY ONCE
# REMOVE THIS AFTER USE
# --------------------------------------------------

@api_view(["POST"])
def setup_admin(request):

    setup_key = request.data.get(
        "setup_key"
    )

    correct_key = os.environ.get(
        "ADMIN_SETUP_KEY"
    )

    if not correct_key:
        return Response(
            {
                "error":
                    "ADMIN_SETUP_KEY is not configured."
            },
            status=500,
        )

    if setup_key != correct_key:
        return Response(
            {
                "error":
                    "Invalid setup key."
            },
            status=403,
        )

    username = request.data.get(
        "username"
    )

    email = request.data.get(
        "email",
        ""
    )

    password = request.data.get(
        "password"
    )

    if not username or not password:
        return Response(
            {
                "error":
                    "Username and password are required."
            },
            status=400,
        )

    if User.objects.filter(
        username=username
    ).exists():

        return Response(
            {
                "error":
                    "User already exists."
            },
            status=400,
        )

    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password,
    )

    return Response(
        {
            "message":
                "Admin account created successfully.",

            "username":
                user.username,
        },
        status=201,
    )