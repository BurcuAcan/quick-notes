import React, { useState } from 'react';
import Modal from '../atoms/Modal';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

interface ShareNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onShare: (email: string) => void;
}

const ShareNoteModal: React.FC<ShareNoteModalProps> = ({ isOpen, onClose, onShare }) => {
    const [email, setEmail] = useState('');

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-lg font-bold mb-4">Share Note</h2>
            <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mb-4 w-full"
            />
            <div className="flex justify-end gap-2 mt-4">
                <Button onClick={onClose}>Close</Button>
                <Button onClick={() => { onShare(email); setEmail(''); }}>
                    Share
                </Button>
            </div>
        </Modal>
    );
};

export default ShareNoteModal;
