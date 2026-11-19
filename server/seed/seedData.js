const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {}

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const Resource = require('../models/Resource');

const seedDB = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to Atlas successfully.');

    // 1. Seed Admin if not exists
    const adminExists = await User.findOne({ email: 'admin@stresscare.org' });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator',
        email: 'admin@stresscare.org',
        password: 'Admin@123456',
        role: 'admin',
        occupation: 'Lead Platform Director',
        phone: '+91 98765 43210',
        bio: 'Senior mental health platform administrator overseeing counselor quality, compliance, and clinical resources.',
      });
      console.log('[Seed] Admin user created: admin@stresscare.org / Admin@123456');
    } else {
      console.log('[Seed] Admin user already exists.');
    }

    // 2. Seed Counselors if not exist
    const counselor1 = await User.findOne({ email: 'dr.sharma@stresscare.org' });
    if (!counselor1) {
      await User.create({
        name: 'Dr. Rajesh Sharma, Ph.D.',
        email: 'dr.sharma@stresscare.org',
        password: 'Counselor@123456',
        role: 'counselor',
        specialization: 'Cognitive Behavioral Therapy (CBT) & Burnout Recovery',
        qualifications: 'Ph.D. in Clinical Psychology (AIIMS), 12+ Years Clinical Experience',
        experience: 12,
        rating: 4.9,
        isVerified: true,
        isAvailable: true,
        phone: '+91 98200 11223',
        bio: 'Specializing in high-stress professionals, workplace fatigue, anxiety disorders, and evidence-based CBT intervention techniques.',
      });
      console.log('[Seed] Counselor created: dr.sharma@stresscare.org');
    }

    const counselor2 = await User.findOne({ email: 'dr.ananya@stresscare.org' });
    if (!counselor2) {
      await User.create({
        name: 'Dr. Ananya Roy, M.Phil',
        email: 'dr.ananya@stresscare.org',
        password: 'Counselor@123456',
        role: 'counselor',
        specialization: 'Mindfulness-Based Stress Reduction (MBSR) & Youth Guidance',
        qualifications: 'M.Phil Clinical Psychology (NIMHANS), Certified Mindfulness Coach',
        experience: 8,
        rating: 4.8,
        isVerified: true,
        isAvailable: true,
        phone: '+91 98111 44556',
        bio: 'Passionate about helping young adults and students overcome performance stress, somatic tension, and emotional overwhelm.',
      });
      console.log('[Seed] Counselor created: dr.ananya@stresscare.org');
    }

    // 2b. Seed Demo User
    const demoUser = await User.findOne({ email: 'user@stresscare.org' });
    if (!demoUser) {
      await User.create({
        name: 'Diya Agrawal',
        email: 'user@stresscare.org',
        password: 'User@123456',
        role: 'user',
        occupation: 'Software Engineer',
        phone: '+91 98765 00000',
        bio: 'Focused on stress tracking, mindfulness, and maintaining a healthy work-life balance.',
      });
      console.log('[Seed] Demo User created: user@stresscare.org / User@123456');
    }

    // 3. Seed Recommendations if collection empty
    const recCount = await Recommendation.countDocuments();
    if (recCount === 0) {
      const recommendations = [
        {
          title: '4-7-8 Parasympathetic Breathing',
          category: 'breathing',
          description: 'A scientifically validated breathwork exercise that rapidly calms the nervous system and lowers heart rate.',
          instructions: 'Sit comfortably with a straight spine. Exhale fully through mouth. Inhale through nose for 4s, hold for 7s, exhale completely through mouth for 8s. Repeat 4 full cycles.',
          steps: [
            'Exhale all air through mouth with a gentle whoosh sound.',
            'Close your mouth and inhale quietly through nose for 4 counts.',
            'Hold your breath comfortably for 7 counts.',
            'Exhale completely through mouth, making a whoosh sound for 8 counts.',
            'Repeat for 4 full cycles.',
          ],
          durationMinutes: 3,
          stressLevelTarget: ['High', 'Moderate', 'All'],
          icon: 'Wind',
          isFeatured: true,
        },
        {
          title: 'Box Breathing (Navy SEAL Protocol)',
          category: 'breathing',
          description: 'Used by high-performance professionals to maintain composure and clarity under acute pressure.',
          instructions: 'Inhale for 4s, hold for 4s, exhale for 4s, hold empty for 4s. Complete 4-5 cycles.',
          steps: [
            'Inhale slowly for 4 seconds.',
            'Hold lungs full for 4 seconds.',
            'Smoothly exhale for 4 seconds.',
            'Hold lungs empty for 4 seconds.',
          ],
          durationMinutes: 4,
          stressLevelTarget: ['High', 'Moderate'],
          icon: 'Square',
          isFeatured: true,
        },
        {
          title: '5-4-3-2-1 Sensory Grounding',
          category: 'relaxation',
          description: 'An effective somatic technique to interrupt racing thoughts and bring you back into the present moment.',
          instructions: 'Acknowledge 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.',
          steps: [
            '5 Things you can SEE around you (e.g. clock, plant, chair).',
            '4 Things you can physically TOUCH (e.g. shirt fabric, cool desk surface).',
            '3 Things you can HEAR (e.g. fan hum, distant birds, your breath).',
            '2 Things you can SMELL (e.g. coffee, fresh air).',
            '1 Thing you can TASTE or positive affirmation.',
          ],
          durationMinutes: 5,
          stressLevelTarget: ['High', 'Moderate'],
          icon: 'Compass',
          isFeatured: true,
        },
        {
          title: 'Progressive Muscle Relaxation (PMR)',
          category: 'relaxation',
          description: 'Relieves chronic somatic tension by sequentially clenching and releasing major muscle groups.',
          instructions: 'Work from toes to crown. Clench muscle group tightly for 5s, release suddenly, and notice the release of tension for 15s.',
          steps: [
            'Tense toes and feet for 5s, then let go.',
            'Tense thighs and glutes for 5s, then let go.',
            'Clench fists and biceps for 5s, then let go.',
            'Raise shoulders toward ears for 5s, then drop them softly.',
            'Notice the wave of warmth and relaxation spreading throughout your body.',
          ],
          durationMinutes: 10,
          stressLevelTarget: ['High', 'Moderate'],
          icon: 'Shield',
          isFeatured: false,
        },
        {
          title: 'The Pomodoro Flow & Micro-Breaks',
          category: 'time_management',
          description: 'Prevents mental fatigue and cognitive overwhelm through structured 25-minute focus intervals.',
          instructions: 'Choose 1 task. Work for 25 minutes without distraction. Take a mandatory 5-minute break away from screens.',
          steps: [
            'Select your single most important priority.',
            'Set a timer for 25 minutes.',
            'Work with zero multitasking until the chime rings.',
            'Step away, stretch, drink water for 5 minutes.',
          ],
          durationMinutes: 25,
          stressLevelTarget: ['Moderate', 'Low', 'All'],
          icon: 'Clock',
          isFeatured: false,
        },
        {
          title: 'Restorative Sleep Hygiene Ritual',
          category: 'healthy_habits',
          description: 'Optimal nighttime habits to maximize restorative deep sleep and balance cortisol levels.',
          instructions: 'Dim lights 60 minutes before bed. Keep bedroom cool (18-20°C). Avoid blue light screens.',
          steps: [
            'Stop consuming caffeine after 2:00 PM.',
            'Turn on warm night-mode filters on devices at sunset.',
            'Keep bedroom quiet, dark, and comfortably cool.',
            'Write down tomorrow’s priorities on a notepad to clear mental clutter.',
          ],
          durationMinutes: 15,
          stressLevelTarget: ['Low', 'Moderate', 'High', 'All'],
          icon: 'Moon',
          isFeatured: false,
        },
      ];
      await Recommendation.insertMany(recommendations);
      console.log(`[Seed] Seeded ${recommendations.length} curated recommendations.`);
    } else {
      console.log(`[Seed] Recommendations already seeded (${recCount} found).`);
    }

    // 4. Seed Resources if collection empty
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      const resources = [
        {
          title: 'Tele-MANAS National Tele Mental Health Programme',
          type: 'helpline',
          category: 'crisis',
          summary: '24/7 Free, Confidential Government of India Mental Health & Crisis Helpline with multi-language support.',
          contactNumber: '14416 / 1800-891-4416',
          availableHours: '24 Hours / 7 Days a week',
          author: 'Ministry of Health & Family Welfare, Govt. of India',
          externalLink: 'https://telemanas.mohfw.gov.in',
          isEmergency: true,
        },
        {
          title: 'KIRAN Mental Health Rehabilitation Helpline',
          type: 'helpline',
          category: 'crisis',
          summary: 'Dedicated 24/7 toll-free helpline providing psychological support, distress management, and mental health first-aid.',
          contactNumber: '1800-599-0019',
          availableHours: '24/7',
          author: 'Department of Empowerment of Persons with Disabilities',
          isEmergency: true,
        },
        {
          title: 'Vandrevala Foundation Mental Health Support',
          type: 'helpline',
          category: 'crisis',
          summary: 'Free 24/7 counseling support and intervention for individuals experiencing acute distress, anxiety, or depression.',
          contactNumber: '+91 9999 666 555',
          availableHours: '24/7 Free Counseling',
          author: 'Vandrevala Foundation',
          isEmergency: true,
        },
        {
          title: 'Understanding Chronic Stress vs. Acute Stress',
          type: 'article',
          category: 'burnout',
          summary: 'A clinical overview of the neurobiological stress response, how cortisol operates, and how to recognize early signs of burnout.',
          content: 'Acute stress is the short-term physiological reaction to immediate challenges—it boosts focus and adrenaline. However, chronic stress occurs when perceived demands constantly exceed coping resources over weeks or months, triggering sustained cortisol elevation, compromised immune function, sleep fragmentation, and emotional exhaustion. Recognizing early cognitive and physical warning signs is the crucial first step toward recovery.',
          readTimeMinutes: 4,
          author: 'Dr. Rajesh Sharma, Ph.D.',
          isEmergency: false,
        },
        {
          title: 'Cognitive Reframing: Shifting From Panic to Problem-Solving',
          type: 'article',
          category: 'mindfulness',
          summary: 'Practical cognitive behavioral tools to identify catastrophic thinking and rebuild objective emotional balance.',
          content: 'When stress strikes, the human brain tends to gravitate toward catastrophic interpretations: "I will fail," or "Everything is ruined." Cognitive reframing is the practice of noticing these cognitive distortions, examining the objective evidence, and replacing unhelpful thought spirals with grounded, actionable perspectives.',
          readTimeMinutes: 5,
          author: 'Dr. Ananya Roy, M.Phil',
          isEmergency: false,
        },
      ];
      await Resource.insertMany(resources);
      console.log(`[Seed] Seeded ${resources.length} resources & helplines.`);
    } else {
      console.log(`[Seed] Resources already seeded (${resourceCount} found).`);
    }

    console.log('[Seed] Database initialization completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedDB();
