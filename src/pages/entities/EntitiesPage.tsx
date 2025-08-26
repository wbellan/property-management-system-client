// src/pages/entities/EntitiesPage.tsx
import React from 'react';
import { EntityManagement } from '../../components/entities';

const EntitiesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <EntityManagement />
        </div>
    );
};

export default EntitiesPage;