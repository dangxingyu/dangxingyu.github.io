// Temporary test data for blog posts
import { BlogPost } from '../types';

export const testBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Human-AI Collaboration",
    slug: "future-human-ai-collaboration",
    excerpt: "Exploring how artificial intelligence will augment human capabilities rather than replace them, and what this means for the future of work and creativity.",
    content: `# The Future of Human-AI Collaboration

As we stand at the threshold of a new era in artificial intelligence, one of the most compelling questions we face is not whether AI will replace humans, but how it will augment and enhance human capabilities.

## The Paradigm Shift

The traditional view of AI as a replacement for human labor is giving way to a more nuanced understanding of AI as a collaborative partner. This shift is not just philosophical—it's practical and immediate.

### Key Areas of Collaboration

1. **Creative Industries**: AI tools are already helping artists, writers, and designers explore new creative territories.
2. **Scientific Research**: Machine learning is accelerating discovery in fields from drug development to climate science.
3. **Decision Making**: AI provides data-driven insights while humans contribute context and ethical reasoning.

## Mathematical Models of Collaboration

We can model the effectiveness of human-AI collaboration using the following equation:

$$E_{collaboration} = \\alpha H + \\beta A + \\gamma (H \\cdot A)$$

Where:
- $H$ represents human contribution
- $A$ represents AI contribution  
- $\\gamma (H \\cdot A)$ captures the synergistic effect
- $\\alpha$, $\\beta$, and $\\gamma$ are optimization parameters

The key insight is that $\\gamma > 0$, meaning the combination yields greater results than the sum of individual contributions.

## Looking Forward

The future belongs to those who can harness the complementary strengths of both human intelligence and artificial intelligence. This is not about competition—it's about collaboration.`,
    publishedAt: "2024-08-15",
    tags: ["AI", "Collaboration", "Future of Work", "Ethics"],
    readingTime: 5
  },
  {
    id: "2", 
    title: "Understanding Transformer Architecture: A Deep Dive",
    slug: "understanding-transformer-architecture",
    excerpt: "A comprehensive technical exploration of the Transformer architecture that revolutionized natural language processing and beyond.",
    content: `# Understanding Transformer Architecture: A Deep Dive

The Transformer architecture, introduced in the seminal paper "Attention Is All You Need" by Vaswani et al., has fundamentally changed the landscape of machine learning, particularly in natural language processing.

## The Attention Mechanism

At the heart of the Transformer lies the attention mechanism, which allows the model to focus on different parts of the input sequence when processing each element.

### Self-Attention Formula

The scaled dot-product attention is computed as:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Where:
- $Q$ is the query matrix
- $K$ is the key matrix  
- $V$ is the value matrix
- $d_k$ is the dimension of the key vectors

## Future Directions

The Transformer architecture continues to evolve:
- **Efficiency Improvements**: Linear attention, sparse attention patterns
- **Scale**: Larger models with billions of parameters
- **Multimodal Applications**: Combining text, images, and audio`,
    publishedAt: "2024-08-10",
    tags: ["Deep Learning", "NLP", "Transformers", "Attention", "Technical"],
    readingTime: 8
  }
];