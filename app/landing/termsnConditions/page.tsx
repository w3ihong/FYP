// pages/terms-and-conditions.tsx


const TermsAndConditions =() => {
  return (
    <>
      
        <title>Terms and Conditions | EchoSphere</title>
        <meta name="description" content="Terms and conditions for EchoSphere" />
      
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
            <p className="text-sm text-gray-500 text-center mb-8">Last updated: 10/7/2024</p>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">1. Introduction</h2>
                <p className="text-gray-700 text-left">
                  Welcome to EchoSphere. By accessing or using our website and services, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our website or services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">2. Use of Our Services</h2>
                <p className="text-gray-700 text-left mb-4">You agree to use our services only for lawful purposes and in accordance with these Terms and Conditions. You must not:</p>
                <ul className="list-disc list-inside space-y-2 text-left">
                  <li>Engage in any activity that violates any applicable law or regulation.</li>
                  <li>Infringe on the intellectual property rights of others.</li>
                  <li>Interfere with or disrupt the integrity or performance of our services.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">3. Account Responsibilities</h2>
                <p className="text-gray-700 text-left">
                  You are responsible for maintaining the confidentiality of your account and password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">4. Intellectual Property</h2>
                <p className="text-gray-700 text-left">
                  All content and materials provided on our website are the property of EchoSphere or its licensors and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">5. Limitation of Liability</h2>
                <p className="text-gray-700 text-left">
                  To the fullest extent permitted by law, EchoSphere shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">6. Modifications</h2>
                <p className="text-gray-700 text-left">
                  We reserve the right to modify these Terms and Conditions at any time. Any changes will be effective when we post the updated terms on our website. Your continued use of our services constitutes your acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">7. Governing Law</h2>
                <p className="text-gray-700 text-left">
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes arising out of or related to these terms shall be resolved in the courts located in [Your Jurisdiction].
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-center">8. Contact Us</h2>
                <p className="text-gray-700 text-left">
                  If you have any questions or concerns about these Terms and Conditions, please contact us at:
                </p>
                <p className="text-gray-700 text-left mt-2"><strong>Email:</strong> support@echosphere.com</p>
                <p className="text-gray-700 text-left mt-2"><strong>Address:</strong> [Company Address]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
