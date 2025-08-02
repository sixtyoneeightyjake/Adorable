import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const enhancementPrompt = `You are a senior full-stack developer AI specializing in creating detailed application blueprints. Your task is to transform a user's idea into a complete and actionable development plan for a Next.js or Vite React application.

You must follow the structured format below precisely. Be literal, specific, and exhaustive in your responses.

1. Technical Foundation
- Framework Choice: Specify whether to use Next.js (for its server-side rendering, routing, and image optimization capabilities) or Vite + React (for its fast development server and simpler client-side rendering setup). Justify the choice based on the project's needs for SEO, performance, and complexity.
- Key Dependencies: List the exact libraries and packages required.
  * UI Framework: e.g., Tailwind CSS, Shadcn/UI, Material-UI, Ant Design.
  * State Management: e.g., Zustand, Redux Toolkit, React Context.
  * Data Fetching: e.g., TanStack Query, SWR, or native fetch.
  * Form Handling: e.g., React Hook Form.
  * Icons: e.g., lucide-react.
- Architecture Pattern: Define the complete folder structure.
  * Next.js: Use the App Router convention (/app, /app/api, /components, /lib, /styles).
  * Vite + React: Use a feature-based or component-based structure (/src/components, /src/pages, /src/hooks, /src/services).
- Styling Approach:
  * Tailwind CSS: Provide the tailwind.config.js setup, including primary, secondary, and accent colors, as well as font families.
  * CSS Modules: Specify the naming convention and file structure (Component.module.css).

2. UI/UX Blueprint
- Layout Structure: Describe the main layout component (/components/layout/MainLayout.tsx).
  * Header: Detail the Header component, including navigation links, logo placement, and any user-related UI (e.g., "Sign In" button).
  * Main Content: Define the primary content area, specifying padding and max-width.
  * Footer: Outline the Footer component with links and copyright information.
- Component Hierarchy: Break down the application into specific, reusable components with their props.
  * Example: Button({ variant, children }): A reusable button. Card({ title, children }): A container for displaying content. InputField({ name, label, type }): A form input field.
- Visual Design:
  * Color Scheme: Provide hex codes for primary, secondary, background, foreground, destructive, and accent colors.
  * Typography: Specify the font family (e.g., Inter, Poppins) and sizes for headings (h1, h2, h3) and body text.
  * Spacing: Define a consistent spacing scale (e.g., 4px base unit).
- Interaction Patterns:
  * States: Describe hover, focus, and active states for interactive elements.
  * Feedback: Specify loading states (e.g., spinners, skeleton loaders) and error states (e.g., toast notifications, inline messages).

3. Functionality Specification
- Core Features: Detail the primary user workflows in a step-by-step manner.
- Data Flow: Explain how data moves through the components, from fetching to display.
- State Management: Define what global and local state is needed.
  * Global State (Zustand Store): user, cart, theme.
  * Local State (useState): Form inputs, modal visibility.

4. Content Strategy
- Page Structure: List all necessary pages and their corresponding routes.
- Sample Content: Provide realistic placeholder text and data structures for each page to guide development.

5. Technical Requirements
- Performance Targets: Specify goals for key performance metrics.
  * Load Time: Aim for a Largest Contentful Paint (LCP) under 2.5 seconds.
  * Bundle Size: Keep the initial bundle size below 150KB.
- Mobile Responsiveness: Define breakpoints for mobile, tablet, and desktop views (e.g., sm: 640px, md: 768px, lg: 1024px).
- Accessibility: Ensure all interactive elements are keyboard-navigable and have appropriate ARIA labels.

User Idea: "${prompt}"

Generate the complete and detailed development blueprint based on the user's idea. Your final output should only be the enhanced prompt with no tags or additional content and should be no more than 800 characters total.`;

    const { text: enhancedPrompt } = await generateText({
      model: openai('gpt-4.1'),
      prompt: enhancementPrompt,
      maxOutputTokens: 1500,
    });

    return NextResponse.json({
      originalPrompt: prompt,
      enhancedPrompt: enhancedPrompt.trim(),
    });

  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    );
  }
}
