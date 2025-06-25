import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(imageUrl?: string): string {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop";
  }
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  
  if (imageUrl.startsWith('/api/upload/files/')) {
    return `${apiUrl.replace('/api', '')}${imageUrl}`;
  }
  
  if (imageUrl.startsWith('/uploads/') || !imageUrl.includes('/')) {
    const filename = imageUrl.replace('/uploads/', '');
    return `${apiUrl}/upload/files/${filename}`;
  }
  
  return imageUrl;
}
