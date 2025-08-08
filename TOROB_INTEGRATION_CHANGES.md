# Torob.com Integration Changes

## Overview
This document outlines all the changes made to improve SEO and meta tag implementation for Torob.com integration.

## Changes Made

### 1. Enhanced MetaTags Component (`components/seo/meta-tags.tsx`)
- **Added new props for Torob.com integration:**
  - `price`: Product price in IRR (Rials)
  - `currency`: Currency code (default: "IRR")
  - `productId`: Unique product identifier
  - `sku`: Stock Keeping Unit
  - `brand`: Product brand/category
  - `category`: Product category
  - `availability`: Stock status ("in stock", "out of stock", "limited")
  - `condition`: Product condition ("new", "used", "refurbished")

- **Added new meta tags:**
  - Product-specific meta tags for search engines
  - Price meta tags with amount and currency
  - Availability and condition meta tags
  - Enhanced OpenGraph tags for products
  - Robots and Googlebot meta tags

### 2. Enhanced Product Page (`app/product/[slug]/page.tsx`)
- **Improved metadata generation:**
  - Added price information to descriptions
  - Added keywords with product and category names
  - Enhanced OpenGraph and Twitter meta tags
  - Added product-specific meta tags in `other` field
  - Dynamic availability status based on product quantity

- **Enhanced MetaTags component usage:**
  - Passes all required product information
  - Includes price conversion from Toman to Rial
  - Sets proper availability status
  - Includes unique product identifiers

### 3. Enhanced Product Schema (`components/seo/product-schema.tsx`)
- **Added more structured data:**
  - GTIN (Global Trade Item Number)
  - Product category information
  - Enhanced seller information with URL
  - Product condition specification
  - Additional properties for stock status, category, series, character
  - Technical specifications (material, height, weight) when available

### 4. Enhanced Category Page (`app/category/[...slug]/page.tsx`)
- **Improved metadata:**
  - Added keywords with category name
  - Enhanced descriptions with pricing information
  - Added Twitter meta tags
  - Improved OpenGraph tags with proper URLs

### 5. Enhanced Shop Page (`app/shop/page.tsx`)
- **Improved metadata:**
  - Added comprehensive keywords
  - Enhanced descriptions
  - Added OpenGraph and Twitter meta tags
  - Better title structure

### 6. Enhanced Sitemap (`app/sitemap.ts`)
- **Improved product discovery:**
  - Better pagination handling for all products
  - Increased product priority to 0.9
  - Increased category priority to 0.8
  - Added main category pages
  - Better error handling and logging

### 7. Created Robots.txt (`public/robots.txt`)
- **Proper crawling instructions:**
  - Allows crawling of all public pages
  - Disallows admin and private areas
  - Specifies sitemap location
  - Sets crawl delay for respectful crawling

## Key Features for Torob.com

### Unique Product Identification
- Each product has a unique UUID-based identifier
- SKU format: `AME-{product.uuid}`
- GTIN format: `AME-{product.uuid}`

### Price Information
- Prices are converted from Toman to Rial (×10)
- Currency is set to "IRR" (Iranian Rial)
- Price meta tags are included in both name and property attributes

### Availability Status
- **In Stock**: Quantity > 2
- **Limited**: Quantity 1-2
- **Out of Stock**: Quantity = 0

### Enhanced Descriptions
- Include product name, category, and price
- Use Persian number formatting
- Include relevant keywords

### Structured Data
- Complete Schema.org Product markup
- Includes all required e-commerce properties
- Enhanced with additional product specifications

## Testing Recommendations

1. **Verify Meta Tags**: Use browser developer tools to check meta tags on product pages
2. **Test Structured Data**: Use Google's Rich Results Test tool
3. **Check Sitemap**: Verify sitemap.xml is accessible and contains all products
4. **Test Robots.txt**: Ensure robots.txt is accessible and properly configured
5. **Validate URLs**: Check that all product and category URLs are properly formatted

## Next Steps

1. Deploy the changes to production
2. Submit the updated sitemap to Torob.com
3. Monitor search engine indexing
4. Track product visibility in Torob.com search results
5. Monitor any additional feedback from Torob.com tech team

## Files Modified

- `components/seo/meta-tags.tsx`
- `app/product/[slug]/page.tsx`
- `components/seo/product-schema.tsx`
- `app/category/[...slug]/page.tsx`
- `app/shop/page.tsx`
- `app/sitemap.ts`
- `public/robots.txt` (new file)

## Files Created

- `TOROB_INTEGRATION_CHANGES.md` (this file) 