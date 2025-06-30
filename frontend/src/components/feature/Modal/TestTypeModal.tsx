import React from 'react';
import { CreateTestTypeRequest } from '../../../api/services/panelService';

type TestTypeModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTestTypeRequest) => Promise<void>;
};

const TestTypeModal: React.FC<TestTypeModalProps> = () => null;
export default TestTypeModal;
