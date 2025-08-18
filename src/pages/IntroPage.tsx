import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail, User, Twitter } from 'lucide-react';
import { personalInfo, publications, projects } from '../data/content';
import { siteConfig } from '../config/siteConfig';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';

function HeroSection() {
  return (
    <Section className="pt-20 pb-16">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Text content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            <span className="text-gradient">{personalInfo.name.split(' ')[0]}</span>{' '}
            <span className="text-[var(--text-primary)]">{personalInfo.name.split(' ')[1]}</span>
          </h1>
          
          <p className="text-xl text-[var(--accent-blue)] mb-6 font-medium">
            {personalInfo.title}
          </p>
          
          <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
            {personalInfo.bio}
          </p>
          
          {/* Social links */}
          <div className="flex space-x-4">
            <Button variant="secondary" size="sm" asChild>
              <a href={`mailto:${personalInfo.email}`} className="flex items-center space-x-2">
                <Mail size={16} />
                <span>Contact</span>
              </a>
            </Button>
            
            {personalInfo.social.github && (
              <Button variant="ghost" size="sm" asChild>
                <a href={personalInfo.social.github} target="_blank" rel="noopener noreferrer">
                  <Github size={16} />
                </a>
              </Button>
            )}
            
            {personalInfo.social.linkedin && (
              <Button variant="ghost" size="sm" asChild>
                <a href={personalInfo.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin size={16} />
                </a>
              </Button>
            )}
            
            {personalInfo.social.twitter && (
              <Button variant="ghost" size="sm" asChild>
                <a href={personalInfo.social.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter size={16} />
                </a>
              </Button>
            )}
          </div>
        </motion.div>
        
        {/* Right side - Avatar/Visual element */}
        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="w-64 h-64 rounded-full border-2 border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-secondary)]"
              whileHover={{
                scale: 1.02,
              }}
              transition={{
                scale: { duration: 0.2, ease: "easeOut" },
              }}
            >
              {personalInfo.avatar ? (
                <img 
                  src={personalInfo.avatar} 
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] flex items-center justify-center">
                  <User size={80} className="text-[var(--accent-blue)]" />
                </div>
              )}
            </motion.div>
            
            {/* Simplified floating elements */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--accent-blue)]/20 rounded-full border border-[var(--accent-blue)]/50 backdrop-blur-sm"
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-[var(--accent-secondary)]/20 rounded-full border border-[var(--accent-secondary)]/50 backdrop-blur-sm"
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function ResearchInterestsSection() {
  return (
    <Section 
      title="Research Interests" 
      subtitle="Areas of focus in my research and development work"
    >
      <div className="flex flex-wrap justify-center gap-3">
        {personalInfo.researchInterests.map((interest, index) => (
          <motion.div
            key={interest}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Tag variant="accent" className="text-base px-4 py-2">{interest}</Tag>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function PublicationsSection() {
  return (
    <Section 
      title="Selected Publications" 
      subtitle="Selected research papers and academic contributions"
    >
      <div className="space-y-6">
        {publications.map((publication, index) => (
          <motion.div
            key={publication.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="hover:border-[var(--accent-blue)]/50">
              <div className="flex flex-col space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-tight">
                    {publication.title}
                  </h3>
                  <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap ml-4">
                    {publication.year}
                  </span>
                </div>
                
                <p className="text-sm text-[var(--text-secondary)]">
                  {publication.authors.join(', ')}
                </p>
                
                <p className="text-sm font-medium text-[var(--accent-blue)]">
                  {publication.venue}
                </p>
                
                {publication.abstract && (
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {publication.abstract}
                  </p>
                )}
                
                <div className="flex items-center space-x-3 pt-2">
                  <Tag>{publication.type}</Tag>
                  {publication.doi && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                        <ExternalLink size={14} />
                        <span>DOI</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
        
        {/* Full list link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: publications.length * 0.1 }}
          viewport={{ once: true }}
          className="text-center pt-6"
        >
          <Button variant="secondary" asChild>
            <a 
              href={personalInfo.social.scholar} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-2"
            >
              <ExternalLink size={16} />
              <span>View Full Publication List</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </Section>
  );
}

function ProjectsSection() {
  return (
    <Section 
      title="Featured Projects" 
      subtitle="Open source projects and research implementations"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card 
              variant={project.featured ? 'default' : 'alt'}
              className="h-full flex flex-col"
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Tag variant="accent">Featured</Tag>
                  )}
                </div>
                
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 mt-4 border-t border-[var(--border-subtle)]">
                {project.githubUrl && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                      <Github size={14} />
                      <span>Code</span>
                    </a>
                  </Button>
                )}
                {project.demoUrl && (
                  <Button variant="secondary" size="sm" asChild>
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1">
                      <ExternalLink size={14} />
                      <span>Demo</span>
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function IntroPage() {
  return (
    <div className="space-y-16">
      {siteConfig.sections.hero && <HeroSection />}
      {siteConfig.sections.researchInterests && <ResearchInterestsSection />}
      {siteConfig.sections.publications && <PublicationsSection />}
      {siteConfig.sections.projects && <ProjectsSection />}
    </div>
  );
}