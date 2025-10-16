import { Upload, X, FileImage, Check } from "lucide-react";
import { useRef, useState, useEffect, type DragEvent, type ChangeEvent } from "react";

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const FileUpload = ({ 
  onFilesSelected, 
  maxFiles = 10,
  acceptedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dragCounterRef = useRef(0);
  const imageRef = useRef<HTMLInputElement>(null);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const handleClick = () => {
    imageRef.current?.click();
  };

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles: FileWithPreview[] = [];
    const remainingSlots = maxFiles - files.length;

    Array.from(fileList).slice(0, remainingSlots).forEach((file) => {
      if (acceptedTypes.includes(file.type)) {
        const preview = URL.createObjectURL(file);
        newFiles.push({
          file,
          preview,
          id: `${file.name}-${Date.now()}-${Math.random()}`
        });
      }
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    
    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map(f => f.file));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    // Reset input value to allow re-selecting the same file
    if (imageRef.current) {
      imageRef.current.value = '';
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounterRef.current = 0;
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    
    if (onFilesSelected) {
      onFilesSelected(updatedFiles.map(f => f.file));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 z-50">
      {/* Upload Zone */}
      <div
        className={`relative group transition-all duration-300 ${
          files.length > 0 ? 'h-56' : 'h-96'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept={acceptedTypes.join(",")}
          ref={imageRef}
          onChange={handleChange}
          className="hidden"
        />
        
        <div
          onClick={handleClick}
          className={`
            relative h-full w-full cursor-pointer overflow-hidden
            rounded-3xl border-2 border-dashed
            transition-all duration-500 ease-out
            ${isDragging 
              ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
              : isHovering
              ? 'border-gray-400 bg-gray-500/5 scale-[1.01]'
              : 'border-gray-600/50 bg-gray-900/20'
            }
            backdrop-blur-sm
          `}
        >
          {/* Animated gradient background */}
          <div className={`
            absolute inset-0 opacity-0 transition-opacity duration-500
            bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10
            ${(isDragging || isHovering) ? 'opacity-100' : ''}
          `} />

          {/* Content */}
          <div className="relative h-full flex flex-col items-center justify-center gap-4 p-6">
            {/* Icon with animation */}
            <div className={`
              relative transition-all duration-500
              ${isDragging 
                ? 'scale-110 rotate-12' 
                : isHovering && files.length === 0
                ? 'scale-105' 
                : files.length > 0 
                ? 'scale-75' 
                : 'scale-100'
              }
            `}>
              <div className={`
                absolute inset-0 rounded-full blur-2xl transition-opacity duration-500
                ${isDragging ? 'opacity-60' : 'opacity-0'}
                bg-gradient-to-r from-blue-400 to-purple-400
              `} />
              <div className={`
                relative ${files.length > 0 ? 'p-4' : 'p-8'} rounded-full transition-all duration-500 flex items-center justify-center
                ${isDragging 
                  ? 'bg-blue-500/20 border-2 border-blue-400/50' 
                  : 'bg-gray-800/40 border-2 border-gray-600/30'
                }
              `}>
                <Upload 
                  size={files.length > 0 ? 48 : 64}
                  className={`
                    transition-all duration-500 flex-shrink-0
                    ${isDragging ? 'text-blue-400' : 'text-gray-400'}
                  `}
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className={`
                ${files.length > 0 ? 'text-xl' : 'text-2xl'} font-semibold transition-all duration-300
                ${isDragging ? 'text-blue-400' : 'text-gray-200'}
              `}>
                {isDragging ? 'Drop your images here' : 'Upload Images'}
              </h3>
              {files.length === 0 && (
                <>
                  <p className="text-gray-400 text-sm max-w-md">
                    Drag and drop your images here, or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <FileImage size={14} />
                    <span>Supports: JPG, PNG, WEBP</span>
                    <span>•</span>
                    <span>Max {maxFiles} files</span>
                  </div>
                </>
              )}
              {files.length > 0 && (
                <p className="text-gray-400 text-sm">
                  Click to add more images ({files.length}/{maxFiles})
                </p>
              )}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-2 h-2 rounded-full bg-gray-600/50 transition-all duration-500
                    ${isDragging ? 'bg-blue-400 animate-pulse' : ''}
                  `}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* File Preview Grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Check size={20} className="text-green-400" />
              Selected Files ({files.length}/{maxFiles})
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                files.forEach(f => URL.revokeObjectURL(f.preview));
                setFiles([]);
                if (onFilesSelected) onFilesSelected([]);
              }}
              className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-200"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((fileItem, index) => (
              <div
                key={fileItem.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-900/40 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Preview */}
                <img
                  src={fileItem.preview}
                  alt={fileItem.file.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1">
                    <p className="text-white text-xs font-medium truncate">
                      {fileItem.file.name}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {formatFileSize(fileItem.file.size)}
                    </p>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(fileItem.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 hover:scale-110"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>

                {/* Success indicator */}
                <div className="absolute top-2 left-2 p-1.5 rounded-full bg-green-500/90 text-white">
                  <Check size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;