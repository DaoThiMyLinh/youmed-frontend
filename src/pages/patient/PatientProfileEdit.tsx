import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, FormField, Input, Button, ErrorMessage, Toast } from '../../components';
import { updateProfileThunk, selectPatientProfile, selectPatientLoading, selectPatientError, selectPatientUpdateSuccess, resetUpdateSuccess } from '../../store/features/patient/patientSlice';
import { selectUserRole } from '../../store/features/auth/authSlice';
import { useTranslation } from 'react-i18next';

const PatientProfileEdit = () => {
  const dispatch = useDispatch<any>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const profile = useSelector(selectPatientProfile);
  const loading = useSelector(selectPatientLoading);
  const error = useSelector(selectPatientError);
  const updateSuccess = useSelector(selectPatientUpdateSuccess);
  const role = useSelector(selectUserRole);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    gender: '',
    dateOfBirth: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        dispatch(resetUpdateSuccess());
        navigate(role === 'DOCTOR' ? '/doctor-profile' : '/profile');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [updateSuccess, navigate, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfileThunk(formData as any));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('profile.editProfile')}</h1>
        <Button variant="outline" onClick={() => navigate(role === 'DOCTOR' ? '/doctor-profile' : '/profile')} disabled={loading}>{t('common.cancel')}</Button>
      </div>

      {updateSuccess && (
        <div className="absolute top-0 right-0 z-50">
          <Toast type="success" title="Success" message={t('profile.updateSuccess')} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.updateInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorMessage message={error} className="mb-6" />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t('profile.fullName')} required>
              <Input 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormField>

            <FormField label={t('profile.phoneNumber')} required>
              <Input 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </FormField>

            <FormField label={t('profile.address')}>
              <Input 
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label={t('profile.gender')}>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="">{t('profile.selectGender')}</option>
                  <option value="MALE">{t('profile.male')}</option>
                  <option value="FEMALE">{t('profile.female')}</option>
                  <option value="OTHER">{t('profile.other')}</option>
                </select>
              </FormField>

              <FormField label={t('profile.dateOfBirth')}>
                <Input 
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={loading}
                />
              </FormField>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" isLoading={loading}>{t('common.save')}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientProfileEdit;
