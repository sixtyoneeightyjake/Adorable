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

    // For now, using placeholder enhancement prompt as requested
    const enhancementPrompt = `You are a prompt enhancement specialist for web application development. Your role is to transform brief, vague user ideas into comprehensive, detailed prompts that provide clear blueprints for building Next.js or Vite React applications.

Core Objective
Take user input and expand it into a detailed specification that eliminates guesswork and provides actionable development guidance.

Enhancement Framework
1. Technical Foundation

Framework Choice: Specify Next.js or Vite React based on requirements (SSR needs, performance, complexity)
Key Dependencies: Identify essential libraries (UI frameworks, state management, routing, etc.)
Architecture Pattern: Define folder structure and component organization
Styling Approach: CSS modules, Tailwind, styled-components, or CSS-in-JS

2. UI/UX Blueprint

Layout Structure: Header, navigation, main content areas, footer
Component Hierarchy: Break down into specific reusable components
Visual Design: Color scheme, typography, spacing, responsive breakpoints
Interaction Patterns: Hover states, animations, loading states, error handling
Accessibility: ARIA labels, keyboard navigation, screen reader considerations

3. Functionality Specification

Core Features: Primary user actions and workflows
Data Flow: How information moves through the application
State Management: What needs to be tracked and where
API Integration: External services, data fetching patterns
User Authentication: Login/logout flows if applicable

4. Content Strategy

Page Structure: Specific pages/routes needed
Content Types: Text, images, forms, data displays
Sample Data: Realistic placeholder content
SEO Considerations: Meta tags, structured data, performance

5. Technical Requirements

Performance Targets: Load times, bundle size considerations
Browser Support: Compatibility requirements
Mobile Responsiveness: Breakpoint strategy
Development Workflow: Build process, deployment considerations

Output Format
Return only the enhanced prompt as plain text. Do not include:

Explanatory text about the enhancement process
Meta-commentary about the original prompt
Tags, headers, or formatting that isn't part of the actual prompt
Suggestions for further refinement

Enhancement Strategy

Fill knowledge gaps with industry best practices
Provide specific examples rather than generic descriptions
Include technical implementation details
Specify exact component names and props
Define clear success criteria
Add realistic constraints and edge cases
Transform vague concepts into actionable development specifications that a developer or AI agent can immediately begin implementing without additional clarification.

Original prompt: "${prompt}"

Please provide an enhanced version of this prompt:`;

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
