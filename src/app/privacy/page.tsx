"use client";

import { motion } from "framer-motion";

export default function Privacy() {
  return (
    <section className="relative py-24 overflow-hidden" id="about-us">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-transparent to-dark-primary opacity-80" />
        <div className="hero-glow" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold mt-20 mb-5">🔒 Privacy Policy</h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Learn about our privacy Policy
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="">
          <motion.div>
            <div className="relative z-10 px-6 p5-10 max-w-4xl mx-auto">
              <section className="mb-10">
                <p>
                  Welcome to our online marketplace. This Privacy Policy
                  explains how we collect, use, share, and protect your personal
                  information when you use our website and related services. By
                  accessing or using our platform, you agree to the terms
                  outlined in this policy.
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  1. 📥 Information We Collect
                </h2>
                <h3 className="text-xl font-medium mt-4">
                  a. Information You Provide Directly:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Full Name</li>
                  <li>Email Address</li>
                  <li>Phone Number</li>
                  <li>Shipping/Billing Address</li>
                  <li>Account login details (username, password)</li>
                  <li>Store and product information (for vendors)</li>
                </ul>

                <h3 className="text-xl font-medium mt-4">
                  b. Information Collected Automatically:
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                  <li>Device type and operating system</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6">
                  2. 🎯 How We Use Your Information
                </h2>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Process and fulfill transactions between buyers and vendors
                  </li>
                  <li>Facilitate secure payments</li>
                  <li>
                    Communicate with you (e.g., order confirmations, support)
                  </li>
                  <li>Verify store owners and validate product authenticity</li>
                  <li>Improve platform functionality and user experience</li>
                  <li>Detect and prevent fraud or unauthorized activities</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6">
                  3. 🤝 Sharing Your Information
                </h2>
                <p>
                  We do <strong>not</strong> sell or rent your personal
                  information. However, we may share your data with:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Payment processors to complete transactions</li>
                  <li>Logistics partners for delivery coordination</li>
                  <li>Customer support tools to manage communications</li>
                  <li>
                    Regulatory authorities when required by law or to prevent
                    fraud
                  </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6">
                  4. 🔐 Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational measures
                  to safeguard your personal data. These include:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>SSL encryption for data in transit</li>
                  <li>Secure storage of sensitive information</li>
                  <li>Restricted access to authorized personnel only</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-6">
                  5. 🍪 Cookies and Tracking
                </h2>
                <p>We may use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Keep you logged in</li>
                  <li>Remember preferences</li>
                  <li>Analyze website traffic and usage</li>
                </ul>
                <p>
                  You can control cookie settings through your browser at any
                  time.
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  6. 🚫 Your Data Rights
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Request access to your personal data</li>
                  <li>Request correction or deletion of your information</li>
                  <li>Object to certain types of data use</li>
                  <li>Withdraw consent (where applicable)</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at: <br />
                  <strong>
                    Email: alphainteractivehub@gmail.com <br />
                    Phone: +234 706 609 6155 <br />
                    Support Center: support@gofroma2zafrica.com
                  </strong>
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  7. 👶 Children’s Privacy
                </h2>
                <p>
                  Our services are not intended for individuals under the age of
                  18. We do not knowingly collect data from children.
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  8. 🌍 International Users
                </h2>
                <p>
                  If you are accessing our platform from outside Nigeria, please
                  note that your data may be transferred to and processed in
                  Nigeria, where our servers and offices are located.
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  9. 📄 Updates to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. If we
                  make significant changes, we will notify users via the
                  platform or email.
                </p>

                <h2 className="text-2xl font-semibold mt-6">
                  10. 📞 Contact Us
                </h2>
                <p>
                  If you have any questions, concerns, or requests regarding
                  this Privacy Policy, please contact our support team at:
                </p>
                <p>
                  <strong>Email:</strong> alphainteractivehub@gmail.com
                  <br />
                  <strong>Phone:</strong> +234 706 609 6155
                  <br />
                  <strong>Support Center:</strong> support@gofroma2zafrica.com
                </p>
              </section>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/3 left-0 w-72 h-72 bg-gradient-to-r from-gold-primary/20 to-gold-secondary/20 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 right-0 w-96 h-96 bg-gradient-to-r from-gold-accent/20 to-gold-highlight/20 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </section>
  );
}
