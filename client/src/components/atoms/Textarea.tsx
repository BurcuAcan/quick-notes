import React from 'react';

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ ...props }) => {
    return (
        <textarea
            className="w-full p-2 rounded border border-gray-300 resize-none"
            {...props}
        />
    );
};

export default Textarea;
