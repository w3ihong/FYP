import React from 'react';
import Sidebar from '@/components/sidebarSettings';

export default function settings() {
    return (
        <div className="flex">
            <Sidebar />
            <main>
                <h6>
                    Settings page
                </h6>
            </main>
        </div>
    );
}
