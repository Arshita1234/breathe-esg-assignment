from django.contrib import admin
from django.urls import path
from ingestion.views import DashboardDataView, ApproveRecordView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/activities/', DashboardDataView.as_view(), name='activities-list'),
    path('api/activities/<int:pk>/approve/', ApproveRecordView.as_view(), name='activity-approve'),
]