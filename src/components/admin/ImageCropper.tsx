import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Area {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropperProps {
  imageFile: File;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
  circular?: boolean;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // set canvas size to match the bounding box, but capped at 1000px to prevent massive file sizes
  const MAX_SIZE = 1000;
  const scale = Math.min(1, MAX_SIZE / pixelCrop.width, MAX_SIZE / pixelCrop.height);
  const targetWidth = pixelCrop.width * scale;
  const targetHeight = pixelCrop.height * scale;

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Canvas is empty'));
        return;
      }
      resolve(new File([blob], fileName.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.8);
  });
};

export const ImageCropper = ({ imageFile, onCropComplete, onCancel, circular = false }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Preserve existing overflow state from underlying modals, if any
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const imageSrc = URL.createObjectURL(imageFile);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, imageFile.name);
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      onCancel();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-border"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-card/50">
          <h3 className="font-bold text-lg font-heading">Crop Image</h3>
          <button onClick={onCancel} className="p-2 hover:bg-foreground/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="relative w-full h-[60vh] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={circular ? "round" : "rect"}
            showGrid={!circular}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="p-6 bg-card">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-bold text-foreground/50 w-12">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(Number(e.target.value));
              }}
              className="w-full accent-primary h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={processing}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              {processing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Check size={18} /> Crop & Save</>
              )}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-foreground/5 border border-border py-3 rounded-xl font-bold hover:bg-foreground/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
