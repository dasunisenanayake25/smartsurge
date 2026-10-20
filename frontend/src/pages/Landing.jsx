import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Lightbulb, BarChart2, Calendar, Target, Leaf, ChevronDown, ChevronUp } from 'lucide-react';

const NAV_GREEN = '#236144';
const LIGHT_GREEN = '#9CD49E';
const DARK_FOOTER = '#1B2B23';

const features = [
  { icon: <Bell size={28} color={NAV_GREEN} />, title: 'Smart Alerts', desc: 'Receive instant alerts when your usage goes above your normal level.' },
  { icon: <Lightbulb size={28} color={NAV_GREEN} />, title: 'AI Saving Tips', desc: 'Our AI watches your usage patterns to help you find easy ways to save.' },
  { icon: <BarChart2 size={28} color={NAV_GREEN} />, title: 'Usage Analytics', desc: 'View detailed analytics on your electricity usage and spot trends easily.' },
  { icon: <Calendar size={28} color={NAV_GREEN} />, title: 'Smart Scheduling', desc: 'Schedule appliances to run at off-peak hours to save money automatically.' },
  { icon: <Target size={28} color={NAV_GREEN} />, title: 'Budget Goals', desc: 'Set a monthly electricity budget and track your progress toward it.' },
  { icon: <Leaf size={28} color={NAV_GREEN} />, title: 'Carbon Footprint', desc: 'See your CO2 impact and strive to cut it by 15% off the national average.' },
];

const faqs = [
  { q: 'What devices does SmartSurge work with?', a: 'SmartSurge works with most smart plugs, smart meters, and home automation systems.' },
  { q: 'Is my data private?', a: 'Yes. Your data is encrypted and stored securely. Only you know where it is stored and who can see it.' },
  { q: 'Is SmartSurge free?', a: 'We offer a free tier with basic features. Check our pricing for full details.' },
  { q: 'How accurate is the bill estimate?', a: 'We use your tariff and consumption data to give a customised cost estimate.' },
];

const steps = [
  { num: '1', title: 'Connect', desc: 'Link your smart home devices to SmartSurge in minutes.' },
  { num: '2', title: 'Monitor', desc: 'See your live power and estimated bill update in real-time.' },
  { num: '3', title: 'Control & Save', desc: 'Switch on schedules and goals and follow tips to use less.' },
];

const statCards = [
  { label: 'Live Power', value: '1.84 kW', sub: 'Right now' },
  { label: 'Estimated Bill', value: 'Rs. 8,420', sub: 'Know your bill before it lands.' },
  { label: 'Active Devices', value: 'AC, Fridge, Router, Lights', sub: 'Active now' },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a1a', background: '#fff', margin: 0, padding: 0 }}>

      {/* Navbar */}
      <nav style={{ background: NAV_GREEN, padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/logo_transparent.png" alt="SmartSurge Logo" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>SmartSurge</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {['Home', 'Features', 'About us', 'Contact'].map(link => (
              <a key={link} href="#" style={{ color: '#d4f5e2', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>{link}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/register" style={{ padding: '9px 22px', background: '#fff', color: NAV_GREEN, borderRadius: 7, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Register</Link>
            <Link to="/login" style={{ padding: '9px 22px', background: 'transparent', color: '#fff', border: '1.5px solid #fff', borderRadius: 7, fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero — background image only */}
      <section style={{ position: 'relative', minHeight: 520, overflow: 'hidden' }}>
        <img
          src="/bg-smarthome.jpg"
          alt="Smart Home"
          style={{ width: '100%', height: '520px', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
      </section>

      {/* Hero subtitle + CTA buttons */}
      <section style={{ background: '#f0f8f1', padding: '48px 2rem', textAlign: 'center' }}>
        <p style={{ fontSize: 18, color: '#3a5245', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Monitor live power, predict your bill and control appliances from one calm, simple dashboard.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{ padding: '14px 32px', background: NAV_GREEN, color: '#fff', borderRadius: 50, fontWeight: 700, textDecoration: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            Get Started <span style={{ fontSize: 18 }}>⚡</span>
          </Link>
          <a
            href="#how"
            style={{ padding: '14px 32px', background: 'transparent', color: NAV_GREEN, border: `2px solid ${NAV_GREEN}`, borderRadius: 50, fontWeight: 600, textDecoration: 'none', fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            See how it works <span style={{ fontSize: 14 }}>&#9658;</span>
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#f5fbf6', padding: '70px 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8, color: '#111' }}>Everything you need to save energy</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 44, fontSize: 15 }}>Simple tools that make your home use less and cost less.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ background: '#fff', borderRadius: 14, padding: '24px 20px', boxShadow: '0 2px 16px rgba(35,97,68,0.07)', border: `1px solid ${LIGHT_GREEN}` }}>
                <div style={{ marginBottom: 14 }}>{f.icon}</div>
                <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: '#111' }}>{f.title}</h4>
                <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: '#fff', padding: '70px 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8, color: '#111' }}>How it works</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 52, fontSize: 15 }}>Three simple steps from set-up to savings.</p>
          <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
            {steps.map(s => (
              <div key={s.num} style={{ flex: 1, minWidth: 220, maxWidth: 320, textAlign: 'center', padding: '36px 28px', borderRadius: 18, background: '#f7fdf9', border: `1.5px solid ${LIGHT_GREEN}` }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: NAV_GREEN, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, margin: '0 auto 18px' }}>{s.num}</div>
                <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10, color: '#111' }}>{s.title}</h4>
                <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section style={{ background: `linear-gradient(135deg, ${NAV_GREEN} 0%, #3a9e5f 100%)`, padding: '70px 2rem', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8 }}>Your home, at a glance</h2>
          <p style={{ textAlign: 'center', color: '#c8f0d4', marginBottom: 40, fontSize: 15 }}>A clean dashboard with the info you need most.</p>
          <div style={{ background: 'rgba(255,255,255,0.13)', borderRadius: 20, padding: 28, border: '1px solid rgba(255,255,255,0.22)' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {['Dashboard', 'Live Power', 'Appliances', 'Billing'].map((t, i) => (
                <span key={t} style={{ padding: '7px 18px', borderRadius: 20, background: i === 0 ? '#fff' : 'rgba(255,255,255,0.15)', color: i === 0 ? NAV_GREEN : '#e0f5e9', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {statCards.map(c => (
                <div key={c.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: '20px 22px' }}>
                  <p style={{ fontSize: 12, color: '#b8eacc', margin: '0 0 6px' }}>{c.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>{c.value}</p>
                  <p style={{ fontSize: 12, color: '#d4f5e2', margin: 0 }}>{c.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#fff', padding: '70px 2rem' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: 30, fontWeight: 800, marginBottom: 8, color: '#111' }}>Frequently Asked Questions</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: 40, fontSize: 15 }}>Quick answers to common questions.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: `1.5px solid ${openFaq === i ? NAV_GREEN : LIGHT_GREEN}`, borderRadius: 12, overflow: 'hidden' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', background: openFaq === i ? '#f0faf4' : '#f9fefc', border: 'none', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 600, fontSize: 15, textAlign: 'left', color: '#111' }}
                >
                  {f.q}
                  {openFaq === i ? <ChevronUp size={18} color={NAV_GREEN} /> : <ChevronDown size={18} color={NAV_GREEN} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '16px 22px', background: '#fff', fontSize: 14, color: '#555', borderTop: `1px solid ${LIGHT_GREEN}`, lineHeight: 1.7 }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: NAV_GREEN, padding: '70px 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 14 }}>Start managing your energy today</h2>
        <p style={{ color: '#c8f0d4', fontSize: 16, maxWidth: 480, margin: '0 auto 32px' }}>Create your free account and see your home power in minutes.</p>
        <Link to="/register" style={{ display: 'inline-block', padding: '15px 36px', background: LIGHT_GREEN, color: NAV_GREEN, borderRadius: 9, fontWeight: 800, textDecoration: 'none', fontSize: 16 }}>
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ background: DARK_FOOTER, color: '#aaa', padding: '48px 2rem 28px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <img src="/logo_transparent.png" alt="Logo" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'contain' }} />
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>SmartSurge</span>
            </div>
            <p style={{ fontSize: 13, maxWidth: 240, lineHeight: 1.7, margin: 0 }}>Monitor and control your home energy usage smartly.</p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {[['Home', 'Features', 'About us'], ['FAQ', 'Contact', 'Privacy']].map((col, i) => (
              <ul key={i} style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.map(l => (
                  <li key={l}><a href="#" style={{ color: '#aaa', textDecoration: 'none', fontSize: 13 }}>{l}</a></li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div style={{ maxWidth: 1200, margin: '28px auto 0', borderTop: '1px solid #2e3d34', paddingTop: 18, fontSize: 12, color: '#555' }}>
          2026 SmartSurge. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
