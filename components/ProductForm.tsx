import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ApiService } from '../services/api';
import { ImageUploader } from './ImageUploader';

const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compare_at_price: z.number().min(0.01).optional().nullable(),
  category_id: z.string().uuid('Please select a category'),
  images: z.array(z.string().url()).min(1, 'At least one image is required').max(10, 'Maximum 10 images'),
  status: z.enum(['draft', 'published']),
  tags: z.array(z.string()).optional(),
  seo_title: z.string().max(60).optional(),
  seo_description: z.string().max(160).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData> | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditing?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  isEditing = false,
}) => {
  const [categories, setCategories] = useState<Array<{id: string; name: string; children?: any[]}>>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      compare_at_price: null,
      category_id: '',
      images: [],
      status: 'draft',
      tags: [],
      seo_title: '',
      seo_description: '',
      ...initialData,
    },
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories: cats } = await ApiService.admin.categories.list();
        setCategories(cats);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Flatten categories for select
  const flattenedCategories = React.useMemo(() => {
    const flat: Array<{id: string; name: string; level: number}> = [];
    const flatten = (cats: any[], level = 0) => {
      for (const cat of cats) {
        flat.push({ id: cat.id, name: `${'  '.repeat(level)}${cat.name}`, level });
        if (cat.children?.length) {
          flatten(cat.children, level + 1);
        }
      }
    };
    flatten(categories);
    return flat;
  }, [categories]);

  const handleImageChange = (newImages: string[]) => {
    setValue('images', newImages, { shouldValidate: true });
  };

  const watchedImages = watch('images');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Product Title *
        </label>
        <input
          {...register('title')}
          id="title"
          type="text"
          className={`w-full rounded-lg border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
            errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          }`}
          placeholder="e.g., Vaseline Cocoa Radiant Lotion"
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          {...register('description')}
          id="description"
          rows={4}
          className={`w-full rounded-lg border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          }`}
          placeholder="Describe the product benefits, ingredients, usage instructions..."
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (₵) *
          </label>
          <Controller
            name="price"
            control={control}
            rules={{ required: 'Price is required', min: { value: 0.01, message: 'Must be > 0' } }}
            render={({ field }) => (
              <input
                {...field}
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                className={`w-full rounded-lg border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
                  errors.price ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
                placeholder="35.00"
              />
            )}
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div>
          <label htmlFor="compare_at_price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Compare at Price (₵)
          </label>
          <Controller
            name="compare_at_price"
            control={control}
            rules={{ min: { value: 0.01, message: 'Must be > 0' } }}
            render={({ field }) => (
              <input
                {...field}
                id="compare_at_price"
                type="number"
                step="0.01"
                min="0.01"
                className={`w-full rounded-lg border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
                  errors.compare_at_price ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                }`}
                placeholder="Optional - original price"
              />
            )}
          />
          {errors.compare_at_price && <p className="mt-1 text-sm text-red-500">{errors.compare_at_price.message}</p>}
        </div>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category *
        </label>
        {categoryLoading ? (
          <div className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 animate-pulse"></div>
        ) : (
          <select
            {...register('category_id')}
            id="category_id"
            className={`w-full rounded-lg border px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors ${
              errors.category_id ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <option value="">Select a category</option>
            {flattenedCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        )}
        {errors.category_id && <p className="mt-1 text-sm text-red-500">{errors.category_id.message}</p>}
      </div>

      {/* Images */}
      <div>
        <ImageUploader
          onImagesChange={handleImageChange}
          initialImages={initialData?.images || []}
          maxImages={10}
        />
        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images.message}</p>}
        {watchedImages.length > 0 && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {watchedImages.length} image{watchedImages.length !== 1 ? 's' : ''} selected. Drag to reorder.
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Status *
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="radio"
                  value="draft"
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
              )}
            />
            <span className="text-gray-900 dark:text-white">Draft</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="radio"
                  value="published"
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                />
              )}
            />
            <span className="text-gray-900 dark:text-white">Published</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tags (comma separated)
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              id="tags"
              type="text"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
              placeholder="skincare, moisturizer, bestseller"
              onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
              value={(field.value as string[])?.join(', ') || ''}
            />
          )}
        />
      </div>

      {/* SEO Section */}
      <details className="group border-t border-gray-100 dark:border-gray-800 pt-6">
        <summary className="flex items-center justify-between cursor-pointer list-none py-2 text-gray-900 dark:text-white font-medium">
          <span>SEO Settings</span>
          <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="space-y-4 pt-4">
          <div>
            <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SEO Title (max 60 chars)
            </label>
            <Controller
              name="seo_title"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="seo_title"
                  type="text"
                  maxLength={60}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors"
                  placeholder="Auto-generated from title if empty"
                />
              )}
            />
          </div>
          <div>
            <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SEO Description (max 160 chars)
            </label>
            <Controller
              name="seo_description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  id="seo_description"
                  rows={2}
                  maxLength={160}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-colors resize-none"
                  placeholder="Auto-generated from description if empty"
                />
              )}
            />
          </div>
        </div>
      </details>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Product')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};