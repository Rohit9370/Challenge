import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import API from '../utils/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('ASC');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadStores();
  }, [filters, sortBy, order]);

  const loadStores = async () => {
    try {
      const { data } = await API.get('/user/stores', {
        params: { ...filters, sortBy, order },
      });
      setStores(data);
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

  const handleRateStore = (store) => {
    setSelectedStore(store);
    setRating(store.userRating || 0);
    setShowRatingModal(true);
    setErrors([]);
    setSuccess('');
  };

  const submitRating = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    try {
      await API.post('/user/ratings', {
        storeId: selectedStore.id,
        rating,
      });
      setSuccess('Rating submitted successfully!');
      setTimeout(() => {
        setShowRatingModal(false);
        loadStores();
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.message || 'Failed to submit rating']);
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setErrors([]);
    setSuccess('');

    try {
      await API.put('/auth/update-password', { newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setNewPassword('');
      }, 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.message || 'Failed to update password']);
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
        <div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            Update Password
          </button>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </div>

      <div className="section">
        <h2>Store Listings</h2>

        <div className="filters">
          <input
            placeholder="Search by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            placeholder="Search by address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Store Name {sortBy === 'name' && (order === 'ASC' ? '↑' : '↓')}</th>
                <th onClick={() => handleSort('address')}>Address</th>
                <th>Overall Rating</th>
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.address}</td>
                  <td className="rating-stars">
                    {'★'.repeat(Math.round(store.averageRating))}{'☆'.repeat(5 - Math.round(store.averageRating))}
                    {' '}({parseFloat(store.averageRating).toFixed(1)})
                  </td>
                  <td>
                    {store.userRating ? (
                      <span className="rating-stars">
                        {'★'.repeat(store.userRating)}{'☆'.repeat(5 - store.userRating)}
                      </span>
                    ) : (
                      <span>Not rated</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleRateStore(store)} className="btn-rate">
                      {store.userRating ? 'Update' : 'Rate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showRatingModal && (
        <div className="modal" onClick={() => setShowRatingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Rate {selectedStore?.name}</h2>
              <button className="btn-close" onClick={() => setShowRatingModal(false)}>×</button>
            </div>
            <form onSubmit={submitRating}>
              <div className="form-group">
                <label>Your Rating (1-5)</label>
                <div style={{ display: 'flex', gap: '10px', fontSize: '32px', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ color: star <= rating ? '#f39c12' : '#ddd' }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {errors.length > 0 && errors.map((err, idx) => (
                <p key={idx} className="error">{err}</p>
              ))}
              {success && <p className="success">{success}</p>}
              <button type="submit" className="btn btn-primary">Submit Rating</button>
            </form>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="modal" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Password</h2>
              <button className="btn-close" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>New Password (8-16 chars, 1 uppercase, 1 special)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              {errors.length > 0 && errors.map((err, idx) => (
                <p key={idx} className="error">{err}</p>
              ))}
              {success && <p className="success">{success}</p>}
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
