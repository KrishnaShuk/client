// client/components/ui/FileUpload.tsx
'use client';

import React from 'react';
import { UploadCloud } from 'lucide-react';

const FileUpload = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-border rounded-xl p-8 text-center bg-card/50 hover:bg-card transition-colors cursor-pointer">
      <UploadCloud className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">Upload your PDF Document</h2>
      <p className="text-muted-foreground">Drag and drop your file here, or click to select a file.</p>
    </div>
  );
};

export default FileUpload;