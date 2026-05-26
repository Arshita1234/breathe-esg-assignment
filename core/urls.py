from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from ingestion.views import DashboardDataView, ApproveRecordView

urlpatterns = [
    # 1. High Priority System Operations
    path('admin/', admin.site.urls),
    path('api/activities/', DashboardDataView.as_view(), name='activities-list'),
    path('api/activities/<int:pk>/approve/', ApproveRecordView.as_view(), name='activity-approve'),
    
    # 2. Strict Empty Root Link
    path('', TemplateView.as_view(template_name='index.html'), name='frontend-root'),
    
    # 3. Catch-all: Intercepts browser requests, ignoring core API/Admin spaces
    re_path(r'^(?!api/|admin/).*$', TemplateView.as_view(template_name='index.html'), name='frontend-catchall'),
]