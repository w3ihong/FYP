// pages/privacy-policy.tsx
import { NextPage } from 'next';
import Head from 'next/head';

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | EchoSphere</title>
        <meta name="description" content="Privacy policy for EchoSphere" />
      </Head>
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">PRIVACY POLICY</h1>
            <p className="text-sm text-gray-500 text-center mb-8">Last updated: 10/7/2024</p>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-gray-700">
                  Welcome to EchoSphere. We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and disclose information about you when you visit our website and use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-gray-700 mb-4">We may collect and process the following types of information about you:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Personal Identification Information:</strong> Name, email address, phone number, etc.</li>
                  <li><strong>Usage Data:</strong> Information about your interaction with our website and services, such as IP address, browser type, and pages visited.</li>
                  <li><strong>Cookies:</strong> We use cookies to improve your experience on our site. You can manage your cookie preferences through your browser settings.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide, maintain, and improve our services.</li>
                  <li>Communicate with you, including sending updates and promotional materials.</li>
                  <li>Analyze usage and trends to enhance user experience.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
                <p className="text-gray-700 mb-4">We do not sell, trade, or otherwise transfer your personal information to outside parties except as described below:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf.</li>
                  <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or to protect our rights, property, or safety.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <p className="text-gray-700 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access and update your personal information.</li>
                  <li>Request the deletion of your personal information.</li>
                  <li>Opt-out of receiving marketing communications.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">6. Security</h2>
                <p className="text-gray-700">
                  We take reasonable measures to protect your information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is completely secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">7. Changes to This Privacy Policy</h2>
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
                <p className="text-gray-700">
                  If you have any questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <p className="text-gray-700 mt-2"><strong>Email:</strong> privacy@echosphere.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
