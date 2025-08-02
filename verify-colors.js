// Color contrast verification script
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h * 12) % 12;
    return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  };
  
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(...color1);
  const lum2 = getLuminance(...color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Mojo Code brand colors (HSL values from our CSS)
const brandPrimary = hslToRgb(15, 85, 45); // Orange-red - darker for accessibility
const brandSecondary = hslToRgb(210, 25, 25); // Dark blue-gray
const brandAccent = hslToRgb(35, 85, 35); // Golden accent - darker for accessibility
const white = [255, 255, 255];
const black = [23, 23, 23]; // Near black for better readability

console.log('🎨 Mojo Code Color Contrast Analysis');
console.log('=====================================');

const tests = [
  { name: 'Primary on White', colors: [brandPrimary, white] },
  { name: 'White on Primary', colors: [white, brandPrimary] },
  { name: 'Secondary on White', colors: [brandSecondary, white] },
  { name: 'White on Secondary', colors: [white, brandSecondary] },
  { name: 'Accent on White', colors: [brandAccent, white] },
  { name: 'Black on Accent', colors: [black, brandAccent] },
];

tests.forEach(test => {
  const ratio = getContrastRatio(test.colors[0], test.colors[1]);
  const passAA = ratio >= 4.5;
  const passAAA = ratio >= 7;
  
  console.log(`${test.name}: ${ratio.toFixed(2)}:1 ${passAA ? '✅ AA' : '❌ AA'} ${passAAA ? '✅ AAA' : '❌ AAA'}`);
});

console.log('\n📊 Summary:');
console.log('- AA Standard: 4.5:1 (minimum for normal text)');
console.log('- AAA Standard: 7:1 (enhanced contrast)');
console.log('- All combinations should pass AA for accessibility compliance');