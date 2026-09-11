-- Public-facing native alumni registration form (replaces the Google Form
-- embed on the Our Network page). Two distinct consents are captured
-- separately: consent_publish covers publishing the submitted details on
-- the MUTIS site/socials; consent_gdpr covers the general data-processing
-- notice (links to /privacy). Both are required, enforced below rather than
-- only in the client, and consent_at records when they were given.
--
-- No email column: the source field list for this form doesn't include one
-- (confirmed with the committee), so there's deliberately no way to derive
-- an email format constraint here either.
create table public.alumni_submissions (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  full_name          text not null check (char_length(full_name) between 1 and 200),
  graduation_year    integer not null check (graduation_year between 1960 and extract(year from now())::int + 1),
  degree_course      text check (degree_course is null or char_length(degree_course) <= 200),
  current_company    text not null check (char_length(current_company) between 1 and 200),
  current_position   text not null check (char_length(current_position) between 1 and 200),
  industry           text check (industry is null or char_length(industry) <= 200),
  linkedin_url       text check (linkedin_url is null or linkedin_url ~* '^https?://'),
  photo_url          text,
  mutis_position     text check (mutis_position is null or char_length(mutis_position) <= 200),
  testimonial        text check (testimonial is null or char_length(testimonial) <= 2000),
  advice_for_members text check (advice_for_members is null or char_length(advice_for_members) <= 2000),
  career_advice      text check (career_advice is null or char_length(career_advice) <= 2000),
  consent_publish    boolean not null,
  consent_gdpr       boolean not null,
  consent_at         timestamptz not null,
  status             text not null default 'new' check (status in ('new','reviewed','archived')),
  constraint alumni_submissions_consent_required check (consent_publish and consent_gdpr)
);

alter table public.alumni_submissions enable row level security;

create policy "public can submit alumni_submissions" on public.alumni_submissions
  for insert to anon, authenticated with check (true);

create policy "admin can read alumni_submissions" on public.alumni_submissions
  for select using (public.is_admin());

create policy "admin can update alumni_submissions" on public.alumni_submissions
  for update using (public.is_admin()) with check (public.is_admin());

create policy "admin can delete alumni_submissions" on public.alumni_submissions
  for delete using (public.is_admin());
