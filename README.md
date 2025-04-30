# rokamaku.github.io

Personal portfolio and CV website.

## Features

### Automatic CV Generation

The site includes functionality to automatically generate a PDF CV from the JSON resume data:

- Edit the resume data in `public/resume.json`
- The PDF CV is automatically generated at `public/CV_AnhBui_FullStackDev.pdf`

#### CV Generation Commands

- `yarn generate-cv` - Generate the CV once
- `yarn watch-cv` - Watch for changes in resume.json and regenerate the CV automatically

The GitHub Actions workflow will automatically generate the CV on each push to the repository when the resume data changes.

### Cloudflare R2 Integration

The CV can be automatically uploaded to Cloudflare R2 object storage:

#### Setup

1. Create a Cloudflare R2 bucket in your Cloudflare account
2. Create an API token with R2 storage access
3. Configure GitHub secrets in your repository:
   - `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
   - `CLOUDFLARE_API_TOKEN` - Your Cloudflare API token
   - `R2_BUCKET_NAME` - Your R2 bucket name

#### Usage

- `yarn upload-cv` - Upload the CV to Cloudflare R2
- `yarn build-and-upload` - Generate the CV and then upload it to Cloudflare R2

#### Automatic Uploads

The GitHub workflow will automatically upload the CV to Cloudflare R2 whenever the resume data changes in the repository.
