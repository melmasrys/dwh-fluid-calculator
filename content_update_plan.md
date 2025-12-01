# Content Update Plan: Aggregating Chat History

## 1. Detailed Pricing & Value Analysis
*Source: Chat 1 & 3*
- **DWU1000c**: ~$11,023/month (East US, On-demand)
- **Fabric F64**: ~$8,409.60/month (East US, On-demand)
- **Savings**: Fabric is approximately **23% cheaper** for equivalent processing capacity.
- **Reservation**: Mention 1-year (37% Synapse vs 41% Fabric) and 3-year discounts.
- **Flexibility**: Contrast "Pause/Resume" (both) vs Fabric's "Capacity Smoothing" which allows paying for average usage rather than peak.

## 2. Comprehensive Technical Specifications Table
*Source: Chat 2 (Technical Comparison)*
Create a full comparison table with these exact metrics:

| Feature | Azure Dedicated SQL Pool (DWU1000c) | Microsoft Fabric (F64) |
| :--- | :--- | :--- |
| **Architecture** | Node-based MPP (Gen2) | Unified Compute (Serverless-like) |
| **Compute Nodes** | **2** Explicit Nodes | Abstracted / Dynamic |
| **Distributions** | **60** Total (**30** per node) | Abstracted (Auto-sharded) |
| **Memory** | **600 GB** Total (**300 GB** per node) | Unified Memory Pool |
| **Max Concurrent Queries** | **128** (Static Limit) | Dynamic (Based on CU load) |
| **Max Open Sessions** | **1,024** | Workload Dependent |
| **Concurrency Model** | Resource Classes / Slots | Smoothing & Bursting |
| **Storage** | Decoupled Azure Storage | OneLake (Parquet/Delta) |

## 3. Deep Dive: 2TB + 50 Dashboards Scenario
*Source: Chat 3 (Sizing Recommendation)*
- **The Challenge**: 50 dashboards implies high concurrency. If all refresh at once, that's 50+ complex queries.
- **Synapse Approach**: DWU1000c provides **128 concurrency slots**. It *can* handle 50 queries, but complex dashboard queries might consume multiple slots, potentially queuing.
- **Fabric Approach**: F64 uses **Bursting**. It can temporarily spike above 64 CUs to handle the refresh storm, then smooth the usage over time. This is often more resilient for dashboard workloads than hard slot limits.
- **Recommendation**: **F64** is the "Prudent" choice. **F32** might work for storage (2TB) but risks latency during dashboard refreshes.

## 4. Performance Caveats & Migration Context
*Source: Chat 1 & 2*
- **Performance Variability**: Not 1:1. Depends on:
    - Data Types & Structure
    - Table Distribution (Hash/Round-robin vs Auto)
    - Data Source Latency
- **Migration**: Moving from Synapse to Fabric involves migrating DDL and T-SQL.
- **Mindset Shift**: From "Provisioning Nodes" to "Managing Capacity".

## Implementation Plan
- **New Section**: "Comprehensive Specs" (Table)
- **New Section**: "Cost Analysis" (Pricing Cards)
- **Enhanced Section**: "Sizing Logic" (Explaining the Bursting vs Slots for the 50 dashboard case)
- **Footer/Note**: Add the caveats about performance variability.
