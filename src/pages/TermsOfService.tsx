import React from "react";

export function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-slate-800 dark:text-slate-200">
      <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Terms of Service</h1>
      
      <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ToolHub Interactive ("our website" or "the Service"), you accept and agree to 
            be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">2. Use of Service</h2>
          <p>
            Our website provides various online calculation, formatting, generation, and processing tools. Most of 
            these tools run client-side. The website and its tools are provided "as is" and "as available". We make 
            no warranties regarding the accuracy or reliability of the results obtained from our tools.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">3. User Responsibilities</h2>
          <p>
            You agree to use the Service only for lawful purposes. You are solely responsible for ensuring that the data you process 
            through our tools complies with intellectual property, data protection, and other legal obligations. 
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">4. Intellectual Property</h2>
          <p>
            The website design, text, graphics, and layout are owned by ToolHub Interactive and are protected by 
            copyright laws. You may not reproduce, modify, or distribute any part of this site without our permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">5. Limitation of Liability</h2>
          <p>
            In no event shall ToolHub Interactive be liable for any direct, indirect, incidental, consequential, 
            or exemplary damages, including but not loss of data, loss of business, or other intangible losses resulting 
            from the use of or inability to use the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-slate-800 dark:text-slate-100">6. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) 
            with or without notice at any time.
          </p>
        </section>
        
        <section className="pt-8 text-sm text-slate-500">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </section>
      </div>
    </div>
  );
}
