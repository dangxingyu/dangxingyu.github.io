import { PersonalInfo, Publication } from '../types';

export const personalInfo: PersonalInfo = {
  name: "Xingyu Dang",
  title: "PhD Student at Princeton University",
  bio: "Hi! I am Xingyu Dang, a first-year PhD student at CS department of Princeton University, working with [Prof. Sanjeev Arora](https://www.cs.princeton.edu/~arora/). I graduated from Yao Class, Tsinghua University. During my undergraduate study, I was fortunate to work under the guidance of [Prof. Aditi Raghunathan](https://www.cs.cmu.edu/~aditirag/), [Prof. Kaifeng Lyu](https://kaifeng.ac/) and [Prof. Yang Yuan](http://people.iiis.tsinghua.edu.cn/~yuanyang/en.html). \n\n My research interests lie in large language models: how pretraining scales, how capabilities such as reasoning emerge, and how algorithms can make efficient use of them.",
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
    "Pretraining & Scaling",
    "Reasoning",
    "Learning Theory"
  ]
};

export const publications: Publication[] = [
  {
    id: "6",
    title: "Learning What to Remember: Test-Time Training via Context Distillation",
    authors: ["Zixuan Wang", "Xingyu Dang", "Rui-Jie Zhu", "Zixin Wen", "Hengyu Fu", "Wenhao Chai", "Jason D. Lee"],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    pdf: "https://arxiv.org/abs/2608.01672",
    summary: "context distillation as a test-time objective"
  },
  {
    id: "5",
    title: "Fantastic Pretraining Optimizers and Where to Find Them II: Hyperball Optimization",
    authors: ["Kaiyue Wen", "Xingyu Dang", "Kaifeng Lyu", "Tengyu Ma", "Percy Liang"],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    pdf: "https://arxiv.org/abs/2606.16899",
    summary: "weight-normalized training"
  },
  {
    id: "4",
    title: "The Power of Power Law: Asymmetry Enables Compositional Reasoning",
    authors: ["Zixuan Wang", "Xingyu Dang", "Jason D. Lee", "Kaifeng Lyu"],
    venue: "ICML 2026 (Spotlight)",
    year: 2026,
    type: "conference",
    pdf: "https://arxiv.org/abs/2604.22951",
    summary: "why power-law data beats uniformly reweighted data for compositional reasoning"
  },
  {
    id: "3",
    title: "Escaping the Cognitive Well: Efficient Competition Math with Off-the-Shelf Models",
    authors: ["Xingyu Dang", "Rohit Agarwal*", "Rodrigo Porto", "Anirudh Goyal", "Liam H Fowl*", "Sanjeev Arora"],
    venue: "arXiv preprint",
    year: 2026,
    type: "preprint",
    pdf: "https://arxiv.org/abs/2602.16793",
    summary: "SOTA IMO problem solver scaffolding"
  },
  {
    id: "1",
    title: "Weight Ensembling Improves Reasoning in Language Models",
    authors: ["Xingyu Dang*", "Christina Baek*", "Kaiyue Wen", "Zico Kolter", "Aditi Raghunathan"],
    venue: "COLM 2025",
    year: 2025,
    type: "conference",
    pdf: "https://arxiv.org/abs/2504.10478",
    summary: "why increasing top-1 hurts top-k on SFT & RL, and how to fix it"
  },
  {
    id: "2",
    title: "RNNs are not Transformers: The Key Bottleneck on In-context Retrieval",
    authors: ["Kaiyue Wen*", "Xingyu Dang*", "Kaifeng Lyu"],
    venue: "ICLR 2025",
    year: 2024,
    type: "conference",
    pdf: "https://arxiv.org/abs/2402.18510",
    summary: "representation gap between RNNs and Transformers (both with CoT!)"
  }
];
