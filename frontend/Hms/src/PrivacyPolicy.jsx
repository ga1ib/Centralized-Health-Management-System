// PrivacyPolicy.jsx
import React from "react";
import Header from "./header";
import Footer from "./footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-green-800 to-green-500">
        <Header />
        <div className="container mx-auto py-20 px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl">
            Protecting Your Data, Respecting Your Privacy.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-10 space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              1. Data Collection
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We collect personal information such as your name, contact details, health records, and appointment data to provide you with enhanced, personalized healthcare services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              2. Data Usage
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Your data is used exclusively to manage your healthcare services, improve our service delivery, and ensure seamless communication between patients, doctors, and administrative staff.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              3. Data Security
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We implement robust security protocols including encryption, secure access controls, and regular audits to protect your sensitive data from unauthorized access or breaches.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              4. Third-Party Sharing
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Your information will never be sold to or shared with third parties without your explicit consent, unless required by law. We only share data with trusted partners to support our core services.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              5. Your Rights
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              You have the right to access, modify, or request deletion of your personal data at any time. For any inquiries or requests regarding your data, please contact our Data Protection Officer.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
