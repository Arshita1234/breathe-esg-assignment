from django.db import models
from django.contrib.auth.models import User

class Tenant(models.Model):
    """Enforces absolute Multi-Tenant Isolation."""
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class IngestionBatch(models.Model):
    """Establishes Data Provenance and Ingestion Lineage."""
    SOURCE_CHOICES = [
        ('SAP', 'SAP Flat File Export'),
        ('UTILITY', 'Utility Portal CSV'),
        ('CONCUR', 'SAP Concur API Payload')
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='batches')
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tenant.name} - {self.source_type} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"

class ActivityLog(models.Model):
    """The Core Relational Audit Ledger."""
    SCOPE_CHOICES = [('1', 'Scope 1'), ('2', 'Scope 2'), ('3', 'Scope 3')]
    STATUS_CHOICES = [('PENDING', 'Pending'), ('SUSPICIOUS', 'Suspicious'), ('APPROVED', 'Approved')]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='activities')
    batch = models.ForeignKey(IngestionBatch, on_delete=models.CASCADE, related_name='records')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    scope_category = models.CharField(max_length=1, choices=SCOPE_CHOICES)
    
    source_row_identifier = models.CharField(max_length=100)
    activity_type = models.CharField(max_length=255)
    
    raw_quantity = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    raw_unit = models.CharField(max_length=50, null=True, blank=True)
    normalized_quantity_kwh = models.DecimalField(max_digits=15, decimal_places=4)
    
    flags_meta = models.JSONField(default=dict, blank=True)
    
    is_locked = models.BooleanField(default=False)
    is_edited = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.CharField(max_length=255, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # CRITICAL: This dummy field wakes up Django's migration engine to build your missing tables!
    migration_trigger = models.CharField(max_length=10, default="sync")

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Activity Logs"

    def __str__(self):
        return f"[{self.get_status_display()}] Scope {self.scope_category} - {self.source_row_identifier}"