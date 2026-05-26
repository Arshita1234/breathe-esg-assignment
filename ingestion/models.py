from django.db import models

class Tenant(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class IngestionBatch(models.Model):
    SOURCE_CHOICES = [
        ('SAP', 'SAP Flat File Export'),
        ('UTILITY', 'Utility Portal CSV'),
        ('CONCUR', 'SAP Concur API Payload')
    ]
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

class ActivityLog(models.Model):
    SCOPE_CHOICES = [('1', 'Scope 1'), ('2', 'Scope 2'), ('3', 'Scope 3')]
    STATUS_CHOICES = [('PENDING', 'Pending'), ('SUSPICIOUS', 'Suspicious'), ('APPROVED', 'Approved')]

    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    batch = models.ForeignKey(IngestionBatch, on_delete=models.CASCADE)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')
    scope_category = models.CharField(max_length=1, choices=SCOPE_CHOICES)
    source_row_identifier = models.CharField(max_length=100)
    
    activity_type = models.CharField(max_length=100)
    normalized_quantity_kwh = models.DecimalField(max_digits=15, decimal_places=4)
    flags_meta = models.JSONField(default=dict, blank=True)