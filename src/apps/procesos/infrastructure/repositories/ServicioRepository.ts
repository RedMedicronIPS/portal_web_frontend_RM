import axiosInstance from '../../../../core/infrastructure/http/axiosInstance';
import type { Servicio } from '../../domain/entities/Servicio';

export class ServicioRepository {
    async getAll(): Promise<Servicio[]> {
        const response = await axiosInstance.get('/processes/servicios/');
        return response.data;
    }
}
