const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Paths
const resumeJsonPath = path.join(__dirname, '../public/resume.json');

// Palette mirrors the light theme of the web CV (src/styles/globals.css)
const COLOR = {
  text: '#333333',
  secondary: '#666666',
  link: '#005bc4',
  rule: '#c9d8ec',
};

const FONT = { regular: 'Helvetica', bold: 'Helvetica-Bold', italic: 'Helvetica-Oblique' };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const isCurrent = dateStr => !dateStr || dateStr.toLowerCase() === 'current';

// Same output as toFormatDateWithMonth in src/app/helper/time.ts
const formatDate = dateStr => {
  if (isCurrent(dateStr)) return 'Present';
  const [year, month] = dateStr.split('-');
  const monthIndex = parseInt(month, 10) - 1;
  return MONTHS[monthIndex] ? `${MONTHS[monthIndex]} ${year}` : year;
};

const formatRange = (start, end) => `${formatDate(start)} – ${formatDate(end)}`;

// Same logic as yearsSince in src/app/helper/time.ts
const yearsSince = (dateStr, now = new Date()) => {
  const start = new Date(dateStr);
  let years = now.getUTCFullYear() - start.getUTCFullYear();
  if (now.getUTCMonth() < start.getUTCMonth()) years -= 1;
  return Math.max(years, 0);
};

const formatLocation = location => {
  if (!location) return '';
  let country = location.countryCode;
  if (country) {
    try {
      country = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country;
    } catch {
      // keep the raw country code
    }
  }
  return [location.city, country].filter(Boolean).join(', ');
};

const stripProtocol = url => url.replace(/^https?:\/\/(www\.)?/, '');

const getPdfFilename = resumeData => {
  const cvPdf = resumeData.basics && resumeData.basics.cvPdf;
  return cvPdf ? cvPdf.split('/').pop() : 'CV_AnhBui.pdf';
};

function renderCv(doc, resumeData) {
  const { basics, work = [], skills = [], education = [], certificates = [] } = resumeData;
  const { projects = [], interests = [] } = resumeData;

  const left = doc.page.margins.left;
  const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pageBottom = () => doc.page.height - doc.page.margins.bottom;

  // Start a new page unless `height` more points fit on the current one,
  // so headings are never stranded at the bottom of a page.
  const ensureSpace = height => {
    if (doc.y + height > pageBottom()) doc.addPage();
  };

  const body = (text, options = {}) => {
    doc
      .font(options.font || FONT.regular)
      .fontSize(options.size || 9.5)
      .fillColor(options.color || COLOR.text)
      .text(text, left + (options.indent || 0), doc.y, {
        width: contentWidth - (options.indent || 0),
        lineGap: 1.5,
        link: options.link,
      });
  };

  const sectionHeading = title => {
    ensureSpace(60);
    doc.moveDown(0.9);
    doc.font(FONT.bold).fontSize(11).fillColor(COLOR.link);
    doc.text(title.toUpperCase(), left, doc.y, { characterSpacing: 0.8 });
    const y = doc.y + 2;
    doc
      .moveTo(left, y)
      .lineTo(left + contentWidth, y)
      .lineWidth(0.75)
      .strokeColor(COLOR.rule)
      .stroke();
    doc.y = y + 7;
  };

  // Title on the left, date (or other meta) right-aligned on the same line.
  const titleRow = (title, meta, options = {}) => {
    const size = options.size || 10.5;
    const indent = options.indent || 0;
    doc.font(FONT.regular).fontSize(9);
    const metaWidth = meta ? doc.widthOfString(meta) + 4 : 0;
    const y = doc.y;

    doc
      .font(FONT.bold)
      .fontSize(size)
      .fillColor(options.color || COLOR.text)
      .text(title, left + indent, y, {
        width: contentWidth - indent - metaWidth - 8,
        link: options.link,
      });
    const afterTitle = doc.y;

    if (meta) {
      doc
        .font(FONT.regular)
        .fontSize(9)
        .fillColor(COLOR.secondary)
        .text(meta, left + contentWidth - metaWidth, y + (size - 9) * 0.8, {
          width: metaWidth,
          align: 'right',
        });
    }
    doc.x = left;
    doc.y = afterTitle;
  };

  const bullet = (text, indent = 0) => {
    const y = doc.y;
    doc.font(FONT.regular).fontSize(9.5).fillColor(COLOR.text);
    doc.text('•', left + indent, y, { width: 10 });
    doc.text(text, left + indent + 10, y, { width: contentWidth - indent - 10, lineGap: 1.5 });
    doc.moveDown(0.15);
  };

  // "Label: a, b, c" with a bold label
  const labelled = (label, value, options = {}) => {
    const indent = options.indent || 0;
    doc
      .font(FONT.bold)
      .fontSize(9.5)
      .fillColor(COLOR.text)
      .text(`${label}: `, left + indent, doc.y, {
        width: contentWidth - indent,
        continued: true,
        lineGap: 1.5,
      })
      .font(FONT.regular)
      .text(value);
  };

  const subLabel = text => {
    doc.moveDown(0.35);
    doc.font(FONT.bold).fontSize(8.5).fillColor(COLOR.secondary);
    doc.text(text.toUpperCase(), left, doc.y, { characterSpacing: 0.6 });
    doc.moveDown(0.25);
  };

  // ---------- Header ----------
  doc.font(FONT.bold).fontSize(24).fillColor(COLOR.text).text(basics.name, left, doc.y);
  if (basics.label) {
    doc.font(FONT.bold).fontSize(13).fillColor(COLOR.link).text(basics.label);
  }
  doc.moveDown(0.35);

  // Derived from the earliest job so it never goes stale (same as the web CV)
  const starts = work
    .map(w => w.startDate)
    .filter(Boolean)
    .sort();
  const yoe = starts.length ? yearsSince(starts[0]) : basics.yoe;
  const meta = [
    formatLocation(basics.location),
    yoe !== undefined ? `${yoe}+ years of professional experience` : '',
  ].filter(Boolean);
  if (meta.length) body(meta.join('  ·  '), { color: COLOR.secondary, size: 9.5 });

  const contacts = [
    basics.email && { text: basics.email, link: `mailto:${basics.email}` },
    basics.phone && { text: basics.phone, link: `tel:${basics.phone.replace(/[^\d+]/g, '')}` },
    basics.url && { text: stripProtocol(basics.url), link: basics.url },
    ...(basics.profiles || []).map(p => ({ text: stripProtocol(p.url), link: p.url })),
  ].filter(Boolean);
  if (contacts.length) {
    doc.moveDown(0.2);
    doc.font(FONT.regular).fontSize(9.5);
    contacts.forEach((contact, index) => {
      const last = index === contacts.length - 1;
      doc.fillColor(COLOR.link).text(contact.text, {
        link: contact.link,
        continued: !last,
        width: contentWidth,
      });
      // `link: null` stops the separator inheriting the previous link
      if (!last) doc.fillColor(COLOR.secondary).text('  |  ', { link: null, continued: true });
    });
  }

  // ---------- Summary ----------
  if (basics.summary) {
    sectionHeading('Summary');
    body(basics.summary);
  }

  // ---------- Skills ----------
  if (skills.length) {
    sectionHeading('Skills');
    if (basics.topSkills && basics.topSkills.length) {
      labelled('Top skills', basics.topSkills.join(', '));
      doc.moveDown(0.2);
    }
    skills.forEach(skill => {
      if (!skill.keywords || !skill.keywords.length) return;
      labelled(skill.name, skill.keywords.join(', '));
      doc.moveDown(0.2);
    });
  }

  // ---------- Work experience ----------
  if (work.length) {
    sectionHeading('Work Experience');
    const sortedWork = [...work].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    sortedWork.forEach((job, index) => {
      if (index > 0) doc.moveDown(0.9);
      ensureSpace(90);

      titleRow(job.position || '', formatRange(job.startDate, job.endDate), { size: 11.5 });
      doc
        .font(FONT.bold)
        .fontSize(10)
        .fillColor(COLOR.link)
        .text(job.name || '', left, doc.y);
      if (job.summary) {
        doc.moveDown(0.2);
        body(job.summary, { font: FONT.italic, color: COLOR.secondary, size: 9 });
      }

      if (job.highlights && job.highlights.length) {
        subLabel('Key achievements');
        job.highlights.forEach(highlight => bullet(highlight.description));
      }

      if (job.projects && job.projects.length) {
        ensureSpace(50);
        subLabel('Projects');
        job.projects.forEach(project => {
          ensureSpace(36);
          const projectMeta = [
            project.startDate && formatRange(project.startDate, project.endDate),
            project.teamSize && `Team of ${project.teamSize}`,
          ]
            .filter(Boolean)
            .join(' · ');
          titleRow(project.name, projectMeta, { size: 9.5 });
          if (project.summary) body(project.summary);
          doc.moveDown(0.3);
        });
      }

      if (job.keywords && job.keywords.length) {
        doc.moveDown(0.15);
        labelled('Technologies', job.keywords.join(', '));
      }
    });
  }

  // ---------- Education ----------
  if (education.length) {
    sectionHeading('Education');
    education.forEach((edu, index) => {
      if (index > 0) doc.moveDown(0.6);
      titleRow(`${edu.studyType} in ${edu.area}`, formatRange(edu.startDate, edu.endDate));
      body(edu.institution, { font: FONT.bold, color: COLOR.link });
      if (edu.score) body(`GPA: ${edu.score}`);
    });
  }

  // ---------- Certifications ----------
  if (certificates.length) {
    sectionHeading('Certifications');
    certificates.forEach((cert, index) => {
      if (index > 0) doc.moveDown(0.5);
      titleRow(cert.name, cert.date ? formatDate(cert.date) : '', {
        link: cert.url,
        color: cert.url ? COLOR.link : COLOR.text,
      });
      if (cert.issuer) body(cert.issuer, { color: COLOR.secondary });
    });
  }

  // ---------- Projects ----------
  if (projects.length) {
    sectionHeading('Projects');
    projects.forEach((project, index) => {
      if (index > 0) doc.moveDown(0.6);
      ensureSpace(50);
      titleRow(
        project.name,
        project.startDate ? formatRange(project.startDate, project.endDate) : ''
      );
      if (project.roles && project.roles.length) {
        body(project.roles.join(', '), { font: FONT.bold, color: COLOR.link });
      }
      if (project.description) body(project.description);
      if (project.url) body(stripProtocol(project.url), { color: COLOR.link, link: project.url });
      if (project.keywords && project.keywords.length) {
        doc.moveDown(0.15);
        labelled('Technologies', project.keywords.join(', '));
      }
    });
  }

  // ---------- Interests ----------
  if (interests.length) {
    sectionHeading('Interests');
    body(
      interests
        .map(it =>
          it.keywords && it.keywords.length ? `${it.name} (${it.keywords.join(', ')})` : it.name
        )
        .join('  ·  ')
    );
  }
}

// Function to generate PDF
function generatePDF() {
  console.log('Generating PDF from resume.json...');

  return new Promise((resolve, reject) => {
    const resumeData = JSON.parse(fs.readFileSync(resumeJsonPath, 'utf8'));

    // Save into public/ so the PDF ships with the site as a static asset,
    // named after the file the Download button links to
    const outputPdfPath = path.join(__dirname, '../public', getPdfFilename(resumeData));

    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 46, left: 50, right: 50, bottom: 46 },
      info: {
        Title: `${resumeData.basics.name} - CV`,
        Author: resumeData.basics.name,
        Creator: 'PDFKit',
        Producer: 'PDFKit',
      },
    });

    const stream = fs.createWriteStream(outputPdfPath);
    stream.on('finish', () => {
      console.log(`CV generated successfully: ${outputPdfPath}`);
      resolve(outputPdfPath);
    });
    stream.on('error', reject);
    doc.pipe(stream);

    renderCv(doc, resumeData);
    doc.end();
  });
}

const run = () =>
  generatePDF().catch(error => {
    console.error('Error generating PDF:', error);
    // Fail the CI job instead of uploading a stale or missing PDF
    process.exitCode = 1;
  });

if (process.argv.includes('--watch')) {
  console.log('Watching for changes in resume.json...');
  const chokidar = require('chokidar');
  chokidar.watch(resumeJsonPath, { persistent: true }).on('change', () => {
    console.log('resume.json changed, regenerating PDF...');
    run();
  });
}

run();
