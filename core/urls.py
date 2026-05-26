from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from ingestion.views import DashboardDataView, ApproveRecordView

urlpatterns = [
    # Admin Panel Routing Control
    path('admin/', admin.site.urls),
    
    # REST API Ledger Endpoints
    path('api/activities/', DashboardDataView.as_view(), name='activities-list'),
    path('api/activities/<int:pk>/approve/', ApproveRecordView.as_view(), name='activity-approve'),
    
    # 1. Base Root View: Serves Vite React frontend home layout directly
    path('', TemplateView.as_view(template_name='index.html'), name='frontend-root'),
    
    # 2. Production Catch-All Route: Redirects structural browser refreshes back to React
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='frontend-catchall'),
]