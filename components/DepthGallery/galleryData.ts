import { INITIAL_PRODUCTS } from '../../data/products';

export interface GalleryPlaneData {
  productId: string;
  position: { x: number; y: number };
  backgroundColor: string;
  blob1Color: string;
  blob2Color: string;
  label: string;
}

export const galleryPlaneData: GalleryPlaneData[] = [
  {
    productId: 's1',
    position: { x: -0.8, y: 0 },
    backgroundColor: '#FFF5E6',
    blob1Color: '#F5D0A9',
    blob2Color: '#E8C5A0',
    label: 'Radiance',
  },
  {
    productId: 'l1',
    position: { x: 0.7, y: 0 },
    backgroundColor: '#FFF8F0',
    blob1Color: '#FFD699',
    blob2Color: '#FFC266',
    label: 'Brighten',
  },
  {
    productId: 'm1',
    position: { x: -0.6, y: 0 },
    backgroundColor: '#F5F0EB',
    blob1Color: '#D4A574',
    blob2Color: '#C49A6C',
    label: 'Coverage',
  },
  {
    productId: 's5',
    position: { x: 0.8, y: 0 },
    backgroundColor: '#F0F5F0',
    blob1Color: '#B8D4B8',
    blob2Color: '#A0C4A0',
    label: 'Hydration',
  },
];

export function getGalleryProduct(planeData: GalleryPlaneData) {
  return INITIAL_PRODUCTS.find(p => p.id === planeData.productId);
}
