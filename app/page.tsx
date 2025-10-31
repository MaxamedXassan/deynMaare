"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";


export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white relative z-50">
        <h1 className="text-2xl font-bold text-blue-600">DeynMaare</h1>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="hover:text-blue-600">Features</Link>
          <Link href="/pricing" className="hover:text-blue-600">Pricing</Link>
          <Link href="/login" className="hover:text-blue-600 font-semibold">Login</Link>
        </nav>

        {/* Hamburger Mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center py-4 space-y-4 md:hidden"
          >
            <Link href="#features" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="hover:text-blue-600" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/login" className="hover:text-blue-600 font-semibold" onClick={() => setMenuOpen(false)}>Login</Link>
          </motion.nav>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 text-center px-6 md:px-12 mt-10 md:mt-20">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 md:mb-6 leading-tight"
        >
          Manage Your Debts <span className="text-blue-600">Smartly</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-xl md:max-w-2xl"
        >
          DeynMaare helps small businesses easily track customers and debts — all in one simple dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/signup"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
          >
            Start Free Trial
          </Link>

          <Link
            href="/evc-payment"
            className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
          >
            Buy Now
          </Link>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="mt-20 max-w-6xl mx-auto px-6 md:px-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {[
          {
            title: "Simple Customer Management",
            desc: "Easily add and manage your customers with a clean interface.",
          },
          {
            title: "Track Debts & Payments",
            desc: "Monitor every paid and unpaid debt in real time.",
          },
          {
            title: "Secure Cloud Storage",
            desc: "Your data is safe and synced using Supabase.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold mb-2 text-blue-700">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Pricing Section (Single Price Plan) */}
      {/* <section id="pricing" className="mt-20 max-w-3xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Start Your 14-Day Free Trial</h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
        >
          <h3 className="text-2xl font-semibold mb-4 text-blue-700">Free Trial</h3>
          <p className="text-gray-600 mb-4">Try DeynMaare free for 14 days. No credit card required.</p>
          <p className="text-3xl font-bold mb-6">$29 / month after trial</p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
            >
              Start Free Trial
            </Link>

            <Link
              href="/buy"
              className="px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition"
            >
              Buy Now
            </Link>
          </div>
        </motion.div>
      </section> */}

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 border-t mt-20">
        © {new Date().getFullYear()} DeynMaare. All rights reserved.
      </footer>
    </div>
  );
}