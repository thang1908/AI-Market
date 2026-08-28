import React from 'react';
import { ProjectMapView } from './projects/ProjectMapView';
import { ProjectDiscoverySections } from './projects/ProjectDiscoverySections';
import { ProjectPageModal } from './projects/ProjectPageModal';
import { ProjectInventoryModal } from './projects/ProjectInventoryModal';
import { PrimaryUnitDetailModal } from './projects/PrimaryUnitDetailModal';
import { BookingPreviewModal } from './projects/BookingPreviewModal';
import { mockProjects } from '../../data/mockPrimaryProjects';

export const ProjectView: React.FC = () => {
  return (
    <div id="market-projects-tab-view" className="w-full space-y-8 animate-in fade-in duration-200">
      {/* 1. Interactive Map of Primary Projects */}
      <ProjectMapView projects={mockProjects} />

      {/* 2. Discovery Sections (Featured, New Launch, Popular) or Filtered Results */}
      <ProjectDiscoverySections projects={mockProjects} />

      {/* 3. Modals */}
      <ProjectPageModal />
      <ProjectInventoryModal />
      <PrimaryUnitDetailModal />
      <BookingPreviewModal />
    </div>
  );
};
