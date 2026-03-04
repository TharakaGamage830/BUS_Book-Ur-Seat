import React, { useState, useEffect } from 'react';
import { getBuses, createBus } from '../../api/admin';
import { BusIcon, PlusCircle } from 'lucide-react';

const ManageBuses = () => {
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form inputs
    const [busNumber, setBusNumber] = useState('');
    const [capacity, setCapacity] = useState(40);
    const [type, setType] = useState('AC');

    const fetchBuses = async () => {
        try {
            setLoading(true);
            const data = await getBuses();
            setBuses(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch buses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await createBus({ busNumber, capacity: Number(capacity), type });
            setSuccessMsg('Bus added successfully');
            setBusNumber('');
            setCapacity(40);
            setType('AC');
            fetchBuses(); // refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create bus');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <BusIcon size={32} color="var(--primary-color)" style={{ marginRight: '1rem' }} />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Manage Buses</h1>
            </div>

            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', border: '1px solid var(--success-color)' }}>{successMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Add New Bus Form */}
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <PlusCircle size={20} /> Add New Bus
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Bus Number / License</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ex. WP-1234"
                                value={busNumber}
                                onChange={(e) => setBusNumber(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Capacity (Seats)</label>
                            <input
                                type="number"
                                className="form-control"
                                min="10"
                                max="100"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select
                                className="form-control"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <option value="AC">AC</option>
                                <option value="Non-AC">Non-AC</option>
                                <option value="Luxury">Luxury</option>
                                <option value="Sleeper">Sleeper</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Bus</button>
                    </form>
                </div>

                {/* List of Buses */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Current Fleet</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '0.75rem' }}>Bus Number</th>
                                        <th style={{ padding: '0.75rem' }}>Type</th>
                                        <th style={{ padding: '0.75rem' }}>Capacity</th>
                                        <th style={{ padding: '0.75rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buses.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No buses found. Add one to get started.</td>
                                        </tr>
                                    ) : (
                                        buses.map(bus => (
                                            <tr key={bus._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{bus.busNumber}</td>
                                                <td style={{ padding: '0.75rem' }}>{bus.type}</td>
                                                <td style={{ padding: '0.75rem' }}>{bus.capacity} seats</td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    <span style={{
                                                        backgroundColor: bus.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: bus.isActive ? 'var(--success-color)' : 'var(--danger-color)',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {bus.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
