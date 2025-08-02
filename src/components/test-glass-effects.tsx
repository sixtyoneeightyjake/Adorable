import React from 'react';

export function TestGlassEffects() {
  return (
    <div className="p-8 space-y-6 bg-brand-gradient min-h-screen">
      <h1 className="text-3xl font-bold text-brand-gradient mb-8">
        Mojo Code Glass Effects Test
      </h1>
      
      {/* Light Glass Effect */}
      <div className="glass-light p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-brand-primary mb-2">
          Light Glass Effect
        </h2>
        <p className="text-brand-secondary">
          This demonstrates the light glassmorphism effect with subtle backdrop blur.
        </p>
      </div>
      
      {/* Medium Glass Effect */}
      <div className="glass p-6 rounded-lg hover-lift">
        <h2 className="text-xl font-semibold text-brand-primary mb-2">
          Medium Glass Effect with Hover
        </h2>
        <p className="text-brand-secondary">
          This shows the standard glass effect with hover lift animation.
        </p>
      </div>
      
      {/* Heavy Glass Effect */}
      <div className="glass-heavy p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-brand-accent mb-2">
          Heavy Glass Effect
        </h2>
        <p className="text-brand-secondary">
          This demonstrates the heavy glassmorphism effect with strong backdrop blur.
        </p>
      </div>
      
      {/* Brand Color Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-primary text-brand-primary-foreground p-4 rounded-lg">
          <h3 className="font-semibold">Primary Color</h3>
          <p className="text-sm opacity-90">Orange-red brand primary</p>
        </div>
        
        <div className="bg-brand-secondary text-brand-secondary-foreground p-4 rounded-lg">
          <h3 className="font-semibold">Secondary Color</h3>
          <p className="text-sm opacity-90">Dark blue-gray secondary</p>
        </div>
        
        <div className="bg-brand-accent text-brand-accent-foreground p-4 rounded-lg">
          <h3 className="font-semibold">Accent Color</h3>
          <p className="text-sm opacity-90">Golden accent color</p>
        </div>
      </div>
      
      {/* Gradient Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-brand-primary-gradient text-white p-6 rounded-lg">
          <h3 className="font-semibold text-lg">Primary Gradient</h3>
          <p className="text-sm opacity-90">Primary to accent gradient</p>
        </div>
        
        <div className="bg-brand-secondary-gradient text-white p-6 rounded-lg">
          <h3 className="font-semibold text-lg">Secondary Gradient</h3>
          <p className="text-sm opacity-90">Secondary to primary gradient</p>
        </div>
      </div>
    </div>
  );
}