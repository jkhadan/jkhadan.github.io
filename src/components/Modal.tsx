import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { useObstacle } from '../utils/domObstacles';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    headerImage?: string;
    headerIcon?: React.ReactNode;
    hideHeaderBar?: boolean;
    centerSubtitle?: boolean;
    zIndex?: number;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = 'md',
    headerImage,
    headerIcon,
    hideHeaderBar = false,
    centerSubtitle = false,
    zIndex = 1000
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useObstacle('modal', modalRef);

    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
            setTimeout(() => modalRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const sizeStyles = {
        sm: { maxWidth: 'min(400px, calc(100vw - 32px))' },
        md: { maxWidth: 'min(600px, calc(100vw - 32px))' },
        lg: { maxWidth: 'min(800px, calc(100vw - 32px))' },
        xl: { maxWidth: 'min(1000px, calc(100vw - 32px))' }
    };

    return ReactDOM.createPortal(
        <div
            ref={overlayRef}
            className="modal-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: zIndex,
                background: 'rgba(0, 6, 15, 0.85)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                animation: 'modalFadeIn 0.3s ease-out',
                boxSizing: 'border-box'
            }}
        >
            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .modal-content::-webkit-scrollbar {
                    width: 8px;
                }
                .modal-content::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .modal-content::-webkit-scrollbar-thumb {
                    background: rgba(91, 192, 190, 0.3);
                    border-radius: 4px;
                }
                .modal-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(91, 192, 190, 0.5);
                }
                @media (max-width: 600px) {
                    .modal-header-content {
                        padding: 16px 20px 12px !important;
                    }
                    .modal-content {
                        padding: 0 20px 20px !important;
                        max-height: 50vh !important;
                    }
                    .modal-title {
                        font-size: 1.2rem !important;
                    }
                }
            `}</style>
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
                style={{
                    width: '100%',
                    ...sizeStyles[size],
                    background: 'linear-gradient(135deg, rgba(11, 19, 43, 0.95) 0%, rgba(20, 35, 65, 0.95) 100%)',
                    borderRadius: 20,
                    border: '1px solid rgba(91, 192, 190, 0.2)',
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 40px rgba(91, 192, 190, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                    outline: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'modalSlideIn 0.4s ease-out'
                }}
            >
                {/* Header Image or Gradient */}
                {headerImage ? (
                    <div style={{
                        height: 150,
                        background: `url(${headerImage}) center/cover no-repeat`,
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(11, 19, 43, 0.95) 100%)'
                        }} />
                    </div>
                ) : !hideHeaderBar ? (
                    <div style={{
                        height: 8,
                        background: 'linear-gradient(90deg, #5BC0BE 0%, #6FFFE9 50%, #5BC0BE 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s linear infinite'
                    }} />
                ) : null}

                <style>{`
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                `}</style>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#E0F7FA',
                        fontSize: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(91, 192, 190, 0.3)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    aria-label="Close modal"
                >
                    ×
                </button>

                {/* Header Content */}
                <div
                    className="modal-header-content"
                    style={{
                        padding: '24px 32px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 16
                    }}
                >
                    {headerIcon && (
                        <div style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            background: 'rgba(91, 192, 190, 0.15)',
                            border: '1px solid rgba(91, 192, 190, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {headerIcon}
                        </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2
                            className="modal-title"
                            style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                color: '#E0F7FA',
                                lineHeight: 1.3,
                                textAlign: centerSubtitle ? 'center' : undefined
                            }}
                        >
                            {title}
                        </h2>
                        {subtitle && (
                            <p style={{
                                margin: '6px 0 0',
                                fontSize: '0.95rem',
                                color: '#5BC0BE',
                                fontWeight: 500,
                                textAlign: centerSubtitle ? 'center' : undefined
                            }}>
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div
                    className="modal-content"
                    style={{
                        padding: '0 32px 32px',
                        maxHeight: 'min(60vh, calc(100dvh - 200px))',
                        overflowY: 'auto'
                    }}
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;