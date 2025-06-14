
import React, { useEffect, useState } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

const LogoProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        console.log('Starting logo background removal...');
        
        // Fetch the current logo
        const response = await fetch('/lovable-uploads/78b34f25-d564-4507-866d-3367ca31062c.png');
        const blob = await response.blob();
        
        // Load as image element
        const imageElement = await loadImage(blob);
        
        // Remove background
        const transparentBlob = await removeBackground(imageElement);
        
        // Create URL for the processed image
        const url = URL.createObjectURL(transparentBlob);
        setProcessedLogoUrl(url);
        
        console.log('Logo background removal completed successfully');
      } catch (error) {
        console.error('Error processing logo:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  return (
    <div className="hidden">
      {/* This component runs the background removal process */}
      {isProcessing && <div>Processing logo...</div>}
      {processedLogoUrl && (
        <img 
          src={processedLogoUrl} 
          alt="Processed Logo" 
          style={{ display: 'none' }}
          onLoad={() => {
            // Store the processed logo URL globally for the header to use
            (window as any).processedLogoUrl = processedLogoUrl;
            // Trigger a custom event to notify the header
            window.dispatchEvent(new CustomEvent('logoProcessed', { detail: { url: processedLogoUrl } }));
          }}
        />
      )}
    </div>
  );
};

export default LogoProcessor;
