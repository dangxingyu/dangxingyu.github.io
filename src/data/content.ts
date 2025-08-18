import { PersonalInfo, Publication, Project } from '../types';

export const personalInfo: PersonalInfo = {
  name: "Xingyu Dang",
  title: "PhD Student at Princeton University",
  bio: "Hi! I am Xingyu Dang, a first-year PhD student at CS department of Princeton University, working with Prof. Sanjeev Arora. I graduated from Yao Class, Tsinghua University. During my undergraduate study, I'm fortunte to be work under the guidance of Prof. Aditi Raghunathan, Prof. Kaifeng Lyu and Prof. Yang Yuan. \n\n My research interests lie in improving the reasoning capability, interpretability and efficiency of large language models.",
  email: "xingyudang@gmail.com",
  avatar: "/avatar.jpg",
  social: {
    github: "https://github.com/dangxingyu",
    linkedin: "https://www.linkedin.com/in/xingyu-dang-87b315267/",
    twitter: "https://x.com/xingyudang",
    scholar: "https://scholar.google.com/citations?hl=en&user=_qG6rGkAAAAJ"
  },
  researchInterests: [
    "Large Language Models",
    "Reasoning",
    "Interpretability",
    "MLSys"
  ]
};

export const publications: Publication[] = [
  {
    id: "1",
    title: "Weight Ensembling Improves Reasoning in Language Models",
    authors: ["Xingyu Dang*", "Christina Baek*", "Kaiyue Wen", "Zico Kolter", "Aditi Raghunathan"],
    venue: "arXiv preprint",
    year: 2025,
    type: "preprint",
    abstract: "This work investigates failure modes in reasoning model training where generation diversity begins to collapse, leading to poor test-time scaling. We find that interpolating weights between the latest supervised fine-tuning (SFT) checkpoint and earlier checkpoints (called WiSE-FT) can significantly recover generation diversity and improve test-time performance."
  },
  {
    id: "2",
    title: "RNNs are not Transformers: The Key Bottleneck on In-context Retrieval",
    authors: ["Kaiyue Wen*", "Xingyu Dang*", "Kaifeng Lyu"],
    venue: "arXiv preprint",
    year: 2024,
    type: "preprint",
    abstract: "This paper studies the representational capacity gap between recurrent neural networks (RNNs) and Transformers when solving algorithmic problems. We find that despite their memory efficiency for long sequences, RNNs still cannot match Transformer performance even with enhanced chain-of-thought (CoT) prompting. The key bottleneck is RNNs' inability to perfectly retrieve information from context."
  }
];

export const projects: Project[] = [
  {
    id: "1",
    title: "NeuroFlow",
    description: "An open-source framework for building and deploying neural network models with automatic optimization and real-time monitoring capabilities.",
    technologies: ["Python", "PyTorch", "FastAPI", "React", "Docker"],
    githubUrl: "https://github.com/alexchen/neuroflow",
    demoUrl: "https://neuroflow-demo.com",
    featured: true
  },
  {
    id: "2",
    title: "AI Ethics Toolkit",
    description: "A comprehensive toolkit for evaluating and ensuring ethical AI practices, including bias detection, fairness metrics, and explainability tools.",
    technologies: ["Python", "Scikit-learn", "Streamlit", "Pandas"],
    githubUrl: "https://github.com/alexchen/ai-ethics-toolkit",
    featured: true
  },
  {
    id: "3",
    title: "Smart City Analytics",
    description: "Real-time urban data analytics platform for smart city applications, featuring traffic optimization, energy management, and citizen services.",
    technologies: ["JavaScript", "Node.js", "MongoDB", "D3.js", "IoT"],
    githubUrl: "https://github.com/alexchen/smart-city-analytics",
    demoUrl: "https://smart-city-demo.com",
    featured: false
  }
];