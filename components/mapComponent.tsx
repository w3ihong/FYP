"use client";
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

type MapComponentProps = {
    mapCoordinates: [number, number] | null;
    selectedCountry: string;
};

const MapUpdater = ({ mapCoordinates }: { mapCoordinates: [number, number] | null }) => {
    const map = useMap();

    useEffect(() => {
        if (map && mapCoordinates) {
            map.setView(mapCoordinates, map.getZoom());
        }
    }, [map, mapCoordinates]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ mapCoordinates, selectedCountry }) => {
    const mapPinIcon = new L.DivIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        `,
        className: 'heroicon-map-pin',
        iconSize: [24, 24],
        iconAnchor: [12, 24], 
        popupAnchor: [0, -24]
    });

    return (
        <MapContainer center={mapCoordinates || [0, 0]} zoom={2} minZoom={2} maxZoom={6} scrollWheelZoom={true} maxBounds={[[-90, -180], [90, 180]]} maxBoundsViscosity={1.0} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {mapCoordinates && (
                <>
                    <MapUpdater mapCoordinates={mapCoordinates} />
                    <Marker position={mapCoordinates} icon={mapPinIcon}>
                        <Popup>{selectedCountry}</Popup>
                    </Marker>
                </>
            )}
        </MapContainer>
    );
};

export default MapComponent;
