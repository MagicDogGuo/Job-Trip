# JobTrip_Extention Automatic publishing and download page update plan

## Background and goals

Currently, the JobTrip browser extension (JobTrip_Extention) uses a fixed GitHub code repository download link. This approach has the following problems:

1. Each time you download is the latest development code, not the stable version
2. Unable to provide versioned release management
3. The front-end download page cannot display and track the latest version number.
4. Users cannot obtain release notes or learn about new feature changes

To address these issues, this plan aims to achieve the following goals:

1. Establish an automated GitHub Release release process
2. Standardize version management of extension programs
3. Update the front-end download page to display the latest version information and Release instructions
4. Provide a more stable and clear download experience

## Implementation steps

### 1. Create a GitHub Actions workflow

#### 1.1 Create workflow configuration file

Create the following file in the JobTrip_Extention repository: `.github/workflows/release-extension.yml`
```yaml
name: Release Extension

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build extension
        run: npm run build
        
      - name: Create ZIP file
        run: |
          cd dist || exit
          zip -r ../jobtrip-extension-${{ github.ref_name }}.zip *
          cd ..
          
      - name: Extract manifest version
        id: manifest
        run: |
          VERSION=$(node -p "require('./manifest.json').version")
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          
      - name: Create Release
        id: create_release
        uses: softprops/action-gh-release@v1
        with:
          files: jobtrip-extension-${{ github.ref_name }}.zip
          name: JobTrip Extension v${{ steps.manifest.outputs.version }}
          draft: false
          prerelease: false
          generate_release_notes: true
```
#### 1.2 Set version update and label creation scripts

Create an npm script that automatically updates the version number and add it to `package.json`:
```json
"scripts": {
  "version:patch": "npm version patch && node scripts/update-manifest-version.js",
  "version:minor": "npm version minor && node scripts/update-manifest-version.js",
  "version:major": "npm version major && node scripts/update-manifest-version.js"
}
```
#### 1.3 Create manifest version synchronization script

Create `scripts/update-manifest-version.js`:
```javascript
const fs = require('fs');
const path = require('path');

//Read package.json to get the new version number
const packageJson = require('../package.json');
const newVersion = packageJson.version;

// Update the version number of manifest.json
const manifestPath = path.join(__dirname, '../manifest.json');
const manifest = require(manifestPath);
manifest.version = newVersion;

//Write back manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`Updated manifest.json version to ${newVersion}`);
```
### 2. Update ChromeExtensionPage.tsx page

#### 2.1 Modify download components

Update the download section in `frontend/src/pages/ChromeExtensionPage.tsx` to add dynamic version information and Release Notes links:
```jsx
//Add state and useEffect
const [latestVersion, setLatestVersion] = useState('1.0.0');
const [releaseUrl, setReleaseUrl] = useState('');
const [downloadUrl, setDownloadUrl] = useState('');

useEffect(() => {
// Get the latest release information
  fetch('https://api.github.com/repos/DravenTJU/Job-Trip/releases/latest')
    .then(response => response.json())
    .then(data => {
      if (data.tag_name) {
        setLatestVersion(data.tag_name.replace('v', ''));
        setReleaseUrl(data.html_url);
// Get the download URL of the zip resource
        const zipAsset = data.assets.find(asset => asset.name.endsWith('.zip'));
        if (zipAsset) {
          setDownloadUrl(zipAsset.browser_download_url);
        }
      }
    })
    .catch(error => {
Error 500 (Server Error)!!1500.That’s an error.There was an error. Please try again later.That’s all we know.
// Set the default download link in case the API request fails
      setDownloadUrl('https://github.com/DravenTJU/Job-Trip/releases/latest/download/jobtrip-extension.zip');
    });
}, []);
```
#### 2.2 Update download area UI
```jsx
{/* Download area */}
<div className="w-fit bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
  <div className="flex flex-col md:flex-row items-center justify-start">
    <div className="flex items-center mb-4 md:mb-0">
      <Chrome className="w-12 h-12 text-indigo-600 mr-4" />
      <div>
<h2 className="title-sm">Chrome browser extension</h2>
<p className="text-description">Version {latestVersion}</p>
        {releaseUrl && (
          <a 
            href={releaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-indigo-600 hover:text-indigo-800 mt-1 block"
          >
View release notes
          </a>
        )}
      </div>
    </div>
    <a 
      href={downloadUrl || "https://github.com/DravenTJU/Job-Trip/releases/latest/download/jobtrip-extension.zip"} 
      download 
      className="md:ml-8"
    >
      <button className="btn btn-primary">
        <Download className="w-4 h-4 mr-2" />
Download extension
      </button>
    </a>
  </div>
</div>
```
#### 2.3 Add necessary imports and types
```jsx
import React, { useState, useEffect } from 'react';
import { Download, Chrome, ... } from 'lucide-react';
```
### 3. Establish release process documentation

Create a README for team members explaining the new release process:

#### 3.1 Create publishing guide

Update `README.md` in the JobTrip_Extention repository and add a release guide section:
```markdown
## Release process

To publish a new version of your extension, follow these steps:

1. Make sure all changes have been committed to the master branch
2. Use one of the version update commands to update the version number:
   ```bash
npm run version:patch # Fix bugs or minor changes (1.0.0 -> 1.0.1)
   npm run version:minor # Add new features but backward compatible (1.0.0 -> 1.1.0)
   npm run version:major # Major changes or incompatible updates (1.0.0 -> 2.0.0)
   ```
3. Push the code and tags to GitHub:
   ```bash
   git push && git push --tags
   ```
4. GitHub Actions will automatically build the extension and create a new Release

Note: The version number will be automatically synchronized to the manifest.json file.
```
### 4. Local testing and generating initial version

Test locally before submitting to the repository to ensure the release process works properly:

#### 4.1 Add version management script
```bash
npm init -y # If package.json does not exist
npm install --save-dev semver # Version number management library
```
#### 4.2 Create initial tag
```bash
git tag -a v1.0.0 -m "Initial version"
git push origin v1.0.0
```
### 5. Deploy to production environment

#### 5.1 Update front-end page

Deploy the modified `ChromeExtensionPage.tsx` to the front-end application.

#### 5.2 Verification automation process

Push the tag and confirm that GitHub Actions fire correctly, generate Release and download files.

#### 5.3 Test download function

Verify that the front-end page can correctly obtain the latest version information and provide available download links.

## Implementation Checklist

1. [Configuring GitHub repository]
   - [ ] Create `.github/workflows/` directory
   - [ ] Add `release-extension.yml` workflow configuration file
   - [ ] Add GitHub Secrets (if needed)

2. [Version management script]
   - [ ] Create `scripts/` directory
   - [ ] Add `update-manifest-version.js` script
   - [ ] Update `package.json` to add version update command

3. [Front-end update]
   - [ ] Modify `ChromeExtensionPage.tsx` to add dynamic version information
   - [ ] Add Release Notes link
   - [ ] Update download link to use GitHub Release resource URL

4. [Documentation update]
   - [ ] Update `README.md` to add release guidelines
   - [ ] Add version history section

5. [Release initial version]
   - [ ] Initialize package.json (if it does not exist)
   - [ ] Make sure the version number of manifest.json is correct
   - [ ] Create and push initial version tag v1.0.0

6. [Testing and Verification]
   - [ ] Test the release process locally
   - [ ] Verify that GitHub Actions are executed correctly
   - [ ] Display version information on the test front-end page
   - [ ] Confirm that the download link is available and the correct expansion file is downloaded

## Notes

1. You need to ensure that the JobTrip_Extention repository has the correct `build` script to generate valid extension files.
2. You need to confirm that GitHub Actions has permission to create Release and upload files.
3. GitHub API requests on the front-end page may be affected by the rate limit, and you should consider adding error handling and backoff strategies.
4. You need to ensure that the version number of manifest.json is synchronized with package.json

## Implementation Checklist:
1. Create GitHub Actions workflow configuration file (.github/workflows/release-extension.yml)
2. Add version update script (scripts/update-manifest-version.js)
3. Update package.json and add version management commands
4. Modify ChromeExtensionPage.tsx to add dynamic version display
5. Modify ChromeExtensionPage.tsx to update the download link and use GitHub Release resources
6. Modify ChromeExtensionPage.tsx to add release notes link
7. Update README.md to add release process guide
8. Initialize the warehouse package.json (if necessary)
9. Create initial version tag and push it
10. Verify that the GitHub Actions workflow executes successfully
11. Verify that the front-end page displays correct version information
12. Test the download link function