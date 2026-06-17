import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import API from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Logo from './Logo';
import './ui/styles.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'user') navigate('/user');
      else if (data.role === 'owner') navigate('/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-branding">
          <Logo size={56} showText={true} />
          <p style={{ marginTop: '16px' }}>Welcome back</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="ui-form-group">
                <Label htmlFor="email">Email</Label>
                <div className="ui-input-wrapper">
                  <Mail className="ui-input-icon" size={16} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="ui-input-with-icon"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="ui-form-group">
                <Label htmlFor="password">Password</Label>
                <div className="ui-input-wrapper">
                  <Lock className="ui-input-icon" size={16} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="ui-input-with-icon"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="ui-alert ui-alert-error">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="auth-footer">
              <span style={{ color: '#737373' }}>Don't have an account? </span>
              <span className="ui-link" onClick={() => navigate('/register')}>
                Sign up
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
