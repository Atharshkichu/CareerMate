from django.contrib import admin
from django.urls import path

from core.views import (
    jobs_list,
    create_profile,
    my_profile,
    signup,
    login_user,
    applications,
    update_application_status,
    admin_dashboard,
    admin_jobs,
    admin_job_detail,
    setup_admin,
)

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path(
        "admin/",
        admin.site.urls
    ),

    path(
        "api/jobs/",
        jobs_list
    ),

    path(
        "api/profiles/",
        create_profile
    ),

    path(
        "api/signup/",
        signup
    ),

    path(
        "api/login/",
        login_user
    ),

    path(
        "api/applications/",
        applications
    ),
    
    path(
    "api/applications/<int:application_id>/status/",
    update_application_status,
),
    
    path(
    "api/token/",
    TokenObtainPairView.as_view(),
),

path(
    "api/token/refresh/",
    TokenRefreshView.as_view(),
),

path(
    "api/profile/me/",
    my_profile
),

path(
    "api/admin/dashboard/",
    admin_dashboard
),

path(
    "api/admin/jobs/",
    admin_jobs
),

path(
    "api/admin/jobs/<int:job_id>/",
    admin_job_detail
),
path(
    "api/setup-admin/",
    setup_admin,
),
]