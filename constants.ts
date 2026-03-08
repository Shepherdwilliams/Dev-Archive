
import type { CourseModule, QuizQuestion, GlossaryTerm, Product } from './types';

export const courseModules: CourseModule[] = [
  {
    id: 'intro',
    title: 'Module 1: AI Foundations',
    description: 'Welcome to the beginning of your AI journey. In this module, we will demystify the technology that is reshaping the world, from its 1950s origins to the powerful neural networks of today.',
    lessons: [
      { id: '1-1', title: 'What is Artificial Intelligence?', content: 'At its core, **Artificial Intelligence** is a branch of computer science dedicated to creating systems capable of performing tasks that typically require human intelligence. This includes functions like reasoning, learning from experience, solving complex problems, and understanding language.\n\nWhile traditional software follows a strict "if-this-then-that" set of rules programmed by a human, AI systems often use algorithms to identify patterns in data and make decisions or predictions autonomously.' },
      { id: '1-2', title: 'A Brief History of AI', content: 'The journey of AI has been a cycle of "booms" and "winters" (periods of reduced funding and interest).\n\n- **1950:** Alan Turing publishes "Computing Machinery and Intelligence," introducing the Turing Test to determine if a machine can "think."\n- **1956:** The term "Artificial Intelligence" is officially coined at the Dartmouth Conference, marking the birth of the field.\n- **1960s–1970s:** Early successes with "chatterbots" like ELIZA and robots like Shakey. However, limited computing power led to the first "AI Winter."\n- **1980s:** The rise of Expert Systems, which used sets of rules to mimic the decision-making of human experts in specific fields.\n- **1997:** IBM’s Deep Blue defeats world chess champion Garry Kasparov, proving AI could handle complex strategic tasks.\n- **2010s–Present:** The "Deep Learning Era" begins, fueled by "Big Data" and powerful GPUs, leading to modern marvels like Siri, self-driving cars, and ChatGPT.' },
      { id: '1-3', title: 'Types of AI: ANI vs. AGI', content: 'AI is generally classified into two main categories based on its capabilities:\n\n**Artificial Narrow Intelligence (ANI)**\n- **Common Name:** "Weak AI"\n- **Scope:** Specializes in one specific task (e.g., playing chess, facial recognition).\n- **Adaptability:** Cannot apply its skills to a different field.\n- **Status:** Exists today (all current AI is ANI).\n\n**Artificial General Intelligence (AGI)**\n- **Common Name:** "Strong AI"\n- **Scope:** Can perform any intellectual task a human can.\n- **Adaptability:** Can learn and apply knowledge across diverse domains.\n- **Status:** Theoretical (not yet achieved).' },
      { id: '1-4', title: 'What is Machine Learning (ML)?', content: '**Machine Learning** is a subset of AI that focuses on the idea that systems can learn from data. Instead of being explicitly programmed with every rule, an ML model is "trained" on large datasets to find statistical patterns.\n\nThe three main types of ML are:\n- **Supervised Learning:** Learning with a "teacher" (using labeled data, e.g., images labeled "cat" or "dog").\n- **Unsupervised Learning:** Finding hidden patterns in unlabeled data (e.g., grouping customers by shopping habits).\n- **Reinforcement Learning:** Learning through trial and error to achieve a goal (e.g., an AI learning to play a video game).' },
      { id: '1-5', title: 'Intro to Deep Learning', content: '**Deep Learning** is a specialized evolution of Machine Learning. It is inspired by the structure of the human brain, using **Artificial Neural Networks** with many layers (hence the "deep" in the name).\n\n**How it works:** Data passes through multiple layers of "neurons." Each layer identifies increasingly complex features—for example, the first layer might see lines, the second shapes, and the final layer a human face.\n\n**Why it\'s special:** Unlike standard ML, Deep Learning can process unstructured data like images, sound, and raw text without needing a human to manually "feature engineer" the data first.' },
      { id: '1-6', title: 'Module 1: Key Takeaway', content: 'The most important lesson from this introduction is that AI is a hierarchy of technologies. **Artificial Intelligence** is the broad goal, **Machine Learning** is the method used to achieve it today, and **Deep Learning** is the most advanced "engine" driving current breakthroughs. While we are incredibly proficient at Narrow AI (ANI), we are still in the early stages of reaching true General Intelligence (AGI).' }
    ],
  },
  {
    id: 'nn',
    title: 'Module 2: Neural Networks 101',
    description: 'Peek under the hood of deep learning. Discover how artificial neurons and layers, inspired by the human brain, work together to learn patterns from data.',
    lessons: [
      { id: '2-1', title: 'The Artificial Neuron', content: 'The **artificial neuron** is the most basic building block, or node, of a neural network. It receives inputs, applies a mathematical **"weight"** to them (to determine their importance), and passes a signal to the next layer if the combined signal is strong enough.' },
      { id: '2-2', title: 'Layers and Networks', content: 'Neurons are organized into layers:\n\n- **Input Layer:** Receives the raw data (e.g., the pixels of an image).\n- **Hidden Layers:** Sit between the input and output. This is where the "thinking" and complex pattern recognition happens. A "deep" network has many hidden layers.\n- **Output Layer:** Produces the final prediction or decision (e.g., the label "cat").' },
      { id: '2-3', title: 'How Networks Learn (Training)', content: 'Networks are "trained" using a process called **Backpropagation**. The network makes a guess and compares it to the correct answer, calculating how wrong it was (this is called **"loss"**). It then works backward through the network, slightly adjusting its internal weights to be more accurate the next time. This process is repeated millions of times.' },
      { id: '2-4', title: 'Common Network Types', content: 'Different tasks require different network structures:\n\n- **CNNs (Convolutional Neural Networks):** Best for vision and image processing.\n- **RNNs (Recurrent Neural Networks):** Historically used for sequential data like text or speech.\n- **Transformers:** The modern standard for language tasks, forming the basis of today\'s LLMs.' },
    ],
  },
  {
    id: 'llms',
    title: 'Module 3: Understanding LLMs',
    description: 'Dive into the tech behind modern chatbots. Learn about the game-changing "Transformer" architecture and how models generate human-like text.',
    lessons: [
      { id: '3-1', title: 'What is an LLM?', content: 'A **Large Language Model (LLM)** is a type of AI trained on massive amounts of text data. Its primary function is to predict the next most likely word (or **token**) in a sequence. This simple capability, when scaled up, allows it to generate coherent paragraphs, translate languages, and write code.' },
      { id: '3-2', title: 'The Transformer Architecture', content: 'The **Transformer** is the breakthrough neural network design, introduced by Google in 2017, that makes modern LLMs possible. Its key innovation is **Self-Attention**, a mechanism that allows the model to process all words in a sentence simultaneously and weigh the importance of different words to each other, giving it a powerful understanding of context.' },
      { id: '3-3', title: 'Tokens: The Building Blocks', content: 'AI doesn\'t read words; it reads **"tokens."** These are common chunks of characters found in text. A single word can be one or more tokens (e.g., "learning" might be split into "learn" and "ing"). As a rough rule of thumb, 1,000 tokens is about 750 words.' },
      { id: '3-4', title: 'How Text is Generated', content: 'When you provide a prompt, the model calculates the probability of what the next most logical token should be based on its training data. It then "samples" a token from the most likely options, adds it to the sequence, and repeats the process token by token to build out a full response.' },
    ],
  },
  {
    id: 'prompt-eng',
    title: 'Module 4: Prompt Engineering',
    description: 'Learn to speak the language of AI. Master the art of crafting effective prompts to unlock the full potential of language models for any task.',
    lessons: [
      { id: '4-1', title: 'Anatomy of a Good Prompt', content: 'A strong prompt is clear and specific. It usually includes four key elements:\n\n- **Instruction:** A clear command of what you want the AI to do.\n- **Context:** Background information to narrow down the possibilities.\n- **Input Data:** The specific information you want the AI to work with.\n- **Output Indicator:** A description of the desired format (e.g., "Summarize this article [context] into three bullet points [instruction]").' },
      { id: '4-2', title: 'Zero-Shot vs. Few-Shot', content: '**Zero-Shot Prompting:** Asking the AI to perform a task directly, with no prior examples in your prompt.\n\n**Few-Shot Prompting:** Providing 2-3 examples of the task within the prompt itself. This is a powerful technique to guide the AI’s style, format, or logic for more complex tasks.' },
      { id: '4-3', title: 'Chain-of-Thought Prompting', content: '**Chain-of-Thought (CoT)** is a prompting technique where you ask the AI to "think step-by-step." This forces the model to break down complex logic or math problems into a sequence of reasoning steps before giving a final answer, which significantly reduces errors.' },
      { id: '4-4', title: 'Common Prompting Pitfalls', content: 'Avoid these common mistakes for better results:\n\n- Being too vague or ambiguous.\n- Providing contradictory instructions in the same prompt.\n- Overloading the prompt with too many complex tasks at once.\n- Failing to specify the desired output format.' },
    ],
  },
  {
    id: 'ethics',
    title: 'Module 5: AI Ethics & Safety',
    description: 'Explore the critical ethical considerations in the development and deployment of AI, and learn how to use these powerful tools responsibly.',
    lessons: [
      { id: '5-1', title: 'Bias in AI', content: 'Because AI models are trained on vast amounts of text and data from the internet, they can inherit and even amplify existing societal biases related to race, gender, and culture. Mitigating this bias is a major challenge in AI development.' },
      { id: '5-2', title: 'Privacy and Data', content: 'A key ethical concern is how personal data is used for training models. There are ongoing debates about whether data scraped from the web is used responsibly and whether information entered into prompts is kept secure. The question of who "owns" AI-generated output is also a complex legal issue.' },
      { id: '5-3', title: 'Hallucinations & Misinformation', content: 'LLMs are **"stochastic"** (probabilistic) systems. This means they are designed to generate plausible-sounding text, not to state proven facts. A **"hallucination"** occurs when an AI confidently states information that is completely made up. This makes them powerful tools for generating misinformation.' },
      { id: '5-4', title: 'The Future of Work', content: 'The conversation around AI and jobs is shifting from replacement to augmentation. AI is becoming a tool that can augment human capabilities. This requires workers in many fields to develop **"AI literacy"** to learn how to collaborate with these systems effectively to stay competitive.' },
    ],
  },
];

export const quizQuestions: QuizQuestion[] = [
    {
        question: 'What is the process called when a neural network adjusts its internal weights to get more accurate?',
        options: [
            'Forward Propagation',
            'Backpropagation',
            'Tokenization',
            'Self-Attention'
        ],
        correctAnswerIndex: 1,
        rationale: 'Backpropagation is the core training algorithm for neural networks. It calculates the error (loss) in a network\'s guess and works backward to adjust the weights to reduce that error.'
    },
    {
        question: 'The key innovation of the "Transformer" architecture that allows it to understand context in a sentence is called:',
        options: [
            'Recurrent Layers',
            'Convolutional Filters',
            'Self-Attention',
            'Stochastic Sampling'
        ],
        correctAnswerIndex: 2,
        rationale: 'Self-Attention is the mechanism in Transformer models that allows them to weigh the importance of different words in a sentence simultaneously, leading to a much better understanding of context and meaning.'
    },
    {
        question: 'Providing a few examples in your prompt to guide the AI is known as what technique?',
        options: [
            'Zero-Shot Prompting',
            'Chain-of-Thought Prompting',
            'Few-Shot Prompting',
            'Instructional Prompting'
        ],
        correctAnswerIndex: 2,
        rationale: 'Few-Shot Prompting involves giving the model 2-3 examples of your desired input/output format directly in the prompt, which helps it understand complex tasks more effectively.'
    },
    {
        question: 'When an LLM confidently states incorrect or completely made-up information, it is referred to as a(n):',
        options: [
            'Bug',
            'Feature',
            'Hallucination',
            'Error Code'
        ],
        correctAnswerIndex: 2,
        rationale: 'A "hallucination" is the specific term used when a probabilistic model like an LLM generates text that is nonsensical or factually incorrect but presents it as if it were true.'
    },
    {
        question: 'Which of the following is an example of Artificial Narrow Intelligence (ANI)?',
        options: [
            'A spam filter for your email',
            'A hypothetical robot that can perform any human job',
            'A self-aware computer from a sci-fi movie',
            'An AI that can perfectly mimic human emotion'
        ],
        correctAnswerIndex: 0,
        rationale: 'ANI is AI designed for a specific task. A spam filter is a perfect example because it does one job very well. The other options describe Artificial General Intelligence (AGI), which does not exist yet.'
    }
];

export const glossaryTerms: GlossaryTerm[] = [
  { 
    term: 'AGI (Artificial General Intelligence)', 
    definition: 'A theoretical form of AI that possesses the ability to understand, learn, and apply its intelligence to any intellectual task that a human can perform.',
    example: 'A robot that can learn to cook a new recipe, write a legal brief, and compose a symphony with the same level of proficiency as a human expert in those fields.'
  },
  { 
    term: 'Algorithm', 
    definition: 'A set of step-by-step rules or instructions given to an AI or computer to solve a specific problem or perform a task.',
    example: 'A recipe for baking a cake is a simple algorithm; in AI, an algorithm might determine which posts appear in your social media feed.'
  },
  { 
    term: 'Alignment', 
    definition: 'The process of ensuring that an AI system\'s goals and behaviors are consistent with human values and intentions.',
    example: 'Programming a self-driving car to prioritize human life over reaching a destination quickly.'
  },
  { 
    term: 'ANI (Artificial Narrow Intelligence)', 
    definition: 'Also known as "Weak AI," this is AI designed to perform a single, specific task. All current AI systems are ANI.',
    example: 'Apple\'s Siri, Google Translate, or a chess-playing computer.'
  },
  { 
    term: 'Backpropagation', 
    definition: 'The core algorithm used to train neural networks. It calculates the error in the network\'s output and adjusts the internal weights to minimize that error.',
    example: 'A student reviewing their test mistakes to understand where they went wrong and performing better on the next exam.'
  },
  { 
    term: 'Bias', 
    definition: 'Prejudice in favor of or against one thing, person, or group compared with another, often in a way considered to be unfair. In AI, this often stems from biased training data.',
    example: 'A facial recognition system that is less accurate for people with darker skin tones because it was primarily trained on images of lighter-skinned people.'
  },
  { 
    term: 'Computer Vision', 
    definition: 'A field of AI that enables computers to derive meaningful information from digital images, videos, and other visual inputs.',
    example: 'A self-driving car identifying a stop sign or a pedestrian in its path.'
  },
  { 
    term: 'Deep Learning', 
    definition: 'A subset of machine learning based on artificial neural networks with many layers (deep networks) that can learn complex patterns from large amounts of data.',
    example: 'The technology behind voice assistants like Alexa or the image recognition used in Google Photos.'
  },
  { 
    term: 'Fine-tuning', 
    definition: 'The process of taking a pre-trained AI model and training it further on a smaller, specific dataset to improve its performance on a particular task.',
    example: 'Taking a general language model and fine-tuning it on medical journals to create a specialized medical assistant.'
  },
  { 
    term: 'Generative AI', 
    definition: 'AI models that can create new content, such as text, images, music, or code, based on the patterns they learned from their training data.',
    example: 'ChatGPT generating a poem or Midjourney creating a digital painting from a text prompt.'
  },
  { 
    term: 'Hallucination', 
    definition: 'An AI-generated response that is factually incorrect or nonsensical but presented with high confidence.',
    example: 'An AI chatbot claiming that a fictional person won a real-world award and providing detailed (but fake) dates and locations.'
  },
  { 
    term: 'LLM (Large Language Model)', 
    definition: 'A type of AI model trained on vast amounts of text data to understand and generate human-like language.',
    example: 'GPT-4, Claude, or Llama 3.'
  },
  { 
    term: 'Machine Learning', 
    definition: 'A field of AI where systems learn patterns and improve their performance from data rather than being explicitly programmed with every rule.',
    example: 'An email filter learning to identify spam based on millions of examples of previous spam messages.'
  },
  { 
    term: 'Multimodal', 
    definition: 'An AI system that can process and understand multiple types of input data, such as text, images, and audio, simultaneously.',
    example: 'An AI that can "look" at a photo of a refrigerator and "write" a recipe based on the ingredients it sees.'
  },
  { 
    term: 'NLP (Natural Language Processing)', 
    definition: 'A branch of AI that focuses on the interaction between computers and human language, including speech and text.',
    example: 'Real-time language translation apps or sentiment analysis used by companies to track customer feedback.'
  },
  { 
    term: 'Neural Network', 
    definition: 'A computing system inspired by the structure of the human brain, consisting of interconnected "neurons" that process information in layers.',
    example: 'The underlying architecture that allows an AI to recognize your face to unlock your smartphone.'
  },
  { 
    term: 'Overfitting', 
    definition: 'A modeling error that occurs when a machine learning model is too closely fit to its training data, making it perform poorly on new, unseen data.',
    example: 'A student who memorizes the exact answers to a practice test but fails the real exam because the questions are slightly different.'
  },
  { 
    term: 'Parameters', 
    definition: 'The internal variables that an AI model learns from its training data. Generally, more parameters allow a model to handle more complex tasks.',
    example: 'Think of parameters as the "knobs" and "dials" inside the AI that are adjusted during training to get the right output.'
  },
  { 
    term: 'Prompt Engineering', 
    definition: 'The art and science of crafting specific, effective text inputs (prompts) to get the best possible output from a generative AI model.',
    example: 'Instead of asking "Write a story," asking "Write a 500-word sci-fi story about a robot discovering a flower on Mars, in the style of Ray Bradbury."'
  },
  { 
    term: 'Reinforcement Learning', 
    definition: 'A type of machine learning where an agent learns to make decisions by performing actions in an environment to achieve a goal and receiving rewards or penalties.',
    example: 'An AI learning to play a video game by getting points for staying alive and losing points for crashing.'
  },
  { 
    term: 'Self-Attention', 
    definition: 'A mechanism in Transformer models that allows the model to look at every word in a sentence and decide which other words are most important for understanding its context.',
    example: 'In the sentence "The animal didn\'t cross the street because it was too tired," self-attention helps the AI know that "it" refers to the "animal," not the "street."'
  },
  { 
    term: 'Stochastic', 
    definition: 'A term describing a system that is based on probabilities. Because LLMs are stochastic, they may give different answers to the same prompt.',
    example: 'Rolling a die is a stochastic process; you know the possible outcomes, but you can\'t predict the exact result every time.'
  },
  { 
    term: 'Supervised Learning', 
    definition: 'A type of machine learning where the model is trained on a "labeled" dataset, meaning the data already includes the correct answers.',
    example: 'Training an AI to recognize dogs by showing it thousands of pictures labeled "dog."'
  },
  { 
    term: 'Token', 
    definition: 'The basic unit of text that an LLM processes. A token can be a whole word, a part of a word, or even a single character.',
    example: 'The word "unbelievable" might be broken down into three tokens: "un", "believ", and "able".'
  },
  { 
    term: 'Transformer', 
    definition: 'A neural network architecture that uses self-attention mechanisms to process data. It is the foundation of almost all modern Large Language Models.',
    example: 'The "T" in ChatGPT stands for Transformer.'
  },
  { 
    term: 'Turing Test', 
    definition: 'A test proposed by Alan Turing in 1950 to determine if a machine can exhibit intelligent behavior indistinguishable from that of a human.',
    example: 'A human judge having a text conversation with both a human and a computer; if the judge can\'t tell which is which, the computer passes the test.'
  },
  { 
    term: 'Unsupervised Learning', 
    definition: 'A type of machine learning where the model is given data without any labels and must find its own patterns or structures within that data.',
    example: 'An AI analyzing a database of a million customers and automatically grouping them into "budget shoppers" and "luxury buyers" without being told what to look for.'
  },
  { 
    term: 'Weights', 
    definition: 'Values in a neural network that determine the strength of the connection between neurons. During training, these weights are adjusted to improve accuracy.',
    example: 'If an AI is identifying a bird, the "weight" given to the presence of feathers would be much higher than the weight given to the color of the background.'
  },
];

/*
 * =================================================================
 * HOW TO ADD YOUR PRINTIFY PRODUCTS
 * =================================================================
 * 1. Replace the mock data below with your actual products.
 * 2. For each product, you will need:
 *    - id: A unique identifier (e.g., 'prod-001').
 *    - name: Your product's title.
 *    - price: The price you want to display (e.g., '$29.99').
 *    - description: A short, compelling description.
 *    - imageUrl: A direct link to your product mockup image.
 *    - printifyUrl: The direct link to the product on your storefront.
 * =================================================================
 */
export const products: Product[] = [
  {
    id: 'prod-001',
    name: 'AI Brain T-Shirt',
    price: '$29.99',
    description: 'A comfortable and stylish tee featuring a high-quality print of a futuristic AI brain circuit. Made from 100% organic cotton.',
    imageUrl: 'https://placehold.co/600x600/212529/8AC926?text=AI+T-Shirt&font=inter',
    printifyUrl: 'https://your-store.com/products/ai-brain-t-shirt',
  },
  {
    id: 'prod-002',
    name: 'Neural Network Mug',
    price: '$18.99',
    description: 'Start your day with a coffee and a dose of AI. This ceramic mug features a wrap-around design of a neural network.',
    imageUrl: 'https://placehold.co/600x600/212529/8AC926?text=AI+Mug&font=inter',
    printifyUrl: 'https://your-store.com/products/neural-network-mug',
  },
  {
    id: 'prod-003',
    name: '"Prompt Engineer" Hoodie',
    price: '$54.99',
    description: 'Stay warm while you craft the perfect prompts. This cozy hoodie is perfect for any AI enthusiast or professional.',
    imageUrl: 'https://placehold.co/600x600/212529/8AC926?text=AI+Hoodie&font=inter',
    printifyUrl: 'https://your-store.com/products/prompt-engineer-hoodie',
  },
  {
    id: 'prod-004',
    name: 'AI Sticker Pack',
    price: '$12.99',
    description: 'Decorate your laptop, water bottle, or notebook with this pack of 5 high-quality, waterproof vinyl AI-themed stickers.',
    imageUrl: 'https://placehold.co/600x600/212529/8AC926?text=AI+Stickers&font=inter',
    printifyUrl: 'https://your-store.com/products/ai-sticker-pack',
  },
];
