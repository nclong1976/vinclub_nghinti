const fs = require('fs');
const path = require('path');

const files = [
  'WelfareConsultationView.tsx',
  'WelfareEducationView.tsx',
  'WelfareMedicalView.tsx',
  'WelfareResortView.tsx',
  'WelfareShoppingView.tsx',
  'WelfareVinhomesView.tsx',
  'InvestmentReasonsView.tsx',
  'VinpearlInvestView.tsx',
  'VinpearlProjectDetailView.tsx',
  'VinpearlProjectsView.tsx'
].map(f => path.join(__dirname, 'src/components', f));

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content
      .replace(/#0055c8/gi, '#b8860b')
      .replace(/#f2f6ff/gi, '#fcfaf5')
      .replace(/#3E97FF/gi, '#b8860b')
      .replace(/#abc7ff/gi, '#d4a373')
      .replace(/#e0a96d/gi, '#b8860b')
      .replace(/#191c1e/gi, '#001839') // Make dark text match navy
      .replace(/#43474f/gi, '#334155'); // Soften gray
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});
