import React from "react";
import { motion } from "framer-motion";

const spinnerVariants = {
    animate: {
        rotate: 360,
        transition: {
            repeat: Infinity,
            duration: 1,
            ease: "linear",
        },
    },
};

const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({
    size = 24,
    color = "#2563eb",
}) => {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            variants={spinnerVariants}
            animate="animate"
            className="inline-block"
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="60"
                strokeDashoffset="0"
            />
        </motion.svg>
    );
};

export default LoadingSpinner;
