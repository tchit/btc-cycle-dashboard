import React from 'react';
import DataTable from '../components/DataTable';
import MethodologyBlock from '../components/MethodologyBlock';
import { EXTERNAL_SOURCES, COMPUTED_METRICS, METHODOLOGY_NOTES } from '../data/sources';

export default function SourcesView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.02em' }}>
          Sources & Méthodologie
        </div>
        <div style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>
          Sources de données, méthodes de calcul et définitions du contenu utilisé dans l'analyse.
        </div>
      </div>

      {/* Source principale — Echeveria */}
      <div style={{
        position: 'relative',
        marginBottom: 24,
        padding: 0,
        borderRadius: 0,
        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px))',
        background: 'linear-gradient(135deg, rgba(204,255,0,0.12) 0%, rgba(45,91,255,0.08) 100%)',
        border: '1px solid rgba(204,255,0,0.25)',
        overflow: 'hidden',
      }}>
        {/* Glow border effect */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          boxShadow: 'inset 0 0 30px rgba(204,255,0,0.08), 0 0 40px rgba(204,255,0,0.06)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          padding: '32px 28px',
        }}>
          {/* Photo */}
          <div style={{
            flexShrink: 0,
            width: 340, height: 340,
            borderRadius: '50%',
            border: '4px solid #CCFF00',
            boxShadow: '0 0 30px rgba(204,255,0,0.4), 0 0 80px rgba(204,255,0,0.15), 0 0 120px rgba(204,255,0,0.05)',
            overflow: 'hidden',
            background: '#0B0C10',
          }}>
            <img
              src="/dane.jpg"
              alt="Echeveria Swiss Banking Grand Master"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
          {/* Title & badge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#CCFF00',
              opacity: 0.7,
            }}>
              Source principale
            </div>
            <div style={{
              fontFamily: "'Chakra Petch', sans-serif",
              fontSize: 24, fontWeight: 700, letterSpacing: '0.03em',
              color: '#FFFFFF',
              textShadow: '0 0 18px rgba(204,255,0,0.25)',
              textAlign: 'center',
            }}>
              Echeveria Swiss Banking Grand Master
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              marginTop: 4,
              padding: '3px 12px',
              background: 'rgba(204,255,0,0.1)',
              border: '1px solid rgba(204,255,0,0.2)',
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              width: 'fit-content',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#CCFF00',
                boxShadow: '0 0 6px #CCFF00',
                display: 'inline-block',
              }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 500, color: '#CCFF00', letterSpacing: '0.06em',
              }}>
                VERIFIED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Sources externes (sous-sections groupées) */}
      <MethodologyBlock
        title="Sources externes"
        subtitle="Chiffres non reproductibles à partir de nos propres données — sourcés depuis des recherches et rapports tiers."
        sections={EXTERNAL_SOURCES.map(s => ({ title: s.section, items: s.items }))}
      />

      {/* Section 2: Table des métriques calculées */}
      <DataTable
        title="Métriques calculées"
        subtitle="Métriques calculées côté serveur à partir de données API brutes — non sourcées depuis des URLs externes."
        columns={COMPUTED_METRICS.columns}
        rows={COMPUTED_METRICS.rows}
      />

      {/* Section 3: Notes méthodologiques (liste ordonnée) */}
      <MethodologyBlock
        title="Méthodologie & notes sur les données"
        subtitle="Hypothèses, dérivations et notes de vérification pour toutes les valeurs calculées."
        items={METHODOLOGY_NOTES}
        ordered
      />
    </div>
  );
}
