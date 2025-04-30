/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const PDFDocument = require('pdfkit');

// Paths
const resumeJsonPath = path.join(__dirname, '../public/resume.json');

// Function to generate PDF
async function generatePDF() {
  console.log('Generating PDF from resume.json...');

  try {
    // Load the resume data
    const resumeData = JSON.parse(fs.readFileSync(resumeJsonPath, 'utf8'));

    // Get the PDF filename from the cvPdf URL or use default
    let pdfFilename = 'CV_AnhBui_FullStackDev.pdf';

    if (resumeData.basics.cvPdf) {
      // Extract just the filename from the URL or path
      const urlParts = resumeData.basics.cvPdf.split('/');
      pdfFilename = urlParts[urlParts.length - 1];
    }

    // Save to root directory
    const outputPdfPath = path.join(__dirname, '..', pdfFilename);

    console.log(`Will save PDF to: ${outputPdfPath}`);

    // Create a document
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, left: 60, right: 60, bottom: 50 },
      info: {
        Title: `${resumeData.basics.name} - CV`,
        Author: resumeData.basics.name,
        Creator: 'PDFKit',
        Producer: 'PDFKit'
      }
    });

    // Pipe the PDF to the output file
    doc.pipe(fs.createWriteStream(outputPdfPath));

    // Helper function to add a section header
    const addSectionHeader = (text) => {
      doc.font('Helvetica-Bold')
         .fillColor('#000000')
         .fontSize(14)
         .text(text.toUpperCase())
         .moveDown(0.5);
    };

    // Name with blue color at the top
    doc.font('Helvetica-Bold')
       .fillColor('#3366CC')
       .fontSize(22)
       .text(resumeData.basics.name)
       .moveDown(0.2);

    // Job title
    doc.font('Helvetica-Bold')
       .fillColor('#000000')
       .fontSize(14)
       .text(resumeData.basics.label)
       .moveDown(0.5);

    // Contact info
    doc.font('Helvetica')
       .fontSize(10)
       .text(`Phone: ${resumeData.basics.phone}`)
       .moveDown(0.2);

    doc.text(`Email: ${resumeData.basics.email}`)
       .moveDown(0.2);

    // LinkedIn (get from profiles)
    const linkedinProfile = resumeData.basics.profiles.find(p => p.network.toLowerCase() === 'linkedin');
    if (linkedinProfile) {
      doc.text(`LinkedIn: `, { continued: true })
         .fillColor('#0077B5')
         .text(linkedinProfile.url, { link: linkedinProfile.url })
         .fillColor('#000000')
         .moveDown(1);
    }

    // SUMMARY section
    addSectionHeader('Summary');
    doc.font('Helvetica')
       .fontSize(10)
       .text(resumeData.basics.summary, { align: 'justify' })
       .moveDown(1.5);

    // SKILLS section
    addSectionHeader('Skills');

    // Programming Languages
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Programming Languages:')
       .moveDown(0.3);

    // Get programming languages skill
    const programmingSkill = resumeData.skills.find(s => s.name === 'Programming Languages');
    if (programmingSkill) {
      programmingSkill.keywords.forEach(lang => {
        doc.font('Helvetica')
           .fontSize(10)
           .text(`- ${lang}`, { indent: 20 })
           .moveDown(0.2);
      });
    }

    // Frameworks/Platforms
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Frameworks/ Platforms:')
       .moveDown(0.3);

    const frameworksSkill = resumeData.skills.find(s => s.name === 'Frameworks/ Platforms');
    if (frameworksSkill) {
      frameworksSkill.keywords.forEach(framework => {
        doc.font('Helvetica')
           .fontSize(10)
           .text(`- ${framework}`, { indent: 20 })
           .moveDown(0.2);
      });
    }

    // Database Management Systems
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Database Management Systems:')
       .moveDown(0.3);

    const dbSkill = resumeData.skills.find(s => s.name === 'Database Management System');
    if (dbSkill) {
      dbSkill.keywords.forEach(db => {
        doc.font('Helvetica')
           .fontSize(10)
           .text(`- ${db}`, { indent: 20 })
           .moveDown(0.2);
      });
    }

    // Version Control
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Version Control:')
       .moveDown(0.3);

    const vcsSkill = resumeData.skills.find(s => s.name === 'Version Control');
    if (vcsSkill) {
      vcsSkill.keywords.forEach(vcs => {
        doc.font('Helvetica')
           .fontSize(10)
           .text(`- ${vcs}`, { indent: 20 })
           .moveDown(0.2);
      });
    }

    // Foreign Languages
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Foreign Languages:')
       .moveDown(0.3);

    const langSkill = resumeData.skills.find(s => s.name === 'Foreign Language');
    if (langSkill) {
      langSkill.keywords.forEach(lang => {
        doc.font('Helvetica')
           .fontSize(10)
           .text(`- ${lang}`, { indent: 20 })
           .moveDown(0.2);
      });
    }

    // Others (additional skills)
    doc.moveDown(0.3);
    doc.font('Helvetica-Bold')
       .fontSize(10)
       .text('• Others:')
       .moveDown(0.3);

    doc.font('Helvetica')
       .fontSize(10)
       .text('- Good understanding of OOP methodologies, SOLID principles, design patterns', { indent: 20 })
       .moveDown(0.2);

    doc.text('- Experience with Agile and Scrum development process', { indent: 20 })
       .moveDown(0.2);

    // Add a new page for work experience
    doc.addPage();

    // WORK EXPERIENCE section
    addSectionHeader('Work Experience');

    // Helper function to format date
    const formatDate = (dateStr) => {
      if (dateStr === 'Current') return dateStr;

      const parts = dateStr.split('-');
      const year = parts[0];

      // If no month is provided, just return the year
      if (!parts[1] || parts[1].trim() === '') return year;

      // Convert numeric month to text
      const monthNum = parseInt(parts[1], 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[monthNum - 1]; // months are 0-indexed in JS arrays

      return `${month} ${year}`;
    };

    // Sort work experiences by startDate in descending order
    const sortedWork = [...resumeData.work].sort((a, b) => {
      return new Date(b.startDate) - new Date(a.startDate);
    });

    sortedWork.forEach((job, index) => {
      // Job title and date on the same line
      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text('Full Stack Developer', { continued: true });

      // Get date range, right-aligned
      const startDate = formatDate(job.startDate);
      const endDate = formatDate(job.endDate);
      const dateRange = `${startDate} - ${endDate}`;

      const textWidth = doc.widthOfString('Full Stack Developer');
      const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const startX = doc.page.margins.left + textWidth;
      const remainingSpace = pageWidth - textWidth;

      doc.text(dateRange, { align: 'right' })
         .moveDown(0.2);

      // Company name
      doc.font('Helvetica-Bold')
         .fontSize(11)
         .text(job.name)
         .moveDown(0.2);

      // Project info if available
      if (job.projects && job.projects.length > 0) {
        // Add a single "Projects" heading
        doc.font('Helvetica-Bold')
           .text('Projects:')
           .moveDown(0.2);

        // Display each project
        job.projects.forEach((project, idx) => {
          // Project name in bold, indented
          doc.font('Helvetica-Bold')
             .text(`- ${project.name}`, { indent: 20 })
             .moveDown(0.2);

          // If project has a summary, show it
          if (project.summary) {
            doc.font('Helvetica')
               .fontSize(10)
               .text(project.summary, { indent: 30, align: 'justify' })
               .moveDown(0.2);
          }

          // If project has a team size different from the job, show it
          if (project.teamSize && project.teamSize !== job.teamSize) {
            doc.font('Helvetica')
               .fontSize(10)
               .text(`Team size: ${project.teamSize}`, { indent: 30 })
               .moveDown(0.2);
          }

          // If project has keywords/technologies
          if (project.keywords && project.keywords.length > 0) {
            doc.font('Helvetica-Bold')
               .fontSize(10)
               .text('Technologies: ', { indent: 30, continued: true })
               .font('Helvetica')
               .text(project.keywords.join(', '))
               .moveDown(0.3);
          }
        });
      }

      // Description
      doc.font('Helvetica-Bold')
         .text('Description: ', { continued: true })
         .font('Helvetica')
         .text(job.summary, { align: 'justify' })
         .moveDown(0.3);

      // Team size
      doc.font('Helvetica-Bold')
         .text('Team size: ', { continued: true })
         .font('Helvetica')
         .text(job.teamSize.toString())
         .moveDown(0.3);

      // Responsibilities
      doc.font('Helvetica-Bold')
         .text('Responsibilities:')
         .moveDown(0.3);

      // Highlights as bullet points
      if (job.highlights && job.highlights.length > 0) {
        job.highlights.forEach(highlight => {
          doc.font('Helvetica')
             .fontSize(10)
             .text(`- ${highlight.description}`, { indent: 20, align: 'justify' })
             .moveDown(0.2);
        });
      }

      doc.moveDown(1);
    });

    // EDUCATION section
    addSectionHeader('Education');

    if (resumeData.education && resumeData.education.length > 0) {
      const edu = resumeData.education[0]; // Get the first education entry

      doc.font('Helvetica-Bold')
         .fontSize(12)
         .text(`${edu.studyType} in ${edu.area}`, { continued: true });

      // Date range, right-aligned
      const eduStartDate = formatDate(edu.startDate);
      const eduEndDate = formatDate(edu.endDate);
      const eduDateRange = `${eduStartDate} - ${eduEndDate}`;

      doc.text(eduDateRange, { align: 'right' })
         .moveDown(0.3);

      doc.font('Helvetica')
         .fontSize(10)
         .text(edu.institution)
         .moveDown(0.3);

      // GPA
      doc.text(`GPA: ${edu.score}`)
         .moveDown(1);
    }

    // TRAINING & CERTIFICATE section
    addSectionHeader('Training & Certificate');

    if (resumeData.certificates && resumeData.certificates.length > 0) {
      // Track the current vertical position
      let currentY = doc.y + 10;

      resumeData.certificates.forEach(cert => {
        // Date formatting
        const certDate = cert.date ? new Date(cert.date) : null;
        let dateText = '';

        if (certDate) {
          const month = certDate.toLocaleString('en-us', { month: 'short' });
          const year = certDate.getFullYear();
          dateText = `${month} ${year}`;
        }

        // Save current state to restore after this certificate entry
        const originalX = doc.x;
        const originalY = doc.y;

        // Set absolute positions for certificate name
        const leftMargin = doc.page.margins.left;
        const rightMargin = doc.page.margins.right;
        const pageWidth = doc.page.width - leftMargin - rightMargin;

        // Calculate positions
        const dateWidth = 70; // Reserve fixed width for date
        const nameWidth = pageWidth - dateWidth;

        // Draw the certificate name (left-aligned)
        if (cert.name.toLowerCase().includes('microsoft')) {
          doc.font('Helvetica-Bold')
             .fillColor('#0077B5');

          doc.text(cert.name, leftMargin, currentY, {
            width: nameWidth,
            continued: false,
            link: cert.url
          });

          doc.fillColor('#000000');
        } else {
          doc.font('Helvetica-Bold');

          doc.text(cert.name, leftMargin, currentY, {
            width: nameWidth,
            continued: false
          });
        }

        // Draw the date (right-aligned)
        doc.font('Helvetica');

        doc.text(dateText, leftMargin + nameWidth, currentY, {
          width: dateWidth,
          align: 'right',
          continued: false
        });

        // Move to the next line
        currentY += 25;

        // Restore position
        doc.x = originalX;
        doc.y = currentY;
      });

      // Add some space after certificates
      doc.moveDown(1);
    }

    // PROJECTS section
    addSectionHeader('Projects');

    if (resumeData.projects && resumeData.projects.length > 0) {
      resumeData.projects.forEach(project => {
        doc.font('Helvetica-Bold')
           .text(project.name)
           .moveDown(0.3);

        doc.font('Helvetica')
           .text(project.description, { align: 'justify' })
           .moveDown(0.3);

        // Add link if available
        if (project.url) {
          doc.text('Link: ', { continued: true })
             .fillColor('#0077B5')
             .text(project.url, { link: project.url })
             .fillColor('#000000');
        }

        doc.moveDown(1);
      });
    }

    // Finish the PDF
    doc.end();

    console.log('CV generated successfully!');
    console.log(`PDF saved to: ${outputPdfPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

// Watch mode
if (process.argv.includes('--watch')) {
  console.log('Watching for changes in resume.json...');

  // Watch the resume.json file for changes
  const watcher = chokidar.watch(resumeJsonPath, {
    persistent: true
  });

  watcher.on('change', () => {
    console.log('resume.json changed, regenerating PDF...');
    generatePDF();
  });

  // Initial generation
  generatePDF();
} else {
  // One-time generation
  generatePDF();
}
