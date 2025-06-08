
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download } from 'lucide-react';

export function Documents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Documents</h1>
        <p className="text-gray-300">
          Access your training documents, contracts, and receipts
        </p>
      </div>

      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Library
          </CardTitle>
          <CardDescription className="text-gray-300">
            Upload and manage your fitness-related documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No documents yet</h3>
            <p className="text-gray-300 mb-4">
              Upload your first document to get started
            </p>
            <Button className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] hover:from-[#e55a2b] hover:to-[#d67b1e] text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
