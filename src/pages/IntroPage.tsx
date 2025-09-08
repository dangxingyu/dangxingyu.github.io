import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail, User } from 'lucide-react';
import { personalInfo, publications } from '../data/content';
import { siteConfig } from '../config/siteConfig';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

function HeroSection() {
  return (
    <div className="min-h-screen bg-white flex items-center relative">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8"
        >
          {/* Avatar at the top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="mb-4"
          >
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-300 bg-gray-100 mx-auto">
                {personalInfo.avatar ? (
                  <img 
                    src={personalInfo.avatar} 
                    alt={personalInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User size={90} className="text-gray-400" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
          
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-black mb-6 leading-tight tracking-tight">
            {personalInfo.name}
          </h1>
          
          <p className="text-2xl text-gray-600 mb-8 font-light">
            {personalInfo.title}
          </p>
          
          <div className="text-lg text-gray-700 mb-12 leading-relaxed max-w-2xl mx-auto">
            <MarkdownRenderer content={personalInfo.bio} />
          </div>
          
          {/* Social links */}
          <div className="flex justify-center space-x-6">
            <motion.a 
              href={`mailto:${personalInfo.email}`} 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
              <span>Contact</span>
            </motion.a>
            
            {personalInfo.social.github && (
              <motion.a 
                href={personalInfo.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} className="text-gray-700" />
              </motion.a>
            )}
            
            {personalInfo.social.linkedin && (
              <motion.a 
                href={personalInfo.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={18} className="text-gray-700" />
              </motion.a>
            )}
            
            {personalInfo.social.twitter && (
              <motion.a 
                href={personalInfo.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </motion.a>
            )}
            
            {personalInfo.social.scholar && (
              <motion.a 
                href={personalInfo.social.scholar} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 border border-gray-300 rounded-full hover:border-black hover:text-black transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink size={18} className="text-gray-700" />
              </motion.a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}


function PublicationsSection() {
  if (!siteConfig.sections.publications) return null;

  return (
    <div className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-4">
            Selected Publications
          </h2>
          <div className="w-16 h-0.5 bg-black mx-auto"></div>
        </motion.div>
        
        <div className="space-y-12">
          {publications.map((publication, index) => (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-black leading-tight group-hover:text-gray-600 transition-colors duration-200">
                    {publication.title}
                  </h3>
                  <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                    {publication.year}
                  </span>
                </div>
                
                <p className="text-gray-600">
                  {publication.authors.join(', ')}
                </p>
                
                <p className="font-medium text-gray-800">
                  {publication.venue}
                </p>
                
                {publication.abstract && (
                  <p className="text-gray-700 leading-relaxed">
                    {publication.abstract}
                  </p>
                )}
                
                <div className="flex items-center space-x-6 text-sm">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {publication.type}
                  </span>
                  {publication.pdf && (
                    <a 
                      href={publication.pdf} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-black hover:underline transition-colors duration-200"
                    >
                      arXiv →
                    </a>
                  )}
                  {publication.doi && (
                    <a 
                      href={`https://doi.org/${publication.doi}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-black hover:underline transition-colors duration-200"
                    >
                      DOI →
                    </a>
                  )}
                </div>
              </div>
              {index < publications.length - 1 && (
                <div className="mt-12 w-full h-px bg-gray-200" />
              )}
            </motion.article>
          ))}
        </div>
        
        {/* Full list link */}
        {personalInfo.social.scholar && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mt-16 pt-8 border-t border-gray-200"
          >
            <a 
              href={personalInfo.social.scholar} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block text-gray-600 hover:text-black transition-colors duration-200 text-lg"
            >
              View full publication list →
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function IntroPage() {
  return (
    <div className="min-h-screen">
      {siteConfig.sections.hero && <HeroSection />}
      {siteConfig.sections.publications && <PublicationsSection />}
    </div>
  );
}