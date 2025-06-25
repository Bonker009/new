'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Building, MapPin, DollarSign, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ownerService } from '@/services/owner';
import { uploadService } from '@/services/upload';
import { useApiMutation, useApi } from '@/hooks/useApi';

const createRenthouseSchema = z.object({
  name: z.string().min(1, 'Property name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  address: z.string().min(1, 'Address is required'),
  baseRent: z.string().min(1, 'Base rent is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid base rent format'),
  waterFee: z.string().min(1, 'Water fee is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid water fee format'),
  electricityFee: z.string().min(1, 'Electricity fee is required').regex(/^\d+(\.\d{1,2})?$/, 'Invalid electricity fee format'),
  qrCodeImage: z.string().max(2000, 'QR Code image URL too long').optional(),
  imageUrl: z.string().max(2000, 'Image URL too long').optional(),
});

type CreateRenthouseForm = z.infer<typeof createRenthouseSchema>;

// This type should match what the backend's CreateRenthouseRequest expects
type CreateRenthousePayload = Omit<CreateRenthouseForm, 'baseRent' | 'latitude' | 'longitude'> & {
  baseRent: number;
  latitude: number;
  longitude: number;
  address: string;
};

export function NewRenthouseForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const createMutation = useApiMutation(ownerService.createRenthouse);
  const updateMutation = useApiMutation(ownerService.updateRenthouse);

  // Fetch existing property data if in edit mode
  const { data: existingProperty, loading: loadingProperty } = useApi(
    () => editId ? ownerService.getRenthouseById(parseInt(editId)) : Promise.resolve({ success: true, data: null, message: '' }),
    { autoFetch: !!editId }
  );

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [propertyImagePreview, setPropertyImagePreview] = useState<string | null>(null);
  const [qrCodeImagePreview, setQrCodeImagePreview] = useState<string | null>(null);
  const [uploadingPropertyImage, setUploadingPropertyImage] = useState(false);
  const [uploadingQrImage, setUploadingQrImage] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateRenthouseForm>({
    resolver: zodResolver(createRenthouseSchema),
  });

  const watchedLatitude = watch('latitude');
  const watchedLongitude = watch('longitude');

  // Populate form with existing data when in edit mode
  useEffect(() => {
    if (existingProperty && isEditMode) {
      const property = existingProperty;
      reset({
        name: property.name || '',
        description: property.description || '',
        latitude: property.latitude?.toString() || '',
        longitude: property.longitude?.toString() || '',
        address: property.address || '',
        baseRent: property.baseRent?.toString() || '',
        waterFee: property.waterFee?.toString() || '',
        electricityFee: property.electricityFee?.toString() || '',
        qrCodeImage: property.qrCodeImage || '',
        imageUrl: property.imageUrl || '',
      });

      // Set image previews if they exist
      if (property.imageUrl) {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        setPropertyImagePreview(`${apiBaseUrl.replace('/api', '')}${property.imageUrl}`);
      }
      if (property.qrCodeImage) {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        setQrCodeImagePreview(`${apiBaseUrl.replace('/api', '')}${property.qrCodeImage}`);
      }
    }
  }, [existingProperty, isEditMode, reset]);

  const onSubmit = async (data: CreateRenthouseForm) => {
    try {
      // Convert string values to appropriate types for the payload
      const payload: CreateRenthousePayload = {
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        address: data.address,
        baseRent: parseFloat(data.baseRent),
      };

      if (isEditMode && editId) {
        await updateMutation.mutate(parseInt(editId), payload);
        toast.success('Property updated successfully!');
      } else {
        await createMutation.mutate(payload);
        toast.success('Property created successfully!');
      }

      router.push('/owner/renthouses');
    } catch (error) {
      console.error('Failed to save property:', error);
      toast.error(isEditMode ? 'Failed to update property' : 'Failed to create property');
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();

          setValue('latitude', lat);
          setValue('longitude', lng);
          setValue('address', ''); // Clear address when using coordinates
          setUseCurrentLocation(true);
          toast.success('Location detected successfully!');
        },
        (error) => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'property' | 'qr') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      // Set loading state
      if (type === 'property') {
        setUploadingPropertyImage(true);
      } else {
        setUploadingQrImage(true);
      }

      // Upload file to server
      const response = await uploadService.uploadImage(file);

      if (response.success && response.data) {
        // Create preview URL using the API base URL
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
        const previewUrl = `${apiBaseUrl.replace('/api', '')}${response.data}`;

        if (type === 'property') {
          setPropertyImagePreview(previewUrl);
          setValue('imageUrl', response.data);
        } else {
          setQrCodeImagePreview(previewUrl);
          setValue('qrCodeImage', response.data);
        }
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(response.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      // Clear loading state
      if (type === 'property') {
        setUploadingPropertyImage(false);
      } else {
        setUploadingQrImage(false);
      }
    }
  };

  const removeImage = (type: 'property' | 'qr') => {
    if (type === 'property') {
      setPropertyImagePreview(null);
      setValue('imageUrl', '');
    } else {
      setQrCodeImagePreview(null);
      setValue('qrCodeImage', '');
    }
  };

  if (loadingProperty) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading property data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/owner/renthouses">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Properties
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Property' : 'Add New Property'}
              </h1>
              <p className="text-gray-600">
                {isEditMode ? 'Update your property information' : 'Create a new rental property'}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Enter the basic details of your rental property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter property name"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="baseRent">Base Rent ($) *</Label>
                  <Input
                    id="baseRent"
                    {...register('baseRent')}
                    placeholder="0.00"
                    className={errors.baseRent ? 'border-red-500' : ''}
                  />
                  {errors.baseRent && (
                    <p className="text-sm text-red-500 mt-1">{errors.baseRent.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Describe your property..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Location Information</span>
              </CardTitle>
              <CardDescription>
                Set the location of your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    {...register('latitude')}
                    placeholder="0.000000"
                    className={errors.latitude ? 'border-red-500' : ''}
                  />
                  {errors.latitude && (
                    <p className="text-sm text-red-500 mt-1">{errors.latitude.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    {...register('longitude')}
                    placeholder="0.000000"
                    className={errors.longitude ? 'border-red-500' : ''}
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-500 mt-1">{errors.longitude.message}</p>
                  )}
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getCurrentLocation}
                    className="w-full"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use Current Location
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  {...register('address')}
                  placeholder="Enter full address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fees Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Additional Fees</span>
              </CardTitle>
              <CardDescription>
                Set additional fees for water and electricity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="waterFee">Water Fee ($) *</Label>
                  <Input
                    id="waterFee"
                    {...register('waterFee')}
                    placeholder="0.00"
                    className={errors.waterFee ? 'border-red-500' : ''}
                  />
                  {errors.waterFee && (
                    <p className="text-sm text-red-500 mt-1">{errors.waterFee.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="electricityFee">Electricity Fee ($) *</Label>
                  <Input
                    id="electricityFee"
                    {...register('electricityFee')}
                    placeholder="0.00"
                    className={errors.electricityFee ? 'border-red-500' : ''}
                  />
                  {errors.electricityFee && (
                    <p className="text-sm text-red-500 mt-1">{errors.electricityFee.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5" />
                <span>Property Images</span>
              </CardTitle>
              <CardDescription>
                Upload images of your property and QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Property Image */}
              <div>
                <Label>Property Image</Label>
                <div className="mt-2">
                  {propertyImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={propertyImagePreview}
                        alt="Property"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeImage('property')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'property')}
                        className="hidden"
                        id="property-image"
                        disabled={uploadingPropertyImage}
                      />
                      <label
                        htmlFor="property-image"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        {uploadingPropertyImage ? (
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">
                          {uploadingPropertyImage ? 'Uploading...' : 'Click to upload property image'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Code Image */}
              <div>
                <Label>QR Code Image</Label>
                <div className="mt-2">
                  {qrCodeImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={qrCodeImagePreview}
                        alt="QR Code"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeImage('qr')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'qr')}
                        className="hidden"
                        id="qr-image"
                        disabled={uploadingQrImage}
                      />
                      <label
                        htmlFor="qr-image"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        {uploadingQrImage ? (
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">
                          {uploadingQrImage ? 'Uploading...' : 'Click to upload QR code image'}
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/owner/renthouses">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createMutation.isLoading || updateMutation.isLoading}
            >
              {createMutation.isLoading || updateMutation.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Property' : 'Create Property'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 