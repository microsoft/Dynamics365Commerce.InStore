# Product Recognition Sample

## Overview

This sample demonstrates how to integrate Azure Custom Vision AI with Dynamics 365 Commerce to enable product recognition from images. The solution allows point-of-sale (POS) systems to identify products by analyzing images captured through cameras, streamlining the checkout process and improving inventory management.

### Key Features

- **Azure Custom Vision Integration**: Leverages Azure Custom Vision API for AI-powered image classification
- **Certificate-Based Authentication**: Uses X.509 certificates for secure authentication with Azure services via Microsoft Identity (MSAL)
- **Configurable Confidence Thresholds**: Supports adjustable confidence levels to control prediction accuracy
- **Tag-to-Product Mapping**: Maps AI-generated tag names to Commerce product IDs using batch processing
- **POS Extensions**: Provides Store Commerce POS extensions for capturing and processing product images
- **Commerce Runtime (CRT) Services**: Implements custom CRT handlers for product recognition workflow

### Architecture

The sample consists of several components:

#### Commerce Runtime (CRT)

1. **ProductRecognitionService**: Main service that orchestrates the product recognition workflow
   - Handles image data submission to Azure Custom Vision
   - Manages authentication using certificate-based OAuth
   - Processes API responses and filters results by confidence threshold

2. **MapTagNamesToProductIdHandler**: Batch mapper that converts AI tag names to product IDs
   - Accepts multiple tag names in a single request
   - Returns a dictionary mapping tag names to product IDs
   - Optimizes performance by processing tags in batches

3. **GetCustomVisionConfigurationHandler**: Configuration provider for Azure Custom Vision settings
   - Endpoint URL
   - Project ID
   - Iteration name
   - Certificate subject name for authentication

4. **ProductRecognitionController**: HTTP endpoint for POS to invoke product recognition

#### Point of Sale (POS)

- Custom UI extensions for image capture and product recognition workflow
- Integration with device cameras or file upload capabilities
- Display of recognition results with confidence scores

### How It Works

1. **Image Capture**: POS extension captures or receives product image data
2. **API Call**: Image is sent to the ProductRecognitionController endpoint as base64-encoded data
3. **Azure Custom Vision**: Service authenticates using certificate and calls Custom Vision API
4. **Tag Recognition**: Custom Vision returns predicted tags with probability scores
5. **Batch Mapping**: All qualifying tag names are mapped to product IDs in a single batch request
6. **Results**: Filtered and sorted results are returned to POS with product IDs and confidence scores
7. **POS Action**: POS can automatically add recognized products to the transaction

### Configuration Requirements

- **Azure Custom Vision**:
  - Active Custom Vision project with trained model
  - Published iteration name
  - Prediction endpoint URL

- **Azure AD Authentication**:
  - App registration with certificate-based credentials
  - X.509 certificate installed in LocalMachine\My store
  - Tenant ID and Client ID configured

- **Product Mapping**:
  - Tag names must be mapped to product IDs in `MapTagNamesToProductIdHandler`
  - Update the `itemIdsByTag` dictionary with your tag-to-product mappings

### Benefits

- **Faster Checkout**: Quickly identify products without manual barcode scanning
- **Improved Accuracy**: Reduce errors from manual product entry
- **Enhanced Customer Experience**: Enable self-service scenarios with image recognition
- **Inventory Insights**: Track product recognition patterns for merchandising optimization
