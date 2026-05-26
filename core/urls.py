from django.contrib import admin
from django.urls import path, re_path
from django.views.generic import TemplateView
from ingestion.views import DashboardDataView, ApproveRecordView

urlpatterns = [
    # 1. High Priority System Routes
    path('admin/', admin.site.urls),
    path('api/activities/', DashboardDataView.as_view(), name='activities-list'),
    path('api/activities/<int:pk>/approve/', ApproveRecordView.as_view(), name='activity-approve'),
    
    # 2. Strict Empty Root Path (Serves the React index page)
    path('', TemplateView.as_view(template_name='index.html'), name='frontend-root'),
    
    # 3. LOW PRIORITY Catch-All (MUST be at the very bottom)
    re_path(r'^api/', DashboardDataView.as_view()), # Guard rail for API calls
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='frontend-catchall'),
]