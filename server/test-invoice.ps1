# Invoice Module Testing Script
# This script tests the Invoice API endpoints
# Prerequisites: Server must be running on localhost:3000

Write-Host "`n=== Testing Invoice Module ===" -ForegroundColor Cyan

## Step 1: Login as Provider
Write-Host "`nStep 1: Login as Provider" -ForegroundColor Yellow

try {
    $loginBody = @{
        email    = "provider@test.com"
        password = "password123"
    } | ConvertTo-Json

    $providerLogin = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $providerToken = $providerLogin.token
    Write-Host "✓ Provider logged in successfully" -ForegroundColor Green
}
catch {
    Write-Host "✗ Provider login failed: $_" -ForegroundColor Red
    exit 1
}

## Step 2: Get Provider's Bookings
Write-Host "`nStep 2: Get Provider's Bookings" -ForegroundColor Yellow

try {
    $headers = @{ Authorization = "Bearer $providerToken" }
    $bookings = Invoke-RestMethod -Uri "http://localhost:3000/api/bookings/provider" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Retrieved $($bookings.Count) booking(s)" -ForegroundColor Green
    
    $completedBooking = $bookings | Where-Object { $_.status -eq "COMPLETED" } | Select-Object -First 1
    
    if ($completedBooking) {
        $bookingId = $completedBooking.id
        Write-Host "✓ Found COMPLETED booking: $bookingId" -ForegroundColor Green
    }
    else {
        Write-Host "! No COMPLETED bookings found." -ForegroundColor Yellow
        Write-Host "Available bookings:" -ForegroundColor Gray
        $bookings | ForEach-Object { Write-Host "  - $($_.id): $($_.status)" -ForegroundColor Gray }
        exit 1
    }
}
catch {
    Write-Host "✗ Failed to retrieve bookings: $_" -ForegroundColor Red
    exit 1
}

## Step 3: Create Invoice
Write-Host "`nStep 3: Create Invoice for Booking" -ForegroundColor Yellow

try {
    $invoiceBody = @{
        bookingId = $bookingId
        items     = @(
            @{ name = "Oil Change"; price = 50.00; quantity = 1 }
            @{ name = "Filter Replacement"; price = 25.00; quantity = 2 }
        )
    } | ConvertTo-Json -Depth 3

    $invoice = Invoke-RestMethod -Uri "http://localhost:3000/api/invoices" `
        -Method POST `
        -Body $invoiceBody `
        -Headers $headers `
        -ContentType "application/json"
    
    $invoiceId = $invoice.id
    Write-Host "✓ Invoice created successfully" -ForegroundColor Green
    Write-Host "  Invoice ID: $invoiceId" -ForegroundColor Gray
    Write-Host "  Amount: `$$($invoice.amount)" -ForegroundColor Gray
    Write-Host "  Status: $($invoice.status)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Invoice creation failed: $_" -ForegroundColor Red
    Write-Host "Error details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    exit 1
}

## Step 4: Get Invoice by ID
Write-Host "`nStep 4: Retrieve Invoice by ID" -ForegroundColor Yellow

try {
    $retrievedInvoice = Invoke-RestMethod -Uri "http://localhost:3000/api/invoices/$invoiceId" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Invoice retrieved successfully" -ForegroundColor Green
    Write-Host "  Amount: `$$($retrievedInvoice.amount)" -ForegroundColor Gray
}
catch {
    Write-Host "✗ Failed to retrieve invoice: $_" -ForegroundColor Red
}

## Step 5: Get All Provider Invoices
Write-Host "`nStep 5: Get All Provider Invoices" -ForegroundColor Yellow

try {
    $allInvoices = Invoke-RestMethod -Uri "http://localhost:3000/api/invoices" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Retrieved $($allInvoices.Count) invoice(s)" -ForegroundColor Green
}
catch {
    Write-Host "✗ Failed to retrieve invoices: $_" -ForegroundColor Red
}

## Step 6: Test Double Billing Prevention
Write-Host "`nStep 6: Test Double Billing Prevention" -ForegroundColor Yellow

try {
    $duplicate = Invoke-RestMethod -Uri "http://localhost:3000/api/invoices" `
        -Method POST `
        -Body $invoiceBody `
        -Headers $headers `
        -ContentType "application/json"
    
    Write-Host "✗ Double billing prevention FAILED!" -ForegroundColor Red
}
catch {
    if ($_.ErrorDetails.Message -like "*already exists*") {
        Write-Host "✓ Double billing correctly prevented" -ForegroundColor Green
        Write-Host "  Error: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    }
    else {
        Write-Host "✗ Unexpected error: $_" -ForegroundColor Red
    }
}

Write-Host "`n=== All Tests Completed ===`n" -ForegroundColor Cyan
