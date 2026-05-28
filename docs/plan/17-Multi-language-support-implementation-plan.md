[Mode:Plan][Model:Claude 3.7 Sonnet]

# Multi-language support implementation plan

## 1. Overview

This plan details how to implement complete multi-language support in the Job-Trip project. We will use react-i18next as the internationalization solution and ensure that language settings are in sync with user preferences.

## 2. Requirements analysis

- Supports English (en), Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW)
- Synchronize user language preferences (preferences.language) with i18n status
- Provide language switching interface
- Implement global multi-language support for applications
- Extensibility reserved for adding more languages in the future

## 3. Technology selection

- **react-i18next**: React’s i18next integration, providing component-level translation support
- **i18next**: Basic internationalization framework
- **i18next-http-backend**: Backend for loading translation files
- **i18next-browser-languagedetector**: Automatically detect browser language

## 4. Detailed design

### 4.1 Install dependencies

npm packages that need to be added:
```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```
### 4.2 Translation file structure

Located in the `frontend/public/locales/` directory, create the necessary translation files for each language:
```
frontend/public/locales/
  ├── en/
  │   ├── common.json
  │   ├── auth.json
  │   ├── profile.json
  │   └── jobs.json
  ├── zh-CN/
  │   ├── common.json
  │   ├── auth.json
  │   ├── profile.json
  │   └── jobs.json
  └── zh-TW/
      ├── common.json
      ├── auth.json
      ├── profile.json
      └── jobs.json
```
### 4.3 Create i18n configuration

File path: `frontend/src/i18n/index.ts`

This file will configure i18next, including:
- List of supported languages
- Default language settings
- Resource loading method
- Language detector
- Caching mechanism

### 4.4 Create language context

File path: `frontend/src/context/LanguageContext.tsx`

This context will:
- Provide global language status
- Handles language switching
- Sync with user preferences

### 4.5 Update application entrance

Modify `frontend/src/App.tsx` and `frontend/src/main.tsx` to integrate language context.

### 4.6 Create language selection component

File path: `frontend/src/components/common/LanguageSelector.tsx`

This component will provide language switching UI.

### 4.7 Update settings page

Modify `frontend/src/pages/SettingsPage.tsx` to add a language selection section.

### 4.8 Synchronize with user status

Add synchronization mechanism in `frontend/src/redux/slices/authSlice.ts`.

## 5. Detailed implementation

### 5.1 i18n configuration file implementation
`frontend/src/i18n/index.ts`:
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

//Supported language list
export const supportedLanguages = {
  'en-US': 'English',
  'zh-CN': 'Simplified Chinese',
  'zh-TW': 'Traditional Chinese'
};

//Default language
export const defaultLanguage = 'en';

//Initialize i18next
i18n
  // Backend for loading translation files
  .use(Backend)
  //Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  //Initialize i18next
  .init({
    //Available languages
    supportedLngs: Object.keys(supportedLanguages),
    //Default language
    fallbackLng: defaultLanguage,
    //debug mode
    debug: process.env.NODE_ENV === 'development',
    // Translation file loading configuration
    backend: {
      //Load path
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    //Default namespace
    defaultNS: 'common',
    // Namespace used
    ns: ['common', 'auth', 'profile', 'jobs'],
    // Interpolation configuration
    interpolation: {
      // Escape output to prevent XSS attacks
      escapeValue: false,
    },
    //Detect language configuration
    detection: {
      // storage options
      order: ['localStorage', 'cookie', 'navigator'],
      //Cache user language selection
      caches: ['localStorage', 'cookie'],
    },
    // Used to disable untranslated text during development
    react: {
      useSuspense: true
    }
  });

//Export i18n instance
export default i18n;
```

### 5.2 Language context implementation

`frontend/src/context/LanguageContext.tsx`:
```typescript
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { updateProfile } from '@/redux/slices/authSlice';
import { supportedLanguages, defaultLanguage } from '@/i18n';
import { User } from '@/types';

//Language context type
interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  supportedLanguages: Record<string, string>;
}

//Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

//Custom hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Language provider component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
//Initialize language state
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || defaultLanguage);
  
// Synchronize user language preference
  useEffect(() => {
    if (isAuthenticated && user?.preferences?.language) {
// If the user is logged in and has a language preference, switch to that language
      if (user.preferences.language !== currentLanguage) {
        i18n.changeLanguage(user.preferences.language);
      }
    }
  }, [user, isAuthenticated, i18n, currentLanguage]);

//Language change processing function
  const changeLanguage = async (lang: string) => {
//Switch i18n language
    await i18n.changeLanguage(lang);
    setCurrentLanguage(lang);
    
// If the user is logged in, update the user's language preference
    if (isAuthenticated && user) {
      const preferences = {
        ...user.preferences,
        language: lang
      };
      
      dispatch(updateProfile({ preferences }));
    }
  };

// Synchronize status when i18n language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

// Provide context value
  const contextValue: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    supportedLanguages
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
```
### 5.3 Translation file example
`frontend/public/locales/en/common.json`:
```json
{
  "app": {
    "name": "JobTrip",
    "description": "Your career assistant"
  },
  "nav": {
    "home": "Home",
    "jobs": "Jobs",
    "profile": "Profile",
    "settings": "Settings"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel",
    "update": "Update",
    "submit": "Submit",
    "loading": "Loading..."
  },
  "languages": {
    "en": "English",
    "zh-CN": "Simplified Chinese",
    "zh-TW": "Traditional Chinese"
  },
  "settings": {
    "title": "Settings",
    "subtitle": "Manage your account and preferences",
    "language": "Language",
    "chooseLanguage": "Choose your preferred language"
  }
}
```

`frontend/public/locales/zh-CN/common.json`:
```json
{
  "app": {
"name": "Career Assistant",
"description": "Your career development partner"
  },
  "nav": {
"home": "Home",
"jobs": "position",
"profile": "personal information",
"settings": "settings"
  },
  "buttons": {
"save": "save",
"cancel": "cancel",
"update": "update",
"submit": "submit",
"loading": "Loading..."
  },
  "languages": {
"en": "English",
"zh-CN": "Simplified Chinese",
"zh-TW": "Traditional Chinese"
  },
  "settings": {
"title": "Settings",
"subtitle": "Manage your account and preferences",
"language": "language",
"chooseLanguage": "Choose your preferred language"
  }
}
```
### 5.4 Application portal update
`frontend/src/App.tsx`:
```typescript
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext'; // Add
import AppRoutes from '@/routes';
import store from '@/redux/store';
import { getCurrentUser } from '@/redux/slices/authSlice';
import '@/i18n'; // Import i18n configuration

/**
 *Application root component
 * Provide theme, language and routing configuration
 */
const App: React.FC = () => {
  // Initialize global state when the application starts
  useEffect(() => {
    // If there is a token locally, try to obtain the current user information
    if (localStorage.getItem('token')) {
      store.dispatch(getCurrentUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <LanguageProvider> {/* Add */}
            <AppRoutes />
          </LanguageProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
```

### 5.5 Language Selector Component

`frontend/src/components/common/LanguageSelector.tsx`:
```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons';
  size?: 'sm' | 'md' | 'lg';
}

/**
* Language selector component
* Allow users to switch between supported languages
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'dropdown',
  size = 'md' 
}) => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  
// style class based on size
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
// drop-down menu style
  const dropdownStyle = `h-10 pl-3 pr-10 py-2 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl 
    border-0 ring-2 ring-gray-900/5 dark:ring-gray-100/5 focus:ring-2 focus:ring-indigo-500 transition-shadow
    ${sizeClasses[size]}`;
  
//Button style
  const buttonStyle = `px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700
    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
    ${sizeClasses[size]}`;
  
// Button selection style
  const activeButtonStyle = `bg-indigo-500 text-white border-indigo-500
    hover:bg-indigo-600 hover:border-indigo-600 dark:hover:bg-indigo-600`;
  
  if (variant === 'dropdown') {
    return (
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className={dropdownStyle}
        aria-label={t('settings.chooseLanguage')}
      >
        {Object.entries(supportedLanguages).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    );
  }
  
// Button group style
  return (
    <div className="flex space-x-2">
      {Object.entries(supportedLanguages).map(([code, name]) => (
        <button
          key={code}
          onClick={() => changeLanguage(code)}
          className={`${buttonStyle} ${currentLanguage === code ? activeButtonStyle : ''}`}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
```
### 5.6 Setting page update
Add the language settings section to `frontend/src/pages/SettingsPage.tsx`:

```typescript
// add import
import { useTranslation } from 'react-i18next';
import LanguageSelector from '@/components/common/LanguageSelector';

// Add the LanguageSettingsForm component within the existing SettingsPage component
const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  // ... existing code ...

  return (
    <div className="container-lg">
      <div className="section space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('settings.subtitle')}
          </p>
        </div>

        {/* ... existing error prompt code ... */}

        {/* Language settings */}
        <LanguageSettingsForm />
        
        {/* Email settings */}
        <EmailSettingsForm
          user={user}
          isLoading={isLoading}
          onSuccess={() => setEmailSuccess(true)}
        />

        {/* Password settings */}
        <PasswordChangeForm
          isLoading={isLoading}
          onSuccess={() => setPasswordSuccess(true)}
        />
      </div>
    </div>
  );
};

/**
 * Language setting form component
 */
const LanguageSettingsForm: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-sm ring-2 ring-gray-900/5 dark:ring-gray-100/5">
      <div className="p-6">
        <h2 className="text-lg font-medium mb-4">{t('settings.language')}</h2>
        
        <div className="mb-4">
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t('settings.chooseLanguage')}
          </label>
          <LanguageSelector variant="dropdown" size="md" />
        </div>
      </div>
    </div>
  );
};
```

## 6. Configuration file

### 6.1 Basic translation files

Basic translation files that need to be created:

1. `frontend/public/locales/en/common.json`
2. `frontend/public/locales/zh-CN/common.json`
3. `frontend/public/locales/zh-TW/common.json`
4. `frontend/public/locales/en/auth.json`
5. `frontend/public/locales/zh-CN/auth.json`
6. `frontend/public/locales/zh-TW/auth.json`

## 7. Implementation plan

### Implementation Checklist:
1. Install the necessary i18n dependency packages
2. Create i18n configuration file frontend/src/i18n/index.ts
3. Create the language context provider frontend/src/context/LanguageContext.tsx
4. Integrate LanguageProvider in App.tsx
5. Create the language selector component frontend/src/components/common/LanguageSelector.tsx
6. Add language settings section in SettingsPage
7. Create English (en) translation file frontend/public/locales/en/common.json
8. Create Simplified Chinese (zh-CN) translation file frontend/public/locales/zh-CN/common.json
9. Create Traditional Chinese (zh-TW) translation file frontend/public/locales/zh-TW/common.json
10. Add translation files related to identity verification
11. Update main UI components to use translation functions
12. Test the language switching function
13. Test the user language preference synchronization function
14. Documented multi-language support function
