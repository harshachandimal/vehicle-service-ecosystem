param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$StopOnFail
)

$script:Pass = 0
$script:Fail = 0
$script:Skip = 0

function Write-Header([string]$Title) {
    Write-Host ""
    Write-Host "----------------------------------------------" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "----------------------------------------------" -ForegroundColor Cyan
}

function Invoke-Test {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Body,
        [string]$Token,
        [int[]]$ExpectStatus = @(200, 201)
    )

    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) { $headers["Authorization"] = "Bearer $Token" }

    $iwrParams = @{
        Uri             = $Url
        Method          = $Method
        Headers         = $headers
        ErrorAction     = "Stop"
        UseBasicParsing = $true
    }
    if ($Body) {
        $iwrParams["Body"] = ($Body | ConvertTo-Json -Depth 10)
    }

    $statusCode = 0
    $responseBody = $null

    try {
        $response = Invoke-WebRequest @iwrParams
        $statusCode = [int]$response.StatusCode
        $responseBody = $response.Content
    }
    catch {
        if ($_.Exception.Response) {
            $statusCode = [int]$_.Exception.Response.StatusCode
            try {
                $stream = $_.Exception.Response.GetResponseStream()
                $reader = [System.IO.StreamReader]::new($stream)
                $responseBody = $reader.ReadToEnd()
            }
            catch {}
        }
    }

    if ($ExpectStatus -contains $statusCode) {
        Write-Host "  [PASS] $Name  ($statusCode)" -ForegroundColor Green
        $script:Pass++
    }
    else {
        Write-Host "  [FAIL] $Name  (got $statusCode, expected $($ExpectStatus -join '|'))" -ForegroundColor Red
        if ($responseBody) {
            Write-Host "         $responseBody" -ForegroundColor DarkRed
        }
        $script:Fail++
        if ($StopOnFail) { exit 1 }
    }

    if ($responseBody) {
        return ($responseBody | ConvertFrom-Json -ErrorAction SilentlyContinue)
    }
    return $null
}

$run = (Get-Date -Format "yyMMddHHmmss")

$ownerToken = $null
$providerToken = $null
$providerUserId = $null
$vehicleId = $null
$bookingId = $null
$serviceItemId = $null
$invoiceId = $null
$providerProfileId = $null

# -----------------------------------------------
Write-Header "1. Health Check"
# -----------------------------------------------

Invoke-Test -Name "GET /health" `
    -Method GET `
    -Url "$BaseUrl/health" | Out-Null

# -----------------------------------------------
Write-Header "2. Auth - Register and Login"
# -----------------------------------------------

$ownerEmail = "owner_$run@test.com"
$providerEmail = "provider_$run@test.com"

Invoke-Test -Name "POST /api/auth/register (owner)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/register" `
    -Body @{ email = $ownerEmail; password = "Password1!"; name = "Test Owner $run"; role = "OWNER" } `
    -ExpectStatus @(200, 201) | Out-Null

Invoke-Test -Name "POST /api/auth/register-business (provider)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/register-business" `
    -Body @{
    email         = $providerEmail
    password      = "Password1!"
    name          = "Test Provider $run"
    businessName  = "Test Garage $run"
    category      = "GARAGE"
    phone         = "0771234567"
    streetAddress = "123 Test Lane"
} `
    -ExpectStatus @(200, 201) | Out-Null

$ownerLogin = Invoke-Test -Name "POST /api/auth/login (owner)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/login" `
    -Body @{ email = $ownerEmail; password = "Password1!" }

if ($ownerLogin) { $ownerToken = $ownerLogin.token }

$providerLogin = Invoke-Test -Name "POST /api/auth/login (provider)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/login" `
    -Body @{ email = $providerEmail; password = "Password1!" }

if ($providerLogin) {
    $providerToken = $providerLogin.token
    $providerUserId = $providerLogin.user.id
}

if (-not $ownerToken) { Write-Host "  [WARN] Owner token missing" -ForegroundColor Yellow }
if (-not $providerToken) { Write-Host "  [WARN] Provider token missing" -ForegroundColor Yellow }

# -----------------------------------------------
Write-Header "2b. Auth - Forgot & Reset Password"
# -----------------------------------------------

$resetResult = Invoke-Test -Name "POST /api/auth/forgot-password (valid email)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/forgot-password" `
    -Body @{ email = $ownerEmail } `
    -ExpectStatus @(200)

$resetToken = $null
if ($resetResult) { $resetToken = $resetResult.resetToken }

Invoke-Test -Name "POST /api/auth/forgot-password (unknown email -> 200 no enum)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/forgot-password" `
    -Body @{ email = "nobody_$run@test.com" } `
    -ExpectStatus @(200) | Out-Null

Invoke-Test -Name "POST /api/auth/reset-password (invalid token -> 400)" `
    -Method POST `
    -Url "$BaseUrl/api/auth/reset-password" `
    -Body @{ token = "bogustoken123"; newPassword = "NewPass1!" } `
    -ExpectStatus @(400) | Out-Null

if ($resetToken) {
    Invoke-Test -Name "POST /api/auth/reset-password (valid token)" `
        -Method POST `
        -Url "$BaseUrl/api/auth/reset-password" `
        -Body @{ token = $resetToken; newPassword = "NewPassword1!" } `
        -ExpectStatus @(200) | Out-Null

    $newOwnerLogin = Invoke-Test -Name "POST /api/auth/login (with new password after reset)" `
        -Method POST `
        -Url "$BaseUrl/api/auth/login" `
        -Body @{ email = $ownerEmail; password = "NewPassword1!" } `
        -ExpectStatus @(200)

    if ($newOwnerLogin) { $ownerToken = $newOwnerLogin.token }
}
else {
    Write-Host "  [SKIP] Reset password tests -- resetToken not returned" -ForegroundColor Yellow
    $script:Skip += 2
}

# -----------------------------------------------
Write-Header "3. Vehicles"
# -----------------------------------------------

$newVehicle = Invoke-Test -Name "POST /api/vehicles (add vehicle)" `
    -Method POST `
    -Url "$BaseUrl/api/vehicles" `
    -Token $ownerToken `
    -Body @{ make = "Toyota"; model = "Corolla"; year = 2020; licensePlate = "CAR-$run" } `
    -ExpectStatus @(200, 201)

if ($newVehicle) { $vehicleId = $newVehicle.id }

Invoke-Test -Name "GET /api/vehicles (list owner vehicles)" `
    -Method GET `
    -Url "$BaseUrl/api/vehicles" `
    -Token $ownerToken | Out-Null

Invoke-Test -Name "GET /api/vehicles (no token -> 401)" `
    -Method GET `
    -Url "$BaseUrl/api/vehicles" `
    -ExpectStatus @(401) | Out-Null

# -----------------------------------------------
Write-Header "4. Providers"
# -----------------------------------------------

$myProfile = Invoke-Test -Name "GET /api/providers/me (provider profile)" `
    -Method GET `
    -Url "$BaseUrl/api/providers/me" `
    -Token $providerToken

if ($myProfile -and $myProfile.profile) { $providerProfileId = $myProfile.profile.id }

Invoke-Test -Name "PUT /api/providers/profile (update profile)" `
    -Method PUT `
    -Url "$BaseUrl/api/providers/profile" `
    -Token $providerToken `
    -Body @{ businessName = "Updated Garage $run"; category = "GARAGE"; streetAddress = "456 New St" } | Out-Null

$newService = Invoke-Test -Name "POST /api/providers/services (add service)" `
    -Method POST `
    -Url "$BaseUrl/api/providers/services" `
    -Token $providerToken `
    -Body @{ name = "Oil Change"; price = 2500; description = "Full synthetic oil change" } `
    -ExpectStatus @(200, 201)

if ($newService) { $serviceItemId = $newService.id }

if ($providerProfileId) {
    Invoke-Test -Name "GET /api/providers/:id (public, by profile ID)" `
        -Method GET `
        -Url "$BaseUrl/api/providers/$providerProfileId" | Out-Null
}
else {
    Write-Host "  [SKIP] GET /api/providers/:id -- providerProfileId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

# -----------------------------------------------
Write-Header "5. Bookings"
# -----------------------------------------------

if ($vehicleId -and $providerUserId) {
    $newBooking = Invoke-Test -Name "POST /api/bookings (create booking)" `
        -Method POST `
        -Url "$BaseUrl/api/bookings" `
        -Token $ownerToken `
        -Body @{
        vehicleId   = $vehicleId
        providerId  = $providerUserId
        description = "Routine service"
        serviceDate = (Get-Date).AddDays(3).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    } `
        -ExpectStatus @(200, 201)

    if ($newBooking) { $bookingId = $newBooking.id }
}
else {
    Write-Host "  [SKIP] POST /api/bookings -- vehicleId or providerUserId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

Invoke-Test -Name "GET /api/bookings/owner (owner bookings)" `
    -Method GET `
    -Url "$BaseUrl/api/bookings/owner" `
    -Token $ownerToken | Out-Null

Invoke-Test -Name "GET /api/bookings/provider (provider bookings)" `
    -Method GET `
    -Url "$BaseUrl/api/bookings/provider" `
    -Token $providerToken | Out-Null

if ($bookingId) {
    Invoke-Test -Name "PATCH /api/bookings/:id/status (ACCEPTED)" `
        -Method PATCH `
        -Url "$BaseUrl/api/bookings/$bookingId/status" `
        -Token $providerToken `
        -Body @{ status = "ACCEPTED" } | Out-Null

    Invoke-Test -Name "PATCH /api/bookings/:id/status (IN_PROGRESS)" `
        -Method PATCH `
        -Url "$BaseUrl/api/bookings/$bookingId/status" `
        -Token $providerToken `
        -Body @{ status = "IN_PROGRESS" } | Out-Null

    Invoke-Test -Name "PATCH /api/bookings/:id/status (COMPLETED)" `
        -Method PATCH `
        -Url "$BaseUrl/api/bookings/$bookingId/status" `
        -Token $providerToken `
        -Body @{ status = "COMPLETED" } | Out-Null
}
else {
    Write-Host "  [SKIP] PATCH /api/bookings/:id/status -- bookingId unavailable" -ForegroundColor Yellow
    $script:Skip += 3
}

# -----------------------------------------------
Write-Header "6. Invoices"
# -----------------------------------------------

if ($bookingId) {
    $newInvoice = Invoke-Test -Name "POST /api/invoices (create invoice)" `
        -Method POST `
        -Url "$BaseUrl/api/invoices" `
        -Token $providerToken `
        -Body @{
        bookingId = $bookingId
        items     = @(
            @{ description = "Labour"; price = 1500; quantity = 1 }
            @{ description = "Parts"; price = 400; quantity = 2 }
        )
    } `
        -ExpectStatus @(200, 201)

    if ($newInvoice) { $invoiceId = $newInvoice.id }
}
else {
    Write-Host "  [SKIP] POST /api/invoices -- bookingId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

Invoke-Test -Name "GET /api/invoices (owner view)" `
    -Method GET `
    -Url "$BaseUrl/api/invoices" `
    -Token $ownerToken | Out-Null

Invoke-Test -Name "GET /api/invoices (provider view)" `
    -Method GET `
    -Url "$BaseUrl/api/invoices" `
    -Token $providerToken | Out-Null

if ($invoiceId) {
    Invoke-Test -Name "GET /api/invoices/:id (by ID)" `
        -Method GET `
        -Url "$BaseUrl/api/invoices/$invoiceId" `
        -Token $ownerToken | Out-Null
}
else {
    Write-Host "  [SKIP] GET /api/invoices/:id -- invoiceId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

# -----------------------------------------------
Write-Header "7. Cleanup - Remove service item and vehicle"
# -----------------------------------------------

if ($serviceItemId) {
    Invoke-Test -Name "DELETE /api/providers/services/:id" `
        -Method DELETE `
        -Url "$BaseUrl/api/providers/services/$serviceItemId" `
        -Token $providerToken `
        -ExpectStatus @(200, 204) | Out-Null
}
else {
    Write-Host "  [SKIP] DELETE /api/providers/services/:id -- serviceItemId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

if ($vehicleId) {
    Invoke-Test -Name "DELETE /api/vehicles/:id" `
        -Method DELETE `
        -Url "$BaseUrl/api/vehicles/$vehicleId" `
        -Token $ownerToken `
        -ExpectStatus @(200, 204) | Out-Null
}
else {
    Write-Host "  [SKIP] DELETE /api/vehicles/:id -- vehicleId unavailable" -ForegroundColor Yellow
    $script:Skip++
}

# -----------------------------------------------
Write-Header "Results"
# -----------------------------------------------

$total = $script:Pass + $script:Fail + $script:Skip

Write-Host ""
Write-Host "  Total : $total"         -ForegroundColor White
Write-Host "  Pass  : $($script:Pass)" -ForegroundColor Green

if ($script:Fail -gt 0) {
    Write-Host "  Fail  : $($script:Fail)" -ForegroundColor Red
}
else {
    Write-Host "  Fail  : $($script:Fail)" -ForegroundColor Green
}

Write-Host "  Skip  : $($script:Skip)" -ForegroundColor Yellow
Write-Host ""

if ($script:Fail -gt 0) {
    Write-Host "  FAILED -- Some tests did not pass." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "  PASSED -- All executed tests passed!" -ForegroundColor Green
    exit 0
}
