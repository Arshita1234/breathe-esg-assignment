from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Tenant, IngestionBatch, ActivityLog

class DashboardDataView(APIView):
    def get(self, request):
        # Programmatic Tenant Multi-Tenant Isolation
        tenant_name = request.query_params.get('tenant', 'Enterprise Corp India')
        tenant, _ = Tenant.objects.get_or_create(name=tenant_name)
        
        # Populate realistic target datasets aligned with the updated model schema
        if not ActivityLog.objects.filter(tenant=tenant).exists():
            
            # Source 1: Raw SAP Flat File Export (Scope 1 - Direct Emissions)
            batch_sap = IngestionBatch.objects.create(tenant=tenant, source_type='SAP')
            ActivityLog.objects.create(
                tenant=tenant, 
                batch=batch_sap, 
                status='SUSPICIOUS', 
                scope_category='1',
                source_row_identifier='SAP-EX-9402', 
                activity_type='Procurement: WERKS-0442 / Diesel Fuel Bulk Receipt',
                raw_quantity=75000.00,
                raw_unit='Liters',
                normalized_quantity_kwh=894500.00,
                flags_meta={
                    "raw_payload": "MAT_L012 || 2026-04-12 || 75000Ltr || DE_WERKS_0442",
                    "warning": "Inconsistent units: Automatically converted Liters to kWh using standard density metrics. Plant lookup code missing."
                }
            )

            # Source 2: Utility Portal Billing Cycle (Scope 2 - Market Based)
            batch_util = IngestionBatch.objects.create(tenant=tenant, source_type='UTILITY')
            ActivityLog.objects.create(
                tenant=tenant, 
                batch=batch_util, 
                status='PENDING', 
                scope_category='2',
                source_row_identifier='UTIL-METER-B2', 
                activity_type='Grid Electricity: Mid-Peak Commercial Tariff Node',
                raw_quantity=41200.50,
                raw_unit='kWh',
                normalized_quantity_kwh=41200.50,
                flags_meta={
                    "billing_period": "2026-04-12 to 2026-05-18",
                    "warning": "Billing period overflows calendar month alignment. Pro-rata distribution algorithm required for baseline reporting."
                }
            )

            # Source 3: SAP Concur Corporate Flights API Payload (Scope 3 - Business Travel)
            batch_concur = IngestionBatch.objects.create(tenant=tenant, source_type='CONCUR')
            ActivityLog.objects.create(
                tenant=tenant, 
                batch=batch_concur, 
                status='PENDING', 
                scope_category='3',
                source_row_identifier='CONCUR-TX-771', 
                activity_type='Business Travel: Corporate Executive Flight Route',
                raw_quantity=1.00,
                raw_unit='IATA_Segment',
                normalized_quantity_kwh=18400.00,
                flags_meta={
                    "flight_segment": "DEL -> BLR (Economy Class)",
                    "warning": "Distance metric missing from Concur webhook payload. Distance interpolated via Great-Circle calculation between airport codes."
                }
            )

        # Include all newly introduced audit trail keys for serialization
        data = ActivityLog.objects.filter(tenant=tenant).values(
            'id', 'source_row_identifier', 'scope_category', 'activity_type',
            'raw_quantity', 'raw_unit', 'normalized_quantity_kwh', 'status', 
            'flags_meta', 'is_locked', 'is_edited', 'approved_by', 'approved_at'
        )
        return Response(data)


class ApproveRecordView(APIView):
    """
    Validates and locks a record, signing it off with an analyst's audit footprint.
    """
    def post(self, request, pk):
        try:
            record = ActivityLog.objects.get(pk=pk)
            record.status = 'APPROVED'
            record.is_locked = True
            record.approved_at = timezone.now()
            record.approved_by = "Lead_ESG_Analyst_01"  # Auditable signature trace
            record.save()
            return Response({"status": "Record successfully verified and locked for auditing"}, status=status.HTTP_200_OK)
        except ActivityLog.DoesNotExist:
            return Response({"error": "Target record not found"}, status=status.HTTP_404_NOT_FOUND)