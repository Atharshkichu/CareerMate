from django.contrib import admin
from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

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
    admin_applications,
    admin_update_application_status,
)


urlpatterns = [

    # ==================================================
    # DJANGO ADMIN
    # ==================================================

    path(
        "admin/",
        admin.site.urls,
    ),


    # ==================================================
    # JWT AUTHENTICATION
    # ==================================================

    path(
        "api/token/",
        TokenObtainPairView.as_view(),
    ),

    path(
        "api/token/refresh/",
        TokenRefreshView.as_view(),
    ),


    # ==================================================
    # JOBS
    # ==================================================

    path(
        "api/jobs/",
        jobs_list,
    ),


    # ==================================================
    # PROFILE
    # ==================================================

    path(
        "api/profiles/",
        create_profile,
    ),

    path(
        "api/profile/me/",
        my_profile,
    ),


    # ==================================================
    # AUTH
    # ==================================================

    path(
        "api/signup/",
        signup,
    ),

    path(
        "api/login/",
        login_user,
    ),


    # ==================================================
    # USER APPLICATIONS
    # GET  -> My applications
    # POST -> Apply for job
    # ==================================================

    path(
        "api/applications/",
        applications,
    ),


    # ==================================================
    # USER UPDATE APPLICATION STATUS
    # ==================================================

    path(
        "api/applications/<int:application_id>/status/",
        update_application_status,
    ),


    # ==================================================
    # ADMIN DASHBOARD
    # ==================================================

    path(
        "api/admin/dashboard/",
        admin_dashboard,
    ),


    # ==================================================
    # ADMIN JOB MANAGEMENT
    # GET  -> All jobs
    # POST -> Create job
    # ==================================================

    path(
        "api/admin/jobs/",
        admin_jobs,
    ),


    # ==================================================
    # ADMIN JOB DETAIL
    # PUT    -> Update job
    # DELETE -> Delete job
    # ==================================================

    path(
        "api/admin/jobs/<int:job_id>/",
        admin_job_detail,
    ),


    # ==================================================
    # ADMIN APPLICATIONS
    # GET -> All applications
    # ==================================================

    path(
        "api/admin/applications/",
        admin_applications,
    ),


    # ==================================================
    # ADMIN UPDATE APPLICATION STATUS
    # ==================================================

    path(
        "api/admin/applications/<int:application_id>/status/",
        admin_update_application_status,
    ),
]