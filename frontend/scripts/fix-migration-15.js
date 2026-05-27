const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/server/database/migrations/015_engineering_subjects_chapters.sql');
let content = fs.readFileSync(filePath, 'utf8');

// Replace table names
content = content.replace(/INSERT INTO subjects/g, 'INSERT INTO eduquest_subjects');
content = content.replace(/INSERT INTO chapters/g, 'INSERT INTO eduquest_chapters');
content = content.replace(/ANALYZE subjects;/g, 'ANALYZE eduquest_subjects;');
content = content.replace(/ANALYZE chapters;/g, 'ANALYZE eduquest_chapters;');
content = content.replace(/FROM subjects s/g, 'FROM eduquest_subjects s');

// Replace subjects column list
content = content.replace(
  /\(name, slug, description, icon, color, class_level, stream, semester, is_published, order_index\)/g,
  '(name, slug, description, icon, color, track, stream, sequence_order)'
);

// Replace values format: NULL, 'STREAM', semester, true, order_index
content = content.replace(/NULL,\s*'([A-Z]+)',\s*\d+,\s*true,\s*(\d+)/g, "'engineering', '$1', $2");

// Replace chapters column list
content = content.replace(
  /\(name, slug, description, subject_id, order_index, is_published, total_topics\)/g,
  '(name, slug, description, subject_id, sequence_order, day_count, difficulty)'
);

// Replace chapters select list
content = content.replace(
  /SELECT\s+ch\.name,\s*ch\.slug,\s*ch\.description,\s*s\.id,\s*ch\.order_idx,\s*true,\s*ch\.topics/g,
  "SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'"
);

// Replace chapters ON CONFLICT from (slug) to (subject_id, slug)
content = content.replace(/(WHERE s\.slug = '[^']+')\s*ON CONFLICT \(slug\) DO NOTHING;/g,
  "$1\nON CONFLICT (subject_id, slug) DO NOTHING;");

fs.writeFileSync(filePath, content, 'utf8');
console.log("Successfully rewrote 015_engineering_subjects_chapters.sql with composite keys!");
