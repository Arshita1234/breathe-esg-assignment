from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from ingestion.views import DashboardDataView, ApproveRecordView

urlpatterns = [
    # 1. High-Priority API Routes (Must match exactly)
    path('admin/', admin.site.urls),
    path('api/activities/', DashboardDataView.as_view(), name='activities-list'),
    path('api/activities/<int:pk>/approve/', ApproveRecordView.as_view(), name='activity-approve'),
    
    # 2. Strict Root Entry for Single Page App
    path('', TemplateView.as_view(template_name='index.html'), name='frontend-root'),
    
    # 3. Fixed Catch-all: Explicitly ignores api/ and admin/ so they never get hijacked
    re_path(r'^(?!(api|admin)/).*$', TemplateView.as_view(template_name='index.html'), name='frontend-catchall'),
]