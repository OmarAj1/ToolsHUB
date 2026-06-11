import React from "react";

export function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Privacy Policy</h1>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">1. Introduction</h2>
          <p>
            Welcome to ToolHub. We respect your privacy and are committed to protecting it. 
            This Privacy Policy explains that our tools are designed to process data locally in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">2. Local Data Processing</h2>
          <p>
            The vast majority of the tools provided on our website operate entirely client-side. This means that 
            files, text inputted, and data processed using these tools do not leave your device and are not uploaded 
            or stored on our servers. Processing occurs entirely within your web browser.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">3. Information We Collect</h2>
          <p>
            When you visit our site, we may automatically collect standard usage information using analytics services 
            to help us improve our services, such as IP addresses, browser types, internet service providers (ISPs), 
            referring/exit pages, and click data. This data is not linked to any personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">4. Cookies and Tracking</h2>
          <p>
            We may use cookies and similar tracking technologies to enhance user experience, track usage patterns, and 
            remember your preferences. You can control the use of cookies at the individual browser level, but if you choose 
            to disable cookies, it may limit your use of certain features or functions on our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">5. External Tools and APIS</h2>
          <p>
            Certain specific tools (like external API testers) may require your browser to transmit network requests 
            to endpoints you specify. We do not intermediate these requests and have no access to the data sent or received 
            during those operations.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">6. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
            Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section className="pt-8 text-sm text-slate-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
}
