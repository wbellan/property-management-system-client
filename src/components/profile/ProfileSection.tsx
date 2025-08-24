// import { useAuth } from "../../contexts";

// // src/components/profile/ProfileSection.tsx
// interface ProfileSectionProps {
//     title: string;
//     fields: Array<{
//         key: string;
//         label: string;
//         type: string;
//     }>;
//     data: any;
//     editing: boolean;
//     onChange: (data: any) => void;
//     roles?: string[]; // Only show section for certain roles
// }

// export const ProfileSection: React.FC<ProfileSectionProps> = ({
//     title,
//     fields,
//     data,
//     editing,
//     onChange,
//     roles
// }) => {
//     const { user } = useAuth();

//     // Hide section if user role doesn't match
//     if (roles && !roles.includes(user?.role)) {
//         return null;
//     }

//     const handleFieldChange = (key: string, value: string) => {
//         onChange({ ...data, [key]: value });
//     };

//     return (
//         <div className="profile-section">
//             <h3>{title}</h3>
//             <div className="form-grid">
//                 {fields.map(field => (
//                     <div key={field.key} className="form-field">
//                         <label>{field.label}</label>
//                         {editing ? (
//                             field.type === 'textarea' ? (
//                                 <textarea
//                                     value={data[field.key] || ''}
//                                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                                     className="form-input"
//                                 />
//                             ) : (
//                                 <input
//                                     type={field.type}
//                                     value={data[field.key] || ''}
//                                     onChange={(e) => handleFieldChange(field.key, e.target.value)}
//                                     className="form-input"
//                                 />
//                             )
//                         ) : (
//                             <span className="field-value">
//                                 {data[field.key] || 'Not set'}
//                             </span>
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };