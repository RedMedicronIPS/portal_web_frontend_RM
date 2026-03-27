import { useState, useEffect } from 'react';
import type { Document } from '../../domain/entities/Document';
import type { Headquarter } from '../../domain/entities/Headquarter';
import type { Process } from '../../domain/entities/Process';
import type { ProcessType } from '../../domain/entities/ProcessType';
import type { Servicio } from '../../domain/entities/Servicio';
import { DocumentService } from '../../application/services/DocumentService';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { HeadquarterRepository } from '../../infrastructure/repositories/HeadquarterRepository';
import { ProcessRepository } from '../../infrastructure/repositories/ProcessRepository';
import { ProcessTypeRepository } from '../../infrastructure/repositories/ProcessTypeRepository';
import { ServicioRepository } from '../../infrastructure/repositories/ServicioRepository';

export const useDocumentCRUD = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [processes, setProcesses] = useState<Process[]>([]);
    const [processTypes, setProcessTypes] = useState<ProcessType[]>([]);
    const [headquarters, setHeadquarters] = useState<Headquarter[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const documentService = new DocumentService(
        new DocumentRepository(),
        new ProcessRepository(),
        new ProcessTypeRepository(),
        new HeadquarterRepository(),
        new ServicioRepository()
    );

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const docs = await documentService.getDocuments();
            setDocuments(docs);
            setError(null);
        } catch (err: any) {
            setError("No se pudieron cargar los documentos");
            console.error("Error fetching documents:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProcesses = async () => {
        try {
            const procs = await documentService.getProcesses();
            setProcesses(procs);
        } catch (err: any) {
            console.error("Error al cargar procesos:", err);
        }
    };

    const fetchProcessTypes = async () => {
        try {
            const procTypes = await documentService.getProcessTypes();
            setProcessTypes(procTypes);
        } catch (err: any) {
            console.error("Error al cargar tipos de proceso:", err);
        }
    };

    const fetchHeadquarters = async () => {
        try {
            const headquartersData = await documentService.getHeadquarters();
            setHeadquarters(headquartersData);
        } catch (err: any) {
            console.error("Error al cargar sedes:", err);
        }
    };

    const fetchServicios = async () => {
        try {
            const serviciosData = await documentService.getServicios();
            setServicios(serviciosData);
        } catch (err: any) {
            console.error("Error al cargar servicios:", err);
        }
    };

    const createDocument = async (data: FormData) => {
        const newDoc = await documentService.createDocument(data);
        setDocuments(prev => [...prev, newDoc]);
        return newDoc;
    };

    const updateDocument = async (id: number, data: FormData) => {
        const updatedDoc = await documentService.updateDocument(id, data);
        setDocuments(prev => prev.map(doc => doc.id === id ? updatedDoc : doc));
        return updatedDoc;
    };

    const deleteDocument = async (id: number) => {
        await documentService.deleteDocument(id);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchDocuments(),
                    fetchProcesses(),
                    fetchProcessTypes(),
                    fetchHeadquarters(),
                    fetchServicios()
                ]);
            } catch (err) {
                setError("Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        documents,
        processes,
        processTypes,
        headquarters,
        servicios,
        loading,
        error,
        fetchDocuments,
        fetchProcesses,
        fetchProcessTypes,
        fetchHeadquarters,
        fetchServicios,
        createDocument,
        updateDocument,
        deleteDocument,
        documentService
    };
};