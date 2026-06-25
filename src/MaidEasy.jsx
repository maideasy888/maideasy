import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// ---------- Fonts ----------
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');
  `}</style>
);

// ---------- Design tokens ----------
const C = {
  soil: '#2B2118',
  sand: '#F7F0E3',
  garden: '#3D6B4F',
  rust: '#C25E3A',
  card: '#E8DCC4',
  whatsapp: '#3D8B5C',
};

// ---------- Categories ----------
const CATEGORIES = {
  cleaning: { label: 'Cleaning', icon: '🧹', color: '#3D6B4F' },
  garden: { label: 'Garden', icon: '🌿', color: '#3D6B4F' },
  plumbing_electrical: { label: 'Plumbing & Electrical', icon: '🔧', color: '#C25E3A' },
  moving: { label: 'Moving & Transport', icon: '🚚', color: '#6B5B3D' },
};

// ---------- Seed data ----------
const SEED_PROVIDERS = [
  {
    id: 'p1', name: 'Nokuthula Mkhize', service: 'cleaning',
    area: 'Soweto, Johannesburg', rate: 180, rateUnit: 'per visit',
    idVerified: true, jobsCompleted: 134, responseMinutes: 12,
    bio: 'Deep cleans, move-outs, weekly maintenance. Bring my own supplies if needed.',
    whatsapp: '27821234001', photoSeed: 'nokuthula',
    loadShedding: 'Works through load-shedding — brings own kettle/equipment.',
    joined: '2023-02-01',
  },
  {
    id: 'p2', name: 'Sipho Dlamini', service: 'garden',
    area: 'Alexandra, Johannesburg', rate: 250, rateUnit: 'per visit',
    idVerified: true, jobsCompleted: 89, responseMinutes: 25,
    bio: 'Lawn mowing, hedge trimming, garden cleanups. Own tools and trailer for green waste.',
    whatsapp: '27821234002', photoSeed: 'sipho',
    loadShedding: null,
    joined: '2023-06-15',
  },
  {
    id: 'p3', name: 'Maria Santos', service: 'cleaning',
    area: 'Sandton, Johannesburg', rate: 220, rateUnit: 'per visit',
    idVerified: true, jobsCompleted: 201, responseMinutes: 8,
    bio: 'Specialise in office and apartment cleans. Available weekday mornings.',
    whatsapp: '27821234003', photoSeed: 'maria',
    loadShedding: 'Has backup battery — keeps to schedule during outages.',
    joined: '2022-11-20',
  },
  {
    id: 'p4', name: 'Thabo Nkosi', service: 'garden',
    area: 'Tembisa, Ekurhuleni', rate: 200, rateUnit: 'per visit',
    idVerified: false, jobsCompleted: 14, responseMinutes: 40,
    bio: 'New to the platform but 6 years experience doing gardens in the area. Refs available.',
    whatsapp: '27821234004', photoSeed: 'thabo',
    loadShedding: null,
    joined: '2024-09-10',
  },
  {
    id: 'p5', name: 'Precious Khumalo', service: 'cleaning',
    area: 'Diepsloot, Johannesburg', rate: 160, rateUnit: 'per visit',
    idVerified: true, jobsCompleted: 67, responseMinutes: 18,
    bio: 'Reliable weekly cleaner, also do ironing on request.',
    whatsapp: '27821234005', photoSeed: 'precious',
    loadShedding: 'Flexible with timing around your load-shedding stage.',
    joined: '2023-09-05',
  },
  {
    id: 'p6', name: 'Johan van der Berg', service: 'garden',
    area: 'Centurion, Pretoria', rate: 300, rateUnit: 'per visit',
    idVerified: true, jobsCompleted: 156, responseMinutes: 15,
    bio: 'Full garden services incl. irrigation repairs and tree trimming. Insured.',
    whatsapp: '27821234006', photoSeed: 'johan',
    loadShedding: null,
    joined: '2022-04-12',
  },
  {
    id: 'p7', name: 'Lerato Mahlangu', service: 'plumbing_electrical',
    area: 'Boksburg, Ekurhuleni', rate: 350, rateUnit: 'callout fee',
    idVerified: true, jobsCompleted: 112, responseMinutes: 20,
    bio: 'Qualified electrician, 9 years experience. Geyser, DB board, and general wiring faults.',
    whatsapp: '27821234007', photoSeed: 'lerato',
    loadShedding: 'Often called out for inverter/battery backup installs.',
    joined: '2022-08-10',
    calloutFee: 350, qualified: true, tradeType: 'Electrician',
  },
  {
    id: 'p8', name: 'David Pretorius', service: 'plumbing_electrical',
    area: 'Midrand, Johannesburg', rate: 300, rateUnit: 'callout fee',
    idVerified: true, jobsCompleted: 78, responseMinutes: 30,
    bio: 'Licensed plumber. Burst pipes, blocked drains, geyser replacement.',
    whatsapp: '27821234008', photoSeed: 'david',
    loadShedding: null,
    joined: '2023-03-22',
    calloutFee: 300, qualified: true, tradeType: 'Plumber',
  },
  {
    id: 'p9', name: 'Kabelo Sithole', service: 'moving',
    area: 'Soweto, Johannesburg', rate: 800, rateUnit: 'per load',
    idVerified: true, jobsCompleted: 45, responseMinutes: 35,
    bio: 'Furniture removals, office moves, single items. Two-man team available.',
    whatsapp: '27821234009', photoSeed: 'kabelo',
    loadShedding: null,
    joined: '2023-11-01',
    vehicleType: '1.5 ton truck', crewSize: 2,
  },
  {
    id: 'p10', name: 'Andries Botha', service: 'moving',
    area: 'Pretoria East, Pretoria', rate: 1200, rateUnit: 'per load',
    idVerified: false, jobsCompleted: 9, responseMinutes: 50,
    bio: 'Full house moves, long distance. Bakkie and 4-ton truck depending on load.',
    whatsapp: '27821234010', photoSeed: 'andries',
    loadShedding: null,
    joined: '2024-12-05',
    vehicleType: '4 ton truck', crewSize: 3,
  },
];

const AREAS = ['All areas', 'Johannesburg', 'Pretoria', 'Ekurhuleni'];
// ---------- Helpers ----------
function initials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

function trustLevel(p) {
  if (p.idVerified && p.jobsCompleted >= 50) return 'high';
  if (p.idVerified) return 'medium';
  return 'new';
}

function timeAgo(dateStr) {
  const months = Math.max(1, Math.floor((Date.now() - new Date(dateStr)) / (1000 * 60 * 60 * 24 * 30)));
  if (months < 12) return `${months} mo on MaidEasy`;
  return `${Math.floor(months / 12)} yr on MaidEasy`;
}

function avatarColor(seed) {
  const colors = [C.garden, C.rust, '#8B5A3C', '#4A7A6B', '#A8693F'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ---------- Trust Strip (signature element) ----------
function TrustStrip({ provider }) {
  const level = trustLevel(provider);
  const levelLabel = { high: 'Highly trusted', medium: 'Verified', new: 'New — not yet verified' }[level];
  const levelColor = { high: C.garden, medium: '#8A7B4F', new: '#999' }[level];

  return (
    <div style={{ borderTop: `1px solid ${C.soil}22`, marginTop: 12, paddingTop: 10 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
        fontSize: 12, fontWeight: 600, color: levelColor, fontFamily: 'Work Sans, sans-serif',
        letterSpacing: 0.3,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: levelColor, display: 'inline-block', flexShrink: 0,
        }} />
        {levelLabel}
      </div>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <TrustItem
          ok={provider.idVerified}
          label={provider.idVerified ? 'ID checked' : 'ID pending'}
        />
        <TrustItem
          ok={provider.jobsCompleted > 0}
          label={`${provider.jobsCompleted} job${provider.jobsCompleted === 1 ? '' : 's'} done`}
        />
        <TrustItem
          ok={provider.responseMinutes <= 30}
          label={`replies in ~${provider.responseMinutes}m`}
        />
      </div>
    </div>
  );
}

function TrustItem({ ok, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      fontSize: 12.5, fontFamily: 'Work Sans, sans-serif',
      color: ok ? C.soil : '#A89B82',
    }}>
      <svg width="13" height="13" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
        {ok ? (
          <>
            <circle cx="10" cy="10" r="9" fill={C.garden} opacity="0.15" />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke={C.garden} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </>
        ) : (
          <circle cx="10" cy="10" r="9" stroke="#A89B82" strokeWidth="1.4" fill="none" strokeDasharray="2 2" />
        )}
      </svg>
      <span style={{ opacity: ok ? 1 : 0.75 }}>{label}</span>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      fontFamily: 'Work Sans, sans-serif', fontSize: 11.5, fontWeight: 600,
      color: color || C.soil, background: `${color || C.soil}14`,
      padding: '4px 10px', borderRadius: 20,
    }}>
      {label}
    </span>
  );
}

// ---------- Provider Card ----------
function ProviderCard({ provider, onOpenBooking }) {
  return (
    <div style={{
      background: C.card, borderRadius: 14, padding: 18,
      border: `1px solid ${C.soil}14`,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
          background: avatarColor(provider.photoSeed),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.sand, fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 17,
        }}>
          {initials(provider.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 17.5,
            color: C.soil, lineHeight: 1.2,
          }}>
            {provider.name}
          </div>
          <div style={{
            fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}99`,
            marginTop: 2,
          }}>
            {provider.area}
          </div>
          <div style={{
            fontFamily: 'Work Sans, sans-serif', fontSize: 11.5, color: `${C.soil}77`,
            marginTop: 1,
          }}>
            {timeAgo(provider.joined)}
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 19, color: C.rust }}>
            R{provider.rate}
          </div>
          <div style={{ fontFamily: 'Work Sans, sans-serif', fontSize: 11, color: `${C.soil}77` }}>
            {provider.rateUnit}
          </div>
        </div>
      </div>

      <p style={{
        fontFamily: 'Work Sans, sans-serif', fontSize: 13.5, color: `${C.soil}cc`,
        lineHeight: 1.5, marginTop: 12, marginBottom: 0,
      }}>
        {provider.bio}
      </p>

      {provider.service === 'plumbing_electrical' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {provider.tradeType && (
            <Tag label={provider.tradeType} />
          )}
          {provider.qualified && (
            <Tag label="Qualified / licensed" color={C.garden} />
          )}
        </div>
      )}

      {provider.service === 'moving' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {provider.vehicleType && <Tag label={provider.vehicleType} />}
          {provider.crewSize && <Tag label={`${provider.crewSize}-person crew`} />}
        </div>
      )}

      {provider.loadShedding && (
        <div style={{
          fontFamily: 'Work Sans, sans-serif', fontSize: 12, color: C.garden,
          marginTop: 8, display: 'flex', gap: 5, alignItems: 'flex-start',
        }}>
          <span style={{ flexShrink: 0 }}>⚡</span>
          <span>{provider.loadShedding}</span>
        </div>
      )}

      <TrustStrip provider={provider} />

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          onClick={() => onOpenBooking(provider)}
          style={{
            flex: 1, background: C.rust, color: '#fff', border: 'none',
            borderRadius: 9, padding: '11px 12px', fontFamily: 'Work Sans, sans-serif',
            fontWeight: 700, fontSize: 13.5, cursor: 'pointer',
          }}
        >
          Book through MaidEasy
        </button>
      </div>
      <div style={{
        fontFamily: 'Work Sans, sans-serif', fontSize: 11, color: `${C.soil}66`,
        marginTop: 7, textAlign: 'center',
      }}>
        Contact details are shared once your booking is confirmed
      </div>
    </div>
  );
}// ---------- Booking Modal ----------
function BookingModal({ provider, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', phone: '', date: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date) return;
    setSubmitting(true);
    await onSubmit({ ...form, providerId: provider.id, providerName: provider.name, service: provider.service });
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(43,33,24,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 100,
    }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.sand, borderRadius: 16, padding: 26,
          maxWidth: 420, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        }}
      >
        <div style={{
          fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 21, color: C.soil,
        }}>
          Book {provider.name.split(' ')[0]} through MaidEasy
        </div>
        <div style={{
          fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}99`, marginTop: 4, marginBottom: 18,
        }}>
          We'll send this to {provider.name.split(' ')[0]} to accept. Once accepted, MaidEasy will contact you to confirm and coordinate the visit — your number isn't shared with the provider directly.
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Your name">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              style={inputStyle} placeholder="e.g. Lindiwe Mokoena" />
          </Field>
          <Field label="Your phone (WhatsApp)">
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
              style={inputStyle} placeholder="082 123 4567" />
          </Field>
          <Field label="Preferred date">
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required
              style={inputStyle} />
          </Field>
          <Field label="Notes (optional)">
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
              placeholder="e.g. 3-bedroom house, need carpets done too" />
          </Field>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, background: 'transparent', border: `1.5px solid ${C.soil}33`,
              borderRadius: 9, padding: '11px', fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600, fontSize: 14, color: C.soil, cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{
              flex: 1.4, background: C.rust, border: 'none', borderRadius: 9,
              padding: '11px', fontFamily: 'Work Sans, sans-serif', fontWeight: 700,
              fontSize: 14, color: '#fff', cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Sending…' : 'Send to provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{
        display: 'block', fontFamily: 'Work Sans, sans-serif', fontSize: 12.5,
        fontWeight: 600, color: `${C.soil}aa`, marginBottom: 5,
      }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 8,
  border: `1.5px solid ${C.soil}22`, background: '#fff',
  fontFamily: 'Work Sans, sans-serif', fontSize: 14, color: C.soil,
  boxSizing: 'border-box', outline: 'none',
};

// ---------- Provider Signup ----------
function SignupModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '', service: 'cleaning', area: '', rate: '', phone: '', bio: '',
    tradeType: '', qualified: false, vehicleType: '', crewSize: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.area || !form.rate || !form.phone) return;
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(43,33,24,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 100,
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: C.sand, borderRadius: 16, padding: 26,
        maxWidth: 440, width: '100%', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 21, color: C.soil }}>
          List your services
        </div>
        <div style={{ fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}99`, marginTop: 4, marginBottom: 18 }}>
          New listings start unverified. Verify your ID later to unlock the trust badge and rank higher.
        </div>

        <form onSubmit={handleSubmit}>
          <Field label="Full name">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
              style={inputStyle} placeholder="e.g. Bongani Zulu" />
          </Field>
          <Field label="Service type">
            <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} style={inputStyle}>
              <option value="cleaning">Cleaning</option>
              <option value="garden">Garden</option>
              <option value="plumbing_electrical">Plumbing & Electrical</option>
              <option value="moving">Moving & Transport</option>
            </select>
          </Field>

          {form.service === 'plumbing_electrical' && (
            <>
              <Field label="Trade">
                <select value={form.tradeType} onChange={e => setForm({ ...form, tradeType: e.target.value })} style={inputStyle}>
                  <option value="">Select trade</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Electrician & Plumber">Both</option>
                </select>
              </Field>
              <Field label="Qualification status">
                <label style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontFamily: 'Work Sans, sans-serif', fontSize: 13.5, color: C.soil,
                }}>
                  <input type="checkbox" checked={form.qualified}
                    onChange={e => setForm({ ...form, qualified: e.target.checked })} />
                  I am a qualified / licensed tradesperson
                </label>
              </Field>
            </>
          )}

          {form.service === 'moving' && (
            <>
              <Field label="Vehicle type">
                <input value={form.vehicleType} onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                  style={inputStyle} placeholder="e.g. 1.5 ton truck, bakkie" />
              </Field>
              <Field label="Crew size">
                <input type="number" value={form.crewSize} onChange={e => setForm({ ...form, crewSize: e.target.value })}
                  style={inputStyle} placeholder="2" />
              </Field>
            </>
          )}

          <Field label="Area you work in">
            <input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} required
              style={inputStyle} placeholder="e.g. Soweto, Johannesburg" />
          </Field>
          <Field label={form.service === 'plumbing_electrical' ? 'Callout fee (ZAR)' : form.service === 'moving' ? 'Rate per load (ZAR)' : 'Rate (ZAR per visit)'}>
            <input type="number" value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} required
              style={inputStyle} placeholder="180" />
          </Field>
          <Field label="WhatsApp number">
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required
              style={inputStyle} placeholder="082 123 4567" />
          </Field>
          <Field label="Short bio">
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
              style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
              placeholder="What do you offer? Any equipment, experience, availability." />
          </Field>
          <div style={{
            fontFamily: 'Work Sans, sans-serif', fontSize: 12, color: `${C.soil}88`,
            marginTop: -4, marginBottom: 14, lineHeight: 1.4,
          }}>
            By listing, you agree that customer bookings are placed and coordinated through MaidEasy, which takes a placement fee on completed jobs. You'll see job details (area, date, type) before accepting; customer contact is shared after you accept.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, background: 'transparent', border: `1.5px solid ${C.soil}33`,
              borderRadius: 9, padding: '11px', fontFamily: 'Work Sans, sans-serif',
              fontWeight: 600, fontSize: 14, color: C.soil, cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} style={{
              flex: 1.4, background: C.garden, border: 'none', borderRadius: 9,
              padding: '11px', fontFamily: 'Work Sans, sans-serif', fontWeight: 700,
              fontSize: 14, color: '#fff', cursor: submitting ? 'default' : 'pointer',
              opacity: submitting ? 0.7 : 1,
            }}>
              {submitting ? 'Creating…' : 'Create listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}// ---------- Provider Inbox ----------
function ProviderInbox({ providers, onRespond }) {
  const [selectedProviderId, setSelectedProviderId] = useState(providers[0]?.id || '');
  const [myBookings, setMyBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    if (!selectedProviderId) return;
    setLoadingBookings(true);
    (async () => {
      try {
        const { data, error } = await supabase.rpc('get_provider_bookings', {
          p_provider_id: selectedProviderId,
        });
        if (!error && data) setMyBookings(data);
      } catch (e) {
        console.error('Failed to load provider bookings', e);
      } finally {
        setLoadingBookings(false);
      }
    })();
  }, [selectedProviderId]);

  const handleRespond = async (bookingId, status) => {
    setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    await onRespond(bookingId, status);
  };

  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '20px 20px 60px' }}>
      <div style={{
        fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 22, color: C.soil, marginBottom: 4,
      }}>
        Provider inbox
      </div>
      <div style={{
        fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}99`, marginBottom: 18,
      }}>
        Job requests sent to you by MaidEasy. Customer contact details are released after you accept.
      </div>

      <Field label="Viewing as">
        <select value={selectedProviderId} onChange={e => setSelectedProviderId(e.target.value)} style={inputStyle}>
          {providers.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </Field>

      {loadingBookings ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: `${C.soil}99`, fontFamily: 'Work Sans, sans-serif', fontSize: 14 }}>
          Loading…
        </div>
      ) : myBookings.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 20px', color: `${C.soil}99`,
          fontFamily: 'Work Sans, sans-serif', fontSize: 14, marginTop: 10,
        }}>
          No job requests yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {myBookings.map(b => (
            <div key={b.id} style={{
              background: C.card, borderRadius: 12, padding: 16,
              border: `1px solid ${C.soil}14`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{
                    fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: 16, color: C.soil,
                  }}>
                    {b.service === 'cleaning' ? 'Cleaning job' : b.service === 'garden' ? 'Garden job' : b.service === 'plumbing_electrical' ? 'Plumbing/Electrical job' : 'Moving job'}
                  </div>
                  <div style={{
                    fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}99`, marginTop: 2,
                  }}>
                    Preferred date: {b.date || 'flexible'}
                  </div>
                  {b.notes && (
                    <div style={{
                      fontFamily: 'Work Sans, sans-serif', fontSize: 12.5, color: `${C.soil}88`, marginTop: 4,
                    }}>
                      "{b.notes}"
                    </div>
                  )}
                </div>
                <StatusBadge status={b.status} />
              </div>

              {b.status === 'pending' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button onClick={() => handleRespond(b.id, 'declined')} style={{
                    flex: 1, background: 'transparent', border: `1.5px solid ${C.soil}33`,
                    borderRadius: 8, padding: '9px', fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 600, fontSize: 13, color: C.soil, cursor: 'pointer',
                  }}>
                    Decline
                  </button>
                  <button onClick={() => handleRespond(b.id, 'accepted')} style={{
                    flex: 1, background: C.garden, border: 'none',
                    borderRadius: 8, padding: '9px', fontFamily: 'Work Sans, sans-serif',
                    fontWeight: 700, fontSize: 13, color: '#fff', cursor: 'pointer',
                  }}>
                    Accept
                  </button>
                </div>
              )}

              {b.status === 'accepted' && (
                <div style={{
                  marginTop: 10, fontFamily: 'Work Sans, sans-serif', fontSize: 12.5,
                  color: C.garden,
                }}>
                  Accepted. MaidEasy will contact you with the customer's details to coordinate.
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Awaiting response', color: '#8A7B4F', bg: '#8A7B4F1a' },
    accepted: { label: 'Accepted', color: C.garden, bg: `${C.garden}1a` },
    declined: { label: 'Declined', color: '#A8693F', bg: '#A8693F1a' },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      fontFamily: 'Work Sans, sans-serif', fontSize: 11.5, fontWeight: 700,
      color: s.color, background: s.bg, padding: '4px 9px', borderRadius: 20,
      flexShrink: 0, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

// ---------- Toast ----------
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)',
      background: C.soil, color: C.sand, padding: '13px 22px', borderRadius: 10,
      fontFamily: 'Work Sans, sans-serif', fontSize: 14, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 200, maxWidth: '90vw',
      textAlign: 'center',
    }}>
      {message}
    </div>
  );
}// ---------- Main App ----------
export default function MaidEasy() {
  const [providers, setProviders] = useState(SEED_PROVIDERS);
  const [loaded, setLoaded] = useState(false);
  const [view, setView] = useState('customer'); // 'customer' | 'provider'
  const [filter, setFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('All areas');
  const [search, setSearch] = useState('');
  const [bookingProvider, setBookingProvider] = useState(null);
  const [signupOpen, setSignupOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: customProviders, error: provErr } = await supabase
          .from('providers')
          .select('*');
        if (!provErr && customProviders) {
          setProviders([...SEED_PROVIDERS, ...customProviders]);
        }
      } catch (e) {
        console.error('Failed to load providers', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const saveBooking = async (bookingData) => {
    const booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    try {
      const { error } = await supabase.rpc('submit_booking', {
        p_id: booking.id,
        p_provider_id: booking.providerId,
        p_provider_name: booking.providerName,
        p_service: booking.service,
        p_name: booking.name,
        p_phone: booking.phone,
        p_date: booking.date,
        p_notes: booking.notes,
      });
      if (error) console.error('Failed to save booking', error);
    } catch (e) {
      console.error('Failed to save booking', e);
    }
    setBookingProvider(null);
    setToast(`Sent to ${bookingData.providerName.split(' ')[0]}. We'll confirm with you once they accept.`);
  };

  const handleRespond = async (bookingId, status) => {
    try {
      const { error } = await supabase.rpc('respond_to_booking', { p_booking_id: bookingId, p_status: status });
      if (error) console.error('Failed to update booking', error);
    } catch (e) {
      console.error('Failed to update booking', e);
    }
  };

  const handleSignup = async (form) => {
    const newProvider = {
      id: `custom-${Date.now()}`,
      name: form.name,
      service: form.service,
      area: form.area,
      rate: Number(form.rate),
      rateUnit: form.service === 'plumbing_electrical' ? 'callout fee' : form.service === 'moving' ? 'per load' : 'per visit',
      idVerified: false,
      jobsCompleted: 0,
      responseMinutes: 60,
      bio: form.bio || 'New provider on MaidEasy.',
      whatsapp: form.phone.replace(/\D/g, ''),
      photoSeed: form.name,
      loadShedding: null,
      joined: new Date().toISOString(),
      tradeType: form.tradeType || null,
      qualified: form.qualified || false,
      vehicleType: form.vehicleType || null,
      crewSize: form.crewSize ? Number(form.crewSize) : null,
    };
    setProviders(prev => [...prev, newProvider]);
    try {
      const { error } = await supabase.from('providers').insert([newProvider]);
      if (error) console.error('Failed to save provider', error);
    } catch (e) {
      console.error('Failed to save provider', e);
    }
    setSignupOpen(false);
    setToast(`Listing created! You'll show up as unverified until ID check.`);
  };

  const filtered = providers.filter(p => {
    if (filter !== 'all' && p.service !== filter) return false;
    if (areaFilter !== 'All areas' && !p.area.includes(areaFilter)) return false;
    if (search && !`${p.name} ${p.area} ${p.bio}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: C.sand, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Work Sans, sans-serif', color: C.soil }}>Loading…</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.sand }}>
      <FontLoader />

      <header style={{
        background: C.soil, padding: '28px 20px 32px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%', background: `${C.garden}33`, filter: 'blur(2px)',
        }} />
        <div style={{ position: 'relative', maxWidth: 880, margin: '0 auto' }}>
          <div style={{
            fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 30,
            color: C.sand, letterSpacing: -0.5,
          }}>
            MaidEasy
          </div>
          <div style={{
            fontFamily: 'Work Sans, sans-serif', fontSize: 14.5, color: `${C.sand}cc`,
            marginTop: 6, maxWidth: 460, lineHeight: 1.4,
          }}>
            Vetted cleaners and gardeners near you. Booked and coordinated through MaidEasy.
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
            <button onClick={() => setSignupOpen(true)} style={{
              background: 'transparent', border: `1.5px solid ${C.sand}55`,
              color: C.sand, borderRadius: 9, padding: '9px 16px',
              fontFamily: 'Work Sans, sans-serif', fontWeight: 600, fontSize: 13.5,
              cursor: 'pointer',
            }}>
              List your services →
            </button>
            <button onClick={() => setView(view === 'customer' ? 'provider' : 'customer')} style={{
              background: view === 'provider' ? C.sand : 'transparent',
              border: `1.5px solid ${C.sand}55`,
              color: view === 'provider' ? C.soil : C.sand,
              borderRadius: 9, padding: '9px 16px',
              fontFamily: 'Work Sans, sans-serif', fontWeight: 600, fontSize: 13.5,
              cursor: 'pointer',
            }}>
              {view === 'customer' ? 'Provider inbox' : '← Back to browsing'}
            </button>
          </div>
        </div>
      </header>

      {view === 'customer' ? (
        <>
          <div style={{
            maxWidth: 880, margin: '0 auto', padding: '20px 20px 0',
          }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, area, or job type…"
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: `1.5px solid ${C.soil}22`, background: '#fff',
                fontFamily: 'Work Sans, sans-serif', fontSize: 14.5, color: C.soil,
                boxSizing: 'border-box', outline: 'none', marginBottom: 14,
              }}
            />

            <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              {[
                { key: 'all', label: 'All services' },
                { key: 'cleaning', label: 'Cleaning' },
                { key: 'garden', label: 'Garden' },
                { key: 'plumbing_electrical', label: 'Plumbing & Electrical' },
                { key: 'moving', label: 'Moving & Transport' },
              ].map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding: '7px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                  fontFamily: 'Work Sans, sans-serif', fontWeight: 600, fontSize: 13,
                  background: filter === f.key ? C.garden : C.card,
                  color: filter === f.key ? '#fff' : C.soil,
                }}>
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
              {AREAS.map(a => (
                <button key={a} onClick={() => setAreaFilter(a)} style={{
                  padding: '6px 13px', borderRadius: 20, cursor: 'pointer',
                  fontFamily: 'Work Sans, sans-serif', fontWeight: 500, fontSize: 12.5,
                  background: 'transparent',
                  border: `1.3px solid ${areaFilter === a ? C.rust : C.soil + '33'}`,
                  color: areaFilter === a ? C.rust : `${C.soil}99`,
                }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <main style={{ maxWidth: 880, margin: '0 auto', padding: '0 20px 60px' }}>
            <div style={{
              fontFamily: 'Work Sans, sans-serif', fontSize: 13, color: `${C.soil}88`,
              marginBottom: 12,
            }}>
              {filtered.length} provider{filtered.length === 1 ? '' : 's'} found
            </div>

            {filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '50px 20px', color: `${C.soil}99`,
                fontFamily: 'Work Sans, sans-serif', fontSize: 14,
              }}>
                No providers match your filters yet. Try a different area or service.
              </div>
            ) : (
              <div style={{
                display: 'grid', gap: 14,
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              }}>
                {filtered.map(p => (
                  <ProviderCard key={p.id} provider={p} onOpenBooking={setBookingProvider} />
                ))}
              </div>
            )}
          </main>
        </>
      ) : (
        <ProviderInbox providers={providers} onRespond={handleRespond} />
      )}

      {bookingProvider && (
        <BookingModal
          provider={bookingProvider}
          onClose={() => setBookingProvider(null)}
          onSubmit={saveBooking}
        />
      )}

      {signupOpen && (
        <SignupModal onClose={() => setSignupOpen(false)} onSubmit={handleSignup} />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
                }
