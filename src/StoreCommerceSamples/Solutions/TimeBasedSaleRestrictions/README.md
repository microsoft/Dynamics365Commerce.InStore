
# Contoso.TimeRestrictions (SDK 10.0.47)

A Commerce Runtime (CRT) extension that restricts sales of items to specific time windows, e.g., allow alcohol sales only between 08:00 and 20:00 in the store's local time.

## Key features
- Enforces restrictions at **add-to-cart** and again during **cart calculation** (safety net)
- Supports **time windows** with `RestrictedBeforeTime` and `RestrictedAfterTime` attributes
- Supports **overnight windows** (e.g., sales allowed from 20:00 to 08:00)
- Uses product attributes for configuration
- Localized error messages (Resources.resx)

## How it works
The extension registers CRT **triggers** that intercept requests at key points in the shopping workflow to validate time-based restrictions:

### Validation Points
1. **Add to Cart** (`AddCartLinesRequest`) - Validates products when they are first added to the cart
2. **Update Cart Lines** (`UpdateCartLinesRequest`) - Validates products when cart line quantities or details are modified
3. **Save Cart** (`SaveCartRequest`) - Validates all cart items when the cart is saved
4. **Checkout Calculation** (`CalculateSalesTransactionServiceRequest`) - Final validation during checkout/totaling to ensure no restricted items proceed to payment

### Configuration Source
The system reads time restriction configuration from product attributes via `GetAttributeValuesByProductIdsServiceRequest` with catalogId=0.

### Time Restriction Rule Evaluation
Each product is evaluated against a rule composed of:
- `RestrictedBeforeTime` → `HH:mm` (e.g., `08:00`) - sales restricted before this time
- `RestrictedAfterTime` → `HH:mm` (e.g., `20:00`) - sales restricted after this time
- `RestrictionDays` → CSV of day names (`Mon,Tue,Wed,Thu,Fri,Sat,Sun`) — optional
- `RestrictionReasonId` → optional reason code for messaging/audit

All time comparisons use the **channel's local time zone** from the channel configuration.

### Time Window Logic
- **Normal daytime window**: `RestrictedBeforeTime=08:00`, `RestrictedAfterTime=20:00` → Sales allowed from 08:00 to 19:59:59 (restricted before 08:00 and after 20:00)
- **Overnight window**: `RestrictedBeforeTime=20:00`, `RestrictedAfterTime=08:00` → Sales allowed from 20:00 to 07:59:59 (crossing midnight)
- **No restriction**: If `RestrictedBeforeTime` equals `RestrictedAfterTime`, no restriction applies
- **Legacy support**: Using only `RestrictedAfterTime` maintains backward compatibility (restricts sales after specified time)

## Attribute setup (HQ)
1. **Product attributes** (Retail and Commerce > Channel setup > Attributes):
   - Create attributes with the exact names:
     - `RestrictedBeforeTime` (Text) - Time before which sales are restricted
     - `RestrictedAfterTime` (Text) - Time after which sales are restricted
     - `RestrictionDays` (Text) - Days when restriction applies
     - `RestrictionReasonId` (Text) - Optional reason code
2. Add attributes to the relevant **attribute group** and assign it to products **or** the category (market assortment).
3. Publish to channel DB via distribution schedule. Typical jobs:
   - **9999** (Initialize) or specific attribute/product jobs (e.g., **1040** Catalog, **1150/9997** as applicable in your environment). Use your project's standard CDX sequence.

## Build & deploy

### Building the extension
Build the solution using the .NET CLI:
```bash
dotnet build TimeBasedSaleRestrictions.sln -c Release
```

This produces:
- `Contoso.TimeRestrictions.dll` - The CRT extension
- `Contoso.TimeRestrictions.ScaleUnit.Installer.exe` - Scale Unit deployment package
- `Contoso.TimeRestrictions.StoreCommerce.Installer.exe` - Store Commerce deployment package

### Deployment
1. **Cloud Scale Unit**: Run the `Contoso.TimeRestrictions.ScaleUnit.Installer.exe` to package and deploy the extension to your Cloud Scale Unit.
2. **Store Commerce**: Run the `Contoso.TimeRestrictions.StoreCommerce.Installer.exe` to deploy the extension to Store Commerce app.
3. Test the extension:
   - Configure time restrictions on a product (see Attribute setup section)
   - **Example 1**: Set `RestrictedBeforeTime=08:00` and `RestrictedAfterTime=20:00`
     - Before 08:00: add-to-cart is blocked
     - 08:00-19:59:59: item can be added to cart
     - After 20:00: add-to-cart is blocked
   - **Example 2**: Set `RestrictedBeforeTime=20:00` and `RestrictedAfterTime=08:00` (overnight window)
     - 00:00-07:59:59: item can be added to cart
     - 08:00-19:59:59: add-to-cart is blocked
     - 20:00-23:59:59: item can be added to cart

## Build & test using .NET CLI

### Build the solution
From the solution directory, run:
```bash
dotnet build TimeBasedSaleRestrictions.sln -c Release
```

This will build:
- The CRT extension (`Contoso.TimeRestrictions.dll`)
- ScaleUnit installer (`Contoso.TimeRestrictions.ScaleUnit.Installer.exe`)
- StoreCommerce installer (`Contoso.TimeRestrictions.StoreCommerce.Installer.exe`)
- Test project (`Contoso.TimeRestrictions.Tests.dll`)

### Run tests
To run the unit tests:
```bash
dotnet test TimeBasedSaleRestrictions.sln -c Release
```

Or to build and test in one step:
```bash
dotnet test TimeBasedSaleRestrictions.sln -c Release --no-build
```

The test suite includes:
- Normal time window tests (e.g., 08:00 to 20:00)
- Overnight window tests (e.g., 20:00 to 08:00)
- Equal before/after tests (no restriction)
- Day-of-week filter tests
- Legacy RestrictedAfter-only tests

### Clean build artifacts
To clean all build outputs:
```bash
dotnet clean TimeBasedSaleRestrictions.sln -c Release
```

## Notes
- Time conversion uses the **store/channel time zone** from channel configuration.
- Restrictions are enforced at multiple points: add-to-cart, cart updates, cart save, and checkout calculation.
- Voided lines and lines with zero/negative quantity are skipped during validation.
- Mixed carts: only offending lines are blocked, with a clear message.
- Error messages adapt based on configuration:
  - Both times set: "Sales of this item are only permitted between 08:00 and 20:00."
  - Only after set: "Sales of this item are not permitted after 20:00."
  - Only before set: "Sales of this item are not permitted before 08:00."

---

## Project structure
- `Contoso.TimeRestrictions/` - CRT extension project
  - `Contoso.TimeRestrictions.csproj`
  - `Handlers/TimeRestrictionTriggers.cs`
  - `Services/TimeRestrictionRule.cs`
  - `Services/TimeRestrictionParsers.cs`
  - `Services/TimeRestrictionConfigProvider.cs`
  - `Services/ChannelTimeService.cs`
  - `Services/AttributeConstants.cs`
  - `Resources/Resources.resx`
- `Contoso.TimeRestrictions.Tests/` - Unit tests
  - `TimeRestrictionTests.cs`
- `ScaleUnit.Installer/` - Scale Unit deployment package
- `StoreCommerce.Installer/` - Store Commerce deployment package
