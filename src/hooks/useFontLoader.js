import { useState, useEffect } from 'react';

export const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Check if Font Loading API is supported
        if ('fonts' in document) {
          // Wait for fonts to be ready (this includes fonts loaded via @import)
          await document.fonts.ready;
          
          // Additional check for Framework fonts specifically
          const frameworkFonts = ['Framework-Sans', 'Framework-Sans-Caps'];
          const fontCheckPromises = frameworkFonts.map(fontFamily => {
            return new Promise((resolve) => {
              // Create a test element to check if font is loaded
              const testElement = document.createElement('span');
              testElement.style.fontFamily = `${fontFamily}, monospace`;
              testElement.style.fontSize = '72px';
              testElement.style.position = 'absolute';
              testElement.style.visibility = 'hidden';
              testElement.textContent = 'Test';
              
              document.body.appendChild(testElement);
              
              // Use requestAnimationFrame to ensure the font is applied
              requestAnimationFrame(() => {
                const isLoaded = testElement.offsetWidth !== testElement.offsetHeight;
                document.body.removeChild(testElement);
                resolve(isLoaded);
              });
            });
          });
          
          await Promise.all(fontCheckPromises);
        } else {
          // Fallback for browsers that don't support Font Loading API
          // Use a timeout to simulate font loading
          setTimeout(() => {
            setFontsLoaded(true);
          }, 2000);
          return;
        }

        setFontsLoaded(true);
      } catch (error) {
        console.warn('Font loading failed, using fallback:', error);
        // Fallback: set fonts as loaded after a reasonable timeout
        setTimeout(() => {
          setFontsLoaded(true);
        }, 2000);
      }
    };

    loadFonts();
  }, []);

  return fontsLoaded;
}; 