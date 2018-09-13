// Generate required css
import iconFont from '../assets/fonts/EotESymbol-Regular-PLUS.otf';
const iconFontStyles = `@font-face {
  src: url(${iconFont});
  font-family: EotESymbol;
}`;

// Create stylesheet
const style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet) {
  style.styleSheet.cssText = iconFontStyles;
} else {
  style.appendChild(document.createTextNode(iconFontStyles));
}

// Inject stylesheet
document.head.appendChild(style);
