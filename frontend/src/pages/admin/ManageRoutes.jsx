import React, { useState, useEffect } from 'react';
import { getRoutes, createRoute } from '../../api/admin';
import { MapIcon, PlusCircle } from 'lucide-react';

const ManageRoutes = () => {
    const [routesList, setRoutesList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form inputs
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [distance, setDistance] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const data = await getRoutes();
            setRoutesList(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await createRoute({
                origin,
                destination,
                distance: distance ? Number(distance) : null,
                estimatedDuration
            });
            setSuccessMsg('Route added successfully');
            setOrigin('');
            setDestination('');
            setDistance('');
            setEstimatedDuration('');
            fetchRoutes(); // refresh list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create route');
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <MapIcon size={32} color="var(--primary-color)" style={{ marginRight: '1rem' }} />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Manage Routes</h1>
            </div>

            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', border: '1px solid var(--success-color)' }}>{successMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Add New Route Form */}
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <PlusCircle size={20} /> Add New Route
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Origin (Starting Point)</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ex. New York"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Destination</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ex. Washington DC"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Distance (km)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ex. 350"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Estimated Duration</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="ex. 4 hours"
                                value={estimatedDuration}
                                onChange={(e) => setEstimatedDuration(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Route</button>
                    </form>
                </div>

                {/* List of Routes */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Active Routes</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '0.75rem' }}>Origin</th>
                                        <th style={{ padding: '0.75rem' }}>Destination</th>
                                        <th style={{ padding: '0.75rem' }}>Distance</th>
                                        <th style={{ padding: '0.75rem' }}>Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routesList.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No routes found. Add one to get started.</td>
                                        </tr>
                                    ) : (
                                        routesList.map(route => (
                                            <tr key={route._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{route.origin}</td>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{route.destination}</td>
                                                <td style={{ padding: '0.75rem' }}>{route.distance ? `${route.distance} km` : 'N/A'}</td>
                                                <td style={{ padding: '0.75rem' }}>{route.estimatedDuration || 'N/A'}</td>
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

export default ManageRoutes;
