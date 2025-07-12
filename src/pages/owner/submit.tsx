import { useState } from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import PropertySubmissionForm from '@/components/owner/PropertySubmissionForm';

export default function SubmitProperty() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  return (
    <>
      <Head>
        <title>Submit Your Property - Philippines Rental</title>
        <meta name="description" content="Submit your property for rental through our professional real estate service" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header 
          currentLanguage={currentLanguage} 
          onLanguageChange={handleLanguageChange} 
        />
        
        <main>
          <PropertySubmissionForm />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                🏠 Philippines Rental - Professional Property Management Service
              </p>
              <p className="text-sm">
                Need help? Contact us: 
                <a href="mailto:support@philippinesrental.com" className="text-primary hover:underline ml-1">
                  support@philippinesrental.com
                </a>
                {' | '}
                <a href="tel:+639123456789" className="text-primary hover:underline ml-1">
                  +63 912 345 6789
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}