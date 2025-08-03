import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Github, Linkedin, Twitter, MapPin, Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useProfile } from '../lib/hooks/useProfile';
import { useContactInfo } from '../lib/hooks/useContactInfo';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' })
    .refine((email) => {
      const localPart = email.split('@')[0];
      const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/;
      return !turkishChars.test(localPart);
    }, { message: 'Email address cannot contain Turkish characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contact: React.FC = memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const { shouldReduceMotion } = useMobileOptimization();

  const { profile, loading: profileLoading } = useProfile();
  const { contactInfo, loading: contactInfoLoading } = useContactInfo();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setLoading(true);
    setNotification(null);

    try {
      const { error } = await supabase.from('messages').insert([data]);

      if (error) throw error;

      setNotification({
        type: 'success',
        message: 'Your message has been sent successfully!',
      });
      reset();
      
      // 2 saniye sonra modalı kapat
      setTimeout(() => {
        setIsModalOpen(false);
        setNotification(null);
      }, 2000);
    } catch {
      setNotification({
        type: 'error',
        message: 'An error occurred while sending your message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const socialLinks = profile ? [
    {
      name: 'GitHub',
      url: profile.social_links.github,
      icon: Github,
      color: 'hover:text-gray-300',
    },
    {
      name: 'LinkedIn',
      url: profile.social_links.linkedin,
      icon: Linkedin,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Twitter',
      url: profile.social_links.twitter,
      icon: Twitter,
      color: 'hover:text-blue-400',
    },
  ] : [];

  const contactInfoItems = profile ? [
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
      link: `mailto:${profile.email}`,
    },
    {
      icon: MapPin,
      label: 'Location',
      value: contactInfo?.location || 'San Francisco, CA',
    },
    {
      icon: Clock,
      label: 'Timezone',
      value: contactInfo?.timezone || 'PST (UTC-8)',
    },
  ] : [];

  if (profileLoading || contactInfoLoading) {
    return <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's connect and explore how we can work together to bring your ideas to life
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                {contactInfoItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <item.icon size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{item.label}</p>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-white hover:text-gray-300 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-white">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Follow Me
              </h2>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                    className={`w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-gray-700`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Current Availability
              </h2>
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                <div>
                  <p className="text-white font-medium">{contactInfo?.availability_status || 'Available for Projects'}</p>
                  <p className="text-gray-400 text-sm">
                    {contactInfo?.availability_description || 'I\'m currently accepting new projects and collaborations. Feel free to reach out to discuss your ideas!'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Alternative / Message */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Let's Build Something Amazing
              </h2>
              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed">
                  {contactInfo?.contact_description || 'I\'m always excited to discuss new projects, creative ideas, or opportunities to be part of your vision. Whether you need a complete web application, want to integrate AI into your existing systems, or are looking for a technical co-founder, I\'d love to hear from you.'}
                </p>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    What I Can Help With:
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    {(contactInfo?.services_list || [
                      'Full-stack web development',
                      'AI/ML integration and consulting',
                      'Technical architecture and system design',
                      'Code reviews and mentoring',
                      'Startup technical advisory'
                    ]).map((service, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-gray-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Preferred Contact Method
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {contactInfo?.preferred_contact_method || 'Email is the best way to reach me for detailed discussions. I typically respond within 24 hours on weekdays.'}
                  </p>
                                      <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(255, 255, 255, 0.2)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mail size={20} className="mr-2" />
                    Send Message
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-900 border border-gray-800 rounded-lg p-8 w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2">Send Message</h3>
                <p className="text-gray-400 text-sm">
                  Send me a message and I'll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    {...register('email')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Write your message..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-white text-black font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>

              {/* Notification */}
              {notification && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  notification.type === 'success' ? 'bg-green-900/50 border border-green-700 text-green-200' : 'bg-red-900/30 border border-red-700 text-red-200'
                }`}>
                  {notification.message}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default Contact;