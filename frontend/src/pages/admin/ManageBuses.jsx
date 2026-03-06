import React, { useState, useEffect } from 'react';
import { getBuses, createBus, updateBus, deleteBus, toggleBusStatus } from '../../api/admin';
import { Bus, PlusCircle, Pencil, Trash2, AlertCircle, CheckCircle, Armchair, LayoutTemplate } from 'lucide-react';

const emptyForm = {
    busNumber: '',
    routeNo: '',
    capacity: 40,
    type: 'Normal (Non AC)',
    layoutParams: { backRowSeats: 5, leftRowSeats: 2, rightRowSeats: 2 },
    layout: []
};

export const generateDynamicLayout = (capacity, params, removedSlots = []) => {
    const { backRowSeats = 5, leftRowSeats = 2, rightRowSeats = 2 } = params || {};
    const cap = Number(capacity) || 0;
    if (cap < 1) return [];

    const totalSlots = cap + removedSlots.length;
    let actualBackRowSeats = backRowSeats;

    // Safety check just in case totalSlots < backRowSeats
    if (totalSlots < backRowSeats) actualBackRowSeats = totalSlots;

    const remainingSlots = totalSlots - actualBackRowSeats;
    const seatsPerRow = leftRowSeats + rightRowSeats;
    const fullRows = seatsPerRow > 0 ? Math.floor(remainingSlots / seatsPerRow) : 0;
    const extraSlots = seatsPerRow > 0 ? remainingSlots % seatsPerRow : remainingSlots;

    const rows = [];
    let seatNum = 1;
    let currentSlot = 0;

    const getSeat = (posStr) => {
        const slotId = `slot_${currentSlot++}`;
        if (removedSlots.includes(slotId)) {
            return { num: null, pos: posStr, slotId };
        }
        return { num: seatNum++, pos: posStr, slotId };
    };

    // First row (partial)
    if (extraSlots > 0) {
        const row = { seats: [], isPartial: true };
        for (let i = 0; i < extraSlots; i++) {
            if (i < leftRowSeats) {
                row.seats.push(getSeat(`L${i + 1}`));
            } else {
                row.seats.push(getSeat(`R${i - leftRowSeats + 1}`));
            }
        }
        rows.push(row);
    }

    // Full normal rows
    for (let r = 0; r < fullRows; r++) {
        const row = { seats: [], isPartial: false };
        for (let l = 0; l < leftRowSeats; l++) {
            row.seats.push(getSeat(`L${l + 1}`));
        }
        for (let ri = 0; ri < rightRowSeats; ri++) {
            row.seats.push(getSeat(`R${ri + 1}`));
        }
        rows.push(row);
    }

    // Last row
    if (actualBackRowSeats > 0) {
        const lastRow = { seats: [], isBack: true };
        for (let i = 0; i < actualBackRowSeats; i++) {
            lastRow.seats.push(getSeat(`B${i}`));
        }
        rows.push(lastRow);
    }

    return rows;
};

const ManageBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Interactive Layout State
    const [removedSlots, setRemovedSlots] = useState([]);
    const [previewLayout, setPreviewLayout] = useState([]);

    const fetchBuses = async () => {
        try { setLoading(true); setBuses(await getBuses()); }
        catch (err) { setError('Failed to load buses.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBuses(); }, []);

    // Update live preview when inputs change
    useEffect(() => {
        const layout = generateDynamicLayout(form.capacity, form.layoutParams, removedSlots);
        setPreviewLayout(layout);
        setForm(prev => ({ ...prev, layout })); // always keep form.layout in sync for submission
    }, [form.capacity, form.layoutParams, removedSlots]);

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSubmitting(true);
        try {
            if (editId) { await updateBus(editId, form); showSuccess('Bus updated!'); }
            else { await createBus(form); showSuccess('Bus added!'); }
            cancelEdit(); fetchBuses();
        } catch (err) { setError(err.response?.data?.message || 'Operation failed.'); }
        finally { setSubmitting(false); }
    };

    const handleEdit = (bus) => {
        setEditId(bus._id);
        setForm({
            busNumber: bus.busNumber,
            routeNo: bus.routeNo || '',
            capacity: bus.capacity,
            type: bus.type || 'Normal (Non AC)',
            layoutParams: bus.layoutParams || { backRowSeats: 5, leftRowSeats: 2, rightRowSeats: 2 },
            layout: bus.layout || []
        });

        // Extract removed slots by scanning the saved layout looking for num === null
        const layout = bus.layout || [];
        const rem = [];
        layout.forEach(r => r.seats.forEach(s => {
            if (s.num === null && s.slotId) rem.push(s.slotId);
        }));
        setRemovedSlots(rem);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this bus?')) return;
        try { await deleteBus(id); showSuccess('Bus deleted.'); fetchBuses(); }
        catch (err) { setError(err.response?.data?.message || 'Delete failed.'); }
    };

    const handleToggle = async (bus) => {
        try {
            const updated = await toggleBusStatus(bus._id);
            setBuses(prev => prev.map(b => b._id === bus._id ? updated : b));
            showSuccess(`Bus ${updated.isActive ? 'activated' : 'deactivated'}.`);
        } catch (err) { setError('Toggle failed.'); }
    };

    const cancelEdit = () => {
        setEditId(null);
        setForm(emptyForm);
        setRemovedSlots([]);
    };

    const toggleSeatSlot = (slotId) => {
        setRemovedSlots(prev => prev.includes(slotId) ? prev.filter(id => id !== slotId) : [...prev, slotId]);
    };

    // Derived vars for easy access
    const { leftRowSeats, rightRowSeats, backRowSeats } = form.layoutParams;
    const aisleSpace = '16px';

    return (
        <div className="page-wrapper animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Bus size={28} color="var(--primary)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800' }}>Manage Buses</h1>
            </div>

            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
            {successMsg && <div className="success-message"><CheckCircle size={16} /> {successMsg}</div>}

            {/* ADD / EDIT SECTION */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} color="var(--primary)" />
                    {editId ? 'Edit Bus Layout & Details' : 'Add New Bus & Customize Layout'}
                </h2>
                <div className="grid-sidebar">
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            {/* General Details */}
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>1. Bus Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Bus Number</label>
                                        <input type="text" className="form-control" placeholder="e.g. NB-1234" value={form.busNumber} onChange={e => setForm({ ...form, busNumber: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Route Number</label>
                                        <input type="text" className="form-control" placeholder="e.g. EX 1-16 (Optional)" value={form.routeNo} onChange={e => setForm({ ...form, routeNo: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Bus Type</label>
                                        <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                            <option value="Normal (Non AC)">Normal (Non AC)</option>
                                            <option value="Semi Luxury (Non AC)">Semi Luxury (Non AC)</option>
                                            <option value="Luxury (AC)">Luxury (AC)</option>
                                            <option value="Super Luxury (AC)">Super Luxury (AC)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Total Passenger Seats</label>
                                        <input type="number" className="form-control" min="5" max="100" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} required />
                                    </div>
                                </div>
                            </div>

                            {/* Layout Settings */}
                            <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>2. Physical Dimensions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label className="form-label">Left Side Seats</label>
                                        <input type="number" className="form-control" min="1" max="5" value={leftRowSeats} onChange={e => setForm({ ...form, layoutParams: { ...form.layoutParams, leftRowSeats: Number(e.target.value) } })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Right Side Seats</label>
                                        <input type="number" className="form-control" min="1" max="5" value={rightRowSeats} onChange={e => setForm({ ...form, layoutParams: { ...form.layoutParams, rightRowSeats: Number(e.target.value) } })} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Back Row Seats</label>
                                        <input type="number" className="form-control" min="1" max="10" value={backRowSeats} onChange={e => setForm({ ...form, layoutParams: { ...form.layoutParams, backRowSeats: Number(e.target.value) } })} required />
                                    </div>
                                </div>
                            </div>

                            <div className="alert alert-info" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <LayoutTemplate size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>Look at the right panel to preview. <b>Click on any seat</b> in the preview to remove it (leave a gap). The numbers will automatically adjust!</span>
                            </div>

                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : editId ? 'Update Bus' : 'Save New Bus'}
                            </button>
                            {editId && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
                        </div>
                    </form>

                    {/* INTERACTIVE SEAT PREVIEW */}
                    <div style={{ marginTop: '0', padding: '1rem', background: 'var(--bg-color)', border: '2px dashed var(--border-strong)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                            <Armchair size={16} /> Interactive Layout Preview
                        </div>

                        {previewLayout.length === 0 ? (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min seats required</div>
                        ) : (
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1.2rem 1.2rem 0.5rem 0.5rem', padding: '1rem 0.75rem', maxWidth: 'max-content', minWidth: '220px', margin: '0 auto' }}>
                                {/* Driver Panel */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '4px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="2"></circle><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                                    </div>
                                </div>

                                {previewLayout.map((row, ri) => {
                                    const InteractiveSeat = ({ seatObj }) => {
                                        const isRemoved = seatObj.num === null;
                                        return (
                                            <div
                                                onClick={() => toggleSeatSlot(seatObj.slotId)}
                                                title={isRemoved ? "Click to add seat" : "Click to remove space"}
                                                style={{
                                                    width: '32px', height: '32px', borderRadius: '5px',
                                                    background: isRemoved ? 'transparent' : 'var(--success)',
                                                    border: isRemoved ? '1.5px dashed var(--border-strong)' : 'none',
                                                    color: isRemoved ? 'var(--text-muted)' : '#fff',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer',
                                                    boxShadow: isRemoved ? 'none' : 'inset 0 -2px 0 rgba(0,0,0,0.15)',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {isRemoved ? '+' : seatObj.num}
                                            </div>
                                        );
                                    };

                                    if (row.isBack) {
                                        return (
                                            <div key={ri} style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                                                {row.seats.map(s => <InteractiveSeat key={s.slotId} seatObj={s} />)}
                                            </div>
                                        );
                                    }

                                    const leftSeats = row.seats.filter(s => s.pos.startsWith('L'));
                                    const rightSeats = row.seats.filter(s => s.pos.startsWith('R'));

                                    return (
                                        <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '4px' }}>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {leftSeats.map(s => <InteractiveSeat key={s.slotId} seatObj={s} />)}
                                            </div>
                                            <div style={{ width: aisleSpace }}></div>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {rightSeats.map(s => <InteractiveSeat key={s.slotId} seatObj={s} />)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--success)', display: 'inline-block' }}></span> Active Seat</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><span style={{ width: 12, height: 12, borderRadius: 3, border: '1.5px dashed var(--border-strong)', display: 'inline-block' }}></span> Removed/Gap</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FLEET LIST SECTION */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Fleet ({buses.length} buses)</h2>
                </div>
                <div className="table-responsive">
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading buses...</div>
                    ) : buses.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No buses configured yet.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Bus No</th>
                                        <th>Route No</th>
                                        <th>Type</th>
                                        <th>Capacity</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buses.map(b => (
                                        <tr key={b._id}>
                                            <td style={{ fontWeight: '600' }}>{b.busNumber}</td>
                                            <td>{b.routeNo || '—'}</td>
                                            <td><span className="badge badge-light">{b.type}</span></td>
                                            <td>{b.capacity}</td>
                                            <td>
                                                <span className={`badge badge-${b.isActive ? 'success' : 'danger'}`}>
                                                    {b.isActive ? 'active' : 'inactive'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'nowrap' }}>
                                                    <button onClick={() => handleEdit(b)} className="btn btn-ghost btn-sm" title="Edit layout"><Pencil size={14} /></button>
                                                    {/* FIX: toggleStatus -> handleToggle */}
                                                    <button onClick={() => handleToggle(b)} className="btn btn-ghost btn-sm" title={b.isActive ? 'Deactivate' : 'Activate'}>
                                                        {b.isActive ? <AlertCircle size={14} color="var(--accent)" /> : <CheckCircle size={14} color="var(--success)" />}
                                                    </button>
                                                    <button onClick={() => handleDelete(b._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} title="Delete"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBuses;
