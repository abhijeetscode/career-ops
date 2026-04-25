import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    await page.goto('https://adsquare.jobs.personio.de/job/2573280?apply', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    // Extract job details using JavaScript in the page context
    const jobData = await page.evaluate(() => {
      const result = {
        title: '',
        company: '',
        location: '',
        description: '',
        responsibilities: [],
        requirements: [],
        qualifications: [],
        salary: '',
        employmentType: '',
        postingDate: '',
        fullText: ''
      };
      
      // Get all text content
      const allText = document.body.innerText;
      result.fullText = allText;
      
      // Try to extract title from h1
      const h1 = document.querySelector('h1');
      if (h1) result.title = h1.innerText;
      
      // Try to extract company info
      const companyElements = document.querySelectorAll('[data-testid*="company"], .company-name, h2');
      for (let el of companyElements) {
        if (el.innerText && !result.company) {
          result.company = el.innerText;
        }
      }
      
      // Extract location
      const locationElements = document.querySelectorAll('[data-testid*="location"], .location, [class*="location"]');
      if (locationElements.length > 0) {
        result.location = locationElements[0].innerText;
      }
      
      return result;
    });
    
    console.log(JSON.stringify(jobData, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
