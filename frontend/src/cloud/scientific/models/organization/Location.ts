import type { CloudDocumentMeta } from '../common';

/** Facility or lab location. Path: `organizations/{orgId}/locations/{locationId}`. */
export interface OrgLocation extends CloudDocumentMeta {
  organization_id: string;
  name: string;
  location_type: 'field' | 'gym' | 'lab' | 'clinic' | 'stadium' | 'other';
  address?: string | null;
  altitude_m?: number | null;
  indoor_outdoor_default?: 'indoor' | 'outdoor' | null;
  surface_type_default?: string | null;
  active: boolean;
}

export type OrgLocationInput = Omit<OrgLocation, keyof CloudDocumentMeta | 'active'> & {
  active?: boolean;
};
