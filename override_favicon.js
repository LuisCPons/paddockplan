const fs = require('fs');
const path = require('path');

const imagePath = 'C:\\Users\\luis.canadilla\\.gemini\\antigravity\\brain\\315a0f08-fbcd-41b9-aca5-c0adc84e1478\\media__1775820469006.png';
const layoutPath = 'c:\\Users\\luis.canadilla\\paddockplan\\app\\layout.tsx';

// 1. Convert image to Base64
const imageBuffer = fs.readFileSync(imagePath);
const base64String = imageBuffer.toString('base64');
const dataUrl = `data:image/png;base64,${base64String}?v=2`;

// 2. Read layout.tsx
let content = fs.readFileSync(layoutPath, 'utf8');

// 3. Technical Override: Remove existing icons metadata
// We look for the icons: { ... } block inside the metadata object
content = content.replace(/icons:\s*\{[\s\S]*?\},\s*/g, '');

// 4. Header Injection: Locate the return block and inject <head>
// We look for the <html ...> tag and inject <head> right after it, 
// or if <head> exists, we replace its content.
// In the current layout.tsx, there's no <head> tag inside <html>.

const faviconLink = `      <head>
        <link rel="icon" type="image/png" href="${dataUrl}" />
      </head>`;

if (content.includes('<html')) {
    // Find the end of the opening <html> tag
    content = content.replace(/(<html[^>]*>)/, `$1\n${faviconLink}`);
}

// 5. Save the result
fs.writeFileSync(layoutPath, content);
console.log('Successfully applied favicon technical override.');
