/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Paths
const resumeJsonPath = path.join(__dirname, '../public/resume.json');
// Path to local wrangler executable
const wranglerPath = path.join(__dirname, '../node_modules/.bin/wrangler');

async function uploadToCloudflare() {
  try {
    // Load the resume data to get the PDF path
    const resumeData = JSON.parse(fs.readFileSync(resumeJsonPath, 'utf8'));

    // Get the PDF filename from the cvPdf URL or use default
    let pdfFilename = 'CV_AnhBui_FullStackDev.pdf';

    if (resumeData.basics.cvPdf) {
      // Extract just the filename from the URL or path
      const urlParts = resumeData.basics.cvPdf.split('/');
      pdfFilename = urlParts[urlParts.length - 1];
    }

    // Path in root directory
    const pdfPath = path.join(__dirname, '..', pdfFilename);

    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`Error: PDF file not found at ${pdfPath}. Generate it first using 'yarn generate-cv'`);
      process.exit(1);
    }

    // Check for required environment variables
    const requiredEnvVars = ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'R2_BUCKET_NAME'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
      console.error('Please set these variables in a .env file or export them in your shell.');
      process.exit(1);
    }

    // Upload using wrangler CLI
    console.log(`Uploading PDF from ${pdfPath} to Cloudflare R2...`);

    const bucketName = process.env.R2_BUCKET_NAME;
    // Format the object path correctly as {bucket}/{key} and use local wrangler
    // Add --remote flag to ensure connection to actual Cloudflare account
    const command = `"${wranglerPath}" r2 object put "${bucketName}/${pdfFilename}" --file "${pdfPath}" --remote`;

    console.log(`Executing command: ${command}`);
    const { stdout, stderr } = await execPromise(command);

    if (stderr && !stderr.includes('Upload complete')) {
      console.error('Error during upload:', stderr);
      process.exit(1);
    }

    console.log('Upload successful!');
    console.log(stdout);

  } catch (error) {
    console.error('Error uploading to Cloudflare R2:', error);
    process.exit(1);
  }
}

// Run the upload
uploadToCloudflare();
