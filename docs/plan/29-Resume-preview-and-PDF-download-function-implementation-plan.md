[Mode:Plan][Model:Claude 3.7 Sonnet]

#Resume preview and PDF download function implementation plan

## 1. Overall architecture

### 1.1 New file structure
```
backend/
  ├── src/
  │   ├── services/
│ │ └── resumeRenderService.ts // Handle template rendering and PDF generation
  │   ├── controllers/
│ │ └── resumeRenderController.ts // HTML preview and PDF download controller
  │   ├── routes/
│ │ └── resumeRenderRoutes.ts // New API route definition
  │   └── templates/
│ └── resume-template.html // Store Handlebars template
frontend/
  ├── src/
  │   ├── services/
│ │ └── resumeExportService.ts // Front-end export service
  │   └── components/
  │       └── resume/
│ └── ResumeExportModal.tsx // Export options modal box
```
### 1.2 Modify the data model
Modify `resumeModel.ts` to fit the structure expected by the template:
```typescript
//Keep the original basic fields and modify the content structure expectations
export interface IResumeContent {
  name: string;
  phone: string;
  email: string;
  education: {
    institutionName: string;
    degree: string;
    major: string;
    graduationDate: string;
    location: string;
    gpa?: string;
    relevantCourses?: string;
    achievements?: string[];
  }[];
  skills: {
    programmingLanguages: string;
    technologies: string;
  };
  experiences: {
    companyName: string;
    teamName?: string;
    position: string;
    startDate: string;
    endDate: string;
    location: string;
    responsibilities: string[];
  }[];
  projects: {
    name: string;
    startDate: string;
    endDate: string;
    description: string[];
  }[];
}
```
## 2. Backend implementation

### 2.1 resumeRenderService.ts
```typescript
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { IResume } from '../models/resumeModel';

// Browser instance management
let browserInstance: puppeteer.Browser | null = null;

export const resumeRenderService = {
//Initialize service
  init: async () => {
// Start the browser instance and keep it running
    if (!browserInstance) {
      browserInstance = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
//Close the browser when the processing process exits
      process.on('exit', async () => {
        if (browserInstance) {
          await browserInstance.close();
        }
      });
    }
    return browserInstance;
  },

//Load and compile the template
  getTemplate: () => {
    const templatePath = path.resolve(__dirname, '../templates/resume-template.html');
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    return Handlebars.compile(templateSource);
  },

// Render HTML
  renderHTML: (resume: IResume): string => {
    const template = resumeRenderService.getTemplate();
    const resumeData = JSON.parse(resume.content);
    
    return template(resumeData);
  },

// Generate PDF
  generatePDF: async (resume: IResume): Promise<Buffer> => {
// Make sure the browser instance exists
    const browser = await resumeRenderService.init();
    
// Render HTML
    const html = resumeRenderService.renderHTML(resume);
    
//Load HTML in new page
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
//Configure PDF options
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
// Close the page (but keep the browser instance)
    await page.close();
    
    return pdfBuffer;
  }
};

export default resumeRenderService;
```

### 2.2 resumeRenderController.ts
```typescript
import { Request, Response, NextFunction } from 'express';
import Resume from '../models/resumeModel';
import { AppError } from '../utils/AppError';
import resumeRenderService from '../services/resumeRenderService';

/**
* @desc Preview resume HTML
 * @route   GET /api/v1/resumes/:id/preview
* @access private
 */
export const previewResumeHTML = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
// Find resume - make sure you can only view your own resume
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
return next(new AppError('The resume was not found', 404));
    }

// Render HTML
    const html = resumeRenderService.renderHTML(resume);
    
//return HTML
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
console.error('Failed to generate resume HTML preview:', error);
next(new AppError(`Preview generation failed: ${error.message}`, 500));
  }
};

/**
* @desc Download resume PDF
 * @route   GET /api/v1/resumes/:id/pdf
* @access private
 */
export const downloadResumePDF = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
// Find resume - make sure you can only download your own resume
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user?._id
    });

    if (!resume) {
return next(new AppError('The resume was not found', 404));
    }

// Generate PDF
    const pdfBuffer = await resumeRenderService.generatePDF(resume);
    
//Set response headers
    const fileName = `${resume.name.replace(/\s+/g, '_')}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
//Send PDF
    res.send(pdfBuffer);
  } catch (error) {
console.error('Failed to generate resume PDF:', error);
next(new AppError(`PDF generation failed: ${error.message}`, 500));
  }
};
```

### 2.3 resumeRenderRoutes.ts
```typescript
import express from 'express';
import { protect } from '../middleware/authMiddleware';
import {
  previewResumeHTML,
  downloadResumePDF
} from '../controllers/resumeRenderController';

const router = express.Router();

// Protect all routes, need to log in
router.use(protect);

// Preview resume HTML
router.get('/:id/preview', previewResumeHTML);

// Download resume PDF
router.get('/:id/pdf', downloadResumePDF);

export default router;
```
### 2.4 Integrate routing into the main application
Modify `app.ts` or the corresponding main application file:
```typescript
import resumeRenderRoutes from './routes/resumeRenderRoutes';

//Add to existing route
app.use('/api/v1/resumes', resumeRenderRoutes);
```
## 3. Front-end implementation

### 3.1 resumeExportService.ts
```typescript
import api from './api';

const resumeExportService = {
// Get resume HTML preview URL
  getResumePreviewUrl: (resumeId: string): string => {
    return `/api/v1/resumes/${resumeId}/preview`;
  },
  
// Download resume PDF
  downloadResumePDF: async (resumeId: string): Promise<void> => {
    try {
// Get authentication token
      const token = localStorage.getItem('token');
      
//Create download link
      const downloadUrl = `/api/v1/resumes/${resumeId}/pdf`;
      
//Open a new window for download
      window.open(downloadUrl, '_blank');
    } catch (error) {
console.error('Failed to download resume PDF:', error);
      throw error;
    }
  }
};

export default resumeExportService;
```

### 3.2 ResumeExportModal.tsx
```tsx
import React from 'react';
import { FileText, Download } from 'lucide-react';
import resumeExportService from '@/services/resumeExportService';
import { useTranslation } from 'react-i18next';

interface ResumeExportModalProps {
  resumeId: string;
  resumeName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ResumeExportModal: React.FC<ResumeExportModalProps> = ({
  resumeId,
  resumeName,
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('resume');
  
  if (!isOpen) return null;
  
// Get preview URL
  const previewUrl = resumeExportService.getResumePreviewUrl(resumeId);
  
// Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      await resumeExportService.downloadResumePDF(resumeId);
    } catch (error) {
console.error('Failed to download PDF:', error);
//You can add an error message here
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
{t('export_resume', 'Export resume')} - {resumeName}
        </h3>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <a 
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 transition-colors"
            >
              <FileText className="w-5 h-5" />
{t('preview_html', 'Preview resume in browser')}
            </a>
            
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-800/50 text-green-700 dark:text-green-300 transition-colors"
            >
              <Download className="w-5 h-5" />
{t('download_pdf', 'Download resume in PDF format')}
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
{t('close', 'close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeExportModal;
```
### 3.3 Integrated into ResumeBuilderPage.tsx
Modify the existing `ResumeBuilderPage.tsx` file:
```tsx
// add import
import ResumeExportModal from '@/components/resume/ResumeExportModal';

//Add status
const [showExportModal, setShowExportModal] = useState(false);
const [resumeToExport, setResumeToExport] = useState<Resume | null>(null);

//Add handler function
const handleExportResume = (resume: Resume) => {
  setResumeToExport(resume);
  setShowExportModal(true);
};

//Add in button area
<button 
  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg ring-2 ring-gray-900/5 dark:ring-gray-100/5 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
  onClick={() => handleExportResume(resume)}
>
  <FileExport className="w-4 h-4" />
{t('export', 'export')}
</button>

//Add a modal box at the end of the component
{showExportModal && resumeToExport && (
  <ResumeExportModal
    resumeId={resumeToExport._id}
    resumeName={resumeToExport.name}
    isOpen={showExportModal}
    onClose={() => setShowExportModal(false)}
  />
)}
```
## 4. Front-end form adaptation

### 4.1 Modify the data structure in ResumeFormPage.tsx
Modify the data processing logic to adapt to new structural requirements:
```typescript
//Data conversion when submitting the form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
// Collect data from the form
  const resumeContent = {
    name: (document.getElementById('fullName') as HTMLInputElement)?.value || '',
    email: (document.getElementById('email') as HTMLInputElement)?.value || '',
    phone: (document.getElementById('phone') as HTMLInputElement)?.value || '',
    
//Convert educational information
    education: educations.map(edu => ({
      institutionName: edu.school,
      degree: edu.education,
      major: edu.major,
      graduationDate: edu.endDate,
location: '', // This field needs to be added to the form
achievements: [] // Optional, need to be added in the form
    })),
    
//Convert skill information
    skills: {
      programmingLanguages: (document.getElementById('programmingLanguages') as HTMLTextAreaElement)?.value || '',
      technologies: (document.getElementById('technologies') as HTMLTextAreaElement)?.value || ''
    },
    
//Convert work experience
    experiences: workExperiences.map(exp => ({
      companyName: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
location: '', // This field needs to be added to the form
      responsibilities: exp.responsibilities.split('\n').filter(item => item.trim() !== '')
    })),
    
//Project information (optional, needs to be added to the form)
    projects: []
  };
  
// ...submit form logic
}
```
### 4.2 Add necessary form fields
Add a "Location" field to the Education and Work Experience sections:
```tsx
//Add in the education background section
<div className="mb-2">
<label htmlFor={`eduLocation-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location', 'Location')}</label>
  <input
    type="text"
    id={`eduLocation-${index}`}
    name={`eduLocation-${index}`}
    className="form-input"
    value={education.location || ''}
    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
placeholder={t('location_placeholder', 'school location')}
  />
</div>

//Add in the work experience section
<div className="mb-2">
<label htmlFor={`workLocation-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('location', 'Work location')}</label>
  <input
    type="text"
    id={`workLocation-${index}`}
    name={`workLocation-${index}`}
    className="form-input"
    value={experience.location || ''}
    onChange={(e) => handleWorkExperienceChange(index, 'location', e.target.value)}
placeholder={t('work_location_placeholder', 'Workplace')}
  />
</div>

// Modify the skill section to two fields
<div className="mb-4">
<label htmlFor="programmingLanguages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('programming_languages', 'Programming languages')}</label>
  <textarea
    id="programmingLanguages"
    name="programmingLanguages"
    className="form-textarea"
    rows={2}
placeholder={t('programming_languages_placeholder', 'e.g.: JavaScript, TypeScript, Python')}
  />
</div>

<div className="mb-4">
<label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('technologies', 'Technology and Framework')}</label>
  <textarea
    id="technologies"
    name="technologies"
    className="form-textarea"
    rows={2}
placeholder={t('technologies_placeholder', 'e.g.: React, Node.js, MongoDB')}
  />
</div>
```
## 5. Install dependencies and configuration
```bash
#Install backend dependencies
cd backend
npm install handlebars puppeteer

#Copy template file
mkdir -p src/templates
cp docs/plan/resume/resume-template.html src/templates/
```
## 6. Server configuration

Make sure Puppeteer's required dependencies are installed on the server:
```bash
# On Ubuntu/Debian
apt-get update && apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libatk-bridge2.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
  libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 \
  libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 \
  libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release \
  xdg-utils wget
```
## Implementation Checklist:
1. Create resumeRenderService.ts service
2. Create resumeRenderController.ts controller
3. Create resumeRenderRoutes.ts route
4. Integrate routing into the main application
5. Create resumeExportService.ts front-end service
6. Create ResumeExportModal.tsx component
7. Modify ResumeBuilderPage.tsx to add export options
8. Modify ResumeFormPage.tsx to adapt to the new data structure
9. Install backend dependencies (handlebars, puppeteer)
10. Copy HTML template to server
11. Configure server Puppeteer dependencies
12. Test the HTML preview function
13. Test PDF download function
14. Adjust template style (optional)
