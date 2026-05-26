from django.contrib import admin
from django.urls import path
from ingestion.views import DashboardDataView, ApproveRowView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/activities/', DashboardDataView.as_view()),
    path('api/activities/<int:pk>/approve/', ApproveRowView.as_view()),
]