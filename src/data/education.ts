export interface Course {
    title: string;
    description: string;
    skillsLearned: string[];
    isGraduate?: boolean;
}

export const relevantCourses: Course[] = [
    {
        title: "Computer Systems",
        description: "Studies the structure, components, design, implementation, and internal operation of computer systems, focusing mainly on the operating system level. Reviews computer hardware and architecture including the arithmetic and logic unit, and the control unit. Covers current operating system components and construction techniques including memory management, I/O device management, file system structures, and the user interface. Introduces distributed operating systems and discusses issues arising from concurrency and distribution.",
        skillsLearned: ["Operating System Design", "Memory Management", "Process Scheduling", "Concurrency", "Distributed Systems"],
        isGraduate: true
    },
    {
        title: "Fundamentals of Computer Networks",
        description: "Studies network protocols, focusing on modeling and analysis, and architectures. Introduces modeling concepts, emphasizing queuing theory. Discusses performance evaluation of computer networks including performance metrics, evaluation tools, simulation techniques, and limitations. Presents different harmonizing functions needed for communication and efficient operation of computer networks. Covers link layer protocols, packet framing, error detection techniques, and congestion control.",
        skillsLearned: ["Network Protocols", "Queuing Theory", "Congestion Control", "Routing Algorithms", "Network Performance Analysis"],
        isGraduate: true
    },
    {
        title: "Introduction to Databases",
        description: "Studies the design of a database for use in a relational database management system. The entity-relationship model and normalization are used in problems. Relational algebra and then the SQL are presented. Advanced topics include triggers, stored procedures, indexing, elementary query optimization, and fundamentals of concurrency and recovery.",
        skillsLearned: ["SQL", "Database Design", "ER Modeling", "Normalization", "Query Optimization"],
        isGraduate: false
    },
    {
        title: "Programming in C++",
        description: "Examines how to program in C++ in a robust and safe manner. Reviews basics, including scoping, typing, and primitive data structures. Discusses data types, addressing/parameter mechanisms, stacks, queues, linked lists, binary trees, hash tables, and the design of classes and class inheritance. Covers function and operator overloading, templates, STL components, streams, exception handling, and system calls for processes and threads.",
        skillsLearned: ["C++", "Object-Oriented Programming", "Data Structures", "Memory Management", "Templates"],
        isGraduate: false
    },
    {
        title: "Discrete Structures",
        description: "Introduces the mathematical structures and methods that form the foundation of computer science. Studies structures such as sets, tuples, sequences, lists, trees, and graphs. Discusses functions, relations, ordering, and equivalence relations. Examines inductive and recursive definitions of structures and functions. Covers counting techniques and arguments needed to estimate the size of sets, the growth of functions, and algorithm complexity.",
        skillsLearned: ["Set Theory", "Graph Theory", "Combinatorics", "Mathematical Proofs", "Algorithm Complexity"],
        isGraduate: false
    },
    {
        title: "Mathematics of Data Models",
        description: "Studies methods and ideas in linear algebra, multivariable calculus, and statistics most relevant for machine learning, modeling, or hypothesis testing with data. Covers least squares regression, finding eigenvalues, performing gradient descent, and hypothesis tests. Includes applications to machine-learning methods including Bayesian models and neural networks.",
        skillsLearned: ["Linear Algebra", "Multivariable Calculus", "Statistical Analysis", "Optimization", "Machine Learning Foundations"],
        isGraduate: false
    },
    {
        title: "Object-Oriented Design",
        description: "Presents a comparative approach to object-oriented programming and design. Discusses concepts of object, class, meta-class, message, method, inheritance, and genericity. Reviews forms of polymorphism. Contrasts use of inheritance and composition. Fosters deeper understanding of design patterns and use of graphical design notations such as UML.",
        skillsLearned: ["OOP Principles", "Design Patterns", "UML", "Code Refactoring", "Software Architecture"],
        isGraduate: false
    },
    {
        title: "Projects in Cloud Computing",
        description: "Introduction to principles and practice of cloud computing with emphasis on real-world use of Amazon Web Services. Combines material aimed at understanding provider-independent concepts and hands-on exercises with AWS. Includes direct training with AWS Skills trainers on Amazon campus.",
        skillsLearned: ["AWS", "Cloud Architecture", "Serverless Computing", "IaaS", "PaaS", "SaaS"],
        isGraduate: false
    },
    {
        title: "Game Programming",
        description: "Introduces different subsystems used to create a 3D game, including rendering, animation, collision, physics, audio, trigger systems, game logic, behavior trees, and simple AI. Covers graphics pipeline, scene graph, level design, behavior scripting, and game scripting languages.",
        skillsLearned: ["Unity", "Game Architecture", "Physics Engines", "Game AI", "User Input Handling"],
        isGraduate: false
    },
    {
        title: "Foundations of Cybersecurity",
        description: "Presents overview of basic principles and security concepts related to information systems. Discusses legal, ethical, and human factors. Uses software tools to probe computer systems and networks to learn about vulnerabilities. Covers security methods, controls, procedures, economics of cybercrime, criminal procedure, and forensics.",
        skillsLearned: ["Cryptography", "Linux", "Network Security"],
        isGraduate: false
    },
    {
        title: "Theory of Computation",
        description: "Introduces the theory behind computers and computing aimed at answering capabilities and limitations of computers. Covers automata theory, computability, and complexity including finite automata, regular expressions, context-free languages, Turing machines, the Church-Turing thesis, and NP-completeness.",
        skillsLearned: ["Formal Languages", "Automata Theory", "Turing Machines", "Complexity Analysis", "P vs NP"],
        isGraduate: false
    },
    {
        title: "Algorithms and Data",
        description: "Introduces the basic principles and techniques for the design, analysis, and implementation of efficient algorithms and data representations. Discusses asymptotic analysis and formal methods for establishing the correctness of algorithms. Considers divide-and-conquer algorithms, graph traversal algorithms, and optimization techniques. Introduces information theory and covers the fundamental structures for representing data. Examines flat and hierarchical representations, dynamic data representations, and data compression. Concludes with a discussion of the relationship of the topics in this course to complexity theory and the notion of the hardness of problems.",
        skillsLearned: ["Algorithm Design", "Data Structures", "Asymptotic Analysis", "Graph Algorithms", "Data Compression"],
        isGraduate: false
    }
];
