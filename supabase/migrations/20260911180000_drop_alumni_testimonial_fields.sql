-- Product decision: drop the three optional narrative fields (testimonial,
-- advice for current members, career advice) from both the public
-- submission form and the curated directory. Checked for existing data
-- first — alumni_submissions had none, alumni had only a placeholder
-- "TEST" row.
alter table public.alumni_submissions
  drop column testimonial,
  drop column advice_for_members,
  drop column career_advice;

alter table public.alumni
  drop column testimonial,
  drop column advice_for_members,
  drop column career_advice;
