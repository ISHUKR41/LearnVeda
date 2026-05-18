const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding real database data...')

  // Create Users
  const student = await prisma.user.upsert({
    where: { email: 'student@eduquest.com' },
    update: {},
    create: {
      email: 'student@eduquest.com',
      name: 'Rohan Sharma',
      role: 'STUDENT',
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@eduquest.com' },
    update: {},
    create: {
      email: 'teacher@eduquest.com',
      name: 'Priya Patel',
      role: 'TEACHER',
    },
  })

  // Create Classes
  const class9 = await prisma.class.create({
    data: {
      name: 'Class 9',
      description: 'Foundational concepts for high school',
    }
  })

  const class10 = await prisma.class.create({
    data: {
      name: 'Class 10',
      description: 'Board exam preparation',
    }
  })

  // Create Subjects for Class 10
  const math10 = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      classId: class10.id,
    }
  })

  const science10 = await prisma.subject.create({
    data: {
      name: 'Science',
      classId: class10.id,
    }
  })

  // Create Chapters
  const algebra = await prisma.chapter.create({
    data: {
      title: 'Polynomials & Linear Equations',
      content: 'Detailed study of polynomials, roots, and pair of linear equations in two variables.',
      subjectId: math10.id,
    }
  })

  const physicsLight = await prisma.chapter.create({
    data: {
      title: 'Light - Reflection and Refraction',
      content: 'Laws of reflection, spherical mirrors, refraction through glass slab and lenses.',
      subjectId: science10.id,
    }
  })

  // Create Mock Test
  const lightTest = await prisma.mockTest.create({
    data: {
      title: 'Light Chapter Revision Test',
      duration: 30,
      chapterId: physicsLight.id,
      questions: {
        create: [
          {
            content: 'What is the speed of light in vacuum?',
            options: JSON.stringify(['3 x 10^8 m/s', '3 x 10^5 m/s', '3 x 10^6 m/s', '300 m/s']),
            answer: '3 x 10^8 m/s'
          },
          {
            content: 'Which mirror is used as a rear-view mirror in vehicles?',
            options: JSON.stringify(['Concave Mirror', 'Convex Mirror', 'Plane Mirror', 'Cylindrical Mirror']),
            answer: 'Convex Mirror'
          }
        ]
      }
    }
  })

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
