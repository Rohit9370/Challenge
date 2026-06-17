import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import API from '../utils/api';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({ averageRating: 0, ratings: [] });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await API.get('/owner/dashboard');
      setDashboardData(data);
    } catch (err) {
      console.error(err);
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

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Average Rating</h3>
          <p>{parseFloat(dashboardData.averageRating).toFixed(2)}</p>
          <div className="rating-stars">
            {'★'.repeat(Math.round(dashboardData.averageRating))}
            {'☆'.repeat(5 - Math.round(dashboardData.averageRating))}
          </div>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p>{dashboardData.ratings.length}</p>
        </div>
      </div>

      <div className="section">
        <h2>User Ratings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.ratings.map((rating) => (
                <tr key={rating.id}>
                  <td>{rating.User.name}</td>
                  <td>{rating.User.email}</td>
                  <td className="rating-stars">
                    {'★'.repeat(rating.rating)}{'☆'.repeat(5 - rating.rating)}
                  </td>
                  <td>{new Date(rating.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default OwnerDashboard;
