insert into questions (id, category, prompt, choices, answer_index, xp) values
  ('cr1', 'basics', 'What does HVAC stand for?', '["Heating, Ventilation, and Air Conditioning","Heat, Volts, AC, Current","High Voltage Air Control"]', 0, 10),
  ('cr2', 'refrigeration', 'Which component compresses refrigerant vapor?', '["Evaporator","Compressor","Metering device"]', 1, 10)
on conflict (id) do nothing;

insert into assignments (title, due_date) values
  ('Wiring basics quiz', current_date + 7),
  ('EPA 608 practice exam', current_date + 14);
