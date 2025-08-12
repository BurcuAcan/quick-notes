"use client";
import React, { useEffect, useState } from 'react';
import Button from '../atoms/Button';
import Link from 'next/link';

interface ShareRequest {
    _id: string;
    sender: { username: string; email: string };
    note: { _id: string; title: string };
}

const NotificationBell: React.FC<{ onNoteShared?: () => void }> = ({ onNoteShared }) => {
    const [open, setOpen] = useState(false);
    const [requests, setRequests] = useState<ShareRequest[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:4000/api/notes/share-requests', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();
            setRequests(data.incoming || []);
        } catch {
            setRequests([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, action: 'accept' | 'reject') => {
        setLoading(true);
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:4000/api/notes/share-requests/${id}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        await fetchRequests(); // Refresh notifications
        setLoading(false);
        if (action === 'accept' && onNoteShared) {
            onNoteShared(); // Trigger notes refresh in parent
        }
    };

    return (
        <div className="relative">
            <button
                className="p-2 rounded-full bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-300 shadow"
                onClick={() => setOpen((o) => !o)}
                aria-label="Notifications"
            >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeWidth="2" d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v7l-2 2v1h16v-1l-2-2z" />
                </svg>
                {requests.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                )}
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-50">
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-300">Notifications</h3>
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : requests.length === 0 ? (
                            <p className="text-gray-500">No new share requests.</p>
                        ) : (
                            requests.map((req) => (
                                req.note ? (
                                    <div key={req._id} className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-gray-800">
                                        <div className="font-semibold text-blue-700 dark:text-blue-200">{req.sender.username} wants to share a note:</div>
                                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Note: <Link href={`/notes/${req.note._id}`} className="underline text-blue-500 dark:text-blue-300">{req.note.title}</Link></div>
                                        <div className="flex gap-2">
                                            <Button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleAction(req._id, 'accept')}>Accept</Button>
                                            <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleAction(req._id, 'reject')}>Reject</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div key={req._id} className="mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <div className="font-semibold text-red-700 dark:text-red-300">Note not found or deleted.</div>
                                        <div className="flex gap-2 mt-2">
                                            <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleAction(req._id, 'reject')}>Dismiss</Button>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
