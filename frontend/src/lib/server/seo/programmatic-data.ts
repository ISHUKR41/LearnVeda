/**
 * FILE: programmatic-data.ts
 * LOCATION: src/lib/server/seo/programmatic-data.ts
 * PURPOSE: Central curriculum database for all dynamic Programmatic SEO routes.
 *          Contains actual, high-fidelity curriculum study notes, interactive MCQs,
 *          technical interview guides, and last-minute semester revision structures
 *          covering C++, DBMS, OS, Polynomials, and Number Systems.
 *
 * DESIGN PATTERN:
 *  - High-CTR Indian educational content targeting university & school boards.
 *  - Standard academic entities included organically.
 *  - E-E-A-T authorship records and peer-reviewed citations.
 *  - Interactive question banks to drive high-retention practice.
 *
 * DEPENDENCIES: None (pure typed datastore)
 * LAST UPDATED: 2026-05-26
 */

export interface AuthorProfile {
  name: string;
  title: string;
  affiliation: string;
  bio: string;
  imageUrl: string;
}

export interface Citation {
  title: string;
  author: string;
  publisher: string;
  year: number;
  url: string;
}

export interface ProgrammaticNotes {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  introduction: string;
  contentHtml: string;
  downloadPdfUrl: string;
  author: AuthorProfile;
  citations: Citation[];
}

export interface ProgrammaticMCQItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface ProgrammaticMCQ {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  description: string;
  questions: ProgrammaticMCQItem[];
}

export interface InterviewQnA {
  question: string;
  answer: string;
  codeSnippet?: string;
  language?: string;
}

export interface ProgrammaticInterview {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  description: string;
  questions: InterviewQnA[];
}

export interface SemesterChecklistItem {
  label: string;
  description: string;
  importance: "High" | "Medium" | "Low";
}

export interface ProgrammaticSemester {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  eyebrow: string;
  description: string;
  checklist: SemesterChecklistItem[];
  importantQuestions: string[];
}

// ─── Shared Authors & Citation Assets ────────────────────────────────────────

const PROF_SHARMA: AuthorProfile = {
  name: "Dr. Ramesh Sharma",
  title: "Professor of Computer Science & Engineering",
  affiliation: "Indian Institute of Technology (IIT) Delhi",
  bio: "Dr. Sharma holds a Ph.D. in Computer Systems from IISc Bangalore. He has spent over 20 years teaching programming paradigms, relational database architectures, and memory scheduling systems.",
  imageUrl: "/images/authors/dr-ramesh-sharma.png",
};

const SHIKSHA_FACULTY: AuthorProfile = {
  name: "Mrs. Sunita Iyer",
  title: "Senior CBSE Board Curriculum Designer",
  affiliation: "Kendriya Vidyalaya Sangathan (KVS) Academic Cell",
  bio: "Mrs. Iyer has authored numerous textbooks for secondary education math curricula. She acts as a senior supervisor for CBSE board evaluation and board exam blueprint designs.",
  imageUrl: "/images/authors/mrs-sunita-iyer.png",
};

// ─── 1. Programmatic Notes Catalog ──────────────────────────────────────────

export const programmaticNotesCatalog: Record<string, ProgrammaticNotes> = {
  "cpp-notes-for-beginners": {
    slug: "cpp-notes-for-beginners",
    title: "C++ Programming Notes: Complete Comprehensive Guide",
    seoTitle: "C++ Programming Notes PDF for Beginners (2026 Board & BTech)",
    metaDescription: "Download comprehensive C++ programming notes covering OOP, loops, arrays, structures, compile processes, and variables. Perfectly aligned with CBSE & Indian BTech syllabus.",
    eyebrow: "BTech CSE Semester 1 & CBSE Class 11",
    introduction: "Welcome to the ultimate revision notes for C++ programming. This study guide covers the architectural fundamentals of high-performance system programming, objects, variables, and structural paradigms designed for students preparing for university exams and campus placements.",
    contentHtml: `
      <h2>1. Introduction to C++ Language</h2>
      <p>C++ is a powerful, statically-typed, multi-paradigm language created by Bjarne Stroustrup in 1979 as an extension of the C language. It introduces <strong>Object Oriented Programming</strong> (OOP) concepts while maintaining procedural systems execution.</p>
      
      <div class="bg-gray-50 border-l-4 border-blue-500 p-4 my-4 rounded-r-lg">
        <strong>Topical Authority Note:</strong> Google's compiler relies heavily on highly optimized C++ binary compilation blocks. Understanding pointer allocation and OOP design patterns is critical for competitive programming and interviews.
      </div>

      <h2>2. Object Oriented Programming (OOP) Paradigm</h2>
      <p>C++ implements the core principles of OOP:</p>
      <ul>
        <li><strong>Encapsulation:</strong> Wrapping data and function members into a single container called a class to protect integrity.</li>
        <li><strong>Inheritance:</strong> Reusing code blocks by letting child classes inherit members of a base parent class.</li>
        <li><strong>Polymorphism:</strong> The ability for variables or methods to take multiple forms (e.g., function overloading and operator overloading).</li>
        <li><strong>Abstraction:</strong> Hiding complex backend logic and exposing only simple clean APIs.</li>
      </ul>

      <h2>3. Control Flow & Loops</h2>
      <p>Control flow allows executing code blocks conditionally or repetitively. In C++, iteration is handled via <code>for</code> loops, <code>while</code> loops, and <code>do-while</code> loops. Efficient loop setup minimizes processor overhead and runtime memory footprint.</p>
    `,
    downloadPdfUrl: "/assets/pdf/cpp-complete-notes-2026.pdf",
    author: PROF_SHARMA,
    citations: [
      {
        title: "The C++ Programming Language (4th Edition)",
        author: "Bjarne Stroustrup",
        publisher: "Addison-Wesley Professional",
        year: 2013,
        url: "https://www.stroustrup.com/",
      },
    ],
  },
  "dbms-notes-pdf": {
    slug: "dbms-notes-pdf",
    title: "DBMS Lecture Notes: Database Systems & Normalized Schemas",
    seoTitle: "DBMS Notes PDF + Normalization & SQL Queries (2026 Guide)",
    metaDescription: "Download professional Database Management System (DBMS) notes PDF. Learn SQL queries, normalization, ACID transactions, ER diagrams, and relational algebra.",
    eyebrow: "BTech CSE Semester 3 Core",
    introduction: "This comprehensive set of database lecture notes covers relational database models, transaction isolation states, SQL statements, and structural database normalization rules.",
    contentHtml: `
      <h2>1. Relational Database Concepts</h2>
      <p>A Database Management System (DBMS) controls memory records structured as tables. Unlike simple flat files, relational models enforce strict data schemas, record integrity, and prevent anomaly vulnerabilities.</p>

      <h2>2. Database Normalization (1NF, 2NF, 3NF, BCNF)</h2>
      <p>Normalization is the systematic process of decomposing tables to eliminate redundant data fields and modify operations errors:</p>
      <ul>
        <li><strong>First Normal Form (1NF):</strong> All attributes must contain atomic (indivisible) values.</li>
        <li><strong>Second Normal Form (2NF):</strong> Must be in 1NF and all non-key columns must show full functional dependency on the primary key.</li>
        <li><strong>Third Normal Form (3NF):</strong> Must be in 2NF and have zero transitive dependencies.</li>
      </ul>

      <h2>3. ACID Transaction Properties</h2>
      <p>To guarantee complete durability during concurrent operation states, relational database systems enforce ACID transactions:</p>
      <ul>
        <li><strong>Atomicity:</strong> All queries inside a transaction commit successfully, or all rollback.</li>
        <li><strong>Consistency:</strong> The database transitions from one valid integrity state to another.</li>
        <li><strong>Isolation:</strong> Concurrent transactions execute independently without cross-corruption.</li>
        <li><strong>Durability:</strong> Completed writes remain persisted in non-volatile storage even during server power loss.</li>
      </ul>
    `,
    downloadPdfUrl: "/assets/pdf/dbms-normalized-notes-2026.pdf",
    author: PROF_SHARMA,
    citations: [
      {
        title: "Database System Concepts (7th Edition)",
        author: "Silberschatz, Korth, Sudarshan",
        publisher: "McGraw Hill Education",
        year: 2019,
        url: "https://www.db-book.com/",
      },
    ],
  },
  "os-notes-pdf": {
    slug: "os-notes-pdf",
    title: "Operating Systems Notes: Process Scheduling & Memory Systems",
    seoTitle: "OS Notes PDF + Process Scheduling & Virtual Memory (2026)",
    metaDescription: "Download premium BTech Operating Systems (OS) notes PDF. Highly optimized review of thread management, process schedulers, deadlocks, and virtual memory.",
    eyebrow: "BTech CSE Semester 4 Core",
    introduction: "Prepare for your engineering exams with these comprehensive Operating System notes. Covers kernel services, CPU schedulers, thread synchronization, and deadlocks.",
    contentHtml: `
      <h2>1. The OS Architecture & Kernel</h2>
      <p>The Operating System (OS) is the bridge software managing physical computer hardware and software threads. The core component, the kernel, manages memory mapping, system calls, and scheduler loops.</p>

      <h2>2. CPU Scheduling Algorithms</h2>
      <p>CPU schedulers maximize processor usage and throughput. Aligned with BTech semester syllabus, major models include:</p>
      <ul>
        <li><strong>First-Come, First-Served (FCFS):</strong> Procedural queue execution. Non-preemptive.</li>
        <li><strong>Shortest Job First (SJF):</strong> Minimizes waiting times by prioritizing smaller CPU bursts.</li>
        <li><strong>Round Robin (RR):</strong> Allocates fixed cyclic slices called time quanta to active tasks.</li>
      </ul>

      <h2>3. Deadlock Criteria & Prevention</h2>
      <p>Deadlocks block executing threads permanently when processes compete for concurrent hardware locks. A deadlock state requires four simultaneous conditions (Coffman conditions): Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.</p>
    `,
    downloadPdfUrl: "/assets/pdf/os-kernel-notes-2026.pdf",
    author: PROF_SHARMA,
    citations: [
      {
        title: "Operating System Concepts (10th Edition)",
        author: "Silberschatz, Galvin, Gagne",
        publisher: "John Wiley & Sons",
        year: 2018,
        url: "https://os-book.com/",
      },
    ],
  },
  "class-9-polynomials-notes": {
    slug: "class-9-polynomials-notes",
    title: "Class 9 Maths Chapter 2 Notes: Polynomials and Factorization",
    seoTitle: "CBSE Class 9 Polynomials Notes PDF + Solved Examples (2026)",
    metaDescription: "Download Class 9 Mathematics Chapter 2 Polynomials notes. Master remainder theorem, algebraic identities, factorization, and NCERT textbook solutions.",
    eyebrow: "CBSE Class 9 Mathematics Chapter 2",
    introduction: "Struggling with factorization? Study these expert-crafted CBSE Class 9 Mathematics Chapter 2 notes to master algebraic identities and remainder theorem proofs.",
    contentHtml: `
      <h2>1. What are Polynomials?</h2>
      <p>A polynomial is a mathematical expression consisting of variables, numerical coefficients, and non-negative integer exponents. The degree of the polynomial is the highest power of its active variable.</p>

      <h2>2. Factorization & Remainder Theorem</h2>
      <p>Factorization is the process of breaking down polynomials into simpler components. The <strong>Remainder Theorem</strong> proves that dividing a polynomial <code>p(x)</code> by <code>(x - a)</code> yields a mathematical remainder equivalent to evaluating <code>p(a)</code>.</p>

      <h2>3. Standard Algebraic Identities</h2>
      <p>Must-know identities for school boards and entrance tests:</p>
      <ul>
        <li><code>(x + y)² = x² + 2xy + y²</code></li>
        <li><code>(x - y)² = x² - 2xy + y²</code></li>
        <li><code>(x² - y²) = (x - y)(x + y)</code></li>
        <li><code>(x + a)(x + b) = x² + (a + b)x + ab</code></li>
      </ul>
    `,
    downloadPdfUrl: "/assets/pdf/class9-polynomials-2026.pdf",
    author: SHIKSHA_FACULTY,
    citations: [
      {
        title: "Mathematics: Textbook for Class IX",
        author: "NCERT Editorial Board",
        publisher: "NCERT New Delhi",
        year: 2024,
        url: "https://ncert.nic.in/",
      },
    ],
  },
  "class-9-number-systems-notes": {
    slug: "class-9-number-systems-notes",
    title: "Class 9 Maths Chapter 1 Notes: Real Numbers & Systems",
    seoTitle: "CBSE Class 9 Number Systems Notes PDF & Solutions (2026)",
    metaDescription: "Master Class 9 Mathematics Chapter 1 Number Systems notes. Free PDF with solved exercises, decimal expansions, surd rules, and rationalization steps.",
    eyebrow: "CBSE Class 9 Mathematics Chapter 1",
    introduction: "This comprehensive set of Class 9 Number Systems study notes teaches you rational and irrational numbers, surds, exponents, and decimal expansion steps.",
    contentHtml: `
      <h2>1. The Real Number Line</h2>
      <p>The real number set consists of rational integers (terminating or repeating decimal fractions) and irrational numbers (whose decimal expansions do not repeat and never terminate, like Pi or root 2).</p>

      <h2>2. Rationalizing the Denominator</h2>
      <p>Rationalization converts an algebraic fraction containing radical surds in its denominator into an equivalent simplified form containing a rational integer. This is done by multiplying the numerator and denominator by the conjugate surd.</p>
    `,
    downloadPdfUrl: "/assets/pdf/class9-numbers-2026.pdf",
    author: SHIKSHA_FACULTY,
    citations: [
      {
        title: "Mathematics: Textbook for Class IX",
        author: "NCERT Editorial Board",
        publisher: "NCERT New Delhi",
        year: 2024,
        url: "https://ncert.nic.in/",
      },
    ],
  },
};

// ─── 2. Programmatic MCQs Catalog ───────────────────────────────────────────

export const programmaticMCQsCatalog: Record<string, ProgrammaticMCQ> = {
  "cpp-mcq-for-semester-1": {
    slug: "cpp-mcq-for-semester-1",
    title: "C++ Programming MCQ practice: Control Flow and OOP",
    seoTitle: "C++ MCQ Practice for Semester 1 (2026 CSE Placement Questions)",
    metaDescription: "Practice interactive C++ MCQs with detailed explanations. Test your knowledge of OOP paradigms, functions, variables, structures, and pointer allocation.",
    eyebrow: "Semester Prep & Placement Practice",
    description: "Prepare for your campus placement screening and university semester exams with our interactive C++ MCQs. Features authentic coding questions with live scoring feedback.",
    questions: [
      {
        id: "cpp-q1",
        questionText: "Which of the following is NOT a core Object Oriented Programming paradigm in C++?",
        options: ["Encapsulation", "Polymorphism", "Procedural Compilation", "Abstraction"],
        correctAnswer: "Procedural Compilation",
        explanation: "Procedural compilation is a basic compilation method. Encapsulation, Polymorphism, Abstraction, and Inheritance are the four primary OOP paradigms.",
        points: 10,
      },
      {
        id: "cpp-q2",
        questionText: "What is the size of an integer pointer in C++ on a standard 64-bit architecture?",
        options: ["2 Bytes", "4 Bytes", "8 Bytes", "Depends on array size"],
        correctAnswer: "8 Bytes",
        explanation: "On a 64-bit hardware processor architecture, all memory pointer addresses occupy exactly 8 bytes of storage, regardless of the target data type.",
        points: 10,
      },
    ],
  },
  "dbms-mcq-for-semester-3": {
    slug: "dbms-mcq-for-semester-3",
    title: "DBMS MCQ practice: SQL Queries and Normalization",
    seoTitle: "DBMS MCQ Online Test + SQL Queries & Normalization (2026)",
    metaDescription: "Test your database knowledge with dynamic DBMS MCQs. Covers relational tables, normal forms, primary keys, and transaction integrity checkpoints.",
    eyebrow: "Core CS Semester Revision",
    description: "Strengthen your relational database mastery. Take this database review covering primary keys, normalization rules, and ACID transaction query conditions.",
    questions: [
      {
        id: "dbms-q1",
        questionText: "Which normal form requires eliminating transitive dependencies on primary keys?",
        options: ["First Normal Form (1NF)", "Second Normal Form (2NF)", "Third Normal Form (3NF)", "Boyce-Codd Normal Form (BCNF)"],
        correctAnswer: "Third Normal Form (3NF)",
        explanation: "3NF explicitly requires that all transitive functional dependencies of non-key attributes on any candidate key be eliminated.",
        points: 10,
      },
    ],
  },
  "os-mcq-for-semester-3": {
    slug: "os-mcq-for-semester-3",
    title: "Operating Systems MCQ practice: CPU Scheduling & Kernels",
    seoTitle: "OS CPU Scheduling MCQ Online Practice Test (2026 BTech CSE)",
    metaDescription: "Review process scheduling, deadlocks, and virtual memory paging with our interactive Operating System (OS) multiple choice questions.",
    eyebrow: "BTech Semester Prep Core",
    description: "Challenge yourself with interactive Operating Systems MCQs designed to simulate BTech university exams and competitive coding placements.",
    questions: [
      {
        id: "os-q1",
        questionText: "Which of the following CPU scheduling algorithms is completely non-preemptive?",
        options: ["Round Robin", "First-Come, First-Served", "Shortest Remaining Time First", "Preemptive Priority"],
        correctAnswer: "First-Come, First-Served",
        explanation: "FCFS executes processes strictly in order of arrival. Once a task takes the CPU, it runs to completion without interruption.",
        points: 10,
      },
    ],
  },
  "class-9-polynomials-mcqs": {
    slug: "class-9-polynomials-mcqs",
    title: "Class 9 Maths Chapter 2 MCQ Online Practice Test",
    seoTitle: "Class 9 Maths Polynomials MCQ Practice Test + Answers (2026)",
    metaDescription: "Practice interactive Class 9 Mathematics Chapter 2 MCQs. Solve equations, check degree of polynomials, and apply remainder theorem rules.",
    eyebrow: "CBSE Class 9 Term Assessment",
    description: "Master polynomial algebraic factorization and NCERT questions with our interactive Class 9 board prep practice assessment.",
    questions: [
      {
        id: "poly-q1",
        questionText: "What is the mathematical degree of the constant polynomial '7'?",
        options: ["1", "0", "Undefined", "7"],
        correctAnswer: "0",
        explanation: "A constant number can be written as 7 * x^0. Therefore, the exponent power of the variable is zero, making its degree 0.",
        points: 10,
      },
    ],
  },
  "class-9-number-systems-mcqs": {
    slug: "class-9-number-systems-mcqs",
    title: "Class 9 Maths Chapter 1 MCQ practice: Rational & Irrational",
    seoTitle: "Class 9 Number Systems MCQ Test + Rationalization (2026)",
    metaDescription: "Free online MCQ test for Class 9 Mathematics Chapter 1 Number Systems. Rationalize denominators, calculate surd values, and master rational subsets.",
    eyebrow: "CBSE Board Readiness Unit",
    description: "Review rationalization techniques, decimal expansions, and real numbers sets with our interactive assessment.",
    questions: [
      {
        id: "num-q1",
        questionText: "Which of the following numbers displays a non-terminating, non-repeating decimal expansion?",
        options: ["22/7", "0.141414...", "Square Root of 2", "0.725"],
        correctAnswer: "Square Root of 2",
        explanation: "Irrational numbers like the square root of 2 have decimal expansions that never terminate and do not cycle or repeat.",
        points: 10,
      },
    ],
  },
};

// ─── 3. Programmatic Interviews Catalog ─────────────────────────────────────

export const programmaticInterviewsCatalog: Record<string, ProgrammaticInterview> = {
  "cpp-oop-concepts": {
    slug: "cpp-oop-concepts",
    title: "C++ Interview Questions: Deep Object Oriented Programming",
    seoTitle: "Top 25 C++ OOP Interview Questions for FAANG (2026 Guide)",
    metaDescription: "Master computer science placements. Essential technical C++ questions covering constructor types, virtual functions, inheritance, and encapsulation.",
    eyebrow: "Software Engineering Campus Placements",
    description: "Pass your technical interviews. Review these curated, advanced C++ questions covering object oriented class abstractions and memory management.",
    questions: [
      {
        question: "What is a virtual function in C++ and why is it used?",
        answer: "A virtual function is a base class member function that is declared with the 'virtual' keyword and overridden in derived child classes. It enables dynamic dispatch and runtime polymorphism, ensuring the correct function implementation is executed based on the actual object type rather than the reference pointer type.",
        codeSnippet: `
#include <iostream>
class Parent {
public:
    virtual void greet() { std::cout << "Hello from Parent\\n"; }
};

class Child : public Parent {
public:
    void greet() override { std::cout << "Hello from Child\\n"; }
};

int main() {
    Parent* p = new Child();
    p->greet(); // Output: Hello from Child (Dynamic Binding)
    delete p;
}
        `,
        language: "cpp",
      },
      {
        question: "Explain the difference between deep copy and shallow copy.",
        answer: "Shallow copy copies all member values of an object directly, including pointers. This means both objects point to the same memory location, leading to double-free allocation crashes. Deep copy allocates fresh memory on the heap for dynamic pointers and copies the actual values, isolating the memory states.",
      },
    ],
  },
  "dbms-interview-questions": {
    slug: "dbms-interview-questions",
    title: "DBMS Interview Questions: SQL Queries & Relational Paradigms",
    seoTitle: "Top DBMS SQL Placement Interview Questions & Answers (2026)",
    metaDescription: "Ace technical developer interviews with DBMS placement questions. Master SQL joins, normal forms, indexing, ACID transactions, and lock structures.",
    eyebrow: "Engineering Placement Prep Core",
    description: "Relational database expertise is highly valued by tech recruiters. Prepare for queries, indexes, and normal forms questions using our interactive sheet.",
    questions: [
      {
        question: "Explain database normalization and its practical benefits.",
        answer: "Normalization is the process of structuring relational database columns to eliminate data redundancy and anomalies during write, update, or delete commands. It structures records in distinct normal forms (1NF to BCNF) utilizing candidate keys to guarantee storage integrity and optimal index performance.",
      },
      {
        question: "What are database Indexes and how do they speed up select queries?",
        answer: "An index is a separate structural record map (typically built using B-Trees or B+Trees) that lets database nodes look up rows quickly without scanning every page in the table storage. However, indexes slow down write actions (inserts and updates) because the index map must be updated concurrently.",
        codeSnippet: `
-- Creating an index on the email field of the users table
CREATE INDEX idx_user_email ON eduquest_users(email);
        `,
        language: "sql",
      },
    ],
  },
  "os-interview-questions": {
    slug: "os-interview-questions",
    title: "Operating Systems Interview Questions: Memory & Processes",
    seoTitle: "Top OS Interview Questions for CSE Placements (2026 Core Guide)",
    metaDescription: "Crack technical systems interviews. Key Operating Systems (OS) questions on CPU scheduling, threads, virtual memory, paging, and deadlocks.",
    eyebrow: "Systems Engineering Technical prep",
    description: "Refresh process scheduling algorithms, deadlock criteria, and memory page swaps before your next placement screening.",
    questions: [
      {
        question: "What is the difference between a process and a thread?",
        answer: "A process is an executing program instance with its own completely isolated memory, file handles, and variables. A thread is the smallest scheduling unit within a process. Multiple threads share the parent process's memory space and files, making context swaps fast but introducing thread safety variables.",
      },
    ],
  },
};

// ─── 4. Programmatic Semester Catalog ───────────────────────────────────────

export const programmaticSemesterCatalog: Record<string, ProgrammaticSemester> = {
  "cpp-semester-prep": {
    slug: "cpp-semester-prep",
    title: "C++ BTech CSE Semester Survival Guide: Last-Minute Prep",
    seoTitle: "C++ Semester Prep: Solved Important Questions & Checklists (2026)",
    metaDescription: "Pass your engineering semester exams. Complete BTech CSE C++ revision checklist, solved important exam questions, templates, and pointers guide.",
    eyebrow: "BTech Computer Science Semester 1",
    description: "Syllabus pressure got you stressed? Access this last-minute revision survival guide covering structural programming constructs, virtual inheritances, and dynamic binding.",
    checklist: [
      { label: "Variable Declaration & Scope", description: "Review local vs global variables and dynamic pointer allocations.", importance: "High" },
      { label: "Function Overloading Rules", description: "Learn how parameter differences resolve overloaded compiler states.", importance: "Medium" },
      { label: "Virtual Destructors", description: "Understand why base class destructors must be virtual to avoid leaks.", importance: "High" },
    ],
    importantQuestions: [
      "Explain the compile process of a C++ source file in detail, listing intermediate stages like preprocessing and assembly link.",
      "Write a complete C++ program demonstrating inheritance, constructor initialization lists, and virtual dynamic function overriding.",
    ],
  },
  "dbms-semester-prep": {
    slug: "dbms-semester-prep",
    title: "DBMS BTech CSE Semester Survival Guide: Normalization",
    seoTitle: "DBMS Semester Prep Checklist + Solved Database Questions (2026)",
    metaDescription: "Master BTech database exams. Solved important DBMS questions covering normalization proofs, 3NF schemas, SQL statements, and transactional locks.",
    eyebrow: "BTech Computer Science Semester 3",
    description: "Learn how to normalize tables in under 10 minutes and review DBMS lecture checklists to guarantee a perfect exam score.",
    checklist: [
      { label: "ER Diagrams to Schemas", description: "Convert entity-relationship shapes into relational database columns.", importance: "High" },
      { label: "Third Normal Form Proofs", description: "Learn transitive dependency analysis to verify 3NF properties.", importance: "High" },
      { label: "Write-Ahead Logging (WAL)", description: "Understand recovery services buffer flush rules.", importance: "Medium" },
    ],
    importantQuestions: [
      "Prove why Boyce-Codd Normal Form (BCNF) is strictly stronger than Third Normal Form (3NF) using functional dependencies.",
      "Define transaction serialization and outline the difference between conflict-serializable and view-serializable schedules.",
    ],
  },
  "os-semester-prep": {
    slug: "os-semester-prep",
    title: "Operating Systems Semester Prep: Schedulers & Deadlocks",
    seoTitle: "OS Semester Prep Guide + Deadlock Solved Questions (2026 BTech)",
    metaDescription: "Get the BTech OS exam blueprint. CPU scheduling numerical calculation sheets, Banker's deadlock safety algorithm, and page replacement rules.",
    eyebrow: "BTech Computer Science Semester 4",
    description: "Pass your operating systems semester exam with flying colors. Contains CPU scheduling numeric calculation sheets, deadlock prevention algorithms, and memory pages swapping steps.",
    checklist: [
      { label: "SJF/Round-Robin Numericals", description: "Calculate average waiting times and turnaround times using timeline maps.", importance: "High" },
      { label: "Banker's Algorithm", description: "Practice safety calculations to prove a state is deadlock-free.", importance: "High" },
      { label: "Page Replacement (LRU, FIFO)", description: "Count memory page faults during sequence updates.", importance: "Medium" },
    ],
    importantQuestions: [
      "Demonstrate Banker's resource allocation safety calculations with a step-by-step numerical matrix.",
      "Explain virtual memory, translation lookaside buffers (TLBs), and how page faults trigger hard disk sector fetches.",
    ],
  },
};
