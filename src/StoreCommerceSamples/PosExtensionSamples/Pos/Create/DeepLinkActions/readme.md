# Deep Link Actions Sample

Demonstrates deep link extensibility with CREATE and EXTEND patterns.

## Components

### CREATE: LogInventoryCheckActionHandler
Custom action that displays item/store information via dialog.
- **Action Name**: `Contoso.PosExtensions.LogInventoryCheck` (package name from `manifest.json` `"name"` field + action name)
- **Deep Link**: `ms-d365sc://executeAction?actionName=Contoso.PosExtensions.LogInventoryCheck&param=eyJpdGVtTnVtYmVyIjoiMDAwMSIsInN0b3JlSWQiOiJTRUFUVExFIn0=`
- **Parameters**: `{"itemNumber":"0001","storeId":"SEATTLE"}`

### EXTEND/REPLACEMENT: RecallOrderReplacementHandler
Complete override of the built-in D365.RecallOrder action using the specific replacement handler class.
- **Action Name**: `D365.RecallOrder` (replaces 1st party action)
- **Handler Class**: Extends `RecallOrderReplacementDeepLinkActionHandler`
- **Deep Link**: `ms-d365sc://executeAction?actionName=D365.RecallOrder&param=eyJzYWxlc0lkIjoiU08tMTIzNDUifQ==`
- **Parameters**: `{"salesId":"SO-12345"}`

### EXTEND/TRIGGER: PreDeepLinkActionTrigger
Generic trigger using switch statement to route actions. Validates item quantities for D365.CreateTransaction.

**Business Scenario**: Products with minimum order quantities
- Product 22565421963: min 5 units
- Product 22565421964: min 2 units
- Product 81655: min 3 units

**Behavior**: Auto-adjusts quantities below minimum, shows toast notification

**Deep Link**: `ms-d365sc://executeAction?actionName=D365.CreateTransaction&param=eyJpdGVtcyI6W3sicHJvZHVjdElkIjoyMjU2NTQyMTk2MywicXVhbnRpdHkiOjJ9XX0=`

**Parameters**: `{"items":[{"productId":22565421963,"quantity":2}]}`

**Result**: Quantity adjusted 2→5, toast displays "Minimum Quantity Applied"

## Implementation Notes

### Action Naming Conventions
- **CREATE pattern**: The `actionName` property in the handler class is the short name (e.g., `"LogInventoryCheck"`). The deep link URL must use the full `<PackageName>.<ActionName>` (e.g., `Contoso.PosExtensions.LogInventoryCheck`), where the package name is the `"name"` field in `manifest.json`.
- **EXTEND pattern**: Target 1st party actions with `D365.` prefix (e.g., `D365.RecallOrder`)
- **Reserved namespace**: ISVs cannot create actions starting with `D365.` - use EXTEND pattern instead

### EXTEND Pattern: Two Approaches

**Approach 1 - REPLACEMENT (Complete Override)**:
- Extend specific replacement handler class from `PosApi/Extend/DeepLink`
- Register in `manifest.json` under `components.extend.deepLinkActions`
- Completely replaces the 1st party action - no access to original implementation

**Approach 2 - TRIGGER (Augmentation)**:
- Use `PreDeepLinkActionTrigger` from `PosApi/Extend/Triggers/DeepLinkActionTriggers`
- Works with ALL actions (1st party and custom)
- Can modify parameters, add validation, or cancel execution
- Original action still executes after trigger (unless canceled)

**Generic Trigger Pattern**: Use switch statement to route actions to private methods:
```typescript
switch (options.actionName) {
    case "D365.CreateTransaction":
        return await this._handleCreateTransaction(options);
    default:
        return { canceled: false };
}
```
