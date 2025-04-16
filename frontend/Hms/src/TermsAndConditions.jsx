// TermsAndConditions.jsx
import React from "react";
import Header from "./header";
import Footer from "./footer";

const TermsAndConditions = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-600">
        <Header />
        <div className="container mx-auto py-20 px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg md:text-xl">
            Your Trust. Our Commitment. Your Rights.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-10 space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              1. User Agreement
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              By using our Centralized Hospital Management System, you agree to provide accurate information, abide by the hospital policies, and safeguard your login credentials. Your integrity and security are essential to us.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              2. Usage Restrictions
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Unauthorized use, data manipulation, or any attempt to breach our security protocols is strictly prohibited. Users found in violation of these guidelines will have their access immediately revoked.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              3. Termination
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We reserve the right to suspend or terminate access to the system without notice if any activity is found to be in violation of these terms or poses a security risk.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              4. Modifications to Terms
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our terms may be updated periodically. We will notify you of significant changes via the system or email. Continued use of the system implies acceptance of the updated terms.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              5. Governing Law
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              These terms and conditions shall be governed and construed under the laws of [Insert Jurisdiction]. Any disputes arising from the use of this system shall be resolved in accordance with local legal procedures.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
