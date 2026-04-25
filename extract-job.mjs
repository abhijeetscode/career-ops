import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://adsquare.jobs.personio.de/job/2573280?apply', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Wait a bit for dynamic content to load
    await page.waitForTimeout(2000);
    
    // Get the full page content
    const content = await page.content();
    console.log(content);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
