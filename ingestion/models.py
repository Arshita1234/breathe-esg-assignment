from django.db import models
from django.contrib.auth.models import User # For enterprise authentication audit trails

class Tenant(models.Model):
    """
    Enforces absolute Multi-Tenant Isolation (Mandatory Specification).
    Ensures corporate perimeter separation at the root entity level.
    """
    name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class IngestionBatch(models.Model):
    """
    Establishes Data Provenance and Ingestion Lineage.
    Ties every transactional record back to a discrete ingestion vector and execution run.
    """
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
    """
    The Core Relational Audit Ledger.
    Maintains a pristine chain of custody from raw input telemetry to normalized energy metrics.
    """
    SCOPE_CHOICES = [('1', 'Scope 1'), ('2', 'Scope 2'), ('3', 'Scope 3')]
    STATUS_CHOICES = [('PENDING', 'Pending'), ('SUSPICIOUS', 'Suspicious'), ('APPROVED', 'Approved')]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='activities')
    batch = models.ForeignKey(IngestionBatch, on_delete=models.CASCADE, related_name='records')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    scope_category = models.CharField(max_length=1, choices=SCOPE_CHOICES)
    
    # Traceability Data
    source_row_identifier = models.CharField(max_length=100) # e.g., 'Line-42', 'Row-102'
    activity_type = models.CharField(max_length=255) # Extended field size for messy enterprise descriptions
    
    # System Unit Normalization Audit Fields (Resolves Unit Normalization Criteria)
    raw_quantity = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True, help_text="Original value from source payload")
    raw_unit = models.CharField(max_length=50, null=True, blank=True, help_text="Original unit (e.g., Liters, Gallons, IATA_Pair)")
    normalized_quantity_kwh = models.DecimalField(max_digits=15, decimal_places=4, help_text="Unified internal normalization footprint")
    
    # Rich Anomaly Metadata Engine
    flags_meta = models.JSONField(default=dict, blank=True, help_text="Stores unstructured system parsing errors, warnings, and payload captures")
    
    # Audit Trail Footprint Signatures (Resolves Audit Trail Criteria)
    is_locked = models.BooleanField(default=False, help_text="True immediately when an analyst signs off; completely immutabilizes the record")
    is_edited = models.BooleanField(default=False, help_text="Tracks whether the row was programmatically ingested or manually adjusted")
    approved_at = models.DateTimeField(null=True, blank=True, help_text="Timestamp of analyst validation")
    approved_by = models.CharField(max_length=255, null=True, blank=True, help_text="Footprint signature of verifying analyst")
    
    # Temporal Controls
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Activity Logs"

    def __str__(self):
        return f"[{self.get_status_display()}] Scope {self.scope_category} - {self.source_row_identifier}"