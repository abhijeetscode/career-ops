import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    console.log('Navigating to job posting...');
    await page.goto('https://jobs.workable.com/view/qBZNsYu4Re4QZyELkhcCBY/hybrid-ai-architect-in-london-at-legatics', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    // Wait a bit for JS to render
    await page.waitForTimeout(2000);
    
    // Get full text content
    const text = await page.innerText('body');
    console.log(text);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
