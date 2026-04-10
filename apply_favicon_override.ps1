$imagePath = 'C:\Users\luis.canadilla\.gemini\antigravity\brain\315a0f08-fbcd-41b9-aca5-c0adc84e1478\media__1775820469006.png'
$layoutPath = 'c:\Users\luis.canadilla\paddockplan\app\layout.tsx'

# 1. Convert image to Base64
$bytes = [IO.File]::ReadAllBytes($imagePath)
$base64String = [Convert]::ToBase64String($bytes)
$dataUrl = "data:image/png;base64,$($base64String)?v=2"

# 2. Read layout.tsx
$content = [IO.File]::ReadAllText($layoutPath)

# 3. Technical Override: Remove existing icons metadata
# Using regex to remove icons: { ... }
$content = $content -replace '(?s)icons:\s*\{.*?\},\s*', ''

# 4. Header Injection: Add <head> block after <html> tag
$faviconLink = "      <head>`n        <link rel=`"icon`" type=`"image/png`" href=`"$dataUrl`" />`n      </head>"

if ($content -match '<html') {
    $content = $content -replace '(<html[^>]*>)', "`$1`n$faviconLink"
}

# 5. Save the result
[IO.File]::WriteAllText($layoutPath, $content)

Write-Host "Successfully applied favicon technical override with cache busting ?v=2"
