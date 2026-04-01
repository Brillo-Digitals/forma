const fs = require('fs');

try {
  const xml = fs.readFileSync('c:/React Project/Forma/formadocx/word/document.xml', 'utf8');
  let text = xml.replace(/<w:p[^>]*>/g, '\n\n'); // Add double newline on paragraph start
  text = text.replace(/<[^>]+>/g, ''); // Remove all other xml tags
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  fs.writeFileSync('c:/React Project/Forma/FORMA_Build_Prompt.txt', text);
  console.log('Successfully generated text file');
} catch (e) {
  console.error('Error:', e);
}
