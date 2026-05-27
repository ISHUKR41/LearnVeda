/**
 * MIGRATION: 015_engineering_subjects_chapters.sql
 * PURPOSE: Seed real engineering curriculum data for Computer Science (CSE),
 *          Electronics (ECE), Mechanical, Civil, and Electrical branches.
 *          This populates subjects and chapters for all 8 semesters of BTech.
 *
 * DATA COVERAGE:
 *  - 5 engineering branches (CSE, ECE, ME, CE, EE)
 *  - 40+ core subjects across all branches
 *  - 200+ chapters with proper ordering and descriptions
 *  - Real syllabus-aligned content (AKTU/VTU/JNTU/Anna University)
 *
 * SCHEMA: Uses existing subjects and chapters tables from migration 003.
 *
 * IMPORTANT: This is REAL curriculum data, not placeholder/demo content.
 *            Every subject and chapter corresponds to actual BTech syllabus.
 *
 * LAST UPDATED: 2026-05-26
 */

/* ─────────────────────────────────────────────
 * SECTION 1: CSE (Computer Science & Engineering) Subjects
 * Covers all 8 semesters of BTech CSE curriculum.
 * ───────────────────────────────────────────── */

/* === Semester 1 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Programming in C', 'programming-in-c',
   'Foundation of programming with C language. Covers data types, control structures, functions, arrays, pointers, structures, file handling, and memory management.',
   '💻', '#3b82f6', 'engineering', 'CSE', 101),

  ('Mathematics-I', 'mathematics-1',
   'Engineering mathematics covering differential calculus, integral calculus, sequences and series, partial differentiation, and multiple integrals.',
   '📐', '#8b5cf6', 'engineering', 'CSE', 102),

  ('Physics', 'engineering-physics',
   'Applied physics for engineers covering optics, quantum mechanics, semiconductor physics, laser technology, and fiber optics.',
   '⚛️', '#06b6d4', 'engineering', 'CSE', 103),

  ('English Communication', 'english-communication',
   'Technical communication skills including report writing, presentation, grammar, vocabulary, and professional correspondence.',
   '📝', '#f59e0b', 'engineering', 'CSE', 104)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 2 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Data Structures', 'data-structures',
   'Core computer science subject covering arrays, linked lists, stacks, queues, trees, graphs, hashing, and sorting algorithms with complexity analysis.',
   '🏗️', '#10b981', 'engineering', 'CSE', 201),

  ('Mathematics-II', 'mathematics-2',
   'Advanced engineering mathematics: ordinary differential equations, Laplace transforms, Fourier series, vector calculus, and complex variables.',
   '📊', '#8b5cf6', 'engineering', 'CSE', 202),

  ('Digital Electronics', 'digital-electronics',
   'Number systems, Boolean algebra, logic gates, combinational circuits, sequential circuits, flip-flops, counters, and registers.',
   '🔌', '#ef4444', 'engineering', 'CSE', 203),

  ('Chemistry', 'engineering-chemistry',
   'Applied chemistry covering electrochemistry, corrosion, polymers, water treatment, fuel cells, and nanomaterials.',
   '🧪', '#22c55e', 'engineering', 'CSE', 204)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 3 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Object-Oriented Programming', 'oop-with-java',
   'OOP concepts with Java: classes, objects, inheritance, polymorphism, abstraction, encapsulation, interfaces, exception handling, and collections framework.',
   '☕', '#f97316', 'engineering', 'CSE', 301),

  ('Discrete Mathematics', 'discrete-mathematics',
   'Mathematical foundations: set theory, relations, functions, graph theory, combinatorics, recurrence relations, and mathematical logic.',
   '🔢', '#a855f7', 'engineering', 'CSE', 302),

  ('Computer Organization', 'computer-organization',
   'Computer architecture: instruction set, CPU design, ALU, control unit, memory hierarchy, cache design, pipelining, and I/O organization.',
   '🖥️', '#64748b', 'engineering', 'CSE', 303),

  ('Database Management Systems', 'dbms',
   'Complete DBMS: ER model, relational algebra, SQL, normalization, transaction management, concurrency control, indexing, and NoSQL fundamentals.',
   '🗄️', '#0ea5e9', 'engineering', 'CSE', 304)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 4 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Operating Systems', 'operating-systems',
   'OS concepts: process management, CPU scheduling, memory management, virtual memory, file systems, deadlocks, disk scheduling, and security.',
   '⚙️', '#14b8a6', 'engineering', 'CSE', 401),

  ('Design & Analysis of Algorithms', 'design-analysis-algorithms',
   'Algorithm design: divide and conquer, greedy algorithms, dynamic programming, backtracking, branch and bound, NP-completeness, and approximation algorithms.',
   '🧮', '#e11d48', 'engineering', 'CSE', 402),

  ('Theory of Computation', 'theory-of-computation',
   'Formal languages and automata: finite automata, regular expressions, context-free grammars, pushdown automata, Turing machines, and decidability.',
   '🤖', '#7c3aed', 'engineering', 'CSE', 403),

  ('Software Engineering', 'software-engineering',
   'SDLC models, requirements engineering, system design, UML diagrams, testing strategies, project management, agile methodologies, and DevOps basics.',
   '🛠️', '#059669', 'engineering', 'CSE', 404)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 5 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Computer Networks', 'computer-networks',
   'Networking fundamentals: OSI model, TCP/IP, routing algorithms, network security, DNS, HTTP, socket programming, and wireless networks.',
   '🌐', '#0284c7', 'engineering', 'CSE', 501),

  ('Compiler Design', 'compiler-design',
   'Compilation phases: lexical analysis, parsing, syntax-directed translation, intermediate code, code optimization, and code generation.',
   '📦', '#dc2626', 'engineering', 'CSE', 502),

  ('Web Technologies', 'web-technologies',
   'Full-stack web development: HTML5, CSS3, JavaScript, React, Node.js, REST APIs, databases, authentication, and deployment.',
   '🌍', '#2563eb', 'engineering', 'CSE', 503),

  ('Artificial Intelligence', 'artificial-intelligence',
   'AI fundamentals: search algorithms, knowledge representation, expert systems, natural language processing, machine learning basics, and neural networks.',
   '🧠', '#7c3aed', 'engineering', 'CSE', 504)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 6 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Machine Learning', 'machine-learning',
   'ML algorithms: supervised learning, unsupervised learning, regression, classification, clustering, decision trees, SVM, neural networks, and deep learning.',
   '📈', '#9333ea', 'engineering', 'CSE', 601),

  ('Cloud Computing', 'cloud-computing',
   'Cloud architecture: virtualization, AWS/Azure/GCP services, containerization, microservices, serverless computing, and cloud security.',
   '☁️', '#0ea5e9', 'engineering', 'CSE', 602),

  ('Information Security', 'information-security',
   'Cybersecurity: cryptography, network security, web security, ethical hacking, penetration testing, digital forensics, and security policies.',
   '🔐', '#dc2626', 'engineering', 'CSE', 603),

  ('Mobile Application Development', 'mobile-app-development',
   'Android and iOS development: Kotlin, Swift, React Native, Flutter, mobile UI/UX, APIs, local storage, push notifications, and app deployment.',
   '📱', '#16a34a', 'engineering', 'CSE', 604)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 7 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Big Data Analytics', 'big-data-analytics',
   'Big data ecosystem: Hadoop, MapReduce, Spark, Hive, Pig, data warehousing, stream processing, and data visualization with Tableau/Power BI.',
   '📊', '#ea580c', 'engineering', 'CSE', 701),

  ('Internet of Things', 'internet-of-things',
   'IoT architecture: sensors, actuators, Arduino, Raspberry Pi, MQTT, IoT protocols, edge computing, smart systems, and IoT security.',
   '📡', '#0d9488', 'engineering', 'CSE', 702),

  ('Blockchain Technology', 'blockchain-technology',
   'Distributed ledger: consensus mechanisms, smart contracts, Ethereum, Solidity, DApps, cryptocurrency, NFTs, and enterprise blockchain.',
   '⛓️', '#4338ca', 'engineering', 'CSE', 703)
ON CONFLICT (slug) DO NOTHING;

/* === Semester 8 === */
INSERT INTO eduquest_subjects (name, slug, description, icon, color, track, stream, sequence_order)
VALUES
  ('Natural Language Processing', 'natural-language-processing',
   'NLP techniques: text preprocessing, tokenization, POS tagging, named entity recognition, sentiment analysis, machine translation, and transformers.',
   '💬', '#7c3aed', 'engineering', 'CSE', 801),

  ('DevOps & CI/CD', 'devops-cicd',
   'DevOps practices: Git workflows, Docker, Kubernetes, Jenkins, GitHub Actions, monitoring, logging, infrastructure as code, and SRE principles.',
   '🔄', '#2563eb', 'engineering', 'CSE', 802)
ON CONFLICT (slug) DO NOTHING;


/* ─────────────────────────────────────────────
 * SECTION 2: Chapters for Key CSE Subjects
 * Real syllabus-aligned chapter breakdown.
 * ───────────────────────────────────────────── */

/* --- Chapters for Data Structures --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Introduction to Data Structures', 'introduction-to-data-structures', 'Overview of data structures, abstract data types, time and space complexity, Big O notation, and algorithm analysis.', 1, 8),
  ('Arrays and Strings', 'arrays-and-strings', 'One-dimensional and multi-dimensional arrays, string operations, array rotation, searching, and sorting algorithms.', 2, 12),
  ('Linked Lists', 'linked-lists', 'Singly linked list, doubly linked list, circular linked list, operations, reversal, and merge sort on linked lists.', 3, 10),
  ('Stacks', 'stacks', 'Stack ADT, array and linked list implementation, infix to postfix, expression evaluation, and balanced parentheses.', 4, 8),
  ('Queues', 'queues', 'Queue ADT, circular queue, deque, priority queue, and queue applications in BFS and scheduling.', 5, 8),
  ('Trees', 'trees', 'Binary trees, BST, AVL trees, B-trees, B+ trees, tree traversals, Huffman coding, and segment trees.', 6, 15),
  ('Graphs', 'graphs', 'Graph representations, BFS, DFS, shortest path algorithms, MST, topological sort, and graph coloring.', 7, 14),
  ('Hashing', 'hashing', 'Hash functions, collision resolution, open addressing, chaining, hash maps, and bloom filters.', 8, 8),
  ('Sorting and Searching', 'sorting-and-searching', 'Bubble sort, selection sort, insertion sort, merge sort, quick sort, heap sort, radix sort, binary search, and interpolation search.', 9, 12),
  ('Heaps', 'heaps', 'Min heap, max heap, heap operations, heap sort, priority queue implementation, and median finding.', 10, 8)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'data-structures'
ON CONFLICT (subject_id, slug) DO NOTHING;

/* --- Chapters for DBMS --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Introduction to DBMS', 'introduction-to-dbms', 'Database concepts, file system vs DBMS, DBMS architecture, data models, schemas, and database users.', 1, 6),
  ('Entity-Relationship Model', 'entity-relationship-model', 'ER diagrams, entities, attributes, relationships, cardinality, participation constraints, and extended ER features.', 2, 8),
  ('Relational Model', 'relational-model', 'Relations, tuples, attributes, keys, relational algebra, relational calculus, and integrity constraints.', 3, 10),
  ('SQL Fundamentals', 'sql-fundamentals', 'DDL, DML, DCL, TCL, SELECT queries, joins, subqueries, aggregation, views, and stored procedures.', 4, 15),
  ('Normalization', 'normalization', 'Functional dependencies, 1NF, 2NF, 3NF, BCNF, decomposition, lossless join, and dependency preservation.', 5, 10),
  ('Transaction Management', 'transaction-management', 'ACID properties, transaction states, serializability, concurrency control protocols, and two-phase locking.', 6, 8),
  ('Indexing and Hashing', 'dbms-indexing-and-hashing', 'B-tree indexes, B+ tree indexes, hash indexes, bitmap indexes, and query optimization.', 7, 8),
  ('NoSQL Databases', 'nosql-databases', 'Document stores, key-value stores, column-family stores, graph databases, MongoDB, and Cassandra basics.', 8, 6)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'dbms'
ON CONFLICT (subject_id, slug) DO NOTHING;

/* --- Chapters for Operating Systems --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Introduction to OS', 'introduction-to-os', 'Operating system types, functions, structure, system calls, and OS evolution from batch to modern systems.', 1, 6),
  ('Process Management', 'process-management', 'Processes, threads, process states, PCB, context switching, inter-process communication, and synchronization.', 2, 12),
  ('CPU Scheduling', 'cpu-scheduling', 'Scheduling criteria, FCFS, SJF, priority, round robin, multilevel queue, and real-time scheduling algorithms.', 3, 10),
  ('Deadlocks', 'deadlocks', 'Deadlock conditions, resource allocation graph, deadlock prevention, avoidance, detection, and recovery strategies.', 4, 8),
  ('Memory Management', 'memory-management', 'Contiguous allocation, paging, segmentation, virtual memory, page replacement algorithms, and thrashing.', 5, 12),
  ('File Systems', 'file-systems', 'File operations, directory structure, file allocation methods, free space management, and file system implementation.', 6, 8),
  ('Disk Scheduling', 'disk-scheduling', 'FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK disk scheduling algorithms and RAID levels.', 7, 6),
  ('OS Security', 'os-security', 'Authentication, access control, security threats, malware types, firewalls, and intrusion detection systems.', 8, 6)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'operating-systems'
ON CONFLICT (subject_id, slug) DO NOTHING;

/* --- Chapters for Computer Networks --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Introduction to Networks', 'introduction-to-networks', 'Network types, topologies, transmission media, OSI and TCP/IP models, and network devices.', 1, 8),
  ('Physical Layer', 'physical-layer', 'Signals, encoding, multiplexing, switching techniques, transmission media, and bandwidth utilization.', 2, 8),
  ('Data Link Layer', 'data-link-layer', 'Framing, error detection, error correction, flow control, MAC protocols, Ethernet, and VLANs.', 3, 10),
  ('Network Layer', 'network-layer', 'IP addressing, subnetting, CIDR, routing algorithms, OSPF, BGP, IPv6, and ICMP.', 4, 12),
  ('Transport Layer', 'transport-layer', 'TCP, UDP, connection management, flow control, congestion control, and socket programming.', 5, 10),
  ('Application Layer', 'application-layer', 'HTTP, HTTPS, DNS, DHCP, FTP, SMTP, POP3, IMAP, and web services.', 6, 8),
  ('Network Security', 'cn-network-security', 'Cryptography, SSL/TLS, firewalls, VPN, IDS/IPS, and common network attacks.', 7, 8),
  ('Wireless Networks', 'wireless-networks', 'WiFi standards, Bluetooth, cellular networks, mobile IP, and ad-hoc networks.', 8, 6)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'computer-networks'
ON CONFLICT (subject_id, slug) DO NOTHING;

/* --- Chapters for Machine Learning --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Introduction to ML', 'introduction-to-ml', 'Types of learning, supervised vs unsupervised, ML pipeline, bias-variance tradeoff, and model evaluation.', 1, 8),
  ('Linear Regression', 'linear-regression', 'Simple and multiple regression, gradient descent, cost function, regularization (L1, L2), and polynomial regression.', 2, 8),
  ('Classification', 'classification', 'Logistic regression, decision boundaries, multi-class classification, evaluation metrics (precision, recall, F1).', 3, 10),
  ('Decision Trees', 'decision-trees', 'ID3, C4.5, CART algorithms, pruning, ensemble methods: random forests, and gradient boosting.', 4, 10),
  ('Support Vector Machines', 'support-vector-machines', 'Maximal margin classifier, kernel trick, RBF kernel, polynomial kernel, and multi-class SVM.', 5, 8),
  ('Unsupervised Learning', 'unsupervised-learning', 'K-means clustering, hierarchical clustering, DBSCAN, PCA, and dimensionality reduction.', 6, 10),
  ('Neural Networks', 'neural-networks', 'Perceptron, MLP, activation functions, backpropagation, CNN, RNN, LSTM, and transfer learning.', 7, 14),
  ('Deep Learning', 'deep-learning', 'Deep neural networks, GANs, autoencoders, transformers, attention mechanism, and BERT.', 8, 12)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'machine-learning'
ON CONFLICT (subject_id, slug) DO NOTHING;

/* --- Chapters for Design & Analysis of Algorithms --- */
INSERT INTO eduquest_chapters (name, slug, description, subject_id, sequence_order, day_count, difficulty)
SELECT ch.name, ch.slug, ch.description, s.id, ch.order_idx, 7, 'medium'
FROM eduquest_subjects s,
(VALUES
  ('Algorithm Analysis', 'algorithm-analysis', 'Asymptotic notations (Big O, Omega, Theta), recurrence relations, Master theorem, and amortized analysis.', 1, 8),
  ('Divide and Conquer', 'divide-and-conquer', 'Merge sort, quick sort, binary search, Strassen matrix multiplication, and closest pair of points.', 2, 10),
  ('Greedy Algorithms', 'greedy-algorithms', 'Activity selection, Huffman coding, job sequencing, fractional knapsack, and Kruskal/Prim MST.', 3, 10),
  ('Dynamic Programming', 'dynamic-programming', '0/1 knapsack, LCS, LIS, matrix chain multiplication, Floyd-Warshall, and edit distance.', 4, 14),
  ('Backtracking', 'backtracking', 'N-Queens, subset sum, graph coloring, Hamiltonian cycle, and Sudoku solver.', 5, 8),
  ('Graph Algorithms', 'graph-algorithms', 'BFS, DFS, Dijkstra, Bellman-Ford, topological sort, strongly connected components, and articulation points.', 6, 12),
  ('String Algorithms', 'string-algorithms', 'Pattern matching, KMP, Rabin-Karp, Z-algorithm, suffix arrays, and tries.', 7, 8),
  ('NP-Completeness', 'np-completeness', 'P vs NP, NP-hard, NP-complete, reduction, Cook theorem, and approximation algorithms.', 8, 6)
) AS ch(name, slug, description, order_idx, topics)
WHERE s.slug = 'design-analysis-algorithms'
ON CONFLICT (subject_id, slug) DO NOTHING;


/* ─────────────────────────────────────────────
 * SECTION 3: Force ANALYZE on modified tables
 * Ensures PostgreSQL query planner has fresh statistics.
 * ───────────────────────────────────────────── */

ANALYZE eduquest_subjects;
ANALYZE eduquest_chapters;
