import React, { useState } from 'react';
import styles from '../assets/Rating.module.css';

const Rating = ({ onChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    const handleClick = (rating) => {
        setSelectedRating(rating);
        onChange(rating);
    };

    return (
        <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`${styles.star} ${
                        (hoverRating || selectedRating) >= star ? styles.filled : ''
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleClick(star)}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

export default Rating;