const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'frontend/src/lib/content/class9/science/force-and-laws-of-motion');

const topicsData = {
  'topic-1-balanced-unbalanced-forces.ts': [
    "balanced-ice", "unbalanced-ice", "balanced-wood", "unbalanced-wood", "balanced-space",
    "unbalanced-space", "heavy-balanced", "heavy-unbalanced", "light-balanced", "light-unbalanced",
    "tug-of-war-tie", "tug-of-war-win", "extreme-balanced", "extreme-unbalanced", "micro-forces"
  ],
  'topic-2-first-law-of-motion.ts': [
    "inertia-rest", "inertia-motion-space", "inertia-heavy", "inertia-light", "friction-stop",
    "ice-slide", "sudden-push", "sudden-pull", "space-push", "space-coast",
    "train-start", "train-stop", "coin-flick", "book-slide", "hovercraft"
  ],
  'topic-3-second-law-of-motion.ts': [
    "fma-standard", "fma-double-mass", "fma-double-force", "fma-friction", "fma-heavy-friction",
    "fma-micro", "fma-macro", "fma-opposing", "fma-braking", "fma-rocket",
    "fma-asteroid", "fma-bullet", "fma-tug", "fma-equilibrium", "fma-breakaway"
  ],
  'topic-4-third-law-of-motion.ts': [
    "action-reaction-push", "recoil-gun", "rocket-launch", "swimmer-wall", "walking-friction",
    "ice-skater", "bird-flight", "boat-jump", "balloon-air", "firehose",
    "hammer-nail", "car-tires", "spring-push", "magnet-repel", "cannon-fire"
  ],
  'topic-5-conservation-of-momentum.ts': [
    "momentum-heavy", "momentum-fast", "momentum-collision", "momentum-stop", "momentum-bullet",
    "momentum-train", "momentum-change", "momentum-braking", "momentum-zero", "momentum-asteroid",
    "momentum-pingpong", "momentum-impulse1", "momentum-impulse2", "momentum-reverse", "momentum-constant"
  ]
};

for (const [filename, ids] of Object.entries(topicsData)) {
  const p = path.join(DIR, filename);
  if (!fs.existsSync(p)) continue;

  let content = fs.readFileSync(p, 'utf8');

  // We want to distribute the 15 IDs across all subtopics in the file.
  // First find all subtopic blocks. We can do this by searching for simulationIds: [...]
  
  const simRegex = /simulationIds:\s*\[[^\]]*\]/g;
  let subtopicIndex = 0;
  
  // Count how many subtopics have simulationIds
  const matches = content.match(simRegex);
  if (!matches) continue;
  
  const numSubtopics = matches.length;
  const idsPerSubtopic = Math.ceil(ids.length / numSubtopics);

  content = content.replace(simRegex, (match) => {
    const startIdx = subtopicIndex * idsPerSubtopic;
    const endIdx = startIdx + idsPerSubtopic;
    const assignedIds = ids.slice(startIdx, endIdx);
    subtopicIndex++;
    return 'simulationIds: [' + assignedIds.map(id => '"' + id + '"').join(', ') + ']';
  });

  fs.writeFileSync(p, content, 'utf8');
  console.log('Updated ' + filename);
}
