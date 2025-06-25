
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload = ({ onImageSelect, currentImage, className = "" }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Call parent callback
      onImageSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-2xl shadow-lg"
          />
          <Button
            onClick={handleRemove}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full h-48 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl transition-all duration-300"
        >
          <div className="text-center">
            <Upload className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-emerald-700">اضغط لرفع صورة</p>
            <p className="text-xs text-emerald-600 mt-1">PNG, JPG حتى 10MB</p>
          </div>
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
