import { useState, useEffect } from 'react';
import { getDropboxImageUrl } from '../utils/dropbox';

function DropboxImage({ src, alt, className, onError }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadImage = async () => {
            try {
                setIsLoading(true);
                setError(false);
                
                // Если это URL Dropbox
                if (src.includes('dropbox.com')) {
                    const url = await getDropboxImageUrl(src);
                    setImageUrl(url);
                } else {
                    // Если это обычный URL
                    setImageUrl(src);
                }
            } catch (err) {
                console.error('Error loading image:', err);
                setError(true);
                if (onError) onError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadImage();
    }, [src, onError]);

    if (isLoading) {
        return (
            <div className={`${className} bg-gray-800 animate-pulse`} style={{ minHeight: '200px' }}>
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">Загрузка...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={className}>
                <img
                    src="/images/book-default.jpg"
                    alt={alt || 'Default image'}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={alt}
            className={className}
            onError={(e) => {
                setError(true);
                if (onError) onError(e);
            }}
        />
    );
}

export default DropboxImage; 