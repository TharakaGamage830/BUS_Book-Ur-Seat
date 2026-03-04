import React, { useState, useEffect } from 'react';
import { getSchedules, createSchedule, getBuses, getRoutes } from '../../api/admin';
import { CalendarIcon, PlusCircle } from 'lucide-react';

const ManageSchedules = () => {
    const [schedules, setSchedules] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Form inputs
    const [selectedBus, setSelectedBus] = useState('');
    const [selectedRoute, setSelectedRoute] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [schedulesData, busesData, routesData] = await Promise.all([
                getSchedules(),
                getBuses(),
                getRoutes()
            ]);
            setSchedules(schedulesData);
            setBuses(busesData.filter(b => b.isActive));
            setRoutes(routesData.filter(r => r.isActive));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            await createSchedule({
                bus: selectedBus,
                route: selectedRoute,
                departureTime,
                arrivalTime,
                price: Number(price)
            });
            setSuccessMsg('Schedule added successfully');
            setSelectedBus('');
            setSelectedRoute('');
            setDepartureTime('');
            setArrivalTime('');
            setPrice('');
            // Only refresh schedules to save network
            const schedulesData = await getSchedules();
            setSchedules(schedulesData);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create schedule');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <CalendarIcon size={32} color="var(--primary-color)" style={{ marginRight: '1rem' }} />
                <h1 style={{ fontSize: '2rem', margin: 0 }}>Manage Schedules</h1>
            </div>

            {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
            {successMsg && <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', border: '1px solid var(--success-color)' }}>{successMsg}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
                {/* Add New Schedule Form */}
                <div className="card">
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <PlusCircle size={20} /> Add New Schedule
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Bus</label>
                            <select
                                className="form-control"
                                value={selectedBus}
                                onChange={(e) => setSelectedBus(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a bus</option>
                                {buses.map(bus => (
                                    <option key={bus._id} value={bus._id}>
                                        {bus.busNumber} ({bus.capacity} seats, {bus.type})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Route</label>
                            <select
                                className="form-control"
                                value={selectedRoute}
                                onChange={(e) => setSelectedRoute(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select a route</option>
                                {routes.map(rt => (
                                    <option key={rt._id} value={rt._id}>
                                        {rt.origin} to {rt.destination}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Departure Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Arrival Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Base Price ($)</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="ex. 25"
                                min="1"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Schedule</button>
                    </form>
                </div>

                {/* List of Schedules */}
                <div className="card">
                    <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Upcoming Schedules</h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '0.75rem' }}>Route</th>
                                        <th style={{ padding: '0.75rem' }}>Bus</th>
                                        <th style={{ padding: '0.75rem' }}>Departure</th>
                                        <th style={{ padding: '0.75rem' }}>Price</th>
                                        <th style={{ padding: '0.75rem' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {schedules.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No schedules found. Add one to get started.</td>
                                        </tr>
                                    ) : (
                                        schedules.map(schedule => (
                                            <tr key={schedule._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>
                                                    {schedule.route ? `${schedule.route.origin} to ${schedule.route.destination}` : 'Deleted Route'}
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>
                                                    {schedule.bus ? schedule.bus.busNumber : 'Deleted Bus'}
                                                </td>
                                                <td style={{ padding: '0.75rem' }}>{formatDate(schedule.departureTime)}</td>
                                                <td style={{ padding: '0.75rem' }}>${schedule.price}</td>
                                                <td style={{ padding: '0.75rem', textTransform: 'capitalize' }}>
                                                    <span style={{
                                                        backgroundColor: schedule.status === 'scheduled' ? 'rgba(56, 189, 248, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                                        color: schedule.status === 'scheduled' ? 'var(--primary-color)' : 'var(--success-color)',
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        {schedule.status}
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

export default ManageSchedules;
