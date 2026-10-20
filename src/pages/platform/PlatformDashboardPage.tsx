
import React, { useEffect, useState } from 'react';

type Institution = {
  id: string;
  name: string;
  code: string | null;
  institution_type?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city: string | null;
  status: string;
  slug: string | null;
  logo_url: string | null;
  login_url?: string;
  owner_id?: string | null;
  created_at: string;
};

type InstitutionsResponse = {
  success: boolean;
  data: Institution[];
  count: number;
};

type InstitutionForm = {
  name: string;
  code: string;
  institution_type: string;
  email: string;
  phone: string;
  address: string;
  city: string;
};

const emptyForm: InstitutionForm = {
  name: '',
  code: '',
  institution_type: 'SCHOOL',
  email: '',
  phone: '',
  address: '',
  city: '',
};

const sections = [
  {
    title: 'تدبير المؤسسات',
    description: 'إنشاء المؤسسات وتعديل معلوماتها وحالتها.',
    icon: '🏫',
  },
  {
    title: 'الحسابات والصلاحيات',
    description: 'إنشاء حسابات مسؤولي المؤسسات وتدبير الأدوار.',
    icon: '👤',
  },
  {
    title: 'الاشتراكات والباقات',
    description: 'تدبير الباقات وتواريخ انتهاء الاشتراكات.',
    icon: '💳',
  },
  {
    title: 'سجل النشاط',
    description: 'مراجعة العمليات الإدارية المهمة.',
    icon: '🛡️',
  },
];

const fieldStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '11px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 9,
  fontSize: 14,
  background: '#fff',
  color: '#172033',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 7,
};

function getInstitutionLoginUrl(institution: Institution): string {
  if (institution.login_url?.startsWith('/')) {
    return `${window.location.origin}${institution.login_url}`;
  }

  if (institution.slug) {
    return `${window.location.origin}/${institution.slug}`;
  }

  return '';
}

export function PlatformDashboardPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<InstitutionForm>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [createdLoginUrl, setCreatedLoginUrl] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadInstitutions() {
      try {
        setIsLoading(true);
        setError('');

        const token = localStorage.getItem('eduvora_access_token');

        if (!token) {
          throw new Error('انتهت جلسة الدخول. المرجو تسجيل الدخول من جديد.');
        }

        const response = await fetch('/api/v1/platform/institutions', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error('جلسة الدخول غير صالحة. المرجو تسجيل الدخول من جديد.');
        }

        if (response.status === 403) {
          throw new Error('ما عندكش الصلاحية للوصول لهاد البيانات.');
        }

        if (!response.ok) {
          throw new Error('تعذر تحميل المؤسسات. حاول مرة أخرى.');
        }

        const result: InstitutionsResponse = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('البيانات المسترجعة من الخادم غير صالحة.');
        }

        setInstitutions(result.data);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;

        setError(
          err instanceof Error
            ? err.message
            : 'وقع خطأ غير متوقع أثناء تحميل البيانات.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void loadInstitutions();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [logoFile]);

  function updateField(field: keyof InstitutionForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setLogoFile(null);
    setLogoPreview('');
    setFormError('');
  }

  async function handleCreateInstitution(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setFormError('');
    setSuccessMessage('');
    setCreatedLoginUrl('');

    const token = localStorage.getItem('eduvora_access_token');

    if (!token) {
      setFormError('انتهت جلسة الدخول. المرجو تسجيل الدخول من جديد.');
      return;
    }

    setIsSaving(true);

    try {
      let logoUrl: string | null = null;
      if (logoFile) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = () => reject(new Error('تعذر قراءة ملف اللوغو.'));
          reader.onload = () => {
            if (typeof reader.result !== 'string') {
              reject(new Error('محتوى ملف اللوغو غير صالح.'));
              return;
            }
            resolve(reader.result);
          };
          reader.readAsDataURL(logoFile);
        });

        const uploadResponse = await fetch('/api/v1/platform/institutions/logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileName: logoFile.name,
            mimeType: logoFile.type,
            base64,
          }),
        });
        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok || !uploadResult.success || typeof uploadResult.data?.logo_url !== 'string') {
          throw new Error(uploadResult.message || 'تعذر رفع اللوغو.');
        }
        logoUrl = uploadResult.data.logo_url;
      }

      const response = await fetch('/api/v1/platform/institutions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim(),
          institution_type: form.institution_type,
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          logo_url: logoUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || 'تعذر إنشاء المؤسسة. حاول مرة أخرى.',
        );
      }

      const newInstitution: Institution = result.data;

      setInstitutions((current) => [
        newInstitution,
        ...current.filter((item) => item.id !== newInstitution.id),
      ]);

      setCreatedLoginUrl(getInstitutionLoginUrl(newInstitution));
      resetForm();
      setShowForm(false);
      setSuccessMessage('تم إنشاء المؤسسة بنجاح، وتم إنشاء رابطها إذا كان متوفراً.');
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'وقع خطأ غير متوقع أثناء إنشاء المؤسسة.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  const activeInstitutions = institutions.filter(
    (institution) => institution.status?.toUpperCase() === 'ACTIVE',
  ).length;

  const stats = [
    {
      title: 'مجموع المؤسسات',
      value: isLoading ? '…' : error ? '—' : institutions.length.toLocaleString('ar'),
      description: 'جميع المؤسسات المسجلة في قاعدة البيانات',
      icon: '🏫',
    },
    {
      title: 'المؤسسات النشطة',
      value: isLoading ? '…' : error ? '—' : activeInstitutions.toLocaleString('ar'),
      description: 'المؤسسات اللي حالتها ACTIVE',
      icon: '✅',
    },
    {
      title: 'مجموع المستخدمين',
      value: 'غير متاح',
      description: 'إحصائيات المستخدمين لم يتم ربطها بعد',
      icon: '👥',
    },
    {
      title: 'الاشتراكات',
      value: 'غير متاح',
      description: 'إحصائيات الاشتراكات لم يتم ربطها بعد',
      icon: '💳',
    },
  ];

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        background: '#f4f7fb',
        color: '#172033',
        fontFamily: 'inherit',
      }}
    >
      <header style={{ background: '#111827', color: '#fff', padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 14, color: '#93c5fd' }}>
            EDUVORA · إدارة المنصة
          </div>
          <h1 style={{ margin: '12px 0 8px', fontSize: 30 }}>
            لوحة التحكم الرئيسية
          </h1>
          <p style={{ margin: 0, color: '#cbd5e1' }}>
            مرحباً بك في فضاء إدارة منصة Eduvora.
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {error && (
          <div
            role="alert"
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              border: '1px solid #fecaca',
            }}
          >
            <p style={{ margin: '0 0 12px' }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #b91c1c',
                background: '#fff',
                color: '#b91c1c',
                cursor: 'pointer',
              }}
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {successMessage && (
          <div
            role="status"
            style={{
              background: '#dcfce7',
              color: '#166534',
              padding: 14,
              borderRadius: 10,
              marginBottom: 20,
              border: '1px solid #bbf7d0',
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {createdLoginUrl && (
          <div
            style={{
              background: '#eff6ff',
              color: '#1e40af',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              border: '1px solid #bfdbfe',
            }}
          >
            <strong>رابط المؤسسة:</strong>
            <p style={{ overflowWrap: 'anywhere' }}>{createdLoginUrl}</p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(createdLoginUrl);
                setSuccessMessage('تم نسخ رابط المؤسسة.');
              }}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #93c5fd',
                background: '#fff',
                color: '#1e40af',
                cursor: 'pointer',
              }}
            >
              نسخ الرابط
            </button>
          </div>
        )}

        <section
          aria-label="إحصائيات المنصة"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {stats.map((stat) => (
            <article
              key={stat.title}
              style={{
                background: '#fff',
                padding: 22,
                borderRadius: 16,
                border: '1px solid #e5eaf2',
              }}
            >
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <h2 style={{ fontSize: 16, marginBottom: 8 }}>{stat.title}</h2>
              <div
                style={{
                  fontSize: stat.value === 'غير متاح' ? 18 : 30,
                  fontWeight: 700,
                }}
              >
                {stat.value}
              </div>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.7 }}>
                {stat.description}
              </p>
            </article>
          ))}
        </section>

        <section style={{ marginTop: 36 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
              marginBottom: 18,
            }}
          >
            <h2 style={{ margin: 0 }}>المؤسسات المسجلة</h2>
            <button
              type="button"
              onClick={() => {
                setShowForm((current) => !current);
                setFormError('');
                setSuccessMessage('');
                setCreatedLoginUrl('');
              }}
              style={{
                padding: '11px 18px',
                border: 'none',
                borderRadius: 10,
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {showForm ? 'إلغاء' : '+ إضافة مؤسسة'}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreateInstitution}
              style={{
                background: '#fff',
                padding: 24,
                borderRadius: 16,
                border: '1px solid #e5eaf2',
                marginBottom: 22,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 20 }}>
                معلومات المؤسسة الجديدة
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: 18,
                }}
              >
                <div>
                  <label htmlFor="institution-name" style={labelStyle}>
                    اسم المؤسسة *
                  </label>
                  <input
                    id="institution-name"
                    required
                    maxLength={200}
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="مثال: مدرسة النجاح"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label htmlFor="institution-code" style={labelStyle}>
                    رمز المؤسسة *
                  </label>
                  <input
                    id="institution-code"
                    required
                    maxLength={50}
                    value={form.code}
                    onChange={(e) => updateField('code', e.target.value)}
                    placeholder="مثال: EDU-SCHOOL-001"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label htmlFor="institution-type" style={labelStyle}>
                    نوع المؤسسة *
                  </label>
                  <select
                    id="institution-type"
                    required
                    value={form.institution_type}
                    onChange={(e) => updateField('institution_type', e.target.value)}
                    style={fieldStyle}
                  >
                    <option value="SCHOOL">مدرسة</option>
                    <option value="UNIVERSITY">جامعة</option>
                    <option value="TRAINING_CENTER">مركز تكوين</option>
                    <option value="OTHER">مؤسسة أخرى</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="institution-email" style={labelStyle}>
                    البريد الإلكتروني
                  </label>
                  <input
                    id="institution-email"
                    type="email"
                    maxLength={255}
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="school@example.com"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label htmlFor="institution-phone" style={labelStyle}>
                    الهاتف
                  </label>
                  <input
                    id="institution-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="رقم الهاتف"
                    style={fieldStyle}
                  />
                </div>

                <div>
                  <label htmlFor="institution-city" style={labelStyle}>
                    المدينة
                  </label>
                  <input
                    id="institution-city"
                    value={form.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="مثال: Casablanca"
                    style={fieldStyle}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="institution-address" style={labelStyle}>
                    العنوان
                  </label>
                  <input
                    id="institution-address"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="العنوان الكامل للمؤسسة"
                    style={fieldStyle}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label htmlFor="institution-logo" style={labelStyle}>
                    لوغو المؤسسة
                  </label>
                  <input
                    id="institution-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;

                      if (file && !['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {\n                        setFormError('الصيغ المقبولة هي PNG وJPG وWebP فقط.');\n                        e.target.value = '';\n                        setLogoFile(null);\n                        return;\n                      }\n\n                      if (file && file.size > 2 * 1024 * 1024) {
                        setFormError('حجم اللوغو خاصو ما يفوتش 2 MB.');
                        e.target.value = '';
                        setLogoFile(null);
                        return;
                      }

                      setFormError('');
                      setLogoFile(file);
                    }}
                    style={fieldStyle}
                  />
                  <p style={{ fontSize: 12, color: '#64748b' }}>
                    PNG أو JPG أو WebP، بحجم أقصى 2 MB.
                  </p>

                  {logoPreview && (
                    <div style={{ marginTop: 12 }}>
                      <img
                        src={logoPreview}
                        alt="معاينة لوغو المؤسسة"
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'contain',
                          border: '1px solid #e5eaf2',
                          borderRadius: 12,
                          padding: 8,
                          background: '#fff',
                        }}
                      />
                      <p style={{ fontSize: 12, color: '#b45309' }}>
                        غادي تترفع الصورة لـ Supabase ملي تحفظ المؤسسة.
                      </p>
                      <button
                        type="button"
                        onClick={() => setLogoFile(null)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: 8,
                          padding: '7px 12px',
                          background: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        حذف الصورة المختارة
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <p
                  role="alert"
                  style={{
                    color: '#b91c1c',
                    background: '#fef2f2',
                    padding: 12,
                    borderRadius: 8,
                    marginTop: 18,
                  }}
                >
                  {formError}
                </p>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  flexWrap: 'wrap',
                  marginTop: 22,
                }}
              >
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    padding: '11px 20px',
                    border: 'none',
                    borderRadius: 9,
                    background: isSaving ? '#93c5fd' : '#2563eb',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? 'جاري الحفظ...' : 'حفظ المؤسسة'}
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  style={{
                    padding: '11px 20px',
                    border: '1px solid #cbd5e1',
                    borderRadius: 9,
                    background: '#fff',
                    color: '#334155',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <p role="status" style={{ color: '#64748b' }}>
              جاري تحميل المؤسسات...
            </p>
          ) : !error && institutions.length === 0 ? (
            <p style={{ color: '#64748b' }}>
              ما كايناش مؤسسات مسجلة حالياً.
            </p>
          ) : !error ? (
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5eaf2',
                borderRadius: 16,
                overflowX: 'auto',
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'right',
                  minWidth: 760,
                }}
              >
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['اللوغو', 'اسم المؤسسة', 'الرمز', 'رابط المؤسسة', 'المدينة', 'الحالة'].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          padding: 14,
                          borderBottom: '1px solid #e5eaf2',
                          fontSize: 14,
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {institutions.map((institution) => {
                    const loginUrl = getInstitutionLoginUrl(institution);

                    return (
                      <tr key={institution.id}>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          {institution.logo_url ? (
                            <img
                              src={institution.logo_url}
                              alt={`لوغو ${institution.name}`}
                              style={{
                                width: 42,
                                height: 42,
                                objectFit: 'contain',
                                borderRadius: 8,
                              }}
                            />
                          ) : (
                            <span aria-label="لا يوجد لوغو">🏫</span>
                          )}
                        </td>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          {institution.name}
                        </td>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          {institution.code || '—'}
                        </td>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          {loginUrl ? (
                            <a
                              href={loginUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#2563eb', overflowWrap: 'anywhere' }}
                            >
                              {loginUrl}
                            </a>
                          ) : (
                            'لم يتم تعيين الرابط'
                          )}
                        </td>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          {institution.city || '—'}
                        </td>
                        <td style={{ padding: 14, borderBottom: '1px solid #eef2f7' }}>
                          <span
                            style={{
                              color: institution.status?.toUpperCase() === 'ACTIVE'
                                ? '#166534'
                                : '#92400e',
                              background: institution.status?.toUpperCase() === 'ACTIVE'
                                ? '#dcfce7'
                                : '#fef3c7',
                              padding: '5px 10px',
                              borderRadius: 20,
                              fontSize: 12,
                            }}
                          >
                            {institution.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        <h2 style={{ marginTop: 36, marginBottom: 18 }}>أقسام الإدارة</h2>
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {sections.map((section) => (
            <article
              key={section.title}
              style={{
                background: '#fff',
                padding: 24,
                borderRadius: 16,
                border: '1px solid #e5eaf2',
              }}
            >
              <div style={{ fontSize: 28 }}>{section.icon}</div>
              <h3>{section.title}</h3>
              <p style={{ color: '#64748b', lineHeight: 1.8 }}>
                {section.description}
              </p>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                سيتم تفعيل هذا القسم في المرحلة التالية
              </span>
            </article>
          ))}
        </section>

        <p style={{ marginTop: 32, color: '#64748b', fontSize: 13 }}>
          بيانات المؤسسات والإحصائيات المرتبطة بها تُحمّل من واجهة API الآمنة.
        </p>
      </main>
    </div>
  );
}

export default PlatformDashboardPage;
