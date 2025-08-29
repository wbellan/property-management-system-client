import React, { useState, useEffect } from 'react';
import {
    X,
    Plus,
    Trash2,
    Save,
    Send,
    Calculator,
    Calendar,
    User,
    Building,
    DollarSign,
    FileText,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

interface InvoiceLineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    category: string;
}

interface InvoiceFormData {
    id?: string;
    invoiceNumber: string;
    customerName: string;
    customerEmail: string;
    propertyName: string;
    spaceName: string;
    issueDate: string;
    dueDate: string;
    invoiceType: 'RENT' | 'LATE_FEE' | 'UTILITY' | 'MAINTENANCE' | 'OTHER';
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'VOID';
    lineItems: InvoiceLineItem[];
    notes?: string;
    terms?: string;
    taxRate: number;
    discountAmount: number;
}

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (invoiceData: InvoiceFormData, action: 'save' | 'send') => Promise<void>;
    invoice?: InvoiceFormData | null;
    customers: Array<{ id: string; name: string; email: string; propertyName?: string; spaceName?: string }>;
    properties: Array<{ id: string; name: string; spaces: Array<{ id: string; name: string }> }>;
}

const InvoiceCreationModal: React.FC<InvoiceModalProps> = ({
    isOpen,
    onClose,
    onSave,
    invoice,
    customers = [],
    properties = []
}) => {
    const [formData, setFormData] = useState<InvoiceFormData>({
        invoiceNumber: '',
        customerName: '',
        customerEmail: '',
        propertyName: '',
        spaceName: '',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        invoiceType: 'RENT',
        status: 'DRAFT',
        lineItems: [],
        notes: '',
        terms: 'Payment is due within 30 days of invoice date.',
        taxRate: 0,
        discountAmount: 0
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (invoice) {
            setFormData(invoice);
        } else {
            // Reset form for new invoice
            const newInvoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
            setFormData({
                invoiceNumber: newInvoiceNumber,
                customerName: '',
                customerEmail: '',
                propertyName: '',
                spaceName: '',
                issueDate: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                invoiceType: 'RENT',
                status: 'DRAFT',
                lineItems: [
                    {
                        id: '1',
                        description: 'Monthly Rent',
                        quantity: 1,
                        rate: 0,
                        amount: 0,
                        category: 'RENT'
                    }
                ],
                notes: '',
                terms: 'Payment is due within 30 days of invoice date.',
                taxRate: 0,
                discountAmount: 0
            });
        }
    }, [invoice, isOpen]);

    const calculateTotals = () => {
        const subtotal = formData.lineItems.reduce((sum, item) => sum + item.amount, 0);
        const taxAmount = subtotal * (formData.taxRate / 100);
        const total = subtotal + taxAmount - formData.discountAmount;

        return {
            subtotal,
            taxAmount,
            total: Math.max(0, total)
        };
    };

    const handleInputChange = (field: keyof InvoiceFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleCustomerChange = (customerName: string) => {
        const customer = customers.find(c => c.name === customerName);
        if (customer) {
            setFormData(prev => ({
                ...prev,
                customerName: customer.name,
                customerEmail: customer.email,
                propertyName: customer.propertyName || '',
                spaceName: customer.spaceName || ''
            }));
        }
    };

    const addLineItem = () => {
        const newItem: InvoiceLineItem = {
            id: Date.now().toString(),
            description: '',
            quantity: 1,
            rate: 0,
            amount: 0,
            category: 'OTHER'
        };
        setFormData(prev => ({
            ...prev,
            lineItems: [...prev.lineItems, newItem]
        }));
    };

    const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: any) => {
        setFormData(prev => ({
            ...prev,
            lineItems: prev.lineItems.map(item => {
                if (item.id === id) {
                    const updatedItem = { ...item, [field]: value };
                    if (field === 'quantity' || field === 'rate') {
                        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
                    }
                    return updatedItem;
                }
                return item;
            })
        }));
    };

    const removeLineItem = (id: string) => {
        if (formData.lineItems.length > 1) {
            setFormData(prev => ({
                ...prev,
                lineItems: prev.lineItems.filter(item => item.id !== id)
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.customerName.trim()) newErrors.customerName = 'Customer is required';
        if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Customer email is required';
        if (!formData.issueDate) newErrors.issueDate = 'Issue date is required';
        if (!formData.dueDate) newErrors.dueDate = 'Due date is required';
        if (formData.lineItems.length === 0) newErrors.lineItems = 'At least one line item is required';

        // Validate line items
        formData.lineItems.forEach((item, index) => {
            if (!item.description.trim()) {
                newErrors[`lineItem_${index}_description`] = 'Description is required';
            }
            if (item.quantity <= 0) {
                newErrors[`lineItem_${index}_quantity`] = 'Quantity must be greater than 0';
            }
            if (item.rate < 0) {
                newErrors[`lineItem_${index}_rate`] = 'Rate cannot be negative';
            }
        });

        if (new Date(formData.dueDate) <= new Date(formData.issueDate)) {
            newErrors.dueDate = 'Due date must be after issue date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (action: 'save' | 'send') => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                status: action === 'send' ? 'SENT' : formData.status
            } as InvoiceFormData;

            await onSave(submitData, action);
            onClose();
        } catch (error: any) {
            setErrors({ form: error.message || `Failed to ${action} invoice` });
        } finally {
            setLoading(false);
        }
    };

    const { subtotal, taxAmount, total } = calculateTotals();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '1.5rem',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '2rem 2rem 1rem 2rem',
                    borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '3rem',
                            height: '3rem',
                            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FileText size={20} style={{ color: 'white' }} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#111827' }}>
                                {invoice ? 'Edit Invoice' : 'Create New Invoice'}
                            </h2>
                            <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                                {formData.invoiceNumber}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(107, 114, 128, 0.1)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#6b7280'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div style={{ padding: '2rem' }}>
                    {errors.form && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '0.5rem',
                            padding: '0.75rem 1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#dc2626'
                        }}>
                            <AlertCircle size={16} />
                            {errors.form}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {/* Left Column - Invoice Details */}
                        <div className="space-y-4">
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                                Invoice Details
                            </h3>

                            {/* Customer Selection */}
                            <div className="form-group">
                                <label className="form-label">
                                    <User size={16} style={{ marginRight: '0.5rem' }} />
                                    Customer
                                </label>
                                <select
                                    value={formData.customerName}
                                    onChange={(e) => handleCustomerChange(e.target.value)}
                                    className="form-input"
                                    style={{ border: errors.customerName ? '1px solid #ef4444' : undefined }}
                                >
                                    <option value="">Select a customer...</option>
                                    {customers.map(customer => (
                                        <option key={customer.id} value={customer.name}>
                                            {customer.name} - {customer.propertyName} {customer.spaceName}
                                        </option>
                                    ))}
                                </select>
                                {errors.customerName && (
                                    <div className="form-error">{errors.customerName}</div>
                                )}
                            </div>

                            {/* Property & Space */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building size={16} style={{ marginRight: '0.5rem' }} />
                                        Property
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.propertyName}
                                        onChange={(e) => handleInputChange('propertyName', e.target.value)}
                                        className="form-input"
                                        placeholder="Property name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Space</label>
                                    <input
                                        type="text"
                                        value={formData.spaceName}
                                        onChange={(e) => handleInputChange('spaceName', e.target.value)}
                                        className="form-input"
                                        placeholder="Space/Unit"
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label className="form-label">
                                        <Calendar size={16} style={{ marginRight: '0.5rem' }} />
                                        Issue Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.issueDate}
                                        onChange={(e) => handleInputChange('issueDate', e.target.value)}
                                        className="form-input"
                                        style={{ border: errors.issueDate ? '1px solid #ef4444' : undefined }}
                                    />
                                    {errors.issueDate && (
                                        <div className="form-error">{errors.issueDate}</div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Due Date</label>
                                    <input
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                                        className="form-input"
                                        style={{ border: errors.dueDate ? '1px solid #ef4444' : undefined }}
                                    />
                                    {errors.dueDate && (
                                        <div className="form-error">{errors.dueDate}</div>
                                    )}
                                </div>
                            </div>

                            {/* Invoice Type */}
                            <div className="form-group">
                                <label className="form-label">Invoice Type</label>
                                <select
                                    value={formData.invoiceType}
                                    onChange={(e) => handleInputChange('invoiceType', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="RENT">Rent</option>
                                    <option value="LATE_FEE">Late Fee</option>
                                    <option value="UTILITY">Utility</option>
                                    <option value="MAINTENANCE">Maintenance</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column - Line Items */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                                    Line Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={addLineItem}
                                    className="btn btn-secondary"
                                    style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                            </div>

                            {/* Line Items List */}
                            <div className="space-y-3">
                                {formData.lineItems.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            padding: '1rem',
                                            background: 'rgba(249, 250, 251, 0.8)',
                                            borderRadius: '0.75rem',
                                            border: '1px solid rgba(229, 231, 235, 0.5)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                                                Item {index + 1}
                                            </span>
                                            {formData.lineItems.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeLineItem(item.id)}
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        border: 'none',
                                                        borderRadius: '0.375rem',
                                                        padding: '0.25rem',
                                                        cursor: 'pointer',
                                                        color: '#dc2626'
                                                    }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                                                className="form-input"
                                                style={{
                                                    fontSize: '0.875rem',
                                                    border: errors[`lineItem_${index}_description`] ? '1px solid #ef4444' : undefined
                                                }}
                                            />

                                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '0.75rem' }}>
                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Qty"
                                                        value={item.quantity}
                                                        onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value) || 0)}
                                                        className="form-input"
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            border: errors[`lineItem_${index}_quantity`] ? '1px solid #ef4444' : undefined
                                                        }}
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>

                                                <div>
                                                    <input
                                                        type="number"
                                                        placeholder="Rate"
                                                        value={item.rate}
                                                        onChange={(e) => updateLineItem(item.id, 'rate', Number(e.target.value) || 0)}
                                                        className="form-input"
                                                        style={{
                                                            fontSize: '0.875rem',
                                                            border: errors[`lineItem_${index}_rate`] ? '1px solid #ef4444' : undefined
                                                        }}
                                                        min="0"
                                                        step="0.01"
                                                    />
                                                </div>

                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    background: 'rgba(255, 255, 255, 0.8)',
                                                    borderRadius: '0.375rem',
                                                    padding: '0.75rem',
                                                    border: '1px solid rgba(229, 231, 235, 0.3)'
                                                }}>
                                                    <DollarSign size={14} style={{ color: '#6b7280', marginRight: '0.25rem' }} />
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
                                                        {item.amount.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Invoice Totals */}
                    <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(249, 250, 251, 0.8)', borderRadius: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            {/* Notes & Terms */}
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label className="form-label">Notes</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        className="form-textarea"
                                        placeholder="Additional notes..."
                                        rows={3}
                                        style={{ resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            value={formData.taxRate}
                                            onChange={(e) => handleInputChange('taxRate', Number(e.target.value) || 0)}
                                            className="form-input"
                                            min="0"
                                            max="100"
                                            step="0.01"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Discount ($)</label>
                                        <input
                                            type="number"
                                            value={formData.discountAmount}
                                            onChange={(e) => handleInputChange('discountAmount', Number(e.target.value) || 0)}
                                            className="form-input"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Totals */}
                            <div>
                                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                                    Invoice Summary
                                </h4>

                                <div className="space-y-2">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Subtotal:</span>
                                        <span style={{ fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
                                    </div>

                                    {formData.taxRate > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                Tax ({formData.taxRate}%):
                                            </span>
                                            <span style={{ fontWeight: '500' }}>${taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {formData.discountAmount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Discount:</span>
                                            <span style={{ fontWeight: '500', color: '#059669' }}>
                                                -${formData.discountAmount.toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                    <div style={{
                                        borderTop: '1px solid rgba(229, 231, 235, 0.5)',
                                        paddingTop: '0.5rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>Total:</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '2rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(229, 231, 235, 0.5)'
                    }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSubmit('save')}
                            className="btn btn-secondary"
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save Draft'}
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSubmit('send')}
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Send size={16} />
                            {loading ? 'Sending...' : 'Save & Send'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceCreationModal;