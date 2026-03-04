import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, Map, Calendar, Settings } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <Settings size={32} color="var(--primary-color)" style={{ marginRight: '1rem' }} />
                <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Admin Dashboard</h1>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                Welcome to the administration panel. Manage system resources below.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
            }}>
                {/* Manage Buses */}
                <Link to="/admin/buses" style={{ textDecoration: 'none' }}>
                    <div className="card feature-card-interactive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
                        <div style={{ backgroundColor: 'rgba(30, 64, 175, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Bus size={48} color="var(--primary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Manage Buses</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Add new buses, view fleet capacity, and configure bus types.</p>
                    </div>
                </Link>

                {/* Manage Routes */}
                <Link to="/admin/routes" style={{ textDecoration: 'none' }}>
                    <div className="card feature-card-interactive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
                        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Map size={48} color="var(--success-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Manage Routes</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Define origins, destinations, distances, and estimated travel times.</p>
                    </div>
                </Link>

                {/* Manage Schedules */}
                <Link to="/admin/schedules" style={{ textDecoration: 'none' }}>
                    <div className="card feature-card-interactive" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', height: '100%' }}>
                        <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
                            <Calendar size={48} color="var(--warning-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Manage Schedules</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Assign buses to routes and schedule departure times.</p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
