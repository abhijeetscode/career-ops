import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Remove the ?apply parameter to get the job description page
    await page.goto('https://adsquare.jobs.personio.de/job/2573280', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Extract all text content
    const pageText = await page.innerText('body');
    console.log(pageText);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
