"use client";

import { motion } from "framer-motion";

export default function Terms() {
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
          <h1 className="text-3xl font-bold mt-20 mb-5">📃 Terms of Service</h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">
            Learn about our terms of service
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="">
          <motion.div>
            <div className="relative z-10 px-6 p5-10 max-w-4xl mx-auto">
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                  🔁 General Terms (Vendors / Buyers)
                </h2>
                <p className="mb-4">
                  Welcome to our online marketplace, a platform designed to
                  empower Small and Medium Enterprises (SMEs) by facilitating
                  seamless transactions between buyers and sellers. By accessing
                  or using our services, you agree to be bound by these Terms of
                  Service, which govern your use of the marketplace and its
                  related services.
                </p>
                <p className="mb-4">
                  Our marketplace serves as a neutral venue for buyers and
                  sellers to engage in commerce. We do not take ownership of the
                  products listed. Our role as a company is to validate the
                  authenticity of every store listed, so as buyers, you can rest
                  assured that each store has been duly verified by our team.
                </p>
                <p className="mb-4">
                  Both buyers and sellers are required to register for an
                  account to access certain features of the marketplace. Users
                  must be at least 18 years old and provide accurate, complete
                  information during the registration process. Account holders
                  are responsible for maintaining the confidentiality of their
                  login credentials and for all activities that occur under
                  their account.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                  🛍️ Note to Store Owners
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    This online marketplace is{" "}
                    <strong>not for drop shipping</strong>. Store owners are
                    required to have at least <strong>three (3)</strong>{" "}
                    quantities of a particular item in stock before posting it
                    for sale.
                  </li>
                  <li>
                    We encourage store owners to use{" "}
                    <strong>in-store photos</strong> rather than stock images to
                    avoid discrepancies ("what I ordered vs what I got").
                  </li>
                  <li>
                    Sellers must list products truthfully, ensuring that all
                    descriptions, images, and pricing are accurate and not
                    misleading.
                  </li>
                  <li>
                    Buyers are encouraged to review product listings carefully
                    before making a purchase.
                  </li>
                  <li>
                    We reserve the right to suspend or terminate accounts that
                    violate these Terms of Service or engage in activities
                    detrimental to the marketplace’s integrity. This may be done
                    without prior notice and at our sole discretion.
                  </li>
                </ul>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">💳 Payment</h2>
                <p className="mb-2">
                  Our platform offers secure payment processing services to
                  facilitate transactions.{" "}
                  <strong className="text-red-600">
                    We kindly plead with our buyers not to make any payments
                    directly to vendors outside the payment gateways provided
                    within the platform
                  </strong>{" "}
                  as we would{" "}
                  <strong className="text-red-600">
                    not be accountable for any mishap
                  </strong>{" "}
                  that may occur.
                </p>
                <p className="font-medium text-gray-800">
                  <strong>
                    If in doubt, please reach out to our customer care/support
                    center.
                  </strong>
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">
                  🔄 Returns / Refunds
                </h2>

                <h3 className="text-lg font-medium mb-2">Return Periods</h3>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    <strong>Marketplace Items:</strong> Eligible for return
                    within 7 days of delivery.
                  </li>
                </ul>

                <h3 className="text-lg font-medium mb-2">
                  Conditions for Return
                </h3>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    Items must be in original condition, unused, and with all
                    original packaging and tags intact.
                  </li>
                  <li>
                    Returns are accepted for wrong, damaged, or defective items.
                  </li>
                  <li>
                    Certain items such as perishable goods, personal care
                    products, and digital downloads may be non-returnable.
                  </li>
                </ul>

                <h3 className="text-lg font-medium mb-2">Refund Process</h3>
                <ul className="list-disc list-inside mb-4">
                  <li>
                    Refunds are processed promptly upon receipt and inspection
                    of the returned item.
                  </li>
                  <li>
                    Refund methods include bank transfers, store credits, or
                    vouchers, depending on the original payment method.
                  </li>
                  <li>
                    Refunds are granted when no replacement is available or when
                    the customer prefers a refund over a replacement.
                  </li>
                  <li>
                    Refunds are made within 3 days upon receiving the item for
                    inspection.
                  </li>
                </ul>
              </section>

              <p className="text-gray-700">
                By using our marketplace, you acknowledge and agree to these
                Terms of Service. We encourage you to read them carefully and
                contact us if you have any questions or concerns.
              </p>
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
