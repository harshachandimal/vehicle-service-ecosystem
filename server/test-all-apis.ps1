# Comprehensive API Testing Script for Vehicle Service Ecosystem
# Tests all 15 endpoints across 5 modules (Auth, Vehicle, Provider, Booking, Invoice)
# Prerequisites: Server running on localhost:3000, Database accessible

$baseUrl = "http://localhost:3000"
$ErrorActionPreference = "Continue"

Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "      Vehicle Service Ecosystem - API Test Suite" -ForegroundColor Cyan
Write-Host "================================================================`n" -ForegroundColor Cyan

# Track test results
$testResults = @{
    Passed = 0
    Failed = 0
    Total  = 0
}

function Test-Endpoint {
    param($Name, [ScriptBlock]$ScriptBlock)
    $testResults.Total++
    Write-Host "`n> $Name" -ForegroundColor Yellow
    try {
        Invoke-Command -ScriptBlock $ScriptBlock
        $testResults.Passed++
        Write-Host "  PASSED" -ForegroundColor Green
        return $true
    }
    catch {
        $testResults.Failed++
        Write-Host "  FAILED: $_" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "  Error: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
        return $false
    }
}

#═══════════════════════════════════════════════════════════
# STEP 0: Health Check
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 0: Health Check ---" -ForegroundColor Magenta

Test-Endpoint "GET /health - Server Health Check" {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    if ($health.status -ne "ok") {
        throw "Server is not healthy: $($health.status)"
    }
    Write-Host "  Database: $($health.database)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 1: Authentication Module (2 endpoints)
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 1: Authentication Module ---" -ForegroundColor Magenta

# Generate unique email addresses to avoid conflicts
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$ownerEmail = "owner_${timestamp}@test.com"
$providerEmail = "provider_${timestamp}@test.com"

# Variables to store tokens
$script:ownerToken = $null
$script:providerToken = $null
$script:ownerId = $null
$script:providerId = $null

Test-Endpoint "POST /api/auth/register - Register Owner" {
    $body = @{
        email    = $ownerEmail
        password = "password123"
        name     = "Test Owner"
        role     = "OWNER"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    
    $script:ownerToken = $response.token
    $script:ownerId = $response.user.id
    Write-Host "  Owner ID: $($script:ownerId)" -ForegroundColor Gray
}

Test-Endpoint "POST /api/auth/register - Register Provider" {
    $body = @{
        email    = $providerEmail
        password = "password123"
        name     = "Test Provider"
        role     = "PROVIDER"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" -Method POST -Body $body -ContentType "application/json"
    
    $script:providerToken = $response.token
    $script:providerId = $response.user.id
    Write-Host "  Provider ID: $($script:providerId)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 2: Vehicle Module (3 endpoints)
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 2: Vehicle Module ---" -ForegroundColor Magenta

$ownerHeaders = @{ Authorization = "Bearer $($script:ownerToken)" }
$script:vehicleId = $null

Test-Endpoint "POST /api/vehicles - Add Vehicle (Owner)" {
    $body = @{
        make         = "Toyota"
        model        = "Camry"
        year         = 2022
        licensePlate = "ABC${timestamp}"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/vehicles" -Method POST -Body $body -Headers $ownerHeaders -ContentType "application/json"
    
    $script:vehicleId = $response.id
    Write-Host "  Vehicle ID: $($script:vehicleId)" -ForegroundColor Gray
    Write-Host "  License: $($response.licensePlate)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/vehicles - List Owner's Vehicles" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/vehicles" -Method GET -Headers $ownerHeaders
    
    if ($response.Count -lt 1) {
        throw "Expected at least 1 vehicle"
    }
    Write-Host "  Found $($response.Count) vehicle(s)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 3: Provider Module (5 endpoints)
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 3: Provider Module ---" -ForegroundColor Magenta

$providerHeaders = @{ Authorization = "Bearer $($script:providerToken)" }
$script:profileId = $null
$script:serviceId = $null

Test-Endpoint "PUT /api/providers/profile - Update Provider Profile" {
    $body = @{
        businessName = "Test Garage ${timestamp}"
        category     = "GARAGE"
        phone        = "1234567890"
        address      = "123 Test Street"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/providers/profile" -Method PUT -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    $script:profileId = $response.id
    Write-Host "  Profile ID: $($script:profileId)" -ForegroundColor Gray
    Write-Host "  Business: $($response.businessName)" -ForegroundColor Gray
}

Test-Endpoint "POST /api/providers/services - Add Service Item" {
    $body = @{
        name        = "Oil Change"
        price       = 49.99
        description = "Standard oil change service"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/providers/services" -Method POST -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    $script:serviceId = $response.id
    Write-Host "  Service ID: $($script:serviceId)" -ForegroundColor Gray
    Write-Host "  Price: `$$($response.price)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/providers/me - Get My Profile" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/providers/me" -Method GET -Headers $providerHeaders
    
    if (-not $response.profile) {
        throw "No profile data returned"
    }
    Write-Host "  Services: $($response.services.Count)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/providers/:id - Get Provider Details (Public)" {
    if (-not $script:profileId) {
        throw "Profile ID not available"
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/api/providers/$($script:profileId)" -Method GET
    
    Write-Host "  Business: $($response.profile.businessName)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 4: Booking Module (4 endpoints)
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 4: Booking Module ---" -ForegroundColor Magenta

$script:bookingId = $null
$serviceDate = (Get-Date).AddDays(7).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

Test-Endpoint "POST /api/bookings - Create Booking (Owner)" {
    if (-not $script:vehicleId -or -not $script:providerId) {
        throw "Vehicle or Provider not available"
    }
    
    $body = @{
        vehicleId   = $script:vehicleId
        providerId  = $script:providerId
        description = "Test booking for oil change"
        serviceDate = $serviceDate
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings" -Method POST -Body $body -Headers $ownerHeaders -ContentType "application/json"
    
    $script:bookingId = $response.id
    Write-Host "  Booking ID: $($script:bookingId)" -ForegroundColor Gray
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/bookings/owner - Get Owner's Bookings" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/owner" -Method GET -Headers $ownerHeaders
    
    if ($response.Count -lt 1) {
        throw "Expected at least 1 booking"
    }
    Write-Host "  Found $($response.Count) booking(s)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/bookings/provider - Get Provider's Bookings" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/provider" -Method GET -Headers $providerHeaders
    
    if ($response.Count -lt 1) {
        throw "Expected at least 1 booking"
    }
    Write-Host "  Found $($response.Count) booking(s)" -ForegroundColor Gray
}

Test-Endpoint "PATCH /api/bookings/:id/status - Update to ACCEPTED" {
    if (-not $script:bookingId) {
        throw "Booking ID not available"
    }
    
    $body = @{ status = "ACCEPTED" } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$($script:bookingId)/status" -Method PATCH -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
}

Test-Endpoint "PATCH /api/bookings/:id/status - Update to IN_PROGRESS" {
    $body = @{ status = "IN_PROGRESS" } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$($script:bookingId)/status" -Method PATCH -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
}

Test-Endpoint "PATCH /api/bookings/:id/status - Update to COMPLETED" {
    $body = @{ status = "COMPLETED" } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/bookings/$($script:bookingId)/status" -Method PATCH -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    Write-Host "  Status: $($response.status)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 5: Invoice Module (3 endpoints)
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 5: Invoice Module ---" -ForegroundColor Magenta

$script:invoiceId = $null

Test-Endpoint "POST /api/invoices - Create Invoice (Provider)" {
    if (-not $script:bookingId) {
        throw "Booking ID not available"
    }
    
    $body = @{
        bookingId = $script:bookingId
        items     = @(
            @{ name = "Oil Change"; price = 49.99; quantity = 1 }
            @{ name = "Oil Filter"; price = 15.00; quantity = 1 }
        )
    } | ConvertTo-Json -Depth 3
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/invoices" -Method POST -Body $body -Headers $providerHeaders -ContentType "application/json"
    
    $script:invoiceId = $response.id
    Write-Host "  Invoice ID: $($script:invoiceId)" -ForegroundColor Gray
    Write-Host "  Amount: `$$($response.amount)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/invoices/:id - Get Invoice by ID (Owner)" {
    if (-not $script:invoiceId) {
        throw "Invoice ID not available"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/invoices/$($script:invoiceId)" -Method GET -Headers $ownerHeaders
    
    Write-Host "  Amount: `$$($response.amount)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/invoices - Get Provider's Invoices" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/invoices" -Method GET -Headers $providerHeaders
    
    if ($response.Count -lt 1) {
        throw "Expected at least 1 invoice"
    }
    Write-Host "  Found $($response.Count) invoice(s)" -ForegroundColor Gray
}

Test-Endpoint "GET /api/invoices - Get Owner's Invoices" {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/invoices" -Method GET -Headers $ownerHeaders
    
    if ($response.Count -lt 1) {
        throw "Expected at least 1 invoice"
    }
    Write-Host "  Found $($response.Count) invoice(s)" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# STEP 6: Cleanup and Additional Tests
#═══════════════════════════════════════════════════════════
Write-Host "`n--- STEP 6: Cleanup and Validation ---" -ForegroundColor Magenta

Test-Endpoint "DELETE /api/providers/services/:id - Remove Service" {
    if (-not $script:serviceId) {
        throw "Service ID not available"
    }
    
    Invoke-RestMethod -Uri "$baseUrl/api/providers/services/$($script:serviceId)" -Method DELETE -Headers $providerHeaders | Out-Null
    
    Write-Host "  Service deleted" -ForegroundColor Gray
}

Test-Endpoint "DELETE /api/vehicles/:id - Delete Vehicle (Owner)" {
    if (-not $script:vehicleId) {
        throw "Vehicle ID not available"
    }
    
    Invoke-RestMethod -Uri "$baseUrl/api/vehicles/$($script:vehicleId)" -Method DELETE -Headers $ownerHeaders | Out-Null
    
    Write-Host "  Vehicle deleted" -ForegroundColor Gray
}

#═══════════════════════════════════════════════════════════
# Test Results Summary
#═══════════════════════════════════════════════════════════
Write-Host "`n================================================================" -ForegroundColor Cyan
Write-Host "                    TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$passRate = if ($testResults.Total -gt 0) { 
    [math]::Round(($testResults.Passed / $testResults.Total) * 100, 2) 
}
else { 0 }

Write-Host "`nTotal Tests:  $($testResults.Total)" -ForegroundColor White
Write-Host "Passed:       $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed:       $($testResults.Failed)" -ForegroundColor $(if ($testResults.Failed -eq 0) { "Green" } else { "Red" })
Write-Host "Pass Rate:    $passRate%`n" -ForegroundColor $(if ($passRate -eq 100) { "Green" } elseif ($passRate -ge 80) { "Yellow" } else { "Red" })

if ($testResults.Failed -eq 0) {
    Write-Host "All tests passed successfully!" -ForegroundColor Green
}
else {
    Write-Host "Some tests failed. Review the output above for details." -ForegroundColor Yellow
}

Write-Host ""
