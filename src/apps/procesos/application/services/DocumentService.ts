import type { Document } from '../../domain/entities/Document';
import type { Headquarter } from '../../domain/entities/Headquarter';
import type { Process } from '../../domain/entities/Process';
import type { ProcessType } from '../../domain/entities/ProcessType';
import type { Servicio } from '../../domain/entities/Servicio';
import { DocumentRepository } from '../../infrastructure/repositories/DocumentRepository';
import { HeadquarterRepository } from '../../infrastructure/repositories/HeadquarterRepository';
import { ProcessRepository } from '../../infrastructure/repositories/ProcessRepository';
import { ProcessTypeRepository } from '../../infrastructure/repositories/ProcessTypeRepository';
import { ServicioRepository } from '../../infrastructure/repositories/ServicioRepository';

export class DocumentService {
    private documentRepository: DocumentRepository;
    private processRepository?: ProcessRepository;
    private processTypeRepository?: ProcessTypeRepository;
    private headquarterRepository?: HeadquarterRepository;
    private servicioRepository?: ServicioRepository;

    constructor(
        documentRepository: DocumentRepository,
        processRepository?: ProcessRepository,
        processTypeRepository?: ProcessTypeRepository,
        headquarterRepository?: HeadquarterRepository,
        servicioRepository?: ServicioRepository
    ) {
        this.documentRepository = documentRepository;
        this.processRepository = processRepository;
        this.processTypeRepository = processTypeRepository;
        this.headquarterRepository = headquarterRepository;
        this.servicioRepository = servicioRepository;
    }

    async getDocuments(): Promise<Document[]> {
        return this.documentRepository.getAll();
    }

    async getProcesses(): Promise<Process[]> {
        if (!this.processRepository) {
            throw new Error('ProcessRepository not provided');
        }
        return this.processRepository.getAll();
    }

    async getProcessTypes(): Promise<ProcessType[]> {
        if (!this.processTypeRepository) {
            throw new Error('ProcessTypeRepository not provided');
        }
        return this.processTypeRepository.getAll();
    }

    async getHeadquarters(): Promise<Headquarter[]> {
        if (!this.headquarterRepository) {
            throw new Error('HeadquarterRepository not provided');
        }
        return this.headquarterRepository.getAll();
    }

    async getServicios(): Promise<Servicio[]> {
        if (!this.servicioRepository) {
            throw new Error('ServicioRepository not provided');
        }
        return this.servicioRepository.getAll();
    }

    async createDocument(data: FormData): Promise<Document> {
        return this.documentRepository.create(data);
    }

    async updateDocument(id: number, data: FormData): Promise<Document> {
        return this.documentRepository.update(id, data);
    }

    async deleteDocument(id: number): Promise<void> {
        return this.documentRepository.delete(id);
    }

    async downloadDocument(id: number, type: 'oficial' | 'editable'): Promise<Blob> {
        return this.documentRepository.download(id, type);
    }

    async previewDocument(id: number, type: 'oficial' | 'editable'): Promise<Blob> {
        return this.documentRepository.preview(id, type);
    }

    // Métodos auxiliares para la UI
    getProcessName(processes: Process[], processId: number): string {
        return processes.find(p => p.id === processId)?.name || 'N/A';
    }

    getHeadquarterName(headquarters: Headquarter[], headquarterId: number | null): string {
        if (!headquarterId) return 'N/A';
        return headquarters.find(h => h.id === headquarterId)?.name || 'N/A';
    }

    getServicioName(servicios: Servicio[], servicioId: number | null): string {
        if (!servicioId) return 'N/A';
        return servicios.find(s => s.id === servicioId)?.nombre_servicio || 'N/A';
    }

    getProcessTypeName(processTypes: ProcessType[], processTypeId: number): string {
        return processTypes.find(pt => pt.id === processTypeId)?.name || 'N/A';
    }

    getDocumentPadreName(documents: Document[], documentoId: number | null): string {
        if (!documentoId) return 'N/A';
        const documento = documents.find(d => d.id === documentoId);
        return documento ? `${documento.codigo_documento} v${documento.version}` : 'N/A';
    }

    getDocumentosDisponiblesComoPadre(documents: Document[], currentDocument?: Document): Document[] {
        if (currentDocument) {
            // Excluir el documento actual y sus versiones relacionadas
            return documents.filter(doc =>
                doc.id !== currentDocument.id &&
                doc.codigo_documento !== currentDocument.codigo_documento
            );
        }
        return documents;
    }
}