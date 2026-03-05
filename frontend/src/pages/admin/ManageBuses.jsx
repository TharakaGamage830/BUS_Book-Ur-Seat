import React, { useState, useEffect } from 'react';
import { getBuses, createBus, updateBus, deleteBus, toggleBusStatus } from '../../api/admin';
import { Bus, PlusCircle, Pencil, Trash2, AlertCircle, CheckCircle, Armchair } from 'lucide-react';

const emptyForm = { busNumber: '', capacity: 40, type: 'AC' };

/**
 * Sri Lankan bus seat layout algorithm:
 * - Last row: always 5 seats (full width, no aisle)
 * - Normal rows: 2 (left) + aisle + 2 (right) = 4 seats
 * - First row: partial, based on remainder
 *   remainder = (total - 5) % 4
 *   0 → no partial first row
 *   1 → 1 seat (left corner only)
 *   2 → 2 seats (left side only)
 *   3 → 2 left + 1 right
 */
const generateSeatLayout = (capacity) => {
    const cap = Number(capacity) || 0;
    if (cap < 5) return [];

    const remaining = cap - 5; // seats minus last row
    const fullRows = Math.floor(remaining / 4);
    const extra = remaining % 4;

    const rows = [];
    let seatNum = 1;

    // First row (partial) — if extra > 0
    if (extra > 0) {
        const row = { seats: [], isPartial: true };
        // Left side: extra >= 1 → seat at pos 0; extra >= 2 → seat at pos 1
        if (extra >= 1) row.seats.push({ num: seatNum++, pos: 'L1' });
        if (extra >= 2) row.seats.push({ num: seatNum++, pos: 'L2' });

        // Right side: extra >= 3 → seat at pos 3 (R1)
        if (extra >= 3) row.seats.push({ num: seatNum++, pos: 'R1' });
        // pos R2 stays empty in partial row (max extra is 3)
        rows.push(row);
    }

    // Full rows of 4
    for (let r = 0; r < fullRows; r++) {
        rows.push({
            seats: [
                { num: seatNum++, pos: 'L1' },
                { num: seatNum++, pos: 'L2' },
                { num: seatNum++, pos: 'R1' },
                { num: seatNum++, pos: 'R2' },
            ],
            isPartial: false,
        });
    }

    // Last row: 5 seats
    const lastRow = { seats: [], isBack: true };
    for (let i = 0; i < 5; i++) {
        lastRow.seats.push({ num: seatNum++, pos: `B${i}` });
    }
    rows.push(lastRow);

    return rows;
};

const SeatPreview = ({ capacity }) => {
    const rows = generateSeatLayout(capacity);
    if (rows.length === 0) return <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min 5 seats required</div>;

    const seatStyle = (filled) => ({
        width: '28px', height: '28px', borderRadius: '5px',
        background: filled ? 'var(--success)' : 'transparent',
        border: filled ? 'none' : '1.5px dashed var(--border-strong)',
        color: filled ? '#fff' : 'var(--text-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.58rem', fontWeight: '700',
    });

    return (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-color)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <Armchair size={14} /> Seat Layout Preview ({capacity} seats)
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '1rem 1rem 0.5rem 0.5rem', padding: '0.75rem 0.5rem', maxWidth: '190px', margin: '0 auto' }}>
                {/* Driver */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.5rem', color: 'var(--text-muted)' }}>
                        <Bus size={12} />
                    </div>
                </div>

                {rows.map((row, ri) => {
                    if (row.isBack) {
                        // Last row: 5 seats, no aisle
                        return (
                            <div key={ri} style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed var(--border)' }}>
                                {row.seats.map(s => (
                                    <div key={s.num} style={seatStyle(true)}>{s.num}</div>
                                ))}
                            </div>
                        );
                    }

                    // Normal or partial row: 2 left + aisle + 2 right
                    const leftSeats = row.seats.filter(s => s.pos.startsWith('L'));
                    const rightSeats = row.seats.filter(s => s.pos.startsWith('R'));

                    return (
                        <div key={ri} style={{ display: 'flex', justifyContent: 'center', gap: '3px', marginBottom: '3px' }}>
                            {/* Left side (2 slots) */}
                            <div style={seatStyle(leftSeats.length >= 1)}>{leftSeats[0]?.num || ''}</div>
                            <div style={seatStyle(leftSeats.length >= 2)}>{leftSeats[1]?.num || ''}</div>
                            {/* Aisle */}
                            <div style={{ width: '16px' }}></div>
                            {/* Right side (2 slots) */}
                            <div style={seatStyle(rightSeats.length >= 1)}>{rightSeats[0]?.num || ''}</div>
                            <div style={seatStyle(rightSeats.length >= 2)}>{rightSeats[1]?.num || ''}</div>
                        </div>
                    );
                })}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.6rem', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--success)', display: 'inline-block' }}></span> Seat</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: 10, height: 10, borderRadius: 3, border: '1.5px dashed var(--border-strong)', display: 'inline-block' }}></span> Empty</span>
            </div>
        </div>
    );
};

const ManageBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchBuses = async () => {
        try { setLoading(true); setBuses(await getBuses()); }
        catch (err) { setError('Failed to load buses.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchBuses(); }, []);

    const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSubmitting(true);
        try {
            if (editId) { await updateBus(editId, form); showSuccess('Bus updated!'); }
            else { await createBus(form); showSuccess('Bus added!'); }
            setForm(emptyForm); setEditId(null); fetchBuses();
        } catch (err) { setError(err.response?.data?.message || 'Operation failed.'); }
        finally { setSubmitting(false); }
    };

    const handleEdit = (bus) => {
        setEditId(bus._id);
        setForm({ busNumber: bus.busNumber, capacity: bus.capacity, type: bus.type });
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

    const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

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
                    {editId ? 'Edit Bus' : 'Add New Bus'}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="form-label">Bus Number / License Plate</label>
                                <input type="text" className="form-control" placeholder="e.g. NB-1234" value={form.busNumber} onChange={e => setForm({ ...form, busNumber: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Seat Capacity</label>
                                <input type="number" className="form-control" min="10" max="60" value={form.capacity} onChange={e => setForm({ ...form, capacity: Number(e.target.value) })} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bus Type</label>
                                <select className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option value="AC">AC (Air Conditioned)</option>
                                    <option value="Non-AC">Non-AC</option>
                                    <option value="Luxury">Luxury (Semi-Sleeper)</option>
                                    <option value="Express">Express</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Saving...' : editId ? 'Update Bus' : 'Add Bus'}
                            </button>
                            {editId && <button type="button" className="btn btn-ghost" onClick={cancelEdit}>Cancel</button>}
                        </div>
                    </form>

                    {/* Live Seat Preview */}
                    <SeatPreview capacity={form.capacity} />
                </div>
            </div>

            {/* FLEET LIST SECTION */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700' }}>Fleet ({buses.length} buses)</h2>
                </div>
                <div className="scrollable">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Bus Number</th>
                                <th>Type</th>
                                <th>Capacity</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading buses...</td></tr>
                            ) : buses.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No buses yet. Add your first bus.</td></tr>
                            ) : buses.map(bus => (
                                <tr key={bus._id} style={{ opacity: bus.isActive ? 1 : 0.55 }}>
                                    <td style={{ fontWeight: '700' }}>{bus.busNumber}</td>
                                    <td><span className="badge badge-primary">{bus.type}</span></td>
                                    <td>{bus.capacity} seats</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <label className="toggle-switch">
                                                <input type="checkbox" checked={bus.isActive} onChange={() => handleToggle(bus)} />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <span style={{ fontSize: '0.8rem', color: bus.isActive ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                                                {bus.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(bus)} title="Edit"><Pencil size={15} /></button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bus._id)} title="Delete"><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export { generateSeatLayout };
export default ManageBuses;
