import axiosInstance from '../../../../core/infrastructure/http/axiosInstance';
import type { Headquarter } from '../../domain/entities/Headquarter';

export class HeadquarterRepository {
    async getAll(): Promise<Headquarter[]> {
        const response = await axiosInstance.get('/companies/headquarters/');
        return response.data;
    }
}
