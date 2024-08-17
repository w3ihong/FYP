// components/Overlay.tsx
import React from 'react';

type OverlayProps = {
    isOpen: boolean;
};

const Overlay: React.FC<OverlayProps> = ({ isOpen }) => {
    return isOpen ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-10"></div>
    ) : null;
};

export default Overlay;
