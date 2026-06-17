import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../utils/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Logo from './Logo';
import './ui/styles.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 8 && password.length <= 16;
    return { hasUppercase, hasSpecial, isLengthValid };
  };

  const passwordValidation = validatePassword(formData.password);
  const nameLength = formData.name?.length || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/user');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else {
        setErrors([err.response?.data?.message || 'Registration failed']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-branding">
          <Logo size={56} showText={true} />
          <p style={{ marginTop: '16px' }}>Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="ui-form-group">
                <Label htmlFor="name">
                  Full Name
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#737373' }}>
                    ({nameLength}/60, min 20)
                  </span>
                </Label>
                <div className="ui-input-wrapper">
                  <User className="ui-input-icon" size={16} />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Michael Smith Junior"
                    className="ui-input-with-icon"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    minLength="20"
                    maxLength="60"
                  />
                </div>
                {nameLength > 0 && nameLength < 20 && (
                  <p className="ui-helper-text">
                    Need {20 - nameLength} more characters
                  </p>
                )}
              </div>

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
                <Label htmlFor="password">
                  Password
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#737373' }}>
                    ({formData.password.length}/16)
                  </span>
                </Label>
                <div className="ui-input-wrapper">
                  <Lock className="ui-input-icon" size={16} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password@123"
                    className="ui-input-with-icon"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="8"
                    maxLength="16"
                  />
                </div>
                {formData.password && (
                  <div>
                    <div className={`ui-validation-item ${passwordValidation.isLengthValid ? 'valid' : ''}`}>
                      {passwordValidation.isLengthValid ? (
                        <CheckCircle2 className="ui-validation-icon" />
                      ) : (
                        <AlertCircle className="ui-validation-icon" />
                      )}
                      <span>8-16 characters</span>
                    </div>
                    <div className={`ui-validation-item ${passwordValidation.hasUppercase ? 'valid' : ''}`}>
                      {passwordValidation.hasUppercase ? (
                        <CheckCircle2 className="ui-validation-icon" />
                      ) : (
                        <AlertCircle className="ui-validation-icon" />
                      )}
                      <span>One uppercase letter</span>
                    </div>
                    <div className={`ui-validation-item ${passwordValidation.hasSpecial ? 'valid' : ''}`}>
                      {passwordValidation.hasSpecial ? (
                        <CheckCircle2 className="ui-validation-icon" />
                      ) : (
                        <AlertCircle className="ui-validation-icon" />
                      )}
                      <span>One special character (!@#$%^&*)</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ui-form-group">
                <Label htmlFor="address">
                  Address
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#737373' }}>
                    ({formData.address.length}/400)
                  </span>
                </Label>
                <div className="ui-input-wrapper">
                  <MapPin className="ui-input-icon" size={16} />
                  <Input
                    id="address"
                    type="text"
                    placeholder="123 Main Street, City, State"
                    className="ui-input-with-icon"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    maxLength="400"
                  />
                </div>
              </div>

              {errors.length > 0 && (
                <div className="ui-alert ui-alert-error">
                  <div className="flex gap-2">
                    <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 500, marginBottom: '8px' }}>Validation Errors:</p>
                      <ul style={{ listStyle: 'none', padding: 0 }}>
                        {errors.map((err, idx) => (
                          <li key={idx} style={{ marginTop: '4px' }}>• {err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="auth-footer">
              <span style={{ color: '#737373' }}>Already have an account? </span>
              <span className="ui-link" onClick={() => navigate('/login')}>
                Sign in
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
