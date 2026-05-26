# Data Source Research

* **SAP ERP:** Research shows raw outputs are historically difficult, containing mixed language variables and abstract plant identifiers. Our data models a sanitized subset of this data.
* **Utility Metering:** Investigated typical utility portal exports. We accounted for the lack of uniform billing date alignments across different municipalities.
* **Corporate Travel:** Examined Navan/Concur data structures. Flight records often lack precise distance variables, meaning the backend must resolve IATA airport codes to map trip parameters.