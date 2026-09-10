import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Engine } from './Engine';
import { galleryPlaneData, getGalleryProduct } from './galleryData';

const DepthGallery: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleActiveIndexChange = useCallback((index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 180);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const engine = new Engine(canvasRef.current, handleActiveIndexChange);
    engineRef.current = engine;

    engine.init().then(() => {
      setIsLoaded(true);
    });

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        engine.setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.3);
      },
      { threshold: [0, 0.3, 0.5, 1] },
    );
    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
      engine.dispose();
      engineRef.current = null;
    };
  }, [handleActiveIndexChange]);

  const planeData = galleryPlaneData[activeIndex];
  const product = planeData ? getGalleryProduct(planeData) : null;

  return (
    <div ref={containerRef} className="depth-gallery-wrapper">
      {/* Three.js Canvas — exact Codrops DOM: <canvas class="webgl"> */}
      <canvas ref={canvasRef} className="webgl" />

      {/* Product info overlay — matches Codrops label overlay positioning */}
      {product && (
        <div className={`plane-label-overlay ${isTransitioning ? 'plane-label-overlay--transitioning' : ''}`}>
          {/* Left side: product info (matches Codrops left panel) */}
          <div className="plane-label-overlay__left">
            <p className="plane-label-overlay__index">
              {String(activeIndex + 1).padStart(2, '0')}
            </p>
            <p className="plane-label-card__word">{planeData?.label}</p>
            <span
              className="plane-label-overlay__chip"
              style={{ backgroundColor: planeData?.blob1Color }}
            />
          </div>

          {/* Right side: product details (matches Codrops right panel) */}
          <article className="plane-label-card plane-label-overlay__right">
            <h2 className="plane-label-product-name">{product.name}</h2>
            <p className="plane-label-product-desc">{product.description}</p>
            <p className="plane-label-product-price">₵{product.price.toFixed(2)}</p>
            <div className="plane-label-product-actions">
              <Link
                to={`/product/${product.id}`}
                className="btn-squish plane-label-btn-primary"
              >
                Shop Now
              </Link>
              <Link
                to="/shop"
                className="btn-squish plane-label-btn-secondary"
              >
                View All
              </Link>
            </div>
          </article>
        </div>
      )}

      {/* Scroll hint */}
      {activeIndex === 0 && isLoaded && (
        <div className="depth-gallery-scroll-hint">
          <span>Scroll</span>
          <div className="depth-gallery-scroll-line" />
        </div>
      )}
    </div>
  );
};

export default DepthGallery;
