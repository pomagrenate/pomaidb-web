"use client";

import { useState } from "react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl text-center py-12 px-6">
        <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#171717] mb-1">Message Sent!</h3>
        <p className="text-[#525252] text-sm">I'll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-xs font-mono font-bold text-[#171717] uppercase tracking-wider mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-mono font-bold text-[#171717] uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-xs font-mono font-bold text-[#171717] uppercase tracking-wider mb-2">
          Subject
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors"
          placeholder="Project inquiry, collaboration, etc."
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-mono font-bold text-[#171717] uppercase tracking-wider mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-[#FAFAF8] border border-[#EAEAEA] rounded-xl text-sm text-[#171717] placeholder-[#A3A3A3] focus:outline-none focus:border-[#6D5DFB] transition-colors resize-none"
          placeholder="Tell me about your project or inquiry..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-xl bg-[#6D5DFB] hover:bg-[#5C4CE5] text-white text-sm font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
