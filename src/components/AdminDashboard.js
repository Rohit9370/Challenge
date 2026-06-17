import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Logo from './Logo';
import API from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'stores') loadStores();
    else if (activeTab === 'users') loadUsers();
  }, [activeTab, filters, sortBy, order]);

  const loadDashboard = async () => {
    try {
      const { data } = await API.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadStores = async () => {
    try {
      const { data } = await API.get('/admin/stores', {
        params: { ...filters, sortBy, order },
      });
      setStores(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await API.get('/admin/users', {
        params: { ...filters, sortBy, order },
      });
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setOrder('ASC');
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await API.post('/admin/stores', formData);
      setShowModal(false);
      setFormData({});
      loadStores();
      loadDashboard();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.message || 'Failed to create store']);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      await API.post('/admin/users', formData);
      setShowModal(false);
      setFormData({});
      loadUsers();
      loadDashboard();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.message || 'Failed to create user']);
      }
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <Logo size={40} showText={true} />
        <button onClick={logout} className="btn-logout">Logout</button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'stores' ? 'active' : ''}`}
          onClick={() => setActiveTab('stores')}
        >
          Stores
        </button>
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Stores</h3>
            <p>{stats.totalStores}</p>
          </div>
          <div className="stat-card">
            <h3>Total Ratings</h3>
            <p>{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {activeTab === 'stores' && (
        <div className="section">
          <button
            onClick={() => {
              setModalType('store');
              setShowModal(true);
              setFormData({});
            }}
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Add New Store
          </button>

          <div className="filters">
            <input
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <input
              placeholder="Filter by email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
            <input
              placeholder="Filter by address"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('email')}>Email {sortBy === 'email' && (order === 'ASC' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('address')}>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td className="rating-stars">
                      {'★'.repeat(Math.round(store.averageRating))}{'☆'.repeat(5 - Math.round(store.averageRating))}
                      {' '}({parseFloat(store.averageRating).toFixed(1)})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="section">
          <button
            onClick={() => {
              setModalType('user');
              setShowModal(true);
              setFormData({ role: 'user' });
            }}
            className="btn btn-primary"
            style={{ marginBottom: '20px' }}
          >
            Add New User
          </button>

          <div className="filters">
            <input
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <input
              placeholder="Filter by email"
              value={filters.email}
              onChange={(e) => setFilters({ ...filters, email: e.target.value })}
            />
            <input
              placeholder="Filter by address"
              value={filters.address}
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            />
            <select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('email')}>Email {sortBy === 'email' && (order === 'ASC' ? '↑' : '↓')}</th>
                  <th onClick={() => handleSort('address')}>Address</th>
                  <th onClick={() => handleSort('role')}>Role {sortBy === 'role' && (order === 'ASC' ? '↑' : '↓')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'store' ? 'Add New Store' : 'Add New User'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={modalType === 'store' ? handleCreateStore : handleCreateUser}>
              <div className="form-group">
                <label>Name (20-60 characters)</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Address (Max 400 characters)</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              {modalType === 'user' && (
                <>
                  <div className="form-group">
                    <label>Password (8-16 chars, 1 uppercase, 1 special)</label>
                    <input
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={formData.role || 'user'}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="owner">Owner</option>
                    </select>
                  </div>
                  {formData.role === 'owner' && (
                    <div className="form-group">
                      <label>Store ID</label>
                      <input
                        type="number"
                        value={formData.storeId || ''}
                        onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                      />
                    </div>
                  )}
                </>
              )}
              {errors.length > 0 && (
                <div>
                  {errors.map((err, idx) => (
                    <p key={idx} className="error">{err}</p>
                  ))}
                </div>
              )}
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
