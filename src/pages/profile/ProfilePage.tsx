import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api/apiService';
import { Camera, User, Phone, Mail, MapPin, Calendar, Briefcase } from 'lucide-react';
// import { ProfileSection } from '../../components/profile/ProfileSection';

export const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await apiService.getProfile();
            console.log('Profile Data', response);
            setProfile(response);
            setFormData(response || {}); // Ensure formData is never null/undefined
        } catch (error) {
            console.error('Failed to load profile:', error);
            // Set fallback data
            setProfile({});
            setFormData({});
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Filter out read-only fields
            const editableFields = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                phoneWork: formData.phoneWork,
                title: formData.title,
                department: formData.department,
                bio: formData.bio,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactPhone: formData.emergencyContactPhone
            };

            // Remove undefined/null values
            const cleanData = Object.fromEntries(
                Object.entries(editableFields).filter(([_, value]) => value !== undefined && value !== null)
            );

            console.log('Saving profile data:', cleanData);
            const response = await apiService.updateProfile(cleanData);
            console.log('Profile update response:', response);

            // Update local state with the response data
            setProfile(response.data || { ...profile, ...cleanData });
            setFormData(response.data || { ...formData, ...cleanData });
            setEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                Loading profile...
            </div>
        );
    }

    // Add this function inside the ProfilePage component
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        try {
            console.log('Uploading file:', file.name, file.size);
            const compressedFile = await compressImage(file);
            const response = await apiService.uploadProfilePhoto(compressedFile);
            console.log('Upload response:', response);

            // Handle the response structure
            const photoUrl = response?.data?.profilePhotoUrl || response?.profilePhotoUrl;

            if (photoUrl) {
                const updatedProfile = { ...profile, profilePhotoUrl: photoUrl };
                setProfile(updatedProfile);
                setFormData(updatedProfile);
            } else {
                throw new Error('No photo URL returned from server');
            }
        } catch (error) {
            console.error('Failed to upload photo:', error);
            alert('Failed to upload photo. Please try again.');
        }
    };

    const handlePhotoRemove = async () => {
        try {
            await apiService.removeProfilePhoto();
            const updatedProfile = { ...profile, profilePhotoUrl: null };
            setProfile(updatedProfile);
            setFormData(updatedProfile);
        } catch (error) {
            console.error('Failed to remove photo:', error);
        }
    };

    const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;
            const img = new Image();

            img.onload = () => {
                const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                canvas.toBlob((blob) => {
                    resolve(new File([blob!], file.name, { type: file.type }));
                }, file.type, quality);
            };

            img.src = URL.createObjectURL(file);
        });
    };

    return (
        <div style={{ maxWidth: '4xl', margin: '0 auto', padding: '2rem' }}>
            {/* Profile Header */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1.5rem',
                padding: '2rem',
                marginBottom: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
            }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '6rem',
                        height: '6rem',
                        borderRadius: '50%',
                        background: profile?.profilePhotoUrl ?
                            `url(http://localhost:3000${profile.profilePhotoUrl})` :  // Full URL
                            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        {!profile?.profilePhotoUrl && (
                            `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`
                        )}
                    </div>
                    {editing && (
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            display: 'flex',
                            gap: '0.25rem'
                        }}>
                            <input
                                type="file"
                                id="photo-upload"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={() => document.getElementById('photo-upload')?.click()}
                                style={{
                                    background: '#6366f1',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '2rem',
                                    height: '2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                title="Upload photo"
                            >
                                <Camera size={16} />
                            </button>
                            {profile?.profilePhotoUrl && (
                                <button
                                    onClick={handlePhotoRemove}
                                    style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '2rem',
                                        height: '2rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer'
                                    }}
                                    title="Remove photo"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                        {profile?.firstName} {profile?.lastName}
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.125rem', margin: '0 0 0.5rem 0' }}>
                        {profile?.title || 'No title set'}
                    </p>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.25rem 0.75rem',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#4f46e5',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 500
                    }}>
                        {user?.role?.replace('_', ' ')}
                    </div>
                </div>

                <div>
                    {!editing ? (
                        <button
                            onClick={() => setEditing(true)}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '0.75rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                onClick={handleSave}
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                style={{
                                    background: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '0.75rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Sections */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <ProfileSection
                    title="Contact Information"
                    icon={<Phone size={20} />}
                    fields={[
                        { key: 'email', label: 'Email', type: 'email', icon: <Mail size={16} /> },
                        { key: 'phone', label: 'Personal Phone', type: 'tel', icon: <Phone size={16} /> },
                        { key: 'phoneWork', label: 'Work Phone', type: 'tel', icon: <Phone size={16} /> },
                        { key: 'address', label: 'Address', type: 'text', icon: <MapPin size={16} /> }
                    ]}
                    data={formData}
                    editing={editing}
                    onChange={setFormData}
                />

                <ProfileSection
                    title="Professional Details"
                    icon={<Briefcase size={20} />}
                    fields={[
                        { key: 'title', label: 'Job Title', type: 'text' },
                        { key: 'department', label: 'Department', type: 'text' },
                        { key: 'bio', label: 'Bio', type: 'textarea' }
                    ]}
                    data={formData}
                    editing={editing}
                    onChange={setFormData}
                />
            </div>
        </div>
    );
};

const ProfileSection = ({ title, icon, fields, data, editing, onChange }) => {
    // Add this guard clause at the top
    if (!data) {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    const handleChange = (key: string, value: string) => {
        onChange({ ...data, [key]: value });
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            <h3 style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1.125rem',
                fontWeight: 600,
                marginBottom: '1rem'
            }}>
                {icon} {title}
            </h3>

            {fields.map(field => (
                <div key={field.key} style={{ marginBottom: '1rem' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '0.25rem'
                    }}>
                        {field.label}
                    </label>
                    {editing ? (
                        field.type === 'textarea' ? (
                            <textarea
                                value={data[field.key] || ''} // Safe access with fallback
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem',
                                    minHeight: '80px'
                                }}
                            />
                        ) : (
                            <input
                                type={field.type}
                                value={data[field.key] || ''} // Safe access with fallback
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.5rem'
                                }}
                            />
                        )
                    ) : (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem',
                            background: '#f9fafb',
                            borderRadius: '0.5rem',
                            minHeight: '1rem'
                        }}>
                            {field.icon}
                            <span>{data[field.key] || 'Not set'}</span> {/* Safe access with fallback */}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};