insert into public.sponsorship_packages (tier, headline, deliverables, display_order) values
  ('Gold', 'Title Partner', array[
    'Named title partner across all flagship events',
    'Exclusive branded session or keynote slot',
    'Priority recruitment access to MUTIS members',
    'Logo placement on all MUTIS communications',
    'Dedicated careers panel feature'
  ], 0),
  ('Silver', 'Event Partner', array[
    'Co-branding on one or more flagship events',
    'Fireside chat or insight session slot',
    'Access to MUTIS member recruitment pipeline',
    'Logo placement on event materials'
  ], 1),
  ('Bronze', 'Supporting Partner', array[
    'Logo placement on MUTIS website and socials',
    'Mention across MUTIS communications',
    'Access to member newsletter sponsorship'
  ], 2);
