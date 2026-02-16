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
