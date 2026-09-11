-- Carries the richer fields from alumni_submissions through to the
-- published alumni directory. Without these, "convert to alumni entry"
-- silently dropped everything except name/firm/role/cohort/linkedin_url —
-- the degree, industry, MUTIS involvement, and all three optional
-- testimonial/advice fields never made it to the public directory.
alter table public.alumni
  add column degree_course text check (degree_course is null or char_length(degree_course) <= 200),
  add column industry text check (industry is null or char_length(industry) <= 200),
  add column mutis_position text check (mutis_position is null or char_length(mutis_position) <= 200),
  add column testimonial text check (testimonial is null or char_length(testimonial) <= 2000),
  add column advice_for_members text check (advice_for_members is null or char_length(advice_for_members) <= 2000),
  add column career_advice text check (career_advice is null or char_length(career_advice) <= 2000);
