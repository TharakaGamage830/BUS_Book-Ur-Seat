import React, { useState, useEffect } from 'react';
import { getRoutes, createRoute, updateRoute, deleteRoute, toggleRouteStatus } from '../../api/admin';
import { MapPin, PlusCircle, Pencil, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const SL_CITIES = [
    'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Matara', 'Negombo', 'Trincomalee',
    'Batticaloa', 'Anuradhapura', 'Polonnaruwa', 'Badulla', 'Ratnapura',
    'Kurunegala', 'Puttalam', 'Ampara', 'Hambantota', 'Kalutara', 'Nuwara Eliya'
];

const emptyForm = { origin: '', destination: '', distance: '', estimatedDuration: '' };

const ManageRoutes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            setRoutes(await getRoutes());
        } catch (err) {
            setError('Failed to load routes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRoutes(); }, []);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSubmitting(true);
        try {
            if (editId) {
                await updateRoute(editId, form);
                showSuccess('Route updated!');
            } else {
                await createRoute(form);
                showSuccess('Route created!');
            }
            setForm(emptyForm);
            setEditId(null);
            fetchRoutes();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (route) => {
        setEditId(route._id);
        setForm({ origin: route.origin, destination: route.destination, distance: route.distance, estimatedDuration: route.estimatedDuration });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this route?')) return;
        try {
            await deleteRoute(id);
            showSuccess('Route deleted.');
            fetchRoutes();
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed.');
        }
    };

    const handleToggle = async (route) => {
        try {
            const updated = await toggleRouteStatus(route._id);
            setRoutes(prev => prev.map(r => r._id === route._id ? updated : r));
            showSuccess(`Route ${updated.isActive ? 'activated' : 'deactivated'}.`);
        } catch (err) {
            setError('Toggle failed.');
        }
    };

    return (
        <div className="page-wrapper animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <MapPin size={28} color="var(--accent)" />
                <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)' }}>Manage Routes</h1>
            </div>

            {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}
            {successMsg && <div className="success-message"><CheckCircle size={16} style={{ display: 'inline', marginRight: '0.4rem' }} />{successMsg}</div>}

            {/* ADD / EDIT SECTION */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PlusCircle size={20} color="var(--accent)" />
                    {editId ? 'Edit Route' : 'Add New Route'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="form-label">Origin City</label>
                            <select className="form-control" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required>
                                <option value="">Select origin...</option>
                                {SL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Destination City</label>
                            <select className="form-control" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required>
                                <option value="">Select destination...</option>
                                {SL_CITIES.filter(c => c !== form.origin).map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Distance (km)</label>
                            <input type="number" className="form-control" min="1" placeholder="e.g. 115" value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Duration</label>
                            <input type="text" className="form-control" placeholder="e.g. 2h 30m" value={form.estimatedDuration} onChange={e => setForm({ ...form, estimatedDuration: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Saving...' : editId ? 'Update Route' : 'Add Route'}
                        </button>
                        {editId && <button type="button" className="btn btn-ghost" onClick={() => { setEditId(null); setForm(emptyForm); }}>Cancel</button>}
                    </div>
                </form>
            </div>

            {/* Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 1.5rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        Routes ({routes.length})
                    </h2>
                </div>
                <div className="scrollable">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Route</th>
                                <th>Distance</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading...</td></tr>
                            ) : routes.length === 0 ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No routes yet. Add your first route.</td></tr>
                            ) : routes.map(route => (
                                <tr key={route._id} style={{ opacity: route.isActive ? 1 : 0.55 }}>
                                    <td>
                                        <div style={{ fontWeight: '700' }}>{route.origin}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>↓ {route.destination}</div>
                                    </td>
                                    <td>{route.distance ? `${route.distance} km` : '—'}</td>
                                    <td>{route.estimatedDuration || '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <label className="toggle-switch">
                                                <input type="checkbox" checked={route.isActive} onChange={() => handleToggle(route)} />
                                                <span className="toggle-slider"></span>
                                            </label>
                                            <span style={{ fontSize: '0.8rem', color: route.isActive ? 'var(--success)' : 'var(--text-muted)', fontWeight: '600' }}>
                                                {route.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(route)}><Pencil size={15} /></button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route._id)}><Trash2 size={15} /></button>
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

export default ManageRoutes;
