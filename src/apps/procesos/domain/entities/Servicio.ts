export interface Servicio {
    id: number;
    codigo_servicio: string;
    nombre_servicio: string;
    descripcion_servicio?: string | null;
    headquarter: number;
    headquarter_nombre?: string;
}
