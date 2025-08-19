export interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: string;
  totalUnits?: number;
  spaces?: Space[];
  entityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Space {
  id: string;
  propertyId: string;
  spaceNumber: string;
  type: string;
  squareFeet?: number;
  rentAmount?: number;
  isOccupied: boolean;
}

export interface CreatePropertyData {
  name: string;
  address: string;
  propertyType: string;
  totalUnits: number;
  entityId: string;
}
