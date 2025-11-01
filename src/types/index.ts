export interface Address {
  street?: string;
  number?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Unit {
  id: string;
  client_id: string;
  name: string;
  address?: Address;
  responsible_name?: string;
  responsible_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Equipment {
  id: string;
  unit_id: string;
  tag: string;
  location?: string;
  brand?: string;
  model?: string;
  type?: "Split" | "Window" | "Central" | "Cassete" | "Piso Teto";
  capacity_btu?: number;
  serial_number?: string;
  installation_date?: string;
  warranty_expiry?: string;
  last_maintenance?: string;
  maintenance_interval_days?: number;
  refrigerant_type?: string;
  voltage?: string;
  photos?: string[];
  status: "Ativo" | "Inativo" | "Manutenção";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TechnicalDetails {
  measurements?: {
    suction_pressure?: string;
    discharge_pressure?: string;
    suction_temp?: string;
    discharge_temp?: string;
    superheat?: string;
    subcooling?: string;
    amperage?: string;
  };
  services_performed?: string[];
  parts_replaced?: Array<{ name: string; quantity: number }>;
  refrigerant_added?: string;
  next_maintenance?: string;
}

export interface ServiceWithDetails {
  id: string;
  client_id?: string;
  unit_id?: string;
  equipment_id?: string;
  type: string;
  description?: string;
  date: string;
  time?: string;
  technician?: string;
  status: string;
  photos?: string[];
  notes?: string;
  technical_details?: TechnicalDetails;
  created_at?: string;
}
