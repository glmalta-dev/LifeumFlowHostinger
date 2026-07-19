create index if not exists contact_events_patient_idx on public.contact_events (patient_id);
create index if not exists contact_events_lead_idx on public.contact_events (lead_id);
create index if not exists evolution_revisions_evolution_idx on public.evolution_revisions (evolution_id);
