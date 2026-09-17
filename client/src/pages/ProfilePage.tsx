import { useState, type FormEvent } from 'react';
import { useApi } from '../hooks/useApi';
import { getProfile, updateProfile } from '../services/profileService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export function ProfilePage() {
  const { data, loading, error, refetch } = useApi(() => getProfile(), []);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const profile = data?.data;

  const startEdit = () => {
    if (!profile) return;
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setStreet(profile.address.street);
    setCity(profile.address.city);
    setState(profile.address.state);
    setPostalCode(profile.address.postalCode);
    setCountry(profile.address.country);
    setEditing(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveError(null);
      await updateProfile({
        name, email, phone,
        address: { street, city, state, postalCode, country },
      });
      setEditing(false);
      setToast('Profile updated!');
      setTimeout(() => setToast(null), 2000);
      refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!profile) return <ErrorMessage message="Profile not found" />;

  const fieldClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        {!editing && (
          <button onClick={startEdit} className="px-4 py-2.5 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors cursor-pointer">
            Edit Profile
          </button>
        )}
      </div>

      {toast && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700 animate-fade-in">{toast}</div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {saveError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{saveError}</div>
            )}
            <div>
              <label className={labelClass}>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={fieldClass} />
            </div>
            <hr className="border-slate-200" />
            <h3 className="font-semibold text-slate-900">Address</h3>
            <div>
              <label className={labelClass}>Street</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)} className={fieldClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input type="text" value={state} onChange={(e) => setState(e.target.value)} className={fieldClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Postal Code</label>
                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={fieldClass} />
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className={fieldClass} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2.5 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 text-slate-700 bg-slate-100 font-medium rounded-lg hover:bg-slate-200 transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Name</p>
              <p className="text-slate-900 font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-slate-900">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-slate-900">{profile.phone}</p>
            </div>
            <hr className="border-slate-200" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Address</p>
              <p className="text-slate-900">{profile.address.street}</p>
              <p className="text-slate-600">{profile.address.city}, {profile.address.state} {profile.address.postalCode}</p>
              <p className="text-slate-600">{profile.address.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
